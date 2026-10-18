<script setup>
import { ref } from 'vue'

const token = ref(uni.getStorageSync('adminToken') || '')
const dashboard = ref(null)
const error = ref('')
const loading = ref(false)

const call = async (name, data = {}) => {
  const response = await uniCloud.callFunction({ name, data: { ...data, token: token.value } })
  return response.result
}

const login = async () => {
  if (!token.value) return
  loading.value = true
  error.value = ''
  try {
    const result = await call('admin-login')
    if (!result?.ok) throw new Error('登录失败')
    uni.setStorageSync('adminToken', token.value)
    dashboard.value = await call('admin-dashboard')
  } catch (err) {
    error.value = err?.message || '云函数调用失败，请确认已上传并配置 ADMIN_TOKEN'
    dashboard.value = null
  } finally { loading.value = false }
}

const logout = () => { token.value = ''; dashboard.value = null; uni.removeStorageSync('adminToken') }
</script>

<template>
  <view class="admin-page">
    <view class="admin-head"><view><text class="kicker">INSIGHT LAB / ADMIN</text><text class="heading">管理台</text></view><button v-if="dashboard" class="logout" @click="logout">退出</button></view>
    <view v-if="!dashboard" class="login-card"><text class="card-title">进入数据后台</text><text class="card-note">请输入云函数环境变量 ADMIN_TOKEN</text><input v-model="token" password placeholder="管理员 Token" class="token-input" @confirm="login"/><button class="login-button" :disabled="loading" @click="login">{{ loading ? '连接中…' : '登录管理台' }}</button><text v-if="error" class="error">{{ error }}</text></view>
    <view v-else><view class="stats"><view class="stat"><text>订单总数</text><strong>{{ dashboard.orders }}</strong></view><view class="stat"><text>测试项目</text><strong>{{ dashboard.tests }}</strong></view></view><view class="panel"><text class="card-title">云端连接正常</text><text class="card-note">数据来自 admin-dashboard 云函数</text></view></view>
  </view>
</template>

<style scoped>
.admin-page{min-height:100vh;padding:34px 24px;background:#f5f1e9;color:#22201d}.admin-head{display:flex;justify-content:space-between;align-items:flex-start}.kicker{display:block;color:#8a8175;font-size:11px;letter-spacing:2px}.heading{display:block;margin-top:10px;font-size:34px;font-weight:800}.logout{margin:0;padding:6px 12px;background:transparent;border:1px solid #cfc5b6;border-radius:8px;color:#6e665d;font-size:12px}.login-card,.panel{max-width:520px;margin:48px auto 0;padding:26px;background:#fffdf8;border:1px solid #ded5c8;border-radius:16px}.card-title{display:block;font-size:18px;font-weight:800}.card-note{display:block;margin-top:9px;color:#82796e;font-size:12px;line-height:1.6}.token-input{box-sizing:border-box;width:100%;height:46px;margin-top:24px;padding:0 13px;background:#f5f1e9;border:1px solid #ded5c8;border-radius:9px}.login-button{width:100%;margin-top:12px;background:#22201d;color:#d8f06a;border:0;border-radius:9px}.error{display:block;margin-top:14px;color:#b24f3e;font-size:12px}.stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:520px;margin:48px auto 0}.stat{padding:20px;background:#fffdf8;border:1px solid #ded5c8;border-radius:14px}.stat text{display:block;color:#82796e;font-size:12px}.stat strong{display:block;margin-top:12px;font-size:30px}
</style>
