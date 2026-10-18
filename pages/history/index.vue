<script setup lang="ts">
import { computed } from 'vue'
import { tests } from '../../data/tests'
const history = computed(() => tests.filter(test => uni.getStorageSync(`answers:${test.id}`)))
const open = (id:string) => uni.navigateTo({url:`/pages/result/index?id=${id}`})
</script>

<template>
  <view class="page history-page">
    <view class="history-head"><view><view class="eyebrow">YOUR LITTLE ARCHIVE</view><text class="heading">我的测试</text></view><text class="count sans">{{ history.length }} 次记录</text></view>
    <view v-if="history.length" class="history-list"><view v-for="item in history" :key="item.id" class="history-item" @click="open(item.id)"><view class="history-art" :style="{background:item.accent}">✦</view><view class="history-info"><text class="history-title">{{ item.title }}</text><text class="history-meta sans">{{ item.category }} · {{ uni.getStorageSync(`unlocked:${item.id}`) ? '已解锁报告' : '已完成测试' }}</text></view><text class="arrow">→</text></view></view>
    <view v-else class="empty"><text class="empty-symbol">○</text><text class="empty-title">这里还很安静</text><text class="empty-copy sans">完成一个测试，给今天的自己留一条记录。</text><button class="button primary" @click="uni.reLaunch({url:'/pages/index/index'})">去发现测试</button></view>
  </view>
</template>

<style scoped lang="scss">.history-page{padding-top:34px}.history-head{display:flex;justify-content:space-between;align-items:end}.heading{display:block;margin-top:10px;font-size:32px;font-weight:700}.count{color:#9a9185;font-size:12px}.history-list{display:flex;flex-direction:column;gap:12px;margin-top:35px}.history-item{position:relative;display:flex;align-items:center;padding:12px;background:#fffdf8;border:1px solid #e8e1d7;border-radius:16px}.history-art{width:58px;height:58px;display:flex;align-items:center;justify-content:center;border-radius:12px;color:#1d1b19;font-size:27px}.history-info{display:flex;flex-direction:column;margin-left:14px;gap:7px}.history-title{font-size:18px;font-weight:700}.history-meta{color:#9a9185;font-size:11px}.arrow{margin-left:auto;padding-right:8px;color:#817a70;font-size:19px}.empty{display:flex;flex-direction:column;align-items:center;padding-top:130px;text-align:center}.empty-symbol{color:#d8f06a;font-size:76px;line-height:1}.empty-title{margin-top:24px;font-size:24px;font-weight:700}.empty-copy{margin-top:10px;color:#9a9185;font-size:13px}.empty .button{margin-top:32px;width:180px}</style>
