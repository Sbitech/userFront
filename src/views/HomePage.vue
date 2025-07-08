<template>
  <v-container class="py-6" style="max-width: 420px; margin: 0 auto;">
    <!-- 用户卡片 -->
    <v-card class="mb-6 px-4 pt-4 pb-2" elevation="0" style="background: #f7f9ff; border-radius: 18px;">
      <v-row align="center" justify="space-between">
        <v-row align="center" no-gutters>
          <v-avatar size="36">
            <v-img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
          </v-avatar>
          <div class="ml-3">
            <div class="text-body-1 font-weight-bold">参赛选手</div>
            <div class="text-caption text-grey-darken-1">ID:20250707</div>
          </div>
        </v-row>
        <v-btn icon variant="text" size="small">
          <v-icon color="#bdbdbd">mdi-share-variant</v-icon>
        </v-btn>
      </v-row>
    </v-card>

    <!-- 功能卡片区 -->
    <v-row dense>
      <v-col cols="12" v-for="(item, i) in features" :key="i" class="mb-4">
        <v-card elevation="0" class="py-6 px-0 d-flex flex-column align-center" :style="'background: #f7f9ff; border-radius: 18px;'">
          <v-avatar size="48" :style="'background:' + item.bg">
            <v-icon :color="item.color" size="32">{{ item.icon }}</v-icon>
          </v-avatar>
          <div class="mt-3 text-h6 font-weight-bold">{{ item.title }}</div>
          <div class="mt-1 text-body-2 text-grey-darken-1">{{ item.desc }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const features = [
  {
    icon: 'mdi-account-check',
    color: '#3b82f6',
    bg: '#e8f1ff',
    title: '签到功能',
    desc: '比赛签到，记录参赛信息'
  },
  {
    icon: 'mdi-file-document-outline',
    color: '#34c759',
    bg: '#e8fbe8',
    title: '查看报告',
    desc: '成绩报告的查看与下载'
  },
  {
    icon: 'mdi-gavel',
    color: '#ff9800',
    bg: '#fff7e6',
    title: '申诉功能',
    desc: '提交成绩争议申诉'
  },
  {
    icon: 'mdi-video',
    color: '#a259ff',
    bg: '#f5e8ff',
    title: '比赛录像',
    desc: '查看录像回放'
  }
]
</script>

<style scoped>
.text-h6 {
  font-size: 1.15rem;
}
.v-card {
  box-shadow: none;
}
</style>
