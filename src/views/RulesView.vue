<template>
  <v-container class="home-bg" style="width: 100%; margin: 0 auto; min-height: 100vh;">
    <v-container class="py-6" style="width: 92%; max-width: 800px; margin: 0 auto;">
      <!-- 页面标题 -->
      <v-card class="mb-4 px-4 py-4 card-shadow" elevation="2" style="background: #ffffff; border-radius: 15px;">
        <v-row align="center" justify="space-between">
          <div class="text-h6 font-weight-bold">参赛规章制度</div>
          <v-btn icon variant="text" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
      </v-card>

      <!-- PDF文件列表 -->
      <v-card class="mb-4 card-shadow" elevation="2" style="background: #ffffff; border-radius: 15px;">
        <v-card-text>
          <div class="text-subtitle-1 font-weight-medium mb-3">可查看的规章制度</div>
          <v-list>
            <v-list-item 
              v-for="rule in rules" 
              :key="rule.id"
              @click="selectRule(rule)"
              :active="selectedRule?.id === rule.id"
              class="mb-2"
              style="border-radius: 8px;"
            >
              <template v-slot:prepend>
                <v-icon color="#ff6b6b" class="mr-3">mdi-file-pdf-box</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">{{ rule.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ rule.description }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-icon color="grey">mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- PDF查看器 -->
      <v-card v-if="selectedRule" class="card-shadow" elevation="2" style="background: #ffffff; border-radius: 15px;">
        <v-card-text>
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 font-weight-medium">{{ selectedRule.title }}</div>
            <v-btn color="primary" variant="outlined" size="small" @click="downloadPdf">
              <v-icon left>mdi-download</v-icon>
              下载PDF
            </v-btn>
          </div>
          
          <!-- PDF显示区域 -->
          <div class="pdf-viewer-container">
            <object 
              :data="selectedRule.pdfUrl" 
              type="application/pdf" 
              width="100%" 
              height="600px"
              style="border: 1px solid #e0e0e0; border-radius: 8px;"
            >
              <div class="text-center py-8">
                <v-icon size="48" color="grey" class="mb-3">mdi-file-alert-outline</v-icon>
                <div class="text-body-1 mb-2">您的浏览器不支持PDF预览</div>
                <div class="text-body-2 text-grey mb-4">请点击下方下载按钮查看文件</div>
              </div>
            </object>
          </div>

          <!-- 下载提示 -->
          <div class="mt-4 text-center text-caption text-grey">
            如果PDF无法显示，请尝试下载后查看
          </div>
        </v-card-text>
      </v-card>

      <!-- 空状态 -->
      <v-card v-if="!selectedRule && rules.length > 0" class="card-shadow" elevation="2" style="background: #ffffff; border-radius: 15px;">
        <v-card-text class="text-center py-8">
          <v-icon size="64" color="grey lighten-1">mdi-file-document-outline</v-icon>
          <div class="text-h6 mt-4 mb-2">选择规章制度</div>
          <div class="text-body-2 text-grey">请从上方列表选择一个规章制度文件进行查看</div>
        </v-card-text>
      </v-card>

      <!-- 无数据状态 -->
      <v-card v-if="rules.length === 0" class="card-shadow" elevation="2" style="background: #ffffff; border-radius: 15px;">
        <v-card-text class="text-center py-8">
          <v-icon size="64" color="grey lighten-1">mdi-file-alert-outline</v-icon>
          <div class="text-h6 mt-4 mb-2">暂无规章制度</div>
          <div class="text-body-2 text-grey">请联系赛事方上传相关规章制度文件</div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedRule = ref(null);

// 模拟规章制度数据
const rules = ref([
  {
    id: 1,
    title: '2024年全国武术锦标赛参赛规则',
    description: '包含比赛流程、评分标准、注意事项等详细规定',
    pdfUrl: '/sample-rules.pdf',
    uploadDate: '2024-01-15'
  },
  {
    id: 2,
    title: '武术比赛安全规范',
    description: '参赛人员安全要求、场地安全标准等安全规定',
    pdfUrl: '/sample-rules.pdf',
    uploadDate: '2024-01-10'
  },
  {
    id: 3,
    title: '评分标准与仲裁规则',
    description: '详细的评分细则和仲裁申诉流程',
    pdfUrl: '/sample-rules.pdf',
    uploadDate: '2024-01-05'
  }
]);

const selectRule = (rule) => {
  selectedRule.value = rule;
};

const downloadPdf = () => {
  if (selectedRule.value) {
    const link = document.createElement('a');
    link.href = selectedRule.value.pdfUrl;
    link.download = `${selectedRule.value.title}.pdf`;
    link.target = '_blank';
    link.click();
  }
};

const goBack = () => {
  router.push('/home');
};

onMounted(() => {
  // 页面加载时可以选择默认显示第一个规则
  if (rules.value.length > 0) {
    selectedRule.value = rules.value[0];
  }
});
</script>

<style scoped>
.home-bg {
  background: #f5f7ff;
  min-height: 100vh;
}

.card-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
}

.pdf-viewer-container {
  position: relative;
  width: 100%;
}

.v-list-item--active {
  background-color: #f5f7ff !important;
  border-left: 3px solid #3b82f6;
}

.v-list-item:hover {
  background-color: #fafbfc;
}
</style>