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
        <v-card class="pa-7 mb-8  report-card card-shadow report-padding" elevation="6">
          <v-row align="center" class="mb-5 px-4 pt-4">
            <v-avatar size="40" class="mr-3" style="background:#e8f7e0;">
              <v-icon size="28" color="#4caf50">mdi-file-document-outline</v-icon>
            </v-avatar>
            <span class="report-card-title">成绩报告</span>
          </v-row>
          <div class="mb-2 report-table-title">比赛项目成绩列表</div>
          <div class="report-table-scroll mb-2">
            <v-table class="report-table">
              <thead>
                <tr>
                  <th>赛事名称</th>
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
                    <v-btn variant="text" size="small" :color="item.isGenerated ? 'primary' : 'warning'"
                      @click="item.isGenerated ? downloadReport(item) : generateReport(item)" :loading="item.loading">
                      <v-icon size="18" class="mr-1">{{ item.isGenerated ? 'mdi-download' : 'mdi-file-clock-outline'
                        }}</v-icon>
                      {{ item.isGenerated ? '下载报告' : '生成报告' }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
        <!-- 成绩可视化 -->
        <v-card class="pa-7 mb-8 report-card card-shadow report-padding" elevation="6">
          <v-row align="center" class="mb-5 px-4 pt-4">
            <v-avatar size="40" class="mr-3" style="background:#e8f7ff;">
              <v-icon size="28" color="#3b82f6">mdi-chart-bar</v-icon>
            </v-avatar>
            <span class="report-card-title">成绩可视化</span>
          </v-row>
          <div>
            <div class="mb-2 report-chart-title">各比赛项目得分对比</div>
            <div class="report-chart-full" style="height:230px;width:100%;min-width:0;">
              <v-responsive :aspect-ratio="2.0">
                <div ref="barChart" style="width:100%;height:100%;min-width:0;"></div>
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
import axios from 'axios';

// 无需全局submitting状态变量，使用每个报告项的独立loading状态

const reportList = ref([
  { id: 1, name: '2024年全国男子长拳', score: '8.95分', rank: '第1名', isGenerated: false, loading: false, filePath: '' },
  { id: 2, name: '2024年省运会南拳项目', score: '8.76分', rank: '第2名', isGenerated: false, loading: false, filePath: '' },
  { id: 3, name: '2024年太极拳比赛', score: '9.12分', rank: '第1名', isGenerated: false, loading: false, filePath: '' },
  { id: 4, name: '2024年刀术项目', score: '8.84分', rank: '第3名', isGenerated: false, loading: false, filePath: '' },
]);

const downloadReport = (item) => {
  if (item.filePath) {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = item.filePath;
    link.download = `${item.name}报告.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`开始下载：${item.name}报告`, 'success');
  } else {
    showNotification('报告文件路径不存在', 'error');
  }
};

// 生成报告
const generateReport = async (item) => {
  // 设置当前项的加载状态
  item.loading = true;

  try {
    // 获取当前用户信息
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      showNotification('用户未登录', 'error');
      return;
    }

    const response = await axios.get('http://localhost:9090/playerMatches/createPDF', {
      params: {
        id: item.id
      }
    });

    if (response.data && response.data !== 'null') {
      // 更新报告状态和文件路径
      item.isGenerated = true;
      item.filePath = response.data; // 假设后端返回的是文件路径

      // 显示成功提示
      showNotification(`报告生成成功：${item.name}`, 'success');
    } else {
      showNotification('报告生成失败，请稍后重试', 'error');
    }

  } catch (error) {
    console.error('报告生成失败', error);
    showNotification('生成失败，请稍后重试', 'error');
  } finally {
    // 清除加载状态
    item.loading = false;
  }
};

// 显示通知提示
const showNotification = (message, type = 'info') => {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    z-index: 9999;
    transition: all 0.3s ease;
    ${type === 'success' ? 'background-color: #4caf50;' :
      type === 'error' ? 'background-color: #f44336;' :
        'background-color: #2196f3;'}
  `;
  notification.textContent = message;

  // 添加到页面
  document.body.appendChild(notification);

  // 3秒后自动移除
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

const barChart = ref(null);

onMounted(async () => {
  await nextTick();
  // 柱状图
  const bar = echarts.init(barChart.value);
  bar.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return `${params[0].value}分`;
      }
    },
    legend: { data: ['得分'], top: 0 },
    grid: { left: 30, right: 20, bottom: 40, top: 40 },
    xAxis: {
      data: ['2024年全国\n男子长拳', '2024年省运会\n南拳项目', '2024年\n太极拳比赛', '2024年\n刀术项目'],
      axisLabel: {
        fontSize: 9,
        interval: 0,
        lineHeight: 12,
        margin: 8
      },
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
          color: function (params) {
            const colors = ['#3b82f6', '#22c55e', '#fb923c', '#ef4444'];
            return colors[params.dataIndex];
          },
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: 36,
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
  font-size: 1.25rem;
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
  font-size: 1.25rem;
  font-weight: bold;
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

  .report-table th,
  .report-table td {
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

  .report-table th,
  .report-table td {
    padding: 6px 2px;
  }

  .report-chart-title {
    font-size: 0.89rem;
  }
}
</style>