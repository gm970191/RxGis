<template>
  <div class="map-controls">
    <el-button-group>
      <el-button 
        size="small" 
        @click="zoomIn"
        title="放大"
      >
        <el-icon><Plus /></el-icon>
      </el-button>
      <el-button 
        size="small" 
        @click="zoomOut"
        title="缩小"
      >
        <el-icon><Minus /></el-icon>
      </el-button>
    </el-button-group>
    
    <el-button 
      size="small" 
      @click="fitBounds"
      title="适应所有车辆"
    >
      <el-icon><FullScreen /></el-icon>
    </el-button>
    
    <el-button 
      size="small" 
      @click="clearMarkers"
      title="清除标记"
    >
      <el-icon><Delete /></el-icon>
    </el-button>
  </div>
</template>

<script>
import { Plus, Minus, FullScreen, Delete } from '@element-plus/icons-vue'

export default {
  name: 'MapControls',
  components: {
    Plus,
    Minus,
    FullScreen,
    Delete
  },
  emits: ['zoom-in', 'zoom-out', 'fit-bounds', 'clear-markers'],
  setup(props, { emit }) {
    const zoomIn = () => {
      emit('zoom-in')
    }

    const zoomOut = () => {
      emit('zoom-out')
    }

    const fitBounds = () => {
      emit('fit-bounds')
    }

    const clearMarkers = () => {
      emit('clear-markers')
    }

    return {
      zoomIn,
      zoomOut,
      fitBounds,
      clearMarkers
    }
  }
}
</script>

<style scoped>
.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-controls {
    top: 10px;
    right: 10px;
  }
}
</style> 