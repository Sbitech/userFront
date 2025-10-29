<template>
  <v-container class="profile-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="profile-header-navbar profile-header-shadow">
          <v-btn icon variant="text" class="profile-header-back" @click="goBack">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="profile-header-title">个人信息</span>
        </div>

        <!-- 个人信息卡片 -->
        <v-card class="pa-3 pa-sm-6 mb-6 profile-card card-shadow" elevation="1">
          <!-- 头像区域 -->
          <div class="text-center mb-3">
            <v-avatar size="64" color="#3b82f6" class="mb-2">
              <v-icon size="32" color="white">mdi-account</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-medium">{{ realName }}</div>
            <div class="text-caption text-grey-darken-1">{{ team }}</div>
          </div>

          <!-- 基本信息 -->
          <div class="text-subtitle-2 font-weight-medium mb-2 pl-2">基本信息</div>

          <v-row dense class="px-2">
            <v-col cols="12" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">用户名</div>
              <div class="text-body-2">{{ username }}</div>
            </v-col>
            <v-col cols="12" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">性别</div>
              <div class="text-body-2">{{ gender === 'male' ? '男' : gender === 'female' ? '女' : '未知' }}</div>
            </v-col>
            <v-col cols="12" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">出生日期</div>
              <div class="text-body-2">{{ dateOfBirth ? formatDate(dateOfBirth) : '未填写' }}</div>
            </v-col>
            <v-col cols="12" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">国籍</div>
              <div class="text-body-2">{{ nationality }}</div>
            </v-col>
            <v-col cols="12" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">身份证号</div>
              <div class="text-body-2">{{ numberID || '未填写' }}</div>
            </v-col>
            <v-col cols="12" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">联系电话</div>
              <div class="text-body-2">{{ phone || '未填写' }}</div>
            </v-col>
          </v-row>

          <!-- 身体信息 -->
          <v-divider class="my-2"></v-divider>
          <div class="text-subtitle-2 font-weight-medium mb-1 pl-2">身体信息</div>

          <v-row dense class="px-2">
            <v-col cols="6" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">身高</div>
              <div class="text-body-2">{{ height ? height + ' cm' : '未填写' }}</div>
            </v-col>
            <v-col cols="6" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">体重</div>
              <div class="text-body-2">{{ weight ? weight + ' kg' : '未填写' }}</div>
            </v-col>
          </v-row>

          <!-- 参赛信息 -->
          <v-divider class="my-2"></v-divider>
          <div class="text-subtitle-2 font-weight-medium mb-1 pl-2">参赛信息</div>

          <v-row dense class="px-2">
            <v-col cols="6" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">所属队伍</div>
              <div class="text-body-2 text-truncate">{{ team || '未填写' }}</div>
            </v-col>
            <v-col cols="6" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">擅长类型</div>
              <div class="text-body-2 text-truncate">{{ discipline ? discipline.replace(/[{}]/g, '') : '未填写' }}</div>
            </v-col>
            <v-col cols="6" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">注册状态</div>
              <v-chip :color="getRegistrationStatusColor(registrationStatus)" size="x-small">
                {{ 
                  registrationStatus === 'active' ? '现役' : 
                  registrationStatus === 'inactive' ? '已注销' : 
                  registrationStatus === 'suspended' ? '禁赛' : 
                  '未知' 
                }}
              </v-chip>
            </v-col>
            <v-col cols="6" sm="6" class="mb-1">
              <div class="text-caption text-grey-darken-1">创建日期</div>
              <div class="text-body-2">{{ formatDateTime(created_at) }}</div>
            </v-col>
          </v-row>

          <!-- 操作按钮 -->
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-end px-2">
            <v-btn color="grey-darken-1" variant="outlined" @click="changePassword" prepend-icon="mdi-lock">
              修改密码
            </v-btn>
          </div>
        </v-card>

        <!-- 修改密码对话框 -->
        <v-dialog v-model="passwordDialog" max-width="420px">
          <v-card class="password-dialog">
            <v-card-title class="dialog-header pa-3">
              <div class="d-flex align-center ml-1">
                <span class="text-h7 font-weight-medium">修改密码</span>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-4">
              <v-form @submit.prevent="savePassword">
                <v-row dense>
                  <v-col cols="12" class="mb-2">
                    <v-text-field v-model="passwordForm.currentPassword" label="原密码" type="password" variant="outlined"
                      density="compact" required prepend-inner-icon="mdi-lock-outline"
                      hide-details="auto"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mb-2">
                    <v-text-field v-model="passwordForm.newPassword" label="新密码" type="password" variant="outlined"
                      density="compact" required prepend-inner-icon="mdi-lock-plus-outline" hide-details="auto"
                      hint="密码长度至少6位" persistent-hint></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="passwordForm.confirmPassword" label="确认新密码" type="password"
                      variant="outlined" density="compact" required prepend-inner-icon="mdi-lock-check-outline"
                      hide-details="auto"></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="cancelPasswordChange" class="px-4">
                取消
              </v-btn>
              <v-btn color="primary" variant="elevated" @click="savePassword" class="px-6"
                :disabled="!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword">
                确认修改
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 个人信息数据
const realName = ref('');
const gender = ref('');
const username = ref('');
const dateOfBirth = ref('');
const nationality = ref('');
const numberID = ref('');
const phone = ref('');
const height = ref('');
const weight = ref('');
const team = ref('');
const discipline = ref('');
const registrationStatus = ref('');
const updated_at = ref('');


onMounted(() => { //获取个人信息
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    realName.value = user.realName;
    gender.value = user.gender;
    username.value = user.username;
    dateOfBirth.value = user.dateOfBirth;
    nationality.value = user.nationality;
    numberID.value = user.numberID;
    phone.value = user.phone;
    height.value = user.height;
    weight.value = user.weight;
    team.value = user.team;
    discipline.value = user.discipline;
    registrationStatus.value = user.registrationStatus;
    updated_at.value = user.updated_at;
  } else {
    router.push('/login');
  }
});



// 密码修改表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordDialog = ref(false);



// 格式化函数
const formatGender = (gender) => {
  const map = { '0': '女', '1': '男', '2': '其他' };
  return map[gender] || '未知';
};

const formatDate = (dateString) => {
  if (!dateString) return '未填写';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '未知';
  return new Date(dateTimeString).toLocaleString('zh-CN');
};

const formatIDCard = (idCard) => {
  if (!idCard) return '未填写';
  if (idCard.length === 18) {
    return idCard.substring(0, 6) + '********' + idCard.substring(14);
  }
  return idCard;
};

const getRegistrationStatusColor = (status) => {
  const map = {
    'active': 'success',
    'inactive': 'default',
    'suspended': 'error'
  };
  return map[status] || 'default';
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 修改密码
const changePassword = () => {
  passwordDialog.value = true;
};

// 保存密码修改
const savePassword = async () => {
  // 验证密码
  if (!passwordForm.value.currentPassword) {
    alert('请输入原密码');
    return;
  }
  if (!passwordForm.value.newPassword) {
    alert('请输入新密码');
    return;
  }
  if (passwordForm.value.newPassword.length < 3) {
    alert('新密码长度不能少于3位');
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的新密码不一致');
    return;
  }
  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    alert('新密码不能与原密码相同');
    return;
  }

  try {
    // 获取当前用户信息
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('用户未登录');
      router.push('/login');
      return;
    }

    // 调用修改密码API
    const response = await axios.post('http://localhost:9090/playerInfo/alertPW', {
      username: user.username,
      oldPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });

    if (response.data) {
      alert('密码修改成功');
      passwordDialog.value = false;
      
      // 清空表单
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } else {
      alert('密码修改失败，请检查原密码是否正确');
    }
  } catch (error) {
    console.error('修改密码失败:', error);
    if (error.response && error.response.status === 400) {
      alert('原密码错误，请重新输入');
    } else {
      alert('密码修改失败，请稍后重试');
    }
  }
};

// 取消密码修改
const cancelPasswordChange = () => {
  passwordDialog.value = false;
  // 清空表单
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

</script>

<style scoped>
.profile-bg {
  background: #f5f7ff;
  min-height: 100vh;
}

.profile-header-navbar {
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

.profile-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}

.profile-header-back {
  margin-left: -8px;
}

.profile-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}

.profile-card {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.04);
}

.card-shadow {
  box-shadow: 0 4px 20px 0 rgba(80, 120, 200, 0.08) !important;
}

.gap-2 {
  gap: 8px;
}

/* 密码修改对话框样式 */
.password-dialog {
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.dialog-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

/* 输入框焦点样式 */
:deep(.v-field--focused) {
  .v-field__outline {
    --v-field-border-width: 2px !important;
  }
}

:deep(.v-text-field--focused) {
  .v-field__outline {
    --v-field-border-color: #3b82f6 !important;
  }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .profile-header-navbar {
    padding: 0 8px;
    height: 52px;
  }

  .profile-header-title {
    font-size: 1.08rem;
  }

  .profile-card {
    padding: 14px !important;
    border-radius: 12px;
  }

  .gap-2 {
    gap: 6px;
  }

  /* 手机端信息区域左侧间距调整 */
  .px-2 {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

@media (max-width: 600px) {
  .profile-header-navbar {
    padding: 0 6px;
    height: 44px;
  }

  .profile-header-title {
    font-size: 0.98rem;
  }

  .profile-card {
    padding: 8px !important;
    border-radius: 8px;
  }

  .gap-2 {
    gap: 4px;
  }

  /* 手机端信息区域左侧间距调整 */
  .px-2 {
    padding-left: 16px !important;
    padding-right: 8px !important;
  }
}
</style>