<template>
  <v-container class="schedule-bg px-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="5" class="mx-auto">
        <!-- 顶部返回和标题 -->
        <div class="schedule-header-navbar schedule-header-shadow" elevation="6">
          <v-btn icon variant="text" class="schedule-header-back" @click="goBack">
            <v-icon color="#3b82f6">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="schedule-header-title">赛事安排</span>
        </div>

        <!-- 赛事安排卡片 -->
        <v-card class="pa-7 mb-8 schedule-card card-shadow" elevation="1" style="border-radius: 14px;">
          <v-row align="center" class="mb-4 px-4 pt-4">
          </v-row>
          
          <!-- 赛事选择下拉菜单 -->
          <v-select
            v-model="selectedCompetitionId"
            :items="myCompetitions"
            item-title="name"
            item-value="id"
            label="请选择要查看的比赛"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            @update:model-value="onCompetitionSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="'比赛编号: ' + item.raw.id"></v-list-item>
            </template>
          </v-select>
          
          <!-- 赛事安排列表 -->
          <div v-if="selectedCompetitionId" class="schedule-timeline-container">
            <div v-for="(match, index) in filteredMatches" :key="index" class="mb-8">
              <!-- 第一行：日期时间 -->
              <v-row justify="center" class="mb-1">
                <div class="text-subtitle-2 font-weight-bold">{{ match.date }}{{ match.time }}</div>
              </v-row>
              
              <!-- 第二行：场次信息 -->
              <v-row justify="center" class="mb-1">
                <div class="text-body-2 font-weight-bold">{{ match.category }}—{{ match.participants }}人</div>
              </v-row>
              
              <!-- 选手信息三列展示 -->
              <v-row dense>
                <v-col v-for="(player, playerIndex) in match.players" :key="playerIndex" cols="4" class="pa-1">
                  <v-card outlined class="text-center pa-2 player-card" style="min-height: 52px; box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;">
                    <div class="text-body-2 font-weight-medium">{{ player.name }}</div>
                    <div class="text-caption text-grey-darken-1">{{ player.school }}</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredMatches.length === 0 && selectedCompetitionId" class="text-center pa-8">
            <div class="text-h6 text-grey-darken-1 mb-2">该比赛暂无具体安排</div>
            <div class="text-body-2 text-grey-darken-1">请稍后再查看</div>
          </div>

          <!-- 未选择比赛状态 -->
          <div v-if="!selectedCompetitionId" class="text-center pa-8">
            <div class="text-h6 text-grey-darken-1 mb-2">请选择要查看的比赛</div>
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

// 当前选中的比赛
const selectedCompetition = ref(null);

// 当前选中的比赛ID
const selectedCompetitionId = ref(null);

// 用户报名的比赛列表（模拟数据）
const myCompetitions = ref([
  { id: 1, name: '2024年全国武术锦标赛' },
  { id: 2, name: '省级武术表演赛' },
  { id: 3, name: '青少年武术比赛' }
]);

// 所有比赛的安排数据
const allMatches = ref({
  1: [ // 2024年全国武术锦标赛
    {
      date: '2024年3月15日',
      time: '09:00-10:30',
      category: '男子甲组长拳',
      participants: 27,
      players: [
        { name: '陈浩然', school: '北京体育大学' },
        { name: '王志强', school: '上海体育学院' },
        { name: '李建华', school: '武汉体育学院' },
        { name: '张明宇', school: '广州体育学院' },
        { name: '刘子轩', school: '成都体育学院' },
        { name: '赵文博', school: '沈阳体育学院' },
        { name: '孙佳豪', school: '西安体育学院' },
        { name: '周天宇', school: '南京体育学院' },
        { name: '吴俊杰', school: '天津体育学院' }
      ]
    },
    {
      date: '2024年3月15日',
      time: '14:00-15:30',
      category: '女子甲组太极拳',
      participants: 23,
      players: [
        { name: '林雅婷', school: '北京体育大学' },
        { name: '陈雨薇', school: '上海体育学院' },
        { name: '王梦琪', school: '武汉体育学院' },
        { name: '张雪怡', school: '广州体育学院' },
        { name: '李思琪', school: '成都体育学院' },
        { name: '刘婷婷', school: '沈阳体育学院' },
        { name: '赵晓萱', school: '西安体育学院' },
        { name: '孙美琳', school: '南京体育学院' },
        { name: '周心怡', school: '天津体育学院' }
      ]
    },
    {
      date: '2024年3月16日',
      time: '10:00-11:30',
      category: '男子乙组南拳',
      participants: 31,
      players: [
        { name: '黄志华', school: '广东武术队' },
        { name: '林建国', school: '福建武术队' },
        { name: '郑小龙', school: '湖南武术队' },
        { name: '何志勇', school: '广西武术队' },
        { name: '谢天宇', school: '江西武术队' },
        { name: '邓家豪', school: '海南武术队' },
        { name: '罗文斌', school: '云南武术队' },
        { name: '钟志强', school: '贵州武术队' },
        { name: '冯伟杰', school: '四川武术队' }
      ]
    }
  ],
  2: [ // 省级武术表演赛
    {
      date: '2024年3月20日',
      time: '09:30-11:00',
      category: '器械表演',
      participants: 18,
      players: [
        { name: '马文博', school: '江苏省武术队' },
        { name: '朱志强', school: '浙江省武术队' },
        { name: '胡佳豪', school: '安徽省武术队' },
        { name: '郭天宇', school: '福建省武术队' },
        { name: '梁志华', school: '江西省武术队' },
        { name: '魏子轩', school: '山东省武术队' }
      ]
    },
    {
      date: '2024年3月20日',
      time: '14:30-16:00',
      category: '对练表演',
      participants: 15,
      players: [
        { name: '沈志华', school: '河南省武术队' },
        { name: '韩佳豪', school: '湖北省武术队' },
        { name: '杨文博', school: '湖南省武术队' },
        { name: '秦志强', school: '广东省武术队' },
        { name: '尤子轩', school: '广西武术队' },
        { name: '许志杰', school: '重庆市武术队' }
      ]
    }
  ],
  3: [ // 青少年武术比赛
    {
      date: '2024年3月25日',
      time: '08:30-10:00',
      category: '少年组长拳',
      participants: 35,
      players: [
        { name: '何家豪', school: '北京青少年武术培训中心' },
        { name: '吕志华', school: '上海武术学校' },
        { name: '施佳豪', school: '广州武术学院' },
        { name: '张志强', school: '深圳武术训练基地' },
        { name: '孔文博', school: '杭州武术学院' },
        { name: '曹子轩', school: '南京武术学校' },
        { name: '严志华', school: '武汉武术培训中心' },
        { name: '华家豪', school: '成都武术学院' },
        { name: '金志强', school: '西安武术学校' }
      ]
    }
  ]
});

// 计算属性：过滤当前选中比赛的数据
const filteredMatches = computed(() => {
  if (!selectedCompetitionId.value) return [];
  return allMatches.value[selectedCompetitionId.value] || [];
});

function goBack() {
  router.push('/home');
}

function onCompetitionChange(competition) {
  console.log('选中比赛:', competition);
  // 这里可以添加获取特定比赛详细数据的逻辑
}

// 更新函数名以匹配新的v-model事件
function onCompetitionSelected(competitionId) {
  console.log('选中比赛ID:', competitionId);
  // 这里可以添加获取特定比赛详细数据的逻辑
}

onMounted(() => {
  // 默认选中第一个比赛，这样页面加载时就能显示数据
  if (myCompetitions.value.length > 0) {
    selectedCompetitionId.value = myCompetitions.value[0].id;
  }
  console.log('赛事安排页面加载完成');
});
</script>

<style scoped>
.schedule-bg {
  background: #f5f7ff;
  min-height: 100vh;
}

.schedule-header-navbar {
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

.schedule-header-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
  border-radius: 14px !important;
  border-bottom: none !important;
}

.schedule-header-back {
  margin-left: -8px;
}

.schedule-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-left: 12px;
  letter-spacing: 0.5px;
}

.schedule-card {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.04);
}

.schedule-card-title {
  font-size: 1.18rem;
  font-weight: bold;
  color: #222;
}

.card-shadow {
  box-shadow: 0 2px 8px #e3e8f7 !important;
}

.white {
  background-color: white !important;
}

.schedule-timeline-container {
  padding: 0 8px;
}

.schedule-time {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.schedule-match-card {
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.schedule-match-title {
  font-size: 1rem;
  font-weight: bold;
}

.schedule-match-info {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #333;
}

.schedule-match-info strong {
    color: #555;
    font-weight: 600;
  }

@media (max-width: 900px) {
  .schedule-header-navbar {
    padding: 0 8px;
    height: 52px;
  }
  
  .schedule-header-title {
    font-size: 1.08rem;
  }
  
  .schedule-card {
    padding: 14px !important;
    border-radius: 12px;
  }
  
  .schedule-card-title {
    font-size: 1.01rem;
  }
  
  .schedule-timeline-container {
    padding: 0 4px;
  }
  
  .schedule-time {
    font-size: 0.8rem;
  }
  
  .schedule-match-title {
    font-size: 0.9rem;
  }
  
  .schedule-match-info {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .schedule-header-navbar {
    padding: 0 6px;
    height: 44px;
  }
  
  .schedule-header-title {
    font-size: 0.98rem;
  }
  
  .schedule-card {
    padding: 8px !important;
    border-radius: 8px;
  }
  
  .schedule-card-title {
    font-size: 0.89rem;
  }
  
  .schedule-timeline-container {
    padding: 0 2px;
  }
  
  .schedule-time {
    font-size: 0.75rem;
  }
  
  .schedule-match-title {
    font-size: 0.85rem;
  }
  
  .schedule-match-info {
    font-size: 0.75rem;
  }
}</style>