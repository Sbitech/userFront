<template>
  <v-container class="sign-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="sign-header-navbar sign-header-shadow" elevation="6">
          <v-btn icon variant="text" class="sign-header-back" @click="$router.back && $router.back()">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="sign-header-title">武术签到</span>
        </div>
        <!-- 签到卡片 -->
        <v-card class="pa-7 mb-8 sign-card card-shadow " elevation="1" style="border-radius: 14px;">
          <v-row align="center" class="mb-5 px-4 pt-4">
            <v-avatar size="44" class="mr-3" style="background:#e8f7ff;">
              <v-icon size="30" color="#3b82f6">mdi-account</v-icon>
            </v-avatar>
            <span class="sign-card-title">武术比赛签到</span>
          </v-row>

          <v-row class="mb-2 sign-info-row px-2">
            <v-col cols="12" class="sign-label">赛事名称</v-col>
            <v-col cols="12" class="sign-competition-name font-weight-bold">{{ competitionName }}</v-col>
          </v-row>
          <v-row class="mb-2 sign-info-row px-2">
            <v-col cols="6" class="sign-label">参赛编号</v-col>
            <v-col cols="6" class="sign-label">参赛项目</v-col>
            <v-col cols="6" class="sign-value font-weight-bold">{{ competitionId }}</v-col>
            <v-col cols="6" class="sign-value font-weight-bold">{{ eventsName }}</v-col>
          </v-row>
          <v-row class="mb-2 sign-info-row px-2">
            <v-col cols="6" class="sign-label">比赛时间</v-col>
            <v-col cols="6" class="sign-label">比赛场地</v-col>
            <v-col cols="6" class="sign-value font-weight-bold">{{ formatDate(startTime) }}</v-col>
            <v-col cols="6" class="sign-value font-weight-bold">{{ location }}</v-col>
          </v-row>

          <div class="mb-2 sign-status-list px-2">
            <div>
              第一次签到-赛前30分钟：
              <span class="sign-status" :class="getStatusClass(first)">{{ first }}</span>
            </div>

            <div>
              第二次签到-赛前20分钟：
              <span class="sign-status" :class="getStatusClass(second)">{{ second }}</span>
            </div>

            <div>
              第三次签到-赛前10分钟：
              <span class="sign-status" :class="getStatusClass(third)">{{ third }}</span>
            </div>
          </div>

          <div class="mb-5  sign-next-time px-2">下次签到时间为：<span class="font-weight-bold">2025/07/07 9:30</span></div>
          <v-btn color="primary" class="sign-btn px-4 mb-4" block rounded size="x-large">
            <v-icon left>mdi-qrcode-scan</v-icon>扫码签到
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue';
const user = JSON.parse(localStorage.getItem('user'));
const first = ref("");
const second = ref("");
const third = ref("");

// 存储比赛项目信息
const competitionId = ref("");
const competitionName = ref("");
const startDate = ref("");
const endDate = ref("");
const location = ref("");
const eventLevel = ref("");
const eventsName = ref("");
const startTime = ref("");

onMounted(() => {

  const getStatus = async () => {
    try {
      const response = await axios.get("http://localhost:9090/signIn/getSignInStatus", {
        params: {
          id: user.id
        }
      });
      first.value = response.data[0];
      second.value = response.data[1];
      third.value = response.data[2];
    } catch (error) {
      console.error("获取签到状态失败:", error);
    }
  }


  // 获取比赛项目信息
  const getCompetitionEvents = async () => {
    try {
      const response = await axios.get("http://localhost:9090/events/getCompetition_Events", {
        params: {
          id: user.id
        }
      });
      if (response.data) {
        console.log("获取比赛项目信息成功:", response.data);
        competitionId.value=response.data.competitionId;
        eventsName.value=response.data.name;
        competitionName.value=response.data.competitionName;
        startDate.value=response.data.startDate;
        endDate.value=response.data.endDate;
        location.value=response.data.location;
        eventLevel.value=response.data.eventLevel;
        startTime.value=response.data.startTime;
      }
    } catch (error) {
      console.error("获取比赛项目信息失败:", error);
    }
  }

  // 页面加载时同时获取签到状态和比赛项目信息
  getStatus();
  getCompetitionEvents();
});
// 状态转类名
function getStatusClass(status) {
  if (status === '已签到') return 'sign-green'
  if (status === '待签到') return 'sign-grey'
  if (status === '未签到') return 'sign-red'
  return 'sign-grey' // 默认
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.sign-bg {
  background: #f5f7ff;
  min-height: 100vh;
}

.sign-header-navbar {
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
  border-bottom: 1.5px solid #f0f1f5;
}

.sign-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}

.sign-header-back {
  margin-left: -8px;
}

.sign-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}

.sign-card {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.04);
}

.sign-card-title {
  font-size: 1.18rem;
  font-weight: bold;
  color: #222;
}

.sign-alert {
  background: #e8f7ff !important;
  color: #3b82f6 !important;
  border-radius: 10px;
  font-size: 1.04rem;
  align-items: center;
  min-height: 44px;
  display: flex;
}

.sign-info-row {
  font-size: 1.12rem;
  margin-bottom: 2px;
}

.sign-label {
  color: #8a8fa3;
  font-size: 1.04rem;
  padding-bottom: 0;
}

.sign-value {
  color: #222;
  font-size: 1.18rem;
  padding-bottom: 0;
}

.sign-status-list {
  font-size: 1.04rem;
  margin-bottom: 8px;
  line-height: 1.8;
}

.sign-status {
  font-weight: bold;
  margin-left: 2px;
}



.sign-next-time {
  font-size: 1.04rem;
  color: #222;
  margin-bottom: 18px;
}

.sign-btn {
  font-size: 1.12rem;
  font-weight: bold;
  height: 52px;
  letter-spacing: 1px;
}

/* 比赛项目信息样式 */
.sign-competition-info {
  background: #f8f9ff;
  border-radius: 10px;
  padding: 16px;
  border-left: 4px solid #3b82f6;
}

.competition-title {
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.competition-item {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e8eaf6;
}

.competition-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.event-name {
  font-weight: bold;
  color: #222;
  margin-bottom: 4px;
  font-size: 1.05rem;
}

.event-details {
  font-size: 0.95rem;
  color: #666;
}

.event-details span {
  margin-right: 16px;
  display: inline-block;
}

.sign-status {
  font-weight: bold;
}

.sign-green {
  color: #4caf50;
  /* Vuetify 的绿色 */
}

.sign-grey {
  color: #9e9e9e;
  /* Vuetify 的灰色 */
}

.sign-red {
  color: #f44336;
  /* Vuetify 的红色 */
}

@media (max-width: 900px) {
  .sign-header-navbar {
    padding: 0 8px;
    height: 52px;
  }

  .sign-header-title {
    font-size: 1.08rem;
  }

  .sign-card {
    padding: 14px !important;
    border-radius: 12px;
  }

  .sign-card-title {
    font-size: 1.05rem;
  }

  .sign-alert {
    font-size: 0.98rem;
    min-height: 36px;
    border-radius: 8px;
  }

  .sign-label {
    font-size: 0.98rem;
  }

  .sign-value {
    font-size: 1.05rem;
  }

  .sign-status-list {
    font-size: 0.98rem;
  }

  .sign-next-time {
    font-size: 0.98rem;
  }

  .sign-btn {
    font-size: 1.01rem;
    height: 44px;
    border-radius: 8px;
  }
}

@media (max-width: 600px) {
  .sign-header-navbar {
    padding: 0 6px;
    height: 44px;
  }

  .sign-header-title {
    font-size: 0.98rem;
  }

  .sign-card {
    padding: 8px !important;
    border-radius: 8px;
  }

  .sign-card-title {
    font-size: 0.93rem;
  }

  .sign-alert {
    font-size: 0.91rem;
    min-height: 28px;
    border-radius: 4px;
  }

  .sign-label {
    font-size: 0.91rem;
  }

  .sign-value {
    font-size: 0.98rem;
  }

  .sign-status-list {
    font-size: 0.91rem;
  }

  .sign-next-time {
    font-size: 0.91rem;
  }

  .sign-btn {
    font-size: 0.95rem;
    height: 36px;
    border-radius: 4px;
  }
}
</style>
