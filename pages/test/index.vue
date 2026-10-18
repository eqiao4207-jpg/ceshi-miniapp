<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTest, type TestItem } from '../../data/tests'

const test = ref<TestItem>(getTest('social-battery'))
const current = ref(0)
const answers = ref<Record<string, number>>({})
const selected = computed(() => answers.value[test.value.questions[current.value]?.id])
onLoad((query) => { if (query?.id) test.value = getTest(String(query.id)) })
const choose = (index:number) => { answers.value[test.value.questions[current.value].id] = index }
const next = () => { if (selected.value === undefined) return uni.showToast({title:'先选一个答案',icon:'none'}); if (current.value < test.value.questions.length - 1) current.value++; else { uni.setStorageSync(`answers:${test.value.id}`, answers.value); uni.navigateTo({url:`/pages/result/index?id=${test.value.id}`}) } }
</script>

<template>
  <view class="page test-page">
    <view class="test-nav"><text @click="uni.navigateBack()">← 返回</text><text class="sans">{{ current + 1 }} / {{ test.questions.length || 8 }}</text></view>
    <view v-if="test.questions.length" class="question-wrap fade-up"><view class="progress"><view :style="{width:`${((current+1)/test.questions.length)*100}%`}" /></view><view class="eyebrow">QUESTION {{ String(current+1).padStart(2,'0') }}</view><text class="question">{{ test.questions[current].title }}</text><text class="tip">凭第一反应选择，不必想太久。</text><view class="options"><view v-for="(option,index) in test.questions[current].options" :key="option.label" class="option" :class="{chosen:selected===index}" @click="choose(index)"><text class="option-key">{{ String.fromCharCode(65+index) }}</text><text>{{ option.label }}</text><text v-if="selected===index" class="check">✓</text></view></view><button class="button primary next" :class="{disabled:selected===undefined}" @click="next">{{ current === test.questions.length-1 ? '查看我的结果' : '下一题' }} <text>→</text></button></view>
    <view v-else class="empty-test"><view class="eyebrow">COMING SOON</view><text class="question">这份测试正在准备中</text><text class="tip">先去试试「你的社交电量」吧。</text><button class="button accent next" @click="uni.redirectTo({url:'/pages/test/index?id=social-battery'})">开始推荐测试 →</button></view>
  </view>
</template>

<style scoped lang="scss">.test-page{padding-top:28px}.test-nav{display:flex;justify-content:space-between;color:#817a70;font:13px -apple-system}.progress{height:4px;background:#e8e1d7;border-radius:4px;margin:39px 0 45px}.progress view{height:100%;background:#1d1b19;border-radius:4px;transition:width .3s}.question{display:block;margin-top:18px;font-size:31px;line-height:1.25;font-weight:700}.tip{display:block;margin-top:13px;color:#9a9185;font:13px -apple-system}.options{display:flex;flex-direction:column;gap:11px;margin-top:40px}.option{display:flex;align-items:center;gap:13px;padding:18px 15px;border:1px solid #e1dbd1;border-radius:15px;background:#fffdf8;font:15px -apple-system;transition:all .2s}.option.chosen{border-color:#1d1b19;background:#d8f06a}.option-key{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border:1px solid #cfc7ba;border-radius:50%;font:700 12px Georgia}.check{margin-left:auto;font-weight:800}.next{width:100%;margin-top:34px}.disabled{opacity:.45}.empty-test{padding-top:110px}.empty-test .question{margin-top:20px}.empty-test .next{margin-top:42px}</style>
