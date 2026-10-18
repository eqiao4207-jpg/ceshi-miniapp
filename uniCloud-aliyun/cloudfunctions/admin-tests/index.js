'use strict'

const db = uniCloud.database()

exports.main = async (event) => {
  if (!process.env.ADMIN_TOKEN || event?.token !== process.env.ADMIN_TOKEN) throw new Error('admin_unauthorized')
  if (event.action === 'update') {
    const priceFullFen = Number(event.priceFullFen)
    const priceCouponFen = Number(event.priceCouponFen)
    if (!event.testId || !Number.isInteger(priceFullFen) || !Number.isInteger(priceCouponFen) || priceCouponFen >= priceFullFen) throw new Error('invalid_price')
    const updated = await db.collection('tests').where({ testId: event.testId }).update({ priceFullFen, priceCouponFen, updatedAt: new Date() })
    if (!updated.updated) await db.collection('tests').add({ testId: event.testId, title: event.title || event.testId, priceFullFen, priceCouponFen, status: 'published', updatedAt: new Date() })
    return { ok: true, testId: event.testId, priceFullFen, priceCouponFen }
  }
  const result = await db.collection('tests').orderBy('updatedAt', 'desc').get()
  if (result.data.length) return { data: result.data }
  return { data: [
    { testId: 'social-battery', title: '你的社交电量', priceFullFen: 590, priceCouponFen: 199, status: 'published' },
    { testId: 'hidden-self', title: '你的隐藏性格', priceFullFen: 590, priceCouponFen: 199, status: 'published' },
    { testId: 'love-language', title: '你的恋爱沟通风格', priceFullFen: 590, priceCouponFen: 299, status: 'published' },
    { testId: 'aesthetic-mood', title: '你的氛围感色彩', priceFullFen: 590, priceCouponFen: 99, status: 'draft' }
  ] }
}
