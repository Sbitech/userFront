<template>
  <v-container class="video-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="video-header-navbar video-header-shadow" elevation="6">
          <v-btn icon variant="text" class="video-header-back" @click="$router.back && $router.back()">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="video-header-title">武术比赛录像</span>
        </div>
        <!-- 录像卡片 -->
        <v-card class="pa-7 mb-8 video-card card-shadow" elevation="6">
          <v-row align="center" class="mb-4">

          </v-row>
          
          <!-- 赛事选择下拉菜单 -->
          <v-select
            v-model="selectedEvent"
            :items="events"
            item-title="name"
            item-value="id"
            label="请选择要观看的赛事"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            @update:model-value="onEventSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.date + ' · ' + item.raw.venue"></v-list-item>
            </template>
          </v-select>

          <!-- 视频播放器 -->
          <v-responsive v-if="selectedEvent" aspect-ratio="16/9" class="mb-4 video-player-wrap">
            <video ref="videoPlayer" controls class="video-player">
              <source :src="currentVideoUrl" type="video/mp4" />
              您的浏览器不支持 video 标签。
            </video>
          </v-responsive>

          <!-- 视频下载按钮 -->
          <v-row v-if="selectedEvent" justify="center" class="mb-5">
            <v-col cols="12" sm="6" md="4">
              <v-btn
                color="success"
                variant="elevated"
                block
                size="large"
                @click="downloadVideo"
                :disabled="!currentVideoUrl"
              >
                <v-icon start>mdi-download</v-icon>
                下载视频
              </v-btn>
            </v-col>
          </v-row>

          <!-- 赛事信息显示区域 -->
          <v-card v-if="selectedEvent" class="pa-4 mt-4" elevation="2" style="background: #f8f9ff;">
            <div class="event-info-title mb-3">赛事信息</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="event-info-item">
                  <span class="event-info-label">赛事名称：</span>
                  <span class="event-info-value">{{ selectedEvent.name }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="event-info-item">
                  <span class="event-info-label">比赛时间：</span>
                  <span class="event-info-value">{{ selectedEvent.date }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="event-info-item">
                  <span class="event-info-label">比赛场地：</span>
                  <span class="event-info-value">{{ selectedEvent.venue }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
        <!-- 上传录像区 -->
         <!-- <v-card class="pa-7 mb-8 video-card card-shadow" elevation="6">
          <div class="video-upload-label mb-2">上传录像</div>
          <v-card class="pa-0 mb-8 video-upload-card" elevation="0">
            <v-sheet class="video-upload-box-img" rounded outlined>
              <v-row align="center" justify="center" style="height: 120px;">
                <v-icon color="#bdbdbd" size="64">mdi-paperclip</v-icon>
              </v-row>
            </v-sheet>
            <v-btn color="#2563EB" class="video-upload-btn-img" block rounded size="x-large">
              提交视频
            </v-btn>
          </v-card>
        </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// 视频播放器引用
const videoPlayer = ref(null)

// 当前播放的视频URL和名称
const currentVideoUrl = ref('')
const currentVideoName = ref('')

// 选中的赛事
const selectedEvent = ref(null)

// 赛事数据数组
const events = ref([
  {
    id: 1,
    name: '男子长拳比赛',
    date: '2024-05-15 10:30',
    venue: '主体育馆A场',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 2,
    name: '男子南拳比赛',
    date: '2024-05-17 09:45',
    venue: '主体育馆A场',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
])

// 选择赛事后的处理函数
function onEventSelected(eventId) {
  const event = events.value.find(e => e.id === eventId)
  if (event) {
    selectedEvent.value = event
    playVideo(event.videoUrl, event.name)
  }
}

// 播放视频函数
function playVideo(url, name) {
  currentVideoUrl.value = url
  currentVideoName.value = name
  
  // 等待DOM更新后播放视频
  setTimeout(() => {
    if (videoPlayer.value) {
      videoPlayer.value.load()
      videoPlayer.value.play().catch(error => {
        console.log('视频播放失败:', error)
      })
    }
  }, 100)
}

// 下载视频函数
function downloadVideo() {
  if (!currentVideoUrl.value || !selectedEvent.value) {
    return
  }
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = currentVideoUrl.value
  link.download = `${selectedEvent.value.name}_比赛录像.mp4`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // 显示下载提示
  console.log('开始下载视频:', selectedEvent.value.name)
}
</script>

<style scoped>
.video-bg {
  background: #f5f7ff;
  min-height: 100vh;
}
.video-header-navbar {
  width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px #e3e8f7;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-bottom: 24px;
  margin-top: 0;
  border-bottom: none;
}
.video-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}
.card-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
}
.video-header-back {
  margin-left: -8px;
}
.video-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}
.video-card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(80,120,200,0.04);
  margin-top: 0;
}
.video-card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
}
.video-section-label {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
  margin-top: 0;
}
.video-player-wrap {
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}
.video-player {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 12px;
  outline: none;
}
.video-table {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: none;
  font-size: 1.05rem;
  border-collapse: separate;
  border-spacing: 0;
}
.video-table-scroll {
  width: 100%;
  overflow: visible;
  padding-bottom: 0;
  margin-bottom: 8px;
}
.video-table-scroll::-webkit-scrollbar,
.video-table-scroll::-webkit-scrollbar-thumb,
.video-table-scroll::-webkit-scrollbar-track {
  display: none;
}
.video-th {
  color: #8a8fa3;
  font-weight: 500;
  font-size: 1.01rem;
  background: #f8fafc;
  border-bottom: 2px solid #f0f1f5;
  white-space: nowrap;
  padding: 14px 0 14px 18px;
  text-align: left;
}
.video-table td {
  white-space: nowrap;
  background: #fff;
  font-size: 1.08rem;
  color: #222;
  padding: 18px 0 18px 18px;
  border-bottom: 2px solid #f0f1f5;
  vertical-align: middle;
}
.video-table td:last-child, .video-th:last-child {
  white-space: nowrap;
}
.video-link {
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: 1.05rem;
  transition: text-decoration 0.15s;
  margin-right: 12px;
  letter-spacing: 0.2px;
}
.video-link:last-child {
  margin-right: 0;
}
.video-link .v-icon {
  margin-right: 3px;
  font-size: 18px;
}
.video-link:hover {
  text-decoration: underline;
}
.video-upload-label {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
  margin-top: 0;
}
.video-upload-card {
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(80,120,200,0.04);
}
.video-upload-box {
  border: 1.5px dashed #bdbdbd;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: 110px;
  padding: 0;
  box-sizing: border-box;
  margin-bottom: 18px;
}
.video-upload-box-img {
  border: 1.5px dashed #bdbdbd;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: 120px;
  padding: 0;
  box-sizing: border-box;
  margin-bottom: 22px;
  border-radius: 12px;
}
.video-upload-box:hover {
  border-color: #3b82f6;
}
.video-upload-btn {
  font-size: 1.14rem;
  font-weight: bold;
  height: 54px;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
}
.video-upload-btn-img {
  font-size: 1.18rem;
  font-weight: bold;
  height: 54px;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
  border-radius: 8px;
}
body, html {
  overflow-x: hidden;
}
@media (max-width: 900px) {
  .video-header-navbar {
    padding: 0 8px;
    height: 52px;
  }
  .video-header-title {
    font-size: 1.25rem;
  }
  .video-card {
    padding: 14px !important;
    border-radius: 12px;
  }
  .video-upload-card {
    padding: 0 !important;
    border-radius: 10px;
  }
  .video-table {
    font-size: 0.93rem;
    border-radius: 8px;
  }
  .video-th {
    font-size: 0.93rem;
    padding-left: 6px;
    padding-right: 2px;
  }
  .video-table td {
    font-size: 0.97rem;
    padding-left: 6px;
    padding-right: 2px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .video-link {
    font-size: 0.97rem;
    margin-right: 8px;
  }
  .video-upload-box-img {
    min-height: 80px;
    margin-bottom: 14px;
    border-radius: 8px;
  }
  .video-upload-btn-img {
    font-size: 1.05rem;
    height: 44px;
    border-radius: 6px;
  }
}
@media (max-width: 600px) {
  .video-header-navbar {
    padding: 0 6px;
    height: 44px;
  }
  .video-header-title {
    font-size: 0.98rem;
  }
  .video-card {
    padding: 20px !important;
    border-radius: 8px;
  }
  .video-upload-card {
    padding: 0 !important;
    border-radius: 6px;
  }
  .video-table {
    font-size: 0.89rem;
    border-radius: 6px;
  }
  .video-th {
    font-size: 0.89rem;
    padding-left: 2px;
    padding-right: 2px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .video-table td {
    font-size: 0.93rem;
    padding-left: 2px;
    padding-right: 2px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .video-link {
    font-size: 0.93rem;
    margin-right: 6px;
  }
  .video-upload-box-img {
    min-height: 60px;
    margin-bottom: 8px;
    border-radius: 4px;
  }
  .video-upload-btn-img {
    font-size: 0.98rem;
    height: 38px;
    border-radius: 4px;
  }
}
.event-info-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 12px;
}

.event-info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.5;
}

.event-info-label {
  font-weight: 500;
  color: #666;
  margin-right: 8px;
  min-width: 80px;
}

.event-info-value {
  color: #333;
  flex: 1;
}

@media (max-width: 600px) {
  .event-info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .event-info-label {
    min-width: auto;
    margin-bottom: 4px;
  }
}

</style>
