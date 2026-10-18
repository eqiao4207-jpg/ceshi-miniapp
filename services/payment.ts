export type PayOrder = { orderId: string; productId: string; priceFen: number }
export type PayResult = { success: boolean; orderId: string }

export interface PaymentAdapter {
  pay(order: PayOrder): Promise<PayResult>
}

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8787'
const request = <T>(url: string, method: 'GET' | 'POST', data?: unknown) => new Promise<T>((resolve, reject) => {
  uni.request({ url: `${apiBase}${url}`, method, data, success: response => response.statusCode >= 200 && response.statusCode < 300 ? resolve(response.data as T) : reject(new Error(`api_${response.statusCode}`)), fail: reject })
})

const mockPayment: PaymentAdapter = {
  pay: async (order) => {
    const created = await request<{ orderId: string }>('/api/orders', 'POST', order)
    // 开发阶段模拟支付通知；正式环境替换为 wx.requestVirtualPayment。
    const paid = await request<{ status: string }>('/api/payment/virtual/notify', 'POST', { orderId: created.orderId })
    return { success: paid.status === 'paid', orderId: created.orderId }
  }
}

// 真实微信支付接入时，在此处请求服务端签名，再调用 wx.requestVirtualPayment。
export const paymentAdapter = mockPayment
