'use strict'

exports.main = async (event) => {
  const expected = process.env.ADMIN_TOKEN
  if (!expected || event?.token !== expected) throw new Error('admin_unauthorized')
  return { ok: true, role: 'admin', token: expected }
}
