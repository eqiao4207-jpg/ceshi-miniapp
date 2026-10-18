export type PayOrder = { orderId: string; productId: string; priceFen: number }
export type PayResult = { success: boolean; orderId: string }

export const cloudPaymentAdapter = {
  async pay(order: PayOrder): Promise<PayResult> {
    const created = await uniCloud.callFunction({ name: 'orders', data: { action: 'create', productId: order.productId, priceFen: order.priceFen } })
    const createdOrder = created.result as { orderId: string }
    const paid = await uniCloud.callFunction({ name: 'orders', data: { action: 'pay', orderId: createdOrder.orderId } })
    const result = paid.result as { status: string; orderId: string }
    return { success: result.status === 'paid', orderId: result.orderId }
  }
}

export const cloudResultAdapter = {
  async create(testId: string, resultCode: string, answers: Record<string, number>) {
    const response = await uniCloud.callFunction({ name: 'results', data: { action: 'create', testId, resultCode, answers } })
    return response.result as { resultId: string }
  },
  async unlock(resultId: string, orderId: string) {
    await uniCloud.callFunction({ name: 'results', data: { action: 'unlock', resultId, orderId } })
  }
}
