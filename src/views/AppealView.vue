<template>
  <v-container class="appeal-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="appeal-header-navbar appeal-header-shadow" elevation="6" style="margin-bottom:32px;">
          <v-btn icon variant="text" class="appeal-header-back" @click="$router.back && $router.back()">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="appeal-header-title">争议申诉</span>
        </div>
        <!-- 申诉表单卡片 -->
        <v-card class="pa-7 mb-8 appeal-card card-shadow" elevation="6">
          <v-row align="center" class="mb-5 px-4 pt-4">
            <v-avatar size="44" class="mr-3" style="background:#fff7e6;">
              <v-icon size="30" color="#ff9800">mdi-gavel</v-icon>
            </v-avatar>
            <span class="appeal-card-title">提交申诉</span>
          </v-row>
          <v-form>
            <div class="appeal-label">申诉项目</div>
            <v-select class="mb-4 appeal-input" label="" :items="['男子长拳-2025年11月12日']" variant="outlined" density="comfortable" placeholder="请选择申诉项目" hide-details />
            <div class="appeal-label">申诉类型</div>
            <v-select class="mb-4 appeal-input" label="" :items="['成绩异议', '规则争议', '其他问题']" variant="outlined" density="comfortable" placeholder="请选择申诉类型" hide-details />
            <div class="appeal-label">申诉内容</div>
            <v-textarea class="mb-4 appeal-input" label="" variant="outlined" rows="3" placeholder="请详细描述申诉原因..." hide-details />
            <div class="appeal-label">证据上传</div>
            <v-sheet class="appeal-upload-box mb-5" rounded outlined @click="triggerFileUpload">
              <v-row align="center" justify="center" style="height: 80px;">
                <v-icon color="#bdbdbd" size="28">{{ uploadedFiles.length > 0 ? 'mdi-check-circle' : 'mdi-paperclip' }}</v-icon>
              </v-row>
              <div class="appeal-upload-text-center">
                <span class="appeal-upload-text-main" style="font-size: 14px;">
                  {{ uploadedFiles.length > 0 ? `已选择 ${uploadedFiles.length} 个文件` : '点击上传证据文件（可多选）' }}
                </span>
              </div>
            </v-sheet>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              accept=".jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.wmv,.mkv,.flv,.webm"
              multiple
              @change="handleFileUpload"
            />
            <v-btn color="#2563EB" class="appeal-btn mb-2" block rounded size="x-large">
              <v-icon left>mdi-send</v-icon>提交申诉
            </v-btn>
            <!-- 申诉次数展示区（严格还原图片） -->
            <div class="appeal-count-box-img mb-2">
              <div class="appeal-count-main-img">
                当前申诉次数：<span class="appeal-count-num-img">0次</span>
              </div>
              <div class="appeal-count-desc-img">
                申诉权利：整场比赛中，每个队伍拥有两次申诉的权利<br />
                申诉范围：申诉内容仅限于对难度（C组）评判、套路编排扣分和套路完成时间扣分的异议
              </div>
            </div>
          </v-form>
        </v-card>
        <!-- 申诉记录卡片 -->
        <v-card class="pa-5 mb-8 appeal-record-card card-shadow" elevation="6">
          <v-row align="center" class="mb-4">
            <v-avatar size="44" class="mr-3" style="background:#f5f7ff;">
              <v-icon size="30" color="#8a8fa3">mdi-undo-variant</v-icon>
            </v-avatar>
            <span class="appeal-record-title">申诉记录</span>
          </v-row>
          <v-sheet class="pa-4 appeal-record-item" rounded outlined style="position:relative;">
            <span class="appeal-record-date-strong">2025-07-07</span>
            <div style="flex:1;min-width:0;">
              <div class="appeal-record-type-row">
                <span class="appeal-record-type">成绩异议</span>
              </div>
              <div class="appeal-record-main-title">申诉标题</div>
              <div class="appeal-record-main-desc">申诉标题内容</div>
              <div class="appeal-record-status-row">
                状态：<span class="appeal-record-status appeal-record-status-done">已处理</span>
              </div>
            </div>
            <div class="appeal-record-detail-link-strong" @click="goToAppealDetail('1')">
              <v-icon size="18" class="mr-1">mdi-eye-outline</v-icon>
              <span>查看详情</span>
            </div>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInput = ref(null);
const uploadedFiles = ref([]);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    name.value = user.name;
    username.value = user.username;
  } else {
    router.push('/login');
  }
});

const goToAppealDetail = (id) => {
  router.push(`/appeal-detail/${id}`);
};

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    uploadedFiles.value = [];
    
    files.forEach(file => {
      // 文件类型验证 - 只允许常见图片和视频格式
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mov', '.wmv', '.mkv', '.flv', '.webm'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        alert(`文件 ${file.name} 格式不支持\n支持格式：JPG、PNG、GIF、MP4、AVI、MOV、WMV、MKV、FLV、WebM`);
        return;
      }
      
      // 文件大小限制（10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert(`文件 ${file.name} 大小超过10MB限制`);
        return;
      }
      
      uploadedFiles.value.push(file);
    });
    
    console.log(`已选择 ${uploadedFiles.value.length} 个文件:`, uploadedFiles.value.map(f => f.name));
    
    if (uploadedFiles.value.length === 0) {
      alert('没有有效的文件被选择');
    }
  }
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
  font-weight: bold;
  color: #222;
}
.appeal-label {
  font-size: 1.08rem;
  color: #222;
  font-weight: 500;
  margin-bottom: 8px;
  margin-top: 10px;
}
.appeal-input .v-input__control {
  background: #fff;
  border-radius: 8px;
}
.appeal-input .v-field {
  border-radius: 8px;
}
.appeal-upload-box {
  border: 1.5px dashed #bdbdbd;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: 80px;
  padding: 0;
  box-sizing: border-box;
  margin-bottom: 18px;
}
.appeal-upload-box:hover {
  border-color: #3b82f6;
}
.appeal-upload-text-center {
  text-align: center;
  margin-top: -10px;
  margin-bottom: 8px;
}
.appeal-upload-text-main {
  color: #B4B4B4;
  font-size: 1.18rem;
  font-weight: 500;
  letter-spacing: 1px;
  display: inline-block;
}
.appeal-btn {
  font-size: 1.14rem;
  font-weight: bold;
  height: 54px;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
}
.appeal-tip {
  font-size: 0.98rem;
  color: #3b82f6;
  margin-bottom: 2px;
}
.appeal-desc {
  font-size: 0.95rem;
  color: #8a8fa3;
}
.appeal-record-card {
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(80,120,200,0.04);
}
.appeal-record-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  letter-spacing: 0.5px;
}
.appeal-record-item {
  background: #fafbfc;
  border: 1.5px solid #e3e6f0;
  border-radius: 10px;
  box-shadow: none;
  margin-left: 2px;
  margin-right: 2px;
}
.appeal-record-type-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.appeal-record-type {
  background: #2563eb;
  color: #fff;
  font-size: 0.98rem;
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 12px;
  display: inline-block;
  margin-right: 8px;
}
.appeal-record-date {
  color: #8a8fa3;
  font-size: 0.98rem;
  font-weight: 400;
}
.appeal-record-date-strong {
  position: absolute;
  right: 18px;
  top: 16px;
  color: #222;
  font-size: 1.04rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.appeal-record-main-title {
  font-size: 1.08rem;
  font-weight: bold;
  color: #222;
  margin: 6px 0 2px 0;
}
.appeal-record-main-desc {
  font-size: 0.97rem;
  color: #8a8fa3;
  margin-bottom: 8px;
}
.appeal-record-status-row {
  font-size: 0.97rem;
  color: #222;
  margin-bottom: 0;
}
.appeal-record-status-done {
  color: #22b04c;
  font-weight: 600;
  margin-left: 2px;
}
.appeal-record-detail-link {
  display: flex;
  align-items: center;
  color: #2563eb;
  font-size: 0.98rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 18px;
  margin-top: 32px;
  user-select: none;
}
.appeal-record-detail-link:hover {
  text-decoration: underline;
}
.appeal-record-detail-link-strong {
  position: absolute;
  right: 16px;
  bottom: 14px;
  display: flex;
  align-items: center;
  font-size: 1.01rem;
  font-weight: 700;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  user-select: none;
  transition: filter 0.18s;
}
.appeal-record-detail-link-strong:hover {
  filter: brightness(1.15) drop-shadow(0 2px 6px #2563eb22);
}
.appeal-record-detail-link-strong .v-icon {
  margin-right: 2px;
}
.appeal-count-box-img {
  text-align: center;
  margin-top: 2px;
  margin-bottom: 0;
}
.appeal-count-main-img {
  font-size: 1.08rem;
  color: #222;
  font-weight: 500;
  margin-bottom: 2px;
  letter-spacing: 0.2px;
}
.appeal-count-num-img {
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  margin-left: 2px;
}
.appeal-count-desc-img {
  font-size: 0.85rem;
  color: #8a8fa3;
  margin-top: 2px;
  line-height: 1.6;
  font-weight: 400;
}
@media (max-width: 900px) {
  .appeal-header-navbar {
    padding: 0 8px;
    height: 52px;
  }
  .appeal-header-title {
    font-size: 1.08rem;
  }
  .appeal-card {
    padding: 14px !important;
    border-radius: 12px;
  }
  .appeal-card-title {
    font-size: 1.05rem;
  }
  .appeal-label {
    font-size: 0.98rem;
  }
  .appeal-btn {
    font-size: 1.01rem;
    height: 44px;
    border-radius: 8px;
  }
  .appeal-count-main-img {
    font-size: 0.97rem;
  }
  .appeal-count-desc-img {
    font-size: 0.85rem;
  }
  .appeal-record-title {
    font-size: 1.05rem;
  }
  .appeal-record-main-title {
    font-size: 0.97rem;
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
  .appeal-label {
    font-size: 0.91rem;
  }
  .appeal-btn {
    font-size: 0.95rem;
    height: 36px;
    border-radius: 4px;
  }
  .appeal-count-main-img {
    font-size: 0.89rem;
  }
  .appeal-count-desc-img {
    font-size: 0.78rem;
  }
  .appeal-record-title {
    font-size: 0.93rem;
  }
  .appeal-record-main-title {
    font-size: 0.89rem;
  }
}
</style>
