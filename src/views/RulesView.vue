<template>
  <v-container class="rules-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="rules-header-navbar rules-header-shadow">
          <v-btn icon variant="text" class="rules-header-back" @click="goBack">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="rules-header-title">参赛规章制度</span>
        </div>

        <!-- 规章制度卡片 -->
        <v-card class="pa-7 mb-8 rules-card card-shadow">
          <!-- PDF选择下拉菜单 -->
          <v-select v-model="selectedRuleId" :items="ruleDocuments" item-title="name" item-value="id"
            label="请选择要查看的规章制度" variant="outlined" density="comfortable" class="mb-4"
            @update:model-value="onRuleSelected">
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props"></v-list-item>
            </template>
          </v-select>

          <!-- PDF显示区域 -->
          <div v-if="selectedRuleId" class="pdf-viewer-container">
            <div class="pdf-viewer"
              style="height: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <iframe :src="currentPdfUrl" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
            </div>

            <!-- PDF操作按钮 -->
            <div class="pdf-actions mt-4 d-flex justify-center gap-2">
              <v-btn color="primary" variant="outlined" @click="downloadPdf" prepend-icon="mdi-download">
                下载PDF
              </v-btn>
            </div>
          </div>

          <!-- 未选择规章制度状态 -->
          <div v-if="!selectedRuleId" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
            <div class="text-h6 text-grey-darken-1 mb-2">请选择要查看的规章制度</div>
            <div class="text-body-2 text-grey-darken-1">选择上方的规章制度文档来查看详细内容</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 当前选中的规章制度ID
const selectedRuleId = ref(null);

// 规章制度文档列表（模拟数据）
const ruleDocuments = ref([
  {
    id: 1,
    name: '武术比赛参赛规则',
    pdfUrl: '/public/pdf/武术比赛参赛规则.pdf'
  },
  {
    id: 2,
    name: '评分标准细则',

    pdfUrl: '/public/pdf/评分标准细则.pdf'
  },
  {
    id: 3,
    name: '安全守则',
    pdfUrl: '/public/pdf/安全守则.pdf'
  },
  {
    id: 4,
    name: '申诉流程',
    pdfUrl: '/public/pdf/申诉流程.pdf'
  }
]);

// 当前PDF的URL
const currentPdfUrl = computed(() => {
  const selectedRule = ruleDocuments.value.find(rule => rule.id === selectedRuleId.value);
  return selectedRule ? selectedRule.pdfUrl : '';
});



// 下载PDF
const downloadPdf = () => {
  if (currentPdfUrl.value) {
    const link = document.createElement('a');
    link.href = currentPdfUrl.value;
    link.download = currentPdfUrl.value.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// 返回首页
const goBack = () => {
  router.push('/home');
};

// 页面加载时默认选中第一个规章制度
onMounted(() => {
  if (ruleDocuments.value.length > 0) {
    selectedRuleId.value = ruleDocuments.value[0].id;
  }
});
</script>

<style scoped>
.rules-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 40px;
}

.rules-header-navbar {
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

.rules-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}

.rules-header-back {
  margin-left: -8px;
}

.rules-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}

.rules-card {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.04);
}

.card-shadow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.pdf-viewer-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.pdf-viewer iframe {
  background: white;
}

.pdf-actions {
  gap: 12px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 900px) {
  .rules-header-navbar {
    padding: 0 8px;
    height: 52px;
  }

  .rules-header-title {
    font-size: 1.08rem;
  }

  .rules-card {
    padding: 14px !important;
    border-radius: 12px;
  }

  .pdf-viewer {
    height: 500px !important;
  }
}

@media (max-width: 600px) {
  .rules-header-navbar {
    padding: 0 6px;
    height: 44px;
  }

  .rules-header-title {
    font-size: 0.98rem;
  }

  .rules-card {
    padding: 8px !important;
    border-radius: 8px;
  }

  .pdf-viewer {
    height: 500px !important;
  }
}
</style>