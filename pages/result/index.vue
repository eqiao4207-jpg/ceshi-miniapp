<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTest, tests } from '../../data/tests'
import { cloudPaymentAdapter } from '../../services/payment-cloud'
const title = ref('太阳能量型')
const testTitle = ref('你的社交电量')
const report = ref('你不是一直热闹，只是把能量留给值得的人。')
const posterPath = ref('')
const showPoster = ref(false)
const unlocked = ref(false)
const paying = ref(false)
const showCoupon = ref(false)
const activeTest = ref(tests[0])
onLoad((query) => {
  if (!query?.id) return
  const test = getTest(String(query.id)); activeTest.value = test; testTitle.value = test.title
  const answers = uni.getStorageSync(`answers:${test.id}`) || {}
  const totals: Record<string, number> = {}
  test.questions.forEach(question => { const option = question.options[answers[question.id]]; Object.entries(option?.scores || {}).forEach(([key, value]) => { totals[key] = (totals[key] || 0) + value }) })
  const winner = Object.entries(totals).sort((a,b) => b[1] - a[1])[0]?.[0]
  if (test.id === 'hidden-self') { title.value = winner === 'spark' ? '灵感行动派' : winner === 'nest' ? '安静可靠派' : '温柔观察派'; report.value = '你有自己的节奏，不急着证明什么，却总能在关键时刻给出很稳的回应。' }
  if (test.id === 'love-language') { title.value = winner === 'word' ? '坦率表达型' : winner === 'gift' ? '行动照顾型' : '细节感知型'; report.value = '你表达在乎的方式很具体，真正喜欢一个人时，细节会替你说很多话。' }
  if (test.id === 'aesthetic-mood') { title.value = winner === 'yellow' ? '明亮柠檬黄' : winner === 'blue' ? '安静海盐蓝' : '热烈樱桃红'; report.value = '你正在寻找一种刚刚好的能量，它会从喜欢的颜色里先露出一点头。' }
  unlocked.value = uni.getStorageSync(`unlocked:${test.id}`) === true
})
const share = () => {
  if (!unlocked.value) return uni.showToast({ title: '先解锁完整报告', icon: 'none' })
  uni.showLoading({ title: '正在生成' })
  const context = uni.createCanvasContext('result-poster')
  context.setFillStyle('#1d1b19'); context.fillRect(0, 0, 640, 900)
  context.setFillStyle('#d8f06a'); context.fillRect(44, 56, 76, 6)
  context.setFillStyle('#fffdf8'); context.setFontSize(24); context.fillText('灵感测验所', 44, 112)
  context.setFillStyle('#817a70'); context.setFontSize(18); context.fillText(testTitle.value, 44, 190)
  context.setFillStyle('#d8f06a'); context.setFontSize(56); context.fillText(title.value, 44, 280)
  context.setFillStyle('#fffdf8'); context.setFontSize(25)
  const lines = report.value.match(/.{1,18}/g) || [report.value]
  lines.slice(0, 3).forEach((line, index) => context.fillText(line, 44, 360 + index * 45))
  context.setStrokeStyle('#524d46'); context.strokeRect(44, 540, 552, 190)
  context.setFillStyle('#bdb5a8'); context.setFontSize(18); context.fillText('这份结果来自你的即时选择', 70, 600); context.fillText('仅代表本次测验的趣味解读', 70, 650)
  context.setFillStyle('#d8f06a'); context.setFontSize(18); context.fillText('打开小程序，测测你的另一面 →', 44, 820)
  context.draw(false, () => uni.canvasToTempFilePath({ canvasId: 'result-poster', width: 640, height: 900, destWidth: 1280, destHeight: 1800,
    success: (res) => { posterPath.value = res.tempFilePath; showPoster.value = true; uni.hideLoading() },
    fail: () => { uni.hideLoading(); uni.showToast({ title: '海报生成失败，请重试', icon: 'none' }) }
  }))
}
const savePoster = () => { if (posterPath.value) uni.saveImageToPhotosAlbum({ filePath: posterPath.value, success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }), fail: () => uni.showToast({ title: '请允许保存到相册', icon: 'none' }) }) }
const unlock = async () => {
  if (paying.value) return
  paying.value = true
  const test = tests.find(item => item.title === testTitle.value) || tests[0]
  try {
    const result = await cloudPaymentAdapter.pay({ orderId: `demo_${Date.now()}`, productId: test.id, priceFen: activeTest.value.priceCouponFen || Math.round(Number(activeTest.value.price) * 100) })
    if (result.success) { unlocked.value = true; uni.setStorageSync(`unlocked:${test.id}`, true); uni.showToast({ title: '报告已解锁', icon: 'success' }) }
  } catch { uni.showToast({ title: '订单创建失败，请稍后重试', icon: 'none' }) }
  finally { paying.value = false }
}
</script>

<template><view class="result-page"><canvas canvas-id="result-poster" class="poster-canvas"/><view class="result-orbit orbit-one"/><view class="result-orbit orbit-two"/><view class="result-top"><text @click="uni.navigateBack()">←</text><text class="sans">我的结果</text><text @click="showCoupon=true">···</text></view><view class="result-content fade-up"><view class="eyebrow">{{ testTitle }} · RESULT 01</view><text class="result-title">{{ title }}</text><text class="result-lead">{{ unlocked ? report : '你已经走到结果门口，再做一个小小的选择，就能看见完整解读。' }}</text><view class="result-card"><view class="result-card-label">TODAY'S NOTE</view><text>{{ unlocked ? '这份结果来自你的即时选择。它不替你下定义，只是把此刻的状态照亮一点，让你更容易看见自己。' : '免费预览：你的结果会从选择倾向、沟通习惯和今日能量三个角度展开。' }}</text><view class="result-tags"><text>#松弛感</text><text>#选择性热情</text><text>#会充电</text></view></view><button v-if="!unlocked" class="button accent unlock-button" :disabled="paying" @click="unlock">{{ paying ? '正在确认…' : `¥${Number(activeTest.price).toFixed(2)} 解锁完整报告` }}</button><view v-else class="result-actions"><button class="button accent" @click="share">生成分享海报</button><button class="button ghost" @click="uni.reLaunch({url:'/pages/index/index'})">再测一个</button></view><text class="disclaimer sans">娱乐性质测评，仅代表本次选择的趣味解读。</text></view><view v-if="showCoupon" class="coupon-modal"><view class="coupon-sheet"><text class="coupon-close" @click="showCoupon=false">×</text><text class="coupon-kicker">SPECIAL OFFER</text><text class="coupon-title">刚刚好，再便宜一点</text><text class="coupon-copy">如果原价不太合适，给你一张专属券。</text><button class="button accent" @click="showCoupon=false; unlock">¥{{ (Number(activeTest.priceCouponFen) / 100).toFixed(2) }} 券后解锁</button></view></view><view v-if="showPoster" class="poster-modal"><view class="poster-sheet"><view class="poster-head"><text class="sans">你的结果海报</text><text @click="showPoster=false">×</text></view><image :src="posterPath" mode="widthFix" class="poster-image"/><button class="button accent poster-save" @click="savePoster">保存到相册</button></view></view></view></template>

<style scoped lang="scss">.result-page{position:relative;min-height:100vh;overflow:hidden;padding:28px 22px;background:#1d1b19;color:#fffdf8}.poster-canvas{position:absolute;left:-9999px;top:-9999px;width:640px;height:900px}.result-orbit{position:absolute;border:1px solid rgba(216,240,106,.3);border-radius:50%;pointer-events:none}.orbit-one{width:390px;height:390px;right:-190px;top:110px}.orbit-two{width:270px;height:270px;left:-145px;bottom:70px;border-color:rgba(255,180,158,.35)}.result-top{display:flex;justify-content:space-between;align-items:center;color:#d1c9bd;font:14px -apple-system}.result-content{position:relative;padding-top:92px}.result-title{display:block;margin-top:18px;color:#d8f06a;font-size:52px;line-height:1.06;font-weight:700}.result-lead{display:block;margin-top:28px;font-size:22px;line-height:1.45}.result-card{margin-top:47px;padding:22px 20px 20px;background:#fffdf8;color:#1d1b19;border-radius:18px}.result-card-label{font:700 10px/1 -apple-system;letter-spacing:1.8px;color:#9a9185;margin-bottom:17px}.result-card text{font:15px/1.75 -apple-system}.result-tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.result-tags text{padding:6px 9px;border-radius:999px;background:#ece7dd;color:#6c665c;font-size:11px;line-height:1}.result-actions{display:flex;gap:10px;margin-top:20px}.result-actions button{flex:1}.ghost{background:transparent;color:#fffdf8;border:1px solid #5e574e}.disclaimer{display:block;text-align:center;margin-top:23px;color:#817a70;font-size:10px}.poster-modal{position:fixed;z-index:10;inset:0;display:flex;align-items:flex-end;background:rgba(0,0,0,.62)}.poster-sheet{width:100%;padding:18px 22px 28px;background:#f8f5ef;border-radius:22px 22px 0 0}.poster-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;color:#1d1b19;font-size:16px}.poster-head text:last-child{font-size:26px}.poster-image{display:block;width:100%;max-height:58vh;border-radius:12px;background:#1d1b19}.poster-save{width:100%;margin-top:16px}</style>
<style scoped>
.coupon-modal{position:fixed;z-index:11;inset:0;display:flex;align-items:flex-end;background:rgba(0,0,0,.62)}.coupon-sheet{position:relative;width:100%;padding:30px 24px 34px;background:#fffdf8;color:#1d1b19;border-radius:24px 24px 0 0}.coupon-close{position:absolute;right:24px;top:16px;font-size:25px;color:#817a70}.coupon-kicker{display:block;color:#9a9185;font:11px/1.2 monospace;letter-spacing:2px}.coupon-title{display:block;margin-top:14px;font-size:28px;font-weight:700}.coupon-copy{display:block;margin:10px 0 22px;color:#817a70;font-size:13px}.coupon-sheet button{width:100%}
</style>
