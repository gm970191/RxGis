# WEB服务后台设计文档

## 1. 系统概述

WEB服务后台是基于FastAPI开发的RESTful API服务，为前端提供数据接口和业务逻辑处理。主要功能包括用户认证、车辆管理、终端管理、报表统计、系统配置等。采用异步架构，支持高并发访问。

## 2. 技术架构

### 2.1 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| FastAPI | 0.104+ | Web框架 |
| SQLAlchemy | 2.0+ | ORM |
| Alembic | 1.12+ | 数据库迁移 |
| Redis | 6.0+ | 缓存/消息队列 |
| JWT | - | 认证授权 |
| Pydantic | 2.0+ | 数据验证 |
| uvicorn | 0.24+ | ASGI服务器 |

### 2.2 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # 应用入口
│   ├── config.py               # 配置管理
│   ├── database.py             # 数据库连接
│   ├── dependencies.py         # 依赖注入
│   ├── models/                 # 数据模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vehicle.py
│   │   ├── terminal.py
│   │   └── report.py
│   ├── schemas/                # 数据验证
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vehicle.py
│   │   └── common.py
│   ├── api/                    # API路由
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── vehicles.py
│   │   │   ├── terminals.py
│   │   │   ├── reports.py
│   │   │   └── system.py
│   │   └── deps.py
│   ├── core/                   # 核心功能
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── config.py
│   │   └── exceptions.py
│   ├── services/               # 业务逻辑
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── vehicle_service.py
│   │   ├── report_service.py
│   │   └── jt808_service.py
│   └── utils/                  # 工具函数
│       ├── __init__.py
│       ├── database.py
│       └── redis.py
├── alembic/                    # 数据库迁移
├── tests/                      # 测试代码
├── requirements.txt
└── Dockerfile
```

## 3. 核心模块设计

### 3.1 认证授权模块

#### 3.1.1 JWT认证实现

```python
# core/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status

class SecurityManager:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.secret_key = "your-secret-key"
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)
```

#### 3.1.2 权限控制

```python
# api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import SecurityManager

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.secret_key, algorithms=[security.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def require_permission(permission: str):
    def permission_checker(current_user: User = Depends(get_current_user)):
        if permission not in current_user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return permission_checker
```

### 3.2 车辆管理模块

#### 3.2.1 数据模型

```python
# models/vehicle.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_no = Column(String(20), unique=True, index=True, nullable=False)
    terminal_id = Column(String(20), unique=True, index=True, nullable=False)
    vehicle_type = Column(String(50))
    owner_name = Column(String(100))
    contact_phone = Column(String(20))
    status = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VehicleLocation(Base):
    __tablename__ = "vehicle_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    terminal_id = Column(String(20), index=True, nullable=False)
    latitude = Column(Integer, nullable=False)
    longitude = Column(Integer, nullable=False)
    altitude = Column(Integer)
    speed = Column(Integer)
    direction = Column(Integer)
    location_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### 3.2.2 API接口

```python
# api/v1/vehicles.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.vehicle import Vehicle, VehicleLocation
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.services.vehicle_service import VehicleService
from app.api.deps import get_current_user, get_db

router = APIRouter()

@router.get("/vehicles", response_model=List[VehicleResponse])
async def get_vehicles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """获取车辆列表"""
    vehicles = VehicleService.get_vehicles(db, skip=skip, limit=limit, status=status)
    return vehicles

@router.get("/vehicles/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """获取车辆详情"""
    vehicle = VehicleService.get_vehicle(db, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/vehicles", response_model=VehicleResponse)
async def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("vehicle:create"))
):
    """创建车辆"""
    return VehicleService.create_vehicle(db, vehicle)

@router.get("/vehicles/{vehicle_id}/location")
async def get_vehicle_location(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """获取车辆实时位置"""
    location = VehicleService.get_vehicle_location(db, vehicle_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.get("/vehicles/{vehicle_id}/track")
async def get_vehicle_track(
    vehicle_id: int,
    start_time: datetime = Query(...),
    end_time: datetime = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """获取车辆历史轨迹"""
    track = VehicleService.get_vehicle_track(db, vehicle_id, start_time, end_time)
    return track
```

### 3.3 与JT808Server交互模块

#### 3.3.1 消息队列接口

```python
# services/jt808_service.py
import redis
import json
from typing import Dict, Any
from app.core.config import settings

class JT808Service:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=True
        )
    
    async def send_command(self, terminal_id: str, command: Dict[str, Any]) -> bool:
        """发送控制命令到JT808Server"""
        try:
            message = {
                "type": "command",
                "terminal_id": terminal_id,
                "command": command,
                "timestamp": datetime.utcnow().isoformat()
            }
            self.redis_client.lpush("jt808_commands", json.dumps(message))
            return True
        except Exception as e:
            logger.error(f"Failed to send command: {e}")
            return False
    
    async def get_vehicle_status(self, terminal_id: str) -> Dict[str, Any]:
        """获取车辆状态"""
        try:
            status_key = f"vehicle_status:{terminal_id}"
            status_data = self.redis_client.get(status_key)
            return json.loads(status_data) if status_data else None
        except Exception as e:
            logger.error(f"Failed to get vehicle status: {e}")
            return None
    
    async def subscribe_vehicle_updates(self, callback):
        """订阅车辆位置更新"""
        pubsub = self.redis_client.pubsub()
        pubsub.subscribe("vehicle_updates")
        
        for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                await callback(data)
```

#### 3.3.2 WebSocket实时推送

```python
# api/v1/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # 移除断开的连接
                self.active_connections.remove(connection)

manager = ConnectionManager()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # 处理客户端消息
            await manager.send_personal_message(f"You wrote: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

### 3.4 报表统计模块

#### 3.4.1 统计服务

```python
# services/report_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Dict, List, Any

class ReportService:
    @staticmethod
    def get_vehicle_statistics(db: Session, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """获取车辆统计信息"""
        # 总车辆数
        total_vehicles = db.query(func.count(Vehicle.id)).scalar()
        
        # 在线车辆数
        online_vehicles = db.query(func.count(VehicleLocation.terminal_id.distinct())).scalar()
        
        # 今日行驶里程
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_distance = db.query(
            func.sum(VehicleLocation.speed * 30 / 3600)  # 假设30秒上报一次
        ).filter(
            VehicleLocation.location_time >= today_start
        ).scalar() or 0
        
        # 今日告警数
        today_alarms = db.query(func.count(AlarmLog.id)).filter(
            AlarmLog.created_at >= today_start
        ).scalar()
        
        return {
            "total_vehicles": total_vehicles,
            "online_vehicles": online_vehicles,
            "today_distance": round(today_distance, 2),
            "today_alarms": today_alarms
        }
    
    @staticmethod
    def get_vehicle_track_report(db: Session, vehicle_id: int, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        """获取车辆轨迹报表"""
        vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
        if not vehicle:
            return []
        
        locations = db.query(VehicleLocation).filter(
            and_(
                VehicleLocation.terminal_id == vehicle.terminal_id,
                VehicleLocation.location_time >= start_date,
                VehicleLocation.location_time <= end_date
            )
        ).order_by(VehicleLocation.location_time).all()
        
        return [
            {
                "latitude": loc.latitude / 1000000,  # 转换为度
                "longitude": loc.longitude / 1000000,
                "speed": loc.speed,
                "direction": loc.direction,
                "location_time": loc.location_time.isoformat()
            }
            for loc in locations
        ]
    
    @staticmethod
    def get_alarm_report(db: Session, start_date: datetime, end_date: datetime, vehicle_id: int = None) -> List[Dict[str, Any]]:
        """获取告警报表"""
        query = db.query(AlarmLog).filter(
            and_(
                AlarmLog.created_at >= start_date,
                AlarmLog.created_at <= end_date
            )
        )
        
        if vehicle_id:
            vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
            if vehicle:
                query = query.filter(AlarmLog.terminal_id == vehicle.terminal_id)
        
        alarms = query.order_by(AlarmLog.created_at.desc()).all()
        
        return [
            {
                "id": alarm.id,
                "terminal_id": alarm.terminal_id,
                "alarm_type": alarm.alarm_type,
                "alarm_content": alarm.alarm_content,
                "created_at": alarm.created_at.isoformat()
            }
            for alarm in alarms
        ]
```

### 3.5 数据库访问层

#### 3.5.1 数据库连接管理

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=20,
    max_overflow=30
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### 3.5.2 多数据库支持

```python
# utils/database.py
from sqlalchemy import create_engine
from app.core.config import settings

class DatabaseManager:
    def __init__(self):
        self.core_engine = create_engine(settings.CORE_DATABASE_URL)
        self.fast_engine = create_engine(settings.FAST_DATABASE_URL)
        self.data_engine = create_engine(settings.DATA_DATABASE_URL)
    
    def get_core_session(self):
        return sessionmaker(bind=self.core_engine)()
    
    def get_fast_session(self):
        return sessionmaker(bind=self.fast_engine)()
    
    def get_data_session(self):
        return sessionmaker(bind=self.data_engine)()
```

## 4. API设计规范

### 4.1 统一响应格式

```python
# schemas/common.py
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar('T')

class ResponseModel(BaseModel, Generic[T]):
    code: int = 200
    message: str = "success"
    data: Optional[T] = None

class PaginationModel(BaseModel):
    page: int
    size: int
    total: int
    pages: int

class PageResponseModel(BaseModel, Generic[T]):
    code: int = 200
    message: str = "success"
    data: list[T]
    pagination: PaginationModel
```

### 4.2 错误处理

```python
# core/exceptions.py
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str, error_code: str = None):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code

async def http_exception_handler(request: Request, exc: CustomHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.error_code or exc.status_code,
            "message": exc.detail,
            "data": None
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "message": "Validation error",
            "data": exc.errors()
        }
    )
```

## 5. 缓存策略

### 5.1 Redis缓存实现

```python
# utils/redis.py
import redis
import json
from typing import Any, Optional
from app.core.config import settings

class RedisManager:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=True
        )
    
    def set(self, key: str, value: Any, expire: int = 3600):
        """设置缓存"""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        self.redis_client.setex(key, expire, value)
    
    def get(self, key: str) -> Optional[Any]:
        """获取缓存"""
        value = self.redis_client.get(key)
        if value:
            try:
                return json.loads(value)
            except:
                return value
        return None
    
    def delete(self, key: str):
        """删除缓存"""
        self.redis_client.delete(key)
    
    def clear_pattern(self, pattern: str):
        """清除匹配模式的缓存"""
        keys = self.redis_client.keys(pattern)
        if keys:
            self.redis_client.delete(*keys)
```

## 6. 测试设计

### 6.1 测试结构

```
tests/
├── __init__.py
├── conftest.py              # 测试配置
├── test_api/                # API测试
│   ├── test_auth.py
│   ├── test_vehicles.py
│   └── test_reports.py
├── test_services/           # 服务层测试
│   ├── test_vehicle_service.py
│   └── test_report_service.py
└── test_models/             # 模型测试
    ├── test_user.py
    └── test_vehicle.py
```

### 6.2 测试示例

```python
# tests/test_api/test_vehicles.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base

# 使用测试数据库
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_get_vehicles(test_db):
    response = client.get("/api/v1/vehicles")
    assert response.status_code == 200
    assert "data" in response.json()

def test_create_vehicle(test_db):
    vehicle_data = {
        "vehicle_no": "京A12345",
        "terminal_id": "TEST001",
        "vehicle_type": "货车",
        "owner_name": "张三"
    }
    response = client.post("/api/v1/vehicles", json=vehicle_data)
    assert response.status_code == 200
    assert response.json()["data"]["vehicle_no"] == "京A12345"
```

## 7. 部署配置

### 7.1 Docker配置

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 7.2 环境配置

```python
# core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 数据库配置
    CORE_DATABASE_URL: str = "mysql+pymysql://user:pass@localhost/jt808core"
    FAST_DATABASE_URL: str = "mysql+pymysql://user:pass@localhost/jt808fast"
    DATA_DATABASE_URL: str = "mysql+pymysql://user:pass@localhost/jt808data"
    
    # Redis配置
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 应用配置
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "RxGis Backend"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## 8. 监控与日志

### 8.1 日志配置

```python
# core/logging.py
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    # 创建日志目录
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # 配置日志格式
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # 文件处理器
    file_handler = RotatingFileHandler(
        f"{log_dir}/app.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    
    # 控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    # 根日志器配置
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
```

### 8.2 性能监控

```python
# middleware/monitoring.py
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

class MonitoringMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(
            f"{request.method} {request.url.path} "
            f"took {process_time:.4f}s "
            f"status={response.status_code}"
        )
        
        return response
```

## 9. 安全设计

### 9.1 认证授权
- JWT Token认证
- 基于角色的权限控制(RBAC)
- API访问频率限制

### 9.2 数据安全
- 敏感数据加密存储
- HTTPS传输加密
- 数据库连接加密

## 10. 性能优化

### 10.1 数据库优化
- 连接池管理
- 读写分离
- 索引优化

### 10.2 缓存优化
- Redis缓存热点数据
- 查询结果缓存
- 缓存更新策略

### 10.3 异步处理
- 非关键操作异步处理
- 消息队列缓冲
- 批量操作优化 