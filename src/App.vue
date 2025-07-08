<template>
  <v-app>
    <v-main>
      <ReportView />
    </v-main>
  </v-app>
</template>

<script setup>
import LoginView from './views/LoginView.vue'
import ReportView from './views/ReportView.vue';
</script>

<style>
.v-application {
  background-color: #f5f5f5 !important;
}
</style>