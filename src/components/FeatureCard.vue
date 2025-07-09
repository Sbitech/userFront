<template>
  <v-col cols="12">
    <v-card class="pa-4" :color="color" rounded="xl" elevation="2">
      <v-row align="center" no-gutters>
        <v-avatar size="48" class="mr-4" :color="color">
          <v-icon :color="iconColor">{{ icon }}</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-medium">{{ title }}</div>
          <div class="text-body-2 text-grey-darken-1">{{ desc }}</div>
        </div>
      </v-row>
    </v-card>
  </v-col>
</template>

<script setup>
defineProps(['icon', 'title', 'desc', 'color', 'iconColor'])
</script>
