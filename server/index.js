import http from 'node:http'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const port = Number(process.env.PORT || 8787)
const useMySql = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER)
let pool
if (useMySql) {
  const mysql = await import('mysql2/promise')
  pool = mysql.createPool({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD, connectionLimit: 5 })
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (order_id VARCHAR(64) PRIMARY KEY, product_id VARCHAR(128) NOT NULL, price_fen INT UNSIGNED NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'pending', created_at DATETIME(3) NOT NULL, paid_at DATETIME(3) NULL, INDEX idx_orders_status_created (status, created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, openid VARCHAR(64) NOT NULL UNIQUE, created_at DATETIME(3) NOT NULL, last_seen_at DATETIME(3) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await pool.query(`CREATE TABLE IF NOT EXISTS test_results (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NULL, test_id VARCHAR(128) NOT NULL, result_code VARCHAR(128) NOT NULL, answers_json JSON NOT NULL, unlocked TINYINT(1) NOT NULL DEFAULT 0, created_at DATETIME(3) NOT NULL, INDEX idx_results_user_created (user_id, created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await pool.query(`CREATE TABLE IF NOT EXISTS payments (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, order_id VARCHAR(64) NOT NULL, transaction_id VARCHAR(128) NULL, payload_json JSON NULL, created_at DATETIME(3) NOT NULL, UNIQUE KEY uk_payments_order (order_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
}
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const ordersFile = path.join(dataDir, 'orders.json')
fs.mkdirSync(dataDir, { recursive: true })
let orders = new Map()
try {
  const saved = JSON.parse(fs.readFileSync(ordersFile, 'utf8'))
  if (Array.isArray(saved)) orders = new Map(saved.map(order => [order.orderId, order]))
} catch (error) {
  if (error.code !== 'ENOENT') console.warn(`unable to load orders: ${error.message}`)
}
let persistTimer
const persistOrders = () => {
  clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    const tempFile = `${ordersFile}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify([...orders.values()], null, 2))
    fs.renameSync(tempFile, ordersFile)
  }, 20)
}
const json = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(body)) }
const readBody = (req) => new Promise((resolve, reject) => { let raw = ''; req.on('data', chunk => { raw += chunk }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}) } catch { reject(new Error('invalid_json')) } }) })
const saveOrder = async order => {
  if (useMySql) return pool.query('INSERT INTO orders (order_id, product_id, price_fen, status, created_at) VALUES (?, ?, ?, ?, ?)', [order.orderId, order.productId, order.priceFen, order.status, order.createdAt])
  orders.set(order.orderId, order); persistOrders()
}
const getOrder = async orderId => {
  if (useMySql) { const [rows] = await pool.query('SELECT order_id orderId, product_id productId, price_fen priceFen, status, created_at createdAt, paid_at paidAt FROM orders WHERE order_id = ?', [orderId]); return rows[0] }
  return orders.get(orderId)
}
const markPaid = async orderId => {
  const paidAt = new Date().toISOString()
  if (useMySql) { await pool.query("UPDATE orders SET status = 'paid', paid_at = ? WHERE order_id = ? AND status = 'pending'", [paidAt, orderId]); return getOrder(orderId) }
  const order = orders.get(orderId); if (order?.status === 'pending') { order.status = 'paid'; order.paidAt = paidAt; persistOrders() }; return order
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true, service: 'ceshi-miniapp-api' })
    if (req.method === 'POST' && url.pathname === '/api/orders') {
      const body = await readBody(req)
      if (!body.productId || !Number.isInteger(body.priceFen) || body.priceFen < 1) return json(res, 400, { error: 'invalid_order' })
      const orderId = `ord_${Date.now()}_${randomUUID().slice(0, 8)}`
      const order = { orderId, productId: body.productId, priceFen: body.priceFen, status: 'pending', createdAt: new Date().toISOString() }
      await saveOrder(order)
      return json(res, 201, order)
    }
    const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/)
    if (req.method === 'GET' && orderMatch) {
      const order = await getOrder(orderMatch[1]); return order ? json(res, 200, order) : json(res, 404, { error: 'order_not_found' })
    }
    if (req.method === 'POST' && url.pathname === '/api/payment/virtual/notify') {
      const body = await readBody(req); const order = await getOrder(body.orderId || body.outTradeNo)
      if (!order) return json(res, 404, { error: 'order_not_found' })
      const updated = order.status === 'pending' ? await markPaid(order.orderId) : order
      return json(res, 200, { ok: true, status: updated.status })
    }
    json(res, 404, { error: 'not_found' })
  } catch (error) { json(res, 400, { error: error.message }) }
})

server.listen(port, () => console.log(`ceshi-miniapp-api listening on http://localhost:${port}`))
