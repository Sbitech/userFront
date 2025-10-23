<template>
  <v-container class="appeal-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="appeal-header-navbar appeal-header-shadow" elevation="6" style="margin-bottom:32px;">
          <v-btn icon variant="text" class="appeal-header-back" @click="$router.back()">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="appeal-header-title">申诉详情</span>
        </div>

        <!-- 申诉基本信息卡片 -->
        <v-card class="pa-7 mb-6 appeal-card card-shadow" elevation="6">
          <v-row align="center" class="mb-5">
            <v-avatar size="44" class="mr-3" style="background:#fff7e6;">
              <v-icon size="30" color="#ff9800">mdi-gavel</v-icon>
            </v-avatar>
            <span class="appeal-card-title" style="font-size:1.25rem;font-weight:900;">申诉信息</span>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="py-1">
              <div class="detail-label">申诉场次</div>
            </v-col>
            <v-col cols="8" class="py-1">
              <div class="detail-value">{{ appealDetail.eventName }}</div>
            </v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="py-1">
              <div class="detail-label">申诉类型</div>
            </v-col>
            <v-col cols="8" class="py-1">
              <div class="detail-value">
                <v-chip :color="getAppealTypeColor(appealDetail.appealType)" size="small">
                  {{ appealDetail.appealType }}
                </v-chip>
              </div>
            </v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="py-1">
              <div class="detail-label">提交时间</div>
            </v-col>
            <v-col cols="8" class="py-1">
              <div class="detail-value">{{ appealDetail.submitTime }}</div>
            </v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="py-1">
              <div class="detail-label">处理状态</div>
            </v-col>
            <v-col cols="8" class="py-1">
              <div class="detail-value">
                <v-chip :color="getStatusColor(appealDetail.status)" size="small">
                  {{ appealDetail.status }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- 申诉内容卡片 -->
        <v-card class="pa-7 mb-6 appeal-card card-shadow" elevation="6">
          <v-row align="center" class="mb-5">
            <v-avatar size="44" class="mr-3" style="background:#f5f7ff;">
              <v-icon size="30" color="#8a8fa3">mdi-text-box-outline</v-icon>
            </v-avatar>
            <span class="appeal-card-title" style="font-size:1.25rem;font-weight:900;">申诉内容</span>
          </v-row>

          <div class="content-box">
            {{ appealDetail.content }}
          </div>
        </v-card>

        <!-- 证据材料卡片 -->
        <v-card class="pa-7 mb-6 appeal-card card-shadow" elevation="6" v-if="appealDetail.evidenceFiles && appealDetail.evidenceFiles.length > 0">
          <v-row align="center" class="mb-5">
            <v-avatar size="44" class="mr-3" style="background:#fff7e6;">
              <v-icon size="30" color="#ff9800">mdi-paperclip</v-icon>
            </v-avatar>
            <span class="appeal-card-title" style="font-size:1.25rem;font-weight:900;">证据材料</span>
          </v-row>

          <v-row>
            <v-col cols="12" v-for="(file, index) in appealDetail.evidenceFiles" :key="index" class="py-2">
              <v-card variant="outlined" class="pa-3 evidence-item">
                <v-row align="center" no-gutters>
                  <v-icon color="#3b82f6" class="mr-3">mdi-file-document-outline</v-icon>
                  <div class="file-name">{{ file.name }}</div>
                  <v-spacer></v-spacer>
                  <v-btn variant="text" color="#3b82f6" size="small" @click="viewEvidence(file)">
                    查看
                  </v-btn>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- 处理结果卡片 -->
        <v-card class="pa-7 mb-6 appeal-card card-shadow" elevation="6" v-if="appealDetail.status === '已处理' && appealDetail.result">
          <v-row align="center" class="mb-5">
            <v-avatar size="44" class="mr-3" style="background:#e8f5e8;">
              <v-icon size="30" color="#22b04c">mdi-check-circle-outline</v-icon>
            </v-avatar>
            <span class="appeal-card-title" style="font-size:1.25rem;font-weight:900;">处理结果</span>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="py-1">
              <div class="detail-label">处理时间</div>
            </v-col>
            <v-col cols="8" class="py-1">
              <div class="detail-value">{{ appealDetail.result.handleTime }}</div>
            </v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="py-1">
              <div class="detail-label">处理人</div>
            </v-col>
            <v-col cols="8" class="py-1">
              <div class="detail-value">{{ appealDetail.result.handler }}</div>
            </v-col>
          </v-row>

          <div class="content-box">
            {{ appealDetail.result.content }}
          </div>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const appealDetail = ref({});

// 模拟申诉详情数据
const mockAppealDetail = {
  id: '1',
  eventName: '2025-07-07 09:00 长拳初赛 - 武术馆A馆',
  appealType: '成绩异议',
  submitTime: '2025-07-07 10:30:00',
  status: '已处理',
  content: '尊敬的裁判组：\n\n我对2025年7月7日上午9点在武术馆A馆举行的长拳初赛成绩存在异议。\n\n具体争议内容如下：\n1. 我的动作难度系数为3.2，但评分表中仅记录为2.8\n2. 套路编排扣分不合理，我的套路完全符合规则要求\n3. 完成时间扣分有误，我的套路用时在允许范围内\n\n请重新核查我的比赛成绩，感谢！',
  evidenceFiles: [
    { name: '比赛视频.mp4', url: '#' },
    { name: '成绩单截图.jpg', url: '#' }
  ],
  result: {
    handleTime: '2025-07-07 14:20:00',
    handler: '裁判长 张师傅',
    content: '经裁判组重新核查，您的申诉理由成立。\n\n1. 动作难度系数确实存在记录错误，已从2.8修正为3.2\n2. 套路编排扣分已撤销，您的套路编排符合规则要求\n3. 完成时间扣分已撤销，您的套路用时在规定范围内\n\n最终成绩已从8.5分调整为9.1分。感谢您的监督和反馈！'
  }
};

onMounted(() => {
  // 从路由参数获取申诉ID，这里使用模拟数据
  const appealId = route.params.id;
  appealDetail.value = mockAppealDetail;
});

const getAppealTypeColor = (type) => {
  const colors = {
    '成绩异议': 'error',
    '规则争议': 'warning',
    '其他问题': 'info'
  };
  return colors[type] || 'grey';
};

const getStatusColor = (status) => {
  const colors = {
    '已处理': 'success',
    '处理中': 'warning',
    '待处理': 'info'
  };
  return colors[status] || 'grey';
};

const viewEvidence = (file) => {
  console.log('查看证据文件:', file);
  // 这里可以实现文件预览功能
};
</script>

<style scoped>
.appeal-bg {
  background: #f5f7ff;
  min-height: 100vh;
}

.appeal-header-navbar {
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

.appeal-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}

.card-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
}

.appeal-header-back {
  margin-left: -8px;
}

.appeal-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}

.appeal-card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(80,120,200,0.04);
  margin-top: 0;
}

.appeal-card-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: #222;
}

.detail-label {
  font-size: 1rem;
  color: #8a8fa3;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #222;
  font-weight: 500;
}

.content-box {
  background: #fafbfc;
  border: 1px solid #e3e6f0;
  border-radius: 8px;
  padding: 16px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #222;
  white-space: pre-line;
}

.evidence-item {
  border-radius: 8px;
  background: #fafbfc;
}

.file-name {
  font-size: 0.9rem;
  color: #222;
  font-weight: 500;
}

@media (max-width: 900px) {
  .appeal-header-navbar {
    padding: 0 8px;
    height: 52px;
  }
  
  .appeal-header-title {
    font-size: 1.25rem;
  }
  
  .appeal-card {
    padding: 14px !important;
    border-radius: 12px;
  }
  
  .appeal-card-title {
    font-size: 1.05rem;
  }
}

@media (max-width: 600px) {
  .appeal-header-navbar {
    padding: 0 6px;
    height: 44px;
  }
  
  .appeal-header-title {
    font-size: 0.98rem;
  }
  
  .appeal-card {
    padding: 20px !important;
    border-radius: 8px;
  }
  
  .appeal-card-title {
    font-size: 0.93rem;
  }
  
  .detail-label,
  .detail-value {
    font-size: 0.9rem;
  }
}
</style>