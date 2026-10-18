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
