import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 全局测试设置
global.console = {
  ...console,
  // 在测试中忽略某些console输出
  warn: vi.fn(),
  error: vi.fn(),
}

// 模拟高德地图API
global.AMap = {
  Map: vi.fn().mockReturnValue({
    addControl: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    setBounds: vi.fn(),
    setCenter: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(11)
  }),
  Scale: vi.fn(),
  ToolBar: vi.fn(),
  Marker: vi.fn().mockReturnValue({
    on: vi.fn(),
    setPosition: vi.fn(),
    getPosition: vi.fn(),
    getContent: vi.fn()
  }),
  Icon: vi.fn(),
  Size: vi.fn(),
  Pixel: vi.fn(),
  Bounds: vi.fn().mockReturnValue({
    extend: vi.fn()
  })
}

// 模拟Element Plus图标
global.ElementPlusIconsVue = {
  ArrowLeft: { name: 'ArrowLeft' },
  ArrowRight: { name: 'ArrowRight' },
  Plus: { name: 'Plus' },
  Minus: { name: 'Minus' },
  FullScreen: { name: 'FullScreen' },
  Delete: { name: 'Delete' },
  Close: { name: 'Close' },
  Setting: { name: 'Setting' },
  User: { name: 'User' },
}

// 设置测试超时时间
config.global.mocks = {
  $t: (key) => key,
}

// 模拟window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 模拟ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/frontend/utils/setup.js'],
    include: ['tests/frontend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      ...configDefaults.exclude,
      'tests/frontend/e2e/**/*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../frontend/src')
    }
  }
})

// Mock Element Plus 图标
vi.mock('@element-plus/icons-vue', () => ({
  Plus: 'Plus',
  Minus: 'Minus',
  FullScreen: 'FullScreen',
  Delete: 'Delete',
  Close: 'Close',
  Warning: 'Warning'
})) 