<template>
  <v-container class="login-bg px-4" fluid fill-height>
    <v-row align="center" justify="center" style="min-height: 100vh;">
      <v-col cols="12" sm="8" md="5" lg="4" class="login-col">
        <v-card class="pa-8" elevation="6" style="border-radius: 24px; background: #fff;">
          <v-row justify="center" class="mb-4">
            <v-avatar size="48" class="login-trophy">
              <v-icon size="36" color="#3b82f6">mdi-trophy</v-icon>
            </v-avatar>
          </v-row>
          <div class="text-center mb-2 login-title">体育赛事本地辅助系统</div>
          <div class="text-center mb-6 login-subtitle">请输入您的账号密码登录系统</div>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="username"
              label="用户名"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              hide-details
              rounded
              :disabled="loading"
            />
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="密码"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              hide-details
              rounded
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              :disabled="loading"
            />
            <v-btn
              block
              color="primary"
              class="login-btn mt-2"
              :loading="loading"
              size="large"
              type="submit"
              style="border-radius: 8px; font-weight: bold; letter-spacing: 1px;"
            >
              登录
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

const login = async () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码');
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post('http://localhost:9091/participant/login', {
      username: username.value,
      password: password.value
    });

    if (response.data) {
      alert('登录成功');
      router.push('/home');
    } else {
      alert('登录失败：用户名或密码错误');
    }
  } catch (error) {
    console.error('登录失败', error);
    alert('登录失败：' + (error.response?.data?.message || '服务器错误'));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-bg {
  background: #f5f7ff;
  min-height: 100vh;
  padding: 0;
}
.login-col {
  max-width: 380px;
  margin: 32px auto;
}
.login-trophy {
  background: #e8f1ff;
  box-shadow: 0 2px 8px #e3e8f7;
}
.login-title {
  font-size: 1.35rem;
  font-weight: bold;
  color: #222;
}
.login-subtitle {
  font-size: 0.98rem;
  color: #8a8fa3;
}
.login-btn {
  font-size: 1.08rem;
  height: 44px;
}
</style>