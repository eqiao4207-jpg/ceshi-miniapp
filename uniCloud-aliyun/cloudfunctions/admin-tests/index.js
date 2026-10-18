'use strict'

const db = uniCloud.database()

exports.main = async (event) => {
  if (!process.env.ADMIN_TOKEN || event?.token !== process.env.ADMIN_TOKEN) throw new Error('admin_unauthorized')
  const result = await db.collection('tests').orderBy('updatedAt', 'desc').get()
  return { data: result.data }
}
