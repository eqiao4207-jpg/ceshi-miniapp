'use strict'

const db = uniCloud.database()
const orders = db.collection('orders')

exports.main = async (event) => {
  const action = event?.action
  if (action === 'create') {
    if (!event.productId || !Number.isInteger(event.priceFen) || event.priceFen < 1) throw new Error('invalid_order')
    const order = { orderId: `ord_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`, productId: event.productId, priceFen: event.priceFen, status: 'pending', createdAt: new Date() }
    await orders.add(order)
    return order
  }
  if (action === 'get') {
    const result = await orders.where({ orderId: event.orderId }).limit(1).get()
    return result.data[0] || null
  }
  if (action === 'pay') {
    const result = await orders.where({ orderId: event.orderId, status: 'pending' }).update({ status: 'paid', paidAt: new Date() })
    if (!result.updated) throw new Error('order_not_found')
    return { status: 'paid', orderId: event.orderId }
  }
  throw new Error('unknown_action')
}
