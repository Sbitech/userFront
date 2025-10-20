<template>
  <v-container class="report-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="report-header-navbar report-header-shadow " elevation="6">
          <v-btn icon variant="text" class="report-header-back" @click="$router.back()">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="report-header-title">成绩报告</span>
        </div>

        <!-- 成绩卡片 -->
        <v-card class="mb-6  report-card card-shadow report-padding" elevation="6">
          <v-row align="center" class="mb-4">
            <v-avatar size="40" class="mr-3" style="background:#e8f7e0;">
              <v-icon size="28" color="#4caf50">mdi-file-document-outline</v-icon>
            </v-avatar>
            <span class="report-card-title">成绩报告</span>
          </v-row>
          <div class="mb-2 report-table-title">武术项目成绩列表</div>
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
                    <v-btn 
                      variant="text" 
                      size="small" 
                      :color="item.isGenerated ? 'primary' : 'warning'"
                      @click="item.isGenerated ? downloadReport(item) : generateReport(item)"
                      :loading="item.loading"
                    >
                      <v-icon size="18" class="mr-1">{{ item.isGenerated ? 'mdi-download' : 'mdi-file-clock-outline' }}</v-icon>
                      {{ item.isGenerated ? '下载报告' : '生成报告' }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
        <!-- 成绩可视化 -->
        <v-card class="mb-8 report-card card-shadow report-padding" elevation="6">
          <v-row align="center" class="mb-4">
            <v-avatar size="40" class="mr-3" style="background:#e8f7ff;">
              <v-icon size="28" color="#3b82f6">mdi-chart-bar</v-icon>
            </v-avatar>
            <span class="report-card-title">成绩可视化</span>
          </v-row>
          <div class="mb-6">
            <div class="mb-2 report-chart-title">各武术项目得分对比</div>
            <div class="report-chart-full" style="height:220px;width:100%;min-width:0;">
              <v-responsive :aspect-ratio="2.1">
                <div ref="barChart" style="width:100%;height:100%;min-width:0;"></div>
              </v-responsive>
            </div>
          </div>
          <div>
            <div class="mb-2 report-chart-title">长拳项目历史得分趋势</div>
            <div class="report-chart-full" style="height:220px;width:100%;min-width:0;">
              <v-responsive :aspect-ratio="2.1">
                <div ref="lineChart" style="width:100%;height:100%;min-width:0;"></div>
              </v-responsive>
            </div>
          </div>
        </v-card>
        <!-- 报告生成功能已集成到成绩表中 -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';

// 无需全局submitting状态变量，使用每个报告项的独立loading状态

const reportList = ref([
  { name: '长拳', score: '8.95分', rank: '第1名', isGenerated: false, loading: false, pdfUrl: null },
  { name: '南拳', score: '8.76分', rank: '第2名', isGenerated: false, loading: false, pdfUrl: null },
  { name: '太极拳', score: '9.12分', rank: '第1名', isGenerated: true, loading: false, pdfUrl: null },
  { name: '刀术', score: '8.84分', rank: '第3名', isGenerated: false, loading: false, pdfUrl: null },
]);

const downloadReport = (item) => {
  // 为未来接入PDF生成工具准备的函数
  // 当接入PDF工具后，可以使用item的具体信息（如名称、成绩、排名等）来生成对应的PDF
  
  // 模拟下载
  alert(`下载${item.name}报告\n成绩：${item.score}\n排名：${item.rank}`);
  
  // 未来实现时可以调用PDF生成工具的API
  // 例如：generatePDF(item.name, item.score, item.rank, item.pdfUrl)
  
  // 如果pdfUrl已存在，可以直接触发下载
  // if (item.pdfUrl) {
  //   window.open(item.pdfUrl, '_blank');
  // }
};

// 生成报告
const generateReport = async (item) => {
  // 设置当前项的加载状态
  item.loading = true;
  
  try {
    // 模拟生成报告（实际使用时需要连接后端API）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新报告状态
    item.isGenerated = true;
    
    // 为未来PDF生成准备的报告数据存储
    // 这里可以存储更多用于PDF生成的详细信息
    item.reportData = {
      name: item.name,
      score: item.score,
      rank: item.rank,
      generateTime: new Date().toLocaleString(),
      // 其他可能需要的报告数据
      category: '武术比赛',
      eventType: item.name.includes('拳') ? '拳术' : '器械'
    };
    
    alert('生成报告成功');
    
  } catch (error) {
    alert('生成失败，请稍后重试');
    console.error('报告生成失败', error);
  } finally {
    // 清除加载状态
    item.loading = false;
  }
};

const barChart = ref(null);
const lineChart = ref(null);

onMounted(async () => {
  await nextTick();
  // 柱状图
  const bar = echarts.init(barChart.value);
  bar.setOption({
    tooltip: {},
    legend: { data: ['得分'], top: 0 },
    grid: { left: 30, right: 20, bottom: 30, top: 40 },
    xAxis: {
      data: ['长拳', '南拳', '太极拳', '刀术'],
      axisLabel: { fontSize: 13 },
    },
    yAxis: {
      max: 10,
      min: 8
    },
    series: [
      {
        name: '得分',
        type: 'bar',
        data: [8.95, 8.76, 9.12, 8.84],
        itemStyle: {
          color: function(params) {
            const colors = ['#3b82f6', '#22c55e', '#fb923c', '#ef4444'];
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
    legend: { data: ['长拳得分'], top: 0 },
    grid: { left: 30, right: 20, bottom: 30, top: 40 },
    xAxis: {
      type: 'category',
      data: ['2021', '2022', '2023', '2024'],
      axisLabel: { fontSize: 13 },
    },
    yAxis: {
      max: 10,
      min: 8
    },
    series: [
      {
        name: '长拳得分',
        type: 'line',
        data: [8.2, 8.5, 8.7, 8.95],
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
.report-padding {
  padding: 16px !important;
}
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
.report-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}
.card-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
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
  width: 100% !important;
  min-width: 0 !important;
  overflow-x: visible !important;
}
.report-chart-scroll {
  /* 彻底移除横向滚动条样式 */
  overflow-x: visible !important;
  margin-bottom: 0 !important;
}
@media (max-width: 900px) {
  .report-header-navbar {
    padding: 0 8px;
    height: 52px;
  }
  .report-header-title {
    font-size: 1.08rem;
  }
  .report-card {
    padding: 14px !important;
    border-radius: 12px;
  }
  .report-card-title {
    font-size: 1.01rem;
  }
  .report-table-title {
    font-size: 0.97rem;
  }
  .report-table {
    font-size: 0.91rem;
    border-radius: 8px;
  }
  .report-table th, .report-table td {
    padding: 8px 4px;
  }
  .report-chart-title {
    font-size: 0.97rem;
  }
}
@media (max-width: 600px) {
  .report-header-navbar {
    padding: 0 6px;
    height: 44px;
  }
  .report-header-title {
    font-size: 0.98rem;
  }
  .report-card {
    padding: 20px !important;
    border-radius: 8px;
  }
  .report-card-title {
    font-size: 0.89rem;
  }
  .report-table-title {
    font-size: 0.89rem;
  }
  .report-table {
    font-size: 0.85rem;
    border-radius: 6px;
  }
  .report-table th, .report-table td {
    padding: 6px 2px;
  }
  .report-chart-title {
    font-size: 0.89rem;
  }
}
</style>