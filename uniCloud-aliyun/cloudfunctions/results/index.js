'use strict'

const db = uniCloud.database()
const results = db.collection('test_results')

exports.main = async (event) => {
  const action = event?.action
  if (action === 'create') {
    if (!event.testId || !event.resultCode) throw new Error('invalid_result')
    const item = { testId: event.testId, resultCode: event.resultCode, answers: event.answers || {}, unlocked: false, createdAt: new Date() }
    const created = await results.add(item)
    return { resultId: created.id, ...item }
  }
  if (action === 'unlock') {
    if (!event.resultId) throw new Error('invalid_result')
    await results.doc(event.resultId).update({ unlocked: true, unlockedAt: new Date(), orderId: event.orderId })
    return { ok: true, resultId: event.resultId, unlocked: true }
  }
  if (action === 'list') {
    const result = await results.orderBy('createdAt', 'desc').limit(50).get()
    return { data: result.data }
  }
  throw new Error('unknown_action')
}
