<script setup lang="ts">
import { ref } from 'vue'
import { tests } from '../../data/tests'

const selectedCategory = ref('全部')
const categories = ['全部', '生活方式', '性格倾向', '关系灵感', '视觉偏好']
const visibleTests = () => selectedCategory.value === '全部' ? tests : tests.filter(item => item.category === selectedCategory.value)
const openTest = (id: string) => uni.navigateTo({ url: `/pages/test/index?id=${id}` })
</script>

<template>
  <view class="page home-page">
    <view class="topbar fade-up"><view class="brand">灵感<text>测验所</text></view><view class="top-icon" @click="uni.navigateTo({url:'/pages/history/index'})">◎</view></view>
    <view class="hero fade-up">
      <view class="eyebrow">A LITTLE MIRROR FOR YOUR DAY</view>
      <text class="hero-title">今天，想认识哪一个<br/><text class="hero-mark">版本的自己？</text></text>
      <text class="hero-copy">三分钟，做一个有趣的选择。<br/>答案不定义你，只给今天的心情一个名字。</text>
      <view class="hero-stamp">NEW<br/><text>01</text></view>
    </view>
    <view class="category-row fade-up"><scroll-view scroll-x :show-scrollbar="false"><view class="category-list"><view v-for="category in categories" :key="category" class="category" :class="{active:selectedCategory===category}" @click="selectedCategory=category">{{ category }}</view></view></scroll-view></view>
    <view class="section-head fade-up"><view><view class="eyebrow">CURATED FOR YOU</view><text class="section-title">今日灵感</text></view><text class="count">{{ visibleTests().length }} 个测试</text></view>
    <view class="test-list">
      <view v-for="(item,index) in visibleTests()" :key="item.id" class="test-card fade-up" :style="{animationDelay:`${index*70}ms`}" @click="openTest(item.id)">
        <view class="card-art" :style="{background:item.accent}"><text class="art-number">0{{ index+1 }}</text><text class="art-symbol">{{ index===0?'◒':index===1?'✳':'◌' }}</text></view>
        <view class="card-body"><view class="pill">{{ item.category }}</view><text class="card-title">{{ item.title }}</text><text class="card-subtitle">{{ item.subtitle }}</text><view class="card-meta"><text>{{ item.minutes }} 分钟</text><text class="price">¥{{ item.price }}</text></view></view>
        <view class="card-arrow">↗</view>
      </view>
    </view>
    <view class="footer-note sans">每一次选择，都是给自己的小小注脚。</view>
  </view>
</template>

<style scoped lang="scss">
.home-page{padding-top:34px}.topbar{display:flex;justify-content:space-between;align-items:center}.brand{font:800 20px Georgia;color:#1d1b19}.brand text{font-weight:400}.top-icon{font-size:23px}.hero{position:relative;padding:60px 0 48px}.hero-title{display:block;margin-top:16px;font-size:39px;line-height:1.12;font-weight:700;letter-spacing:-1px}.hero-mark{position:relative;z-index:1}.hero-mark:after{content:'';position:absolute;left:-4px;right:-4px;bottom:3px;height:11px;background:#d8f06a;z-index:-1;transform:rotate(-2deg)}.hero-copy{display:block;margin-top:22px;color:#817a70;font:14px/1.75 -apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}.hero-stamp{position:absolute;right:5px;top:58px;width:64px;height:64px;border:1px solid #cfc7ba;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#9a9185;font:700 9px/1.1 -apple-system}.hero-stamp text{font:700 18px Georgia}.category-row{margin:0 -22px;padding-left:22px}.category-list{display:flex;gap:9px;width:max-content;padding-bottom:4px}.category{padding:9px 14px;border:1px solid #e1dbd1;border-radius:999px;color:#817a70;font:600 12px -apple-system}.category.active{background:#1d1b19;color:#fffdf8;border-color:#1d1b19}.section-head{display:flex;justify-content:space-between;align-items:end;margin:42px 0 18px}.section-title{display:block;margin-top:7px;font-size:27px;font-weight:700}.count{color:#9a9185;font:12px -apple-system}.test-list{display:flex;flex-direction:column;gap:13px}.test-card{position:relative;display:flex;min-height:148px;overflow:hidden;background:#fffdf8;border:1px solid #e8e1d7;border-radius:18px;box-shadow:0 8px 20px rgba(55,44,30,.045)}.card-art{width:112px;flex-shrink:0;position:relative;padding:13px}.art-number{font:700 11px -apple-system;color:#1d1b19}.art-symbol{position:absolute;left:22px;bottom:16px;font-size:61px;line-height:1;color:#1d1b19;opacity:.8}.card-body{padding:16px 34px 14px 16px;display:flex;flex-direction:column}.card-title{margin-top:11px;font-size:21px;font-weight:700}.card-subtitle{margin-top:6px;color:#817a70;font:12px/1.45 -apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}.card-meta{display:flex;justify-content:space-between;margin-top:auto;padding-top:12px;color:#9a9185;font:11px -apple-system}.price{color:#1d1b19;font-weight:800}.card-arrow{position:absolute;right:14px;top:14px;font:22px Georgia;color:#8f877b}.footer-note{text-align:center;margin-top:42px;color:#aaa195;font-size:11px}
</style>
