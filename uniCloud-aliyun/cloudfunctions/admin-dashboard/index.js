'use strict'

const db = uniCloud.database()

exports.main = async (event) => {
  const token = event?.token
  const expected = process.env.ADMIN_TOKEN
  if (!expected || token !== expected) throw new Error('admin_unauthorized')
  const [orders, tests] = await Promise.all([db.collection('orders').count(), db.collection('tests').count()])
  return { orders: orders.total, tests: tests.total, generatedAt: new Date() }
}
