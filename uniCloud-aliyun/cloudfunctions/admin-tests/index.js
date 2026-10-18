'use strict'

const db = uniCloud.database()

exports.main = async (event) => {
  if (!process.env.ADMIN_TOKEN || event?.token !== process.env.ADMIN_TOKEN) throw new Error('admin_unauthorized')
  const result = await db.collection('tests').orderBy('updatedAt', 'desc').get()
  if (result.data.length) return { data: result.data }
  return { data: [
    { testId: 'social-battery', title: '你的社交电量', priceFen: 99, status: 'published' },
    { testId: 'hidden-self', title: '你的隐藏性格', priceFen: 199, status: 'published' },
    { testId: 'love-language', title: '你的恋爱沟通风格', priceFen: 299, status: 'published' },
    { testId: 'aesthetic-mood', title: '你的氛围感色彩', priceFen: 99, status: 'draft' }
  ] }
}
