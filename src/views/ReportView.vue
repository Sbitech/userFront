<template>
  <v-container class="report-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="report-header-navbar">
          <v-btn icon variant="text" class="report-header-back" @click="$router.back()">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="report-header-title">成绩报告</span>
        </div>
        <!-- 成绩卡片 -->
        <v-card class="pa-6 mb-6 report-card" elevation="2">
          <v-row align="center" class="mb-4">
            <v-avatar size="40" class="mr-3" style="background:#e8f7e0;">
              <v-icon size="28" color="#4caf50">mdi-file-document-outline</v-icon>
            </v-avatar>
            <span class="report-card-title">成绩报告</span>
          </v-row>
          <div class="mb-2 report-table-title">成绩列表</div>
          <div class="report-table-scroll mb-2">
            <v-table class="report-table">
              <thead>
                <tr>
                  <th>比赛项目</th>
                  <th>成绩</th>
                  <th>排名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in reportList" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.score }}</td>
                  <td>{{ item.rank }}</td>
                  <td>
                    <v-btn variant="text" size="small" color="primary" @click="downloadReport(item)">
                      <v-icon size="18" class="mr-1">mdi-download</v-icon>下载报告
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
        <!-- 成绩可视化 -->
        <v-card class="pa-6 report-card mb-8" elevation="2">
          <div class="mb-4 report-table-title">成绩可视化</div>
          <div class="mb-6">
            <div class="mb-2 report-chart-title">各项目成绩对比</div>
            <div class="report-chart-full" style="height:220px;">
              <v-responsive :aspect-ratio="2.1">
                <div ref="barChart" style="width:100%;height:100%;"></div>
              </v-responsive>
            </div>
          </div>
          <div>
            <div class="mb-2 report-chart-title">历史成绩趋势</div>
            <div class="report-chart-full" style="height:220px;">
              <v-responsive :aspect-ratio="2.1">
                <div ref="lineChart" style="width:100%;height:100%;"></div>
              </v-responsive>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';

const reportList = [
  { name: '100米短跑', score: '12.45秒', rank: '第3名' },
  { name: '跳远', score: '6.78米', rank: '第1名' },
];

const downloadReport = (item) => {
  // 模拟下载
  alert(`下载${item.name}报告`);
};

const barChart = ref(null);
const lineChart = ref(null);

onMounted(async () => {
  await nextTick();
  // 柱状图
  const bar = echarts.init(barChart.value);
  bar.setOption({
    tooltip: {},
    legend: { data: ['成绩'], top: 0 },
    grid: { left: 30, right: 20, bottom: 30, top: 40 },
    xAxis: {
      data: ['100米短跑', '跳远', '铅球'],
      axisLabel: { fontSize: 13 },
    },
    yAxis: {},
    series: [
      {
        name: '成绩',
        type: 'bar',
        data: [12.45, 6.78, 14],
        itemStyle: {
          color: function(params) {
            const colors = ['#3b82f6', '#22c55e', '#fb923c'];
            return colors[params.dataIndex];
          },
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: 36,
      },
    ],
  });
  // 折线图
  const line = echarts.init(lineChart.value);
  line.setOption({
    tooltip: {},
    legend: { data: ['100米短跑成绩(秒)'], top: 0 },
    grid: { left: 30, right: 20, bottom: 30, top: 40 },
    xAxis: {
      type: 'category',
      data: ['2021', '2022', '2023', '2024'],
      axisLabel: { fontSize: 13 },
    },
    yAxis: {},
    series: [
      {
        name: '100米短跑成绩(秒)',
        type: 'line',
        data: [13.2, 12.8, 12.6, 12.45],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#3b82f6', width: 3 },
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: 'rgba(59,130,246,0.08)' },
      },
    ],
  });
});
</script>

<style scoped>
.report-bg {
  background: #f5f7ff;
  min-height: 100vh;
}
.report-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
}
.report-card {
  border-radius: 18px;
  background: #fff;
}
.report-card-title {
  font-size: 1.12rem;
  font-weight: bold;
  color: #222;
}
.report-table-title {
  font-size: 1.02rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 8px;
}
.report-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 10px;
  background: #f7f8fa;
  padding-bottom: 2px;
}
.report-table {
  min-width: 420px;
  font-size: 0.98rem;
}
.report-table th {
  color: #8a8fa3;
  font-weight: 500;
  background: #f7f8fa;
}
.report-table td {
  color: #222;
  background: #fff;
}
.report-chart-title {
  font-size: 1.01rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 6px;
}
.report-table-scroll::-webkit-scrollbar {
  height: 8px;
  background: #f0f1f5;
  border-radius: 8px;
}
.report-table-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}
.report-header-navbar {
  width: 100%;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
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
.report-header-back {
  margin-left: -8px;
}
.report-header-title {
  font-size: 2rem;
  font-weight: 900;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}
.report-chart-full {
  width: 100%;
  min-width: 0;
  overflow-x: visible;
}
.report-chart-scroll {
  /* 彻底移除横向滚动条样式 */
  overflow-x: visible !important;
  margin-bottom: 0 !important;
}
@media (max-width: 600px) {
  .report-header-navbar {
    padding: 0 12px;
    height: 48px;
  }
  .report-header-title {
    font-size: 1.18rem;
  }
}
</style>