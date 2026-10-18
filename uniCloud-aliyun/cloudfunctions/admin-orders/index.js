'use strict'

const db = uniCloud.database()

exports.main = async (event) => {
  if (!process.env.ADMIN_TOKEN || event?.token !== process.env.ADMIN_TOKEN) throw new Error('admin_unauthorized')
  const page = Math.max(1, Number(event.page || 1))
  const pageSize = Math.min(50, Math.max(1, Number(event.pageSize || 20)))
  const result = await db.collection('orders').orderBy('createdAt', 'desc').skip((page - 1) * pageSize).limit(pageSize).get()
  return { page, pageSize, data: result.data }
}
