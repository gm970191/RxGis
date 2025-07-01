# RxGis 测试目录

本目录包含所有子系统和模块的测试代码，与业务代码完全分离。

## 系统架构

RxGis 系统包含以下子系统：
- **WEB前台**：Vue 3 前端界面
- **WEB后台**：FastAPI 后端服务
- **JT808Server**：JT808协议TCP服务器
- **车载终端模拟器**：单台/多台车辆模拟软件

## 目录结构

```
tests/
├── README.md                    # 测试说明文档
├── TEST_SUMMARY.md              # 测试总结文档
├── test.html                    # 测试页面
├── run-tests.bat                # 测试运行脚本
├── run-all-tests.bat            # 运行所有子系统测试
├── config/                      # 测试配置
│   ├── test-config.json         # 测试配置文件
│   ├── database-config.json     # 数据库测试配置
│   └── network-config.json      # 网络测试配置
├── frontend/                    # WEB前台测试
│   ├── vitest.config.js         # Vitest配置
│   ├── unit/                    # 单元测试
│   │   ├── components/          # 组件测试
│   │   ├── stores/              # 状态管理测试
│   │   ├── utils/               # 工具函数测试
│   │   └── views/               # 页面测试
│   ├── integration/             # 集成测试
│   │   ├── api/                 # API集成测试
│   │   ├── components/          # 组件集成测试
│   │   └── stores/              # 状态集成测试
│   ├── e2e/                     # 端到端测试
│   │   ├── scenarios/           # 测试场景
│   │   ├── pages/               # 页面测试
│   │   └── workflows/           # 工作流测试
│   └── utils/                   # 测试工具
│       ├── setup.js             # 测试环境设置
│       ├── mockData.js          # 模拟数据
│       └── testHelpers.js       # 测试辅助函数
├── backend/                     # WEB后台测试
│   ├── pytest.ini              # Pytest配置
│   ├── unit/                    # 单元测试
│   │   ├── api/                 # API接口测试
│   │   ├── models/              # 数据模型测试
│   │   ├── services/            # 业务服务测试
│   │   └── utils/               # 工具函数测试
│   ├── integration/             # 集成测试
│   │   ├── database/            # 数据库集成测试
│   │   ├── redis/               # Redis集成测试
│   │   └── external/            # 外部服务集成测试
│   ├── performance/             # 性能测试
│   │   ├── load/                # 负载测试
│   │   ├── stress/              # 压力测试
│   │   └── benchmark/           # 基准测试
│   └── utils/                   # 测试工具
│       ├── conftest.py          # Pytest配置
│       ├── fixtures.py          # 测试夹具
│       └── mockData.py          # 模拟数据
├── jt808server/                 # JT808服务器测试
│   ├── pytest.ini              # Pytest配置
│   ├── unit/                    # 单元测试
│   │   ├── protocol/            # 协议解析测试
│   │   ├── handlers/            # 消息处理器测试
│   │   ├── connection/          # 连接管理测试
│   │   └── utils/               # 工具函数测试
│   ├── integration/             # 集成测试
│   │   ├── terminal/            # 终端通信测试
│   │   ├── database/            # 数据库集成测试
│   │   └── backend/             # 后台服务集成测试
│   ├── performance/             # 性能测试
│   │   ├── concurrent/          # 并发测试
│   │   ├── throughput/          # 吞吐量测试
│   │   └── memory/              # 内存使用测试
│   ├── protocol/                # 协议测试
│   │   ├── messages/            # 消息格式测试
│   │   ├── parsing/             # 解析测试
│   │   └── validation/          # 验证测试
│   └── utils/                   # 测试工具
│       ├── conftest.py          # Pytest配置
│       ├── fixtures.py          # 测试夹具
│       ├── mockTerminal.py      # 模拟终端
│       └── protocolHelper.py    # 协议辅助工具
├── terminal-simulator/          # 车载终端模拟器测试
│   ├── pytest.ini              # Pytest配置
│   ├── unit/                    # 单元测试
│   │   ├── simulator/           # 模拟器核心测试
│   │   ├── protocol/            # 协议实现测试
│   │   ├── vehicle/             # 车辆模型测试
│   │   └── utils/               # 工具函数测试
│   ├── integration/             # 集成测试
│   │   ├── server/              # 服务器通信测试
│   │   ├── multi-vehicle/       # 多车辆测试
│   │   └── scenarios/           # 场景测试
│   ├── performance/             # 性能测试
│   │   ├── single/              # 单车辆性能测试
│   │   ├── multi/               # 多车辆性能测试
│   │   └── stress/              # 压力测试
│   ├── scenarios/               # 场景测试
│   │   ├── normal/              # 正常场景
│   │   ├── abnormal/            # 异常场景
│   │   ├── emergency/           # 紧急场景
│   │   └── complex/             # 复杂场景
│   └── utils/                   # 测试工具
│       ├── conftest.py          # Pytest配置
│       ├── fixtures.py          # 测试夹具
│       ├── mockServer.py        # 模拟服务器
│       └── scenarioBuilder.py   # 场景构建器
├── system/                      # 系统级测试
│   ├── integration/             # 系统集成测试
│   │   ├── end-to-end/          # 端到端测试
│   │   ├── workflow/            # 工作流测试
│   │   └── data-flow/           # 数据流测试
│   ├── performance/             # 系统性能测试
│   │   ├── load/                # 系统负载测试
│   │   ├── stress/              # 系统压力测试
│   │   └── scalability/         # 可扩展性测试
│   ├── security/                # 安全测试
│   │   ├── authentication/      # 认证测试
│   │   ├── authorization/       # 授权测试
│   │   ├── encryption/          # 加密测试
│   │   └── vulnerability/       # 漏洞测试
│   └── utils/                   # 测试工具
│       ├── conftest.py          # Pytest配置
│       ├── fixtures.py          # 测试夹具
│       └── testHelpers.py       # 测试辅助函数
├── scripts/                     # 测试脚本
│   ├── test-project.js          # 项目完整性测试
│   ├── test-homepage.js         # 首页访问测试
│   ├── test-homepage.bat        # 批处理测试脚本
│   ├── test-simple.ps1          # PowerShell测试脚本
│   ├── test-server.js           # 测试服务器
│   ├── setup-test-env.py        # 测试环境设置
│   ├── cleanup-test-env.py      # 测试环境清理
│   └── generate-test-report.py  # 测试报告生成
├── reports/                     # 测试报告
│   ├── coverage/                # 覆盖率报告
│   ├── performance/             # 性能测试报告
│   ├── security/                # 安全测试报告
│   └── html/                    # HTML格式报告
├── data/                        # 测试数据
│   ├── mock/                    # 模拟数据
│   ├── fixtures/                # 测试夹具数据
│   ├── scenarios/               # 场景数据
│   └── expected/                # 期望结果数据
└── tools/                       # 测试工具
    ├── test-runner.py           # 测试运行器
    ├── coverage-analyzer.py     # 覆盖率分析器
    ├── performance-monitor.py   # 性能监控器
    └── report-generator.py      # 报告生成器
```

## 测试类型

### 1. 单元测试 (Unit Tests)
- **目的**: 测试单个函数、方法或类的功能
- **工具**: 
  - 前端: Vitest + @vue/test-utils
  - 后端: Pytest
- **位置**: 各子系统的 `unit/` 目录

### 2. 集成测试 (Integration Tests)
- **目的**: 测试模块间、子系统间的交互
- **工具**: 
  - 前端: Vitest
  - 后端: Pytest + TestClient
- **位置**: 各子系统的 `integration/` 目录

### 3. 端到端测试 (E2E Tests)
- **目的**: 测试完整的用户流程
- **工具**: Playwright
- **位置**: `frontend/e2e/` 目录

### 4. 性能测试 (Performance Tests)
- **目的**: 测试系统性能和负载能力
- **工具**: 
  - 负载测试: Locust
  - 基准测试: Pytest-benchmark
- **位置**: 各子系统的 `performance/` 目录

### 5. 协议测试 (Protocol Tests)
- **目的**: 测试JT808协议实现
- **工具**: Pytest + 自定义协议工具
- **位置**: `jt808server/protocol/` 目录

### 6. 场景测试 (Scenario Tests)
- **目的**: 测试特定业务场景
- **工具**: Pytest + 场景构建器
- **位置**: `terminal-simulator/scenarios/` 目录

### 7. 安全测试 (Security Tests)
- **目的**: 测试系统安全性
- **工具**: Bandit, Safety
- **位置**: `system/security/` 目录

## 运行测试

### 运行所有测试
```bash
cd tests
run-all-tests.bat
```

### 运行特定子系统测试
```bash
# 前端测试
cd tests/frontend
npm run test

# 后端测试
cd tests/backend
pytest

# JT808服务器测试
cd tests/jt808server
pytest

# 终端模拟器测试
cd tests/terminal-simulator
pytest

# 系统测试
cd tests/system
pytest
```

### 运行特定类型测试
```bash
# 单元测试
npm run test:unit          # 前端
pytest tests/unit/         # 后端

# 集成测试
npm run test:integration   # 前端
pytest tests/integration/  # 后端

# 性能测试
pytest tests/performance/  # 后端

# 端到端测试
npm run test:e2e          # 前端
```

## 测试配置

### 环境变量
```bash
# 测试环境
TEST_ENV=test
TEST_DATABASE_URL=sqlite:///test.db
TEST_REDIS_URL=redis://localhost:6379/1

# 性能测试
PERFORMANCE_TEST_DURATION=300
PERFORMANCE_TEST_USERS=100

# 协议测试
JT808_SERVER_HOST=localhost
JT808_SERVER_PORT=7611
```

### 测试数据
- **模拟数据**: `data/mock/`
- **测试夹具**: `data/fixtures/`
- **场景数据**: `data/scenarios/`

## 持续集成

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run all tests
        run: |
          cd tests
          python -m pytest
          npm run test
```

### 测试报告
- **覆盖率报告**: `reports/coverage/`
- **性能报告**: `reports/performance/`
- **安全报告**: `reports/security/`

## 最佳实践

### 测试编写
1. **命名规范**: 测试文件名以 `test_` 开头
2. **独立性**: 每个测试应该独立运行
3. **可重复性**: 测试结果应该一致
4. **快速性**: 单元测试应该快速执行

### 测试数据管理
1. **模拟数据**: 使用专门的模拟数据文件
2. **测试环境**: 与开发环境分离
3. **数据清理**: 测试后清理测试数据

### 性能测试
1. **基准测试**: 建立性能基准
2. **监控指标**: CPU、内存、网络、响应时间
3. **阈值设置**: 设置性能阈值

### 安全测试
1. **漏洞扫描**: 定期扫描安全漏洞
2. **认证测试**: 测试用户认证机制
3. **授权测试**: 测试权限控制
4. **加密测试**: 测试数据加密

## 注意事项

1. **测试环境隔离**: 确保测试环境与开发环境分离
2. **数据备份**: 重要测试数据需要备份
3. **资源清理**: 测试后及时清理资源
4. **错误处理**: 测试中需要处理各种异常情况
5. **日志记录**: 测试过程需要详细日志记录 