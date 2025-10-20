# Model Context Protocol (MCP)

> Kotlin/Spring/Gradle 헥사고날 아키텍처 멀티모듈 백엔드 개발자를 위한 MCP 실무 가이드

---

## 📖 개요

Model Context Protocol(MCP)은 Claude Code가 외부 도구, 데이터베이스, API 등과 안전하게 연결할 수 있게 해주는 오픈 표준 프로토콜입니다.

### 핵심 개념

- **표준화된 연결**: AI와 외부 시스템 간의 일관된 통신 방식
- **보안 우선**: 권한 관리가 내장된 구조
- **확장 가능**: 플러그인처럼 기능을 추가할 수 있는 아키텍처

### 헥사고날 아키텍처와 MCP

MCP는 헥사고날 아키텍처의 외부 어댑터(Outbound Adapter)와 유사한 개념입니다:
- **포트**: MCP 인터페이스 정의
- **어댑터**: 실제 MCP 서버 구현
- **도메인**: 비즈니스 로직은 MCP에 독립적

---

## 🎯 Kotlin/Spring 백엔드 개발자를 위한 필수 MCP

### 1. 데이터베이스 연동

#### 🗄️ PostgreSQL MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-postgres
```

**주요 기능:**
- JPA 엔티티와 DB 스키마 동기화 확인
- QueryDSL 쿼리 최적화 제안
- 인덱스 누락 검증
- N+1 쿼리 패턴 감지

**실무 활용:**
```
"PostgreSQL MCP로 Order 엔티티의 스키마를 확인하고,
fetch join이 필요한 연관 관계를 식별해줘"
```

#### 🔴 Redis MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-redis
```

**주요 기능:**
- Spring Cache 설정 검증
- 캐시 히트율 분석
- 만료 시간(TTL) 최적화 제안
- 메모리 사용량 모니터링

**실무 활용:**
```
"Redis MCP로 현재 캐시 키 패턴을 확인하고,
UserService의 @Cacheable 설정을 개선해줘"
```

---

### 2. 개발 도구 연동

#### 🔧 Git MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-git
```

**주요 기능:**
- 헥사고날 아키텍처 의존성 방향 검증
- 모듈 간 순환 참조 감지
- 코드 리뷰 자동화 (코딩 컨벤션 체크)
- 커밋 메시지 패턴 분석

**실무 활용:**
```
"Git MCP로 최근 10개 커밋을 분석하고,
Domain → Application → Adapter 의존성 방향이 올바른지 검증해줘"
```

#### 🐳 Docker MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-docker
```

**주요 기능:**
- Docker Compose 설정 검증
- 멀티 스테이지 빌드 최적화
- 컨테이너 로그 실시간 조회
- 리소스 사용량 모니터링

**실무 활용:**
```
"Docker MCP로 Spring Boot 애플리케이션의 컨테이너 메모리 사용량을 확인하고,
JVM 힙 메모리 설정을 최적화해줘"
```

#### ☸️ Kubernetes MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-kubernetes
```

**주요 기능:**
- Spring Actuator 헬스 체크 연동
- ConfigMap/Secret 관리
- 롤링 업데이트 상태 모니터링
- HPA(Horizontal Pod Autoscaler) 설정 검증

**실무 활용:**
```
"Kubernetes MCP로 API 서버 파드의 readiness/liveness 프로브 설정을 확인하고,
Spring Boot Actuator와 연동되는지 검증해줘"
```

---

### 3. 빌드 & CI/CD

#### 🏗️ Gradle MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-gradle
```

**주요 기능:**
- 멀티모듈 의존성 그래프 시각화
- 빌드 성능 분석 (Build Scan 연동)
- 의존성 버전 충돌 해결
- 플러그인 최적화 제안

**실무 활용:**
```
"Gradle MCP로 멀티모듈 프로젝트의 빌드 시간을 분석하고,
병렬 빌드와 캐싱으로 최적화해줘"
```

---

### 4. API 및 외부 서비스

#### 💬 Slack MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-slack
```

**주요 기능:**
- 배포 알림 자동화
- 에러 알럿 발송
- 코드 리뷰 요청 알림
- 팀 커뮤니케이션

**실무 활용:**
```
"Slack MCP로 #backend 채널에 PR 생성 알림을 보내고,
변경된 모듈 목록을 함께 공유해줘"
```

#### 📋 Jira MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-jira
```

**주요 기능:**
- 스토리/태스크 생성 자동화
- 스프린트 진행 상황 추적
- Git 커밋과 이슈 연동
- 릴리즈 노트 자동 생성

**실무 활용:**
```
"Jira MCP로 현재 스프린트의 완료된 이슈 목록을 가져오고,
릴리즈 노트를 자동 생성해줘"
```

#### 📝 Notion MCP
**설치:**
```bash
npm install -g @notion/mcp-server
```

**주요 기능:**
- API 문서 자동 생성 (OpenAPI → Notion)
- 아키텍처 다이어그램 관리
- 팀 위키 업데이트
- 회고 문서 작성

---

### 5. 모니터링 & 로깅

#### 📊 Prometheus MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-prometheus
```

**주요 기능:**
- Spring Actuator 메트릭 조회
- API 응답 시간 분석
- JVM 메모리/GC 모니터링
- 커스텀 메트릭 쿼리

**실무 활용:**
```
"Prometheus MCP로 지난 1시간 동안 /api/orders 엔드포인트의
평균 응답 시간과 에러율을 확인해줘"
```

#### 🔍 Elasticsearch MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-elasticsearch
```

**주요 기능:**
- Spring Boot 로그 검색 (Logback/Logstash 연동)
- 에러 스택트레이스 분석
- 비즈니스 로그 패턴 분석
- 성능 병목 지점 식별

**실무 활용:**
```
"Elasticsearch MCP로 최근 1시간 동안 PaymentService에서 발생한
모든 ERROR 레벨 로그를 검색하고 원인을 분석해줘"
```

#### ☁️ AWS MCP
**설치:**
```bash
npm install -g @modelcontextprotocol/server-aws
```

**주요 기능:**
- RDS 성능 메트릭 조회
- S3 버킷 관리
- CloudWatch 로그 분석
- ECS/EKS 배포 상태 확인

**실무 활용:**
```
"AWS MCP로 RDS의 슬로우 쿼리 로그를 확인하고,
인덱스 최적화가 필요한 쿼리를 식별해줘"
```

---

## 🚀 실무 시나리오별 MCP 활용

### 시나리오 1: N+1 쿼리 문제 해결

```
1. PostgreSQL MCP로 슬로우 쿼리 로그 확인
   "PostgreSQL MCP로 응답 시간이 1초 이상인 쿼리를 찾아줘"

2. 코드에서 문제 지점 식별
   "OrderRepository의 findAllWithItems 메서드에서 fetch join이 누락되었는지 확인해줘"

3. 최적화 후 검증
   "PostgreSQL MCP로 쿼리 실행 계획을 분석하고 개선 여부를 확인해줘"
```

### 시나리오 2: 헥사고날 아키텍처 의존성 검증

```
1. Git MCP로 모듈 간 의존성 확인
   "Git MCP로 domain 모듈이 adapter 모듈에 의존하는 코드가 있는지 찾아줘"

2. 순환 참조 감지
   "Gradle MCP로 멀티모듈 간 순환 의존성이 있는지 확인해줘"

3. 아키텍처 다이어그램 생성
   "Notion MCP로 현재 모듈 구조를 다이어그램으로 작성해줘"
```

### 시나리오 3: 배포 후 성능 모니터링

```
1. Kubernetes MCP로 배포 상태 확인
   "Kubernetes MCP로 payment-service 파드의 현재 상태와 재시작 횟수를 확인해줘"

2. Prometheus MCP로 메트릭 조회
   "Prometheus MCP로 지난 30분간 API 응답 시간과 에러율을 확인해줘"

3. Elasticsearch MCP로 에러 로그 분석
   "Elasticsearch MCP로 payment-service의 최근 에러 로그를 검색하고 원인을 분석해줘"

4. Slack MCP로 팀에 알림
   "Slack MCP로 #backend 채널에 성능 이슈 리포트를 공유해줘"
```

### 시나리오 4: 캐시 전략 최적화

```
1. Redis MCP로 현재 상태 확인
   "Redis MCP로 현재 캐시 히트율과 메모리 사용량을 확인해줘"

2. 캐시 키 패턴 분석
   "Redis MCP로 'user:*' 패턴의 키 개수와 TTL 설정을 확인해줘"

3. Spring Cache 설정 최적화
   "@Cacheable 애노테이션의 TTL과 키 생성 전략을 개선해줘"

4. 성능 비교
   "Prometheus MCP로 캐시 적용 전후의 API 응답 시간을 비교해줘"
```

---

## 🛠️ MCP 설정 방법

### 1. Claude Code에서 MCP 활성화

```bash
# MCP 기능 활성화
claude config set mcp.enabled true

# 설정 확인
claude config get mcp.enabled
```

### 2. PostgreSQL MCP 설정 (예시)

**설치:**
```bash
npm install -g @modelcontextprotocol/server-postgres
```

**연결 정보 설정:**
```bash
claude config mcp add postgres \
  --host localhost \
  --port 5432 \
  --database myapp_dev \
  --user developer \
  --password-env POSTGRES_PASSWORD
```

**환경 변수 설정:**
```bash
# .env 파일에 추가
export POSTGRES_PASSWORD=your_password

# 또는 환경별로 분리
export POSTGRES_DEV_PASSWORD=dev_password
export POSTGRES_PROD_PASSWORD=prod_password
```

### 3. 권한 설정 (보안)

**`~/.claude/mcp-config.json`:**
```json
{
  "mcps": {
    "postgres": {
      "permissions": ["read", "schema", "explain"],
      "restrictions": ["no-delete", "no-drop", "no-truncate"],
      "environments": {
        "development": {
          "host": "localhost",
          "database": "myapp_dev"
        },
        "staging": {
          "host": "staging-db.example.com",
          "database": "myapp_staging",
          "permissions": ["read", "schema"]
        },
        "production": {
          "host": "prod-db.example.com",
          "database": "myapp_prod",
          "permissions": ["read"],
          "restrictions": ["read-only"]
        }
      }
    },
    "redis": {
      "permissions": ["read", "info"],
      "restrictions": ["no-flushdb", "no-flushall"]
    },
    "kubernetes": {
      "namespaces": ["myapp-dev", "myapp-staging"],
      "permissions": ["read", "logs"],
      "restrictions": ["no-delete", "no-scale"]
    }
  }
}
```

### 4. 멀티모듈 프로젝트 설정

**`.claude/project.json`:**
```json
{
  "name": "myapp-backend",
  "type": "kotlin-multimodule",
  "architecture": "hexagonal",
  "modules": {
    "domain": {
      "path": "modules/domain",
      "type": "domain"
    },
    "application": {
      "path": "modules/application",
      "type": "application",
      "dependencies": ["domain"]
    },
    "adapter-web": {
      "path": "modules/adapter-web",
      "type": "adapter-in",
      "dependencies": ["application", "domain"]
    },
    "adapter-persistence": {
      "path": "modules/adapter-persistence",
      "type": "adapter-out",
      "dependencies": ["application", "domain"]
    }
  },
  "mcps": {
    "enabled": ["postgres", "redis", "git", "gradle", "docker"],
    "context": {
      "coding-style": ".claude/coding-conventions.md",
      "architecture": ".claude/project-structure.md"
    }
  }
}
```

---

## 💡 개발 단계별 추천 MCP 조합

### 🏗️ 로컬 개발 단계
```bash
# 필수 MCP
- Git MCP           # 코드 변경사항 추적
- PostgreSQL MCP    # 스키마 설계 및 쿼리 최적화
- Redis MCP         # 캐시 전략 검증
- Docker MCP        # 로컬 개발 환경 관리
- Gradle MCP        # 빌드 성능 최적화

# 선택적 MCP
- Notion MCP        # 문서화
- Slack MCP         # 팀 커뮤니케이션
```

**활용 예시:**
```
"PostgreSQL MCP로 Order 테이블의 인덱스를 검토하고,
Gradle MCP로 빌드 시간을 분석해줘"
```

### 🧪 테스트 단계
```bash
# 필수 MCP
- PostgreSQL MCP    # 테스트 DB 관리
- Docker MCP        # TestContainers 환경
- Git MCP           # 테스트 커버리지 추적

# 선택적 MCP
- Jira MCP          # 테스트 케이스 관리
```

**활용 예시:**
```
"Docker MCP로 TestContainers PostgreSQL을 시작하고,
통합 테스트를 실행해줘"
```

### 🚀 배포 단계
```bash
# 필수 MCP
- Kubernetes MCP    # 배포 상태 모니터링
- Git MCP           # 배포 태그 관리
- Slack MCP         # 배포 알림

# 선택적 MCP
- AWS MCP           # 클라우드 리소스 확인
- Jira MCP          # 릴리즈 노트 생성
```

**활용 예시:**
```
"Kubernetes MCP로 payment-service의 롤링 업데이트 상태를 확인하고,
Slack MCP로 배포 완료 알림을 보내줘"
```

### 🔍 운영/모니터링 단계
```bash
# 필수 MCP
- Prometheus MCP        # 성능 메트릭
- Elasticsearch MCP     # 로그 분석
- Kubernetes MCP        # 파드 상태 모니터링
- Slack MCP             # 알럿 발송

# 선택적 MCP
- AWS MCP               # 클라우드 메트릭
- Jira MCP              # 이슈 자동 생성
```

**활용 예시:**
```
"Prometheus MCP로 API 응답 시간이 느린 엔드포인트를 찾고,
Elasticsearch MCP로 관련 에러 로그를 분석한 후,
Jira MCP로 이슈를 자동 생성해줘"
```

---

## 🎯 엔드투엔드 실무 시나리오

### 시나리오 A: API 성능 이슈 해결 (전체 프로세스)

```bash
# 1단계: 문제 감지
claude "Prometheus MCP로 지난 1시간 동안 응답 시간이 느린 API를 찾아줘"

# 2단계: 로그 분석
claude "Elasticsearch MCP로 /api/orders 엔드포인트의 에러 로그를 검색해줘"

# 3단계: 데이터베이스 분석
claude "PostgreSQL MCP로 Order 관련 슬로우 쿼리를 찾고 실행 계획을 분석해줘"

# 4단계: 코드 최적화
claude "OrderRepository에 fetch join을 추가하고 N+1 쿼리를 해결해줘"

# 5단계: 테스트
claude "Docker MCP로 TestContainers를 시작하고 통합 테스트를 실행해줘"

# 6단계: 커밋 및 PR
claude "Git MCP로 변경사항을 커밋하고 PR을 생성해줘"

# 7단계: 배포 및 모니터링
claude "Kubernetes MCP로 배포 상태를 확인하고,
Prometheus MCP로 성능이 개선되었는지 검증해줘"

# 8단계: 팀 공유
claude "Slack MCP로 #backend 채널에 성능 개선 리포트를 공유해줘"
```

### 시나리오 B: 신규 기능 개발 (주문 취소 기능)

```bash
# 1단계: 이슈 확인
claude "Jira MCP로 TASK-123 이슈의 요구사항을 확인해줘"

# 2단계: 브랜치 생성
claude "Git MCP로 feature/order-cancellation 브랜치를 생성해줘"

# 3단계: 스키마 설계
claude "PostgreSQL MCP로 orders 테이블에 cancelled_at 컬럼을 추가하는
마이그레이션 스크립트를 생성해줘"

# 4단계: 헥사고날 아키텍처로 구현
claude "주문 취소 유스케이스를 헥사고날 아키텍처로 구현해줘:
- CancelOrderUseCase (application/port/in)
- CancelOrderService (application)
- OrderPersistenceAdapter 수정 (adapter/out)"

# 5단계: 테스트 작성
claude "CancelOrderService에 대한 단위 테스트를 Kotest로 작성해줘"

# 6단계: API 구현
claude "OrderController에 주문 취소 엔드포인트를 추가해줘"

# 7단계: 통합 테스트
claude "Docker MCP로 TestContainers를 시작하고 E2E 테스트를 실행해줘"

# 8단계: 문서화
claude "Notion MCP로 주문 취소 API 문서를 작성해줘"

# 9단계: PR 생성
claude "Git MCP로 PR을 생성하고 Slack MCP로 리뷰 요청을 보내줘"

# 10단계: 이슈 업데이트
claude "Jira MCP로 TASK-123를 'In Review' 상태로 변경해줘"
```

### 시나리오 C: 운영 중 장애 대응

```bash
# 1단계: 알럿 감지
claude "Slack MCP에서 받은 알럿을 확인하고 문제를 분석해줘"

# 2단계: 파드 상태 확인
claude "Kubernetes MCP로 payment-service 파드가 재시작되는 이유를 확인해줘"

# 3단계: 로그 분석
claude "Elasticsearch MCP로 payment-service의 최근 30분간 에러 로그를 검색해줘"

# 4단계: 메트릭 확인
claude "Prometheus MCP로 payment-service의 메모리 사용량과 GC 시간을 확인해줘"

# 5단계: 데이터베이스 상태
claude "PostgreSQL MCP로 활성 연결 수와 락 대기 중인 쿼리를 확인해줘"

# 6단계: 핫픽스 적용
claude "메모리 설정을 조정하는 핫픽스를 작성하고 배포해줘"

# 7단계: 검증
claude "Kubernetes MCP로 파드가 정상적으로 실행되는지 확인하고,
Prometheus MCP로 메트릭이 정상화되었는지 검증해줘"

# 8단계: 사후 조치
claude "Jira MCP로 장애 리포트 이슈를 생성하고,
Notion MCP로 사후 분석 문서를 작성해줘"

# 9단계: 팀 공유
claude "Slack MCP로 #incident 채널에 해결 내역을 공유해줘"
```

---

## 🔐 보안 고려사항

### 1. 권한 최소화 원칙

**개발 환경:**
```json
{
  "postgres": {
    "permissions": ["read", "write", "schema", "explain"],
    "restrictions": ["no-drop-database"]
  },
  "redis": {
    "permissions": ["read", "write", "info"],
    "restrictions": ["no-flushall"]
  }
}
```

**스테이징 환경:**
```json
{
  "postgres": {
    "permissions": ["read", "schema", "explain"],
    "restrictions": ["no-write", "no-delete"]
  },
  "redis": {
    "permissions": ["read", "info"],
    "restrictions": ["no-write"]
  }
}
```

**운영 환경:**
```json
{
  "postgres": {
    "permissions": ["read"],
    "restrictions": ["read-only", "no-pii"]
  },
  "kubernetes": {
    "permissions": ["read", "logs"],
    "restrictions": ["no-exec", "no-delete"]
  }
}
```

### 2. 민감 정보 보호

```bash
# 환경 변수로 관리
export DB_PASSWORD=$(vault read secret/database/password)
export REDIS_PASSWORD=$(vault read secret/redis/password)

# MCP 설정에서 환경 변수 참조
{
  "postgres": {
    "password": "${DB_PASSWORD}"  # 직접 저장 금지
  }
}
```

### 3. 감사 로그

```json
{
  "audit": {
    "enabled": true,
    "log_path": "~/.claude/audit.log",
    "include": ["postgres", "redis", "kubernetes"],
    "events": ["read", "write", "execute"]
  }
}
```

---

## 🎓 MCP 활용 팁

### 1. MCP 체이닝

여러 MCP를 연쇄적으로 활용하여 복잡한 작업 자동화:

```
"PostgreSQL MCP로 슬로우 쿼리를 찾고,
Git MCP로 해당 코드를 수정하고,
Docker MCP로 테스트를 실행한 후,
Slack MCP로 결과를 팀에 공유해줘"
```

### 2. 컨텍스트 유지

프로젝트 설정 파일에 MCP 컨텍스트를 저장:

```json
{
  "mcp-context": {
    "database": "myapp_dev",
    "namespace": "myapp-dev",
    "modules": ["domain", "application", "adapter-web", "adapter-persistence"]
  }
}
```

### 3. 자주 사용하는 명령어 별칭

```bash
# ~/.claude/aliases.json
{
  "check-health": "Kubernetes MCP로 모든 파드의 헬스 상태를 확인해줘",
  "slow-queries": "PostgreSQL MCP로 최근 1시간 동안의 슬로우 쿼리를 찾아줘",
  "deploy-status": "Kubernetes MCP로 배포 상태를 확인하고 Slack으로 알려줘"
}
```

---

## 📚 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io)
- [Claude Code MCP 가이드](https://docs.claude.com/mcp)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [헥사고날 아키텍처](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Last Updated**: 2025-01-20