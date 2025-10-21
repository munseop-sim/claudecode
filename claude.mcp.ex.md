# MCP 활용 전략

Kotlin + Spring Boot + Gradle 기반 헥사고날 아키텍처 멀티모듈 프로젝트에서 활용할 수 있는 MCP(Model Context Protocol) 서버들의 설치 방법과 실무 활용 사례를 정리한 문서입니다.

---

## 1. Context7

### 개요
최신 라이브러리 문서와 코드 예제를 실시간으로 조회할 수 있는 MCP 서버입니다. Claude의 지식 컷오프 이후 업데이트된 최신 API 문서, 마이그레이션 가이드, 베스트 프랙티스를 즉시 참조할 수 있습니다.

### 설치 방법

```bash
# Claude Code 설정 파일 열기
code ~/.config/claude-code/config.json

# mcpServers 섹션에 추가
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}

# Claude Code 재시작
```

### 핵심 기능
- **라이브러리 문서 조회**: Spring Boot, Kotlin, Gradle 등 주요 라이브러리의 최신 공식 문서 검색
- **코드 스니펫 제공**: 실제 동작하는 예제 코드와 사용 패턴 제공
- **버전별 문서**: 특정 버전의 API 문서 조회 가능 (예: `/spring/spring-boot/3.3.0`)

### 실무 활용 사례

#### 사례 1: 최신 Spring Boot 기능 적용
```kotlin
// Context7로 Spring Boot 3.3.x의 Observability 기능 확인 후 적용
@Configuration
class ObservabilityConfig {
    @Bean
    fun customObservationHandler(): ObservationHandler<Observation.Context> {
        // Context7에서 조회한 최신 Micrometer 문서 기반 구현
        return object : ObservationHandler<Observation.Context> {
            override fun onStart(context: Observation.Context) {
                // 요청 추적 시작
            }
        }
    }
}
```

#### 사례 2: Kotlin Coroutine 최신 패턴 적용
헥사고날 아키텍처의 Port 구현 시 최신 코루틴 패턴 확인:
```kotlin
// Application Layer - Port Interface
interface ProductQueryPort {
    suspend fun findById(id: ProductId): Product?
    fun findAllByCategory(category: Category): Flow<Product>
}

// Adapter Layer - Context7에서 조회한 최신 R2DBC 패턴 적용
@Repository
class ProductR2dbcAdapter(
    private val client: DatabaseClient
) : ProductQueryPort {
    override suspend fun findById(id: ProductId): Product? =
        client.sql("SELECT * FROM products WHERE id = :id")
            .bind("id", id.value)
            .awaitSingleOrNull()
}
```

#### 사례 3: Gradle Version Catalog 최신 패턴
```kotlin
// settings.gradle.kts - Context7로 확인한 Gradle 8.x 버전 카탈로그 패턴
dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            version("spring-boot", "3.3.0")
            version("kotlin", "1.9.23")
            library("spring-webflux", "org.springframework.boot", "spring-boot-starter-webflux")
                .versionRef("spring-boot")
        }
    }
}
```

### 활용 팁
- 새로운 라이브러리 도입 전 `/org/project` 형식으로 최신 문서 확인
- 마이그레이션 시 이전 버전과 최신 버전 문서를 비교하여 Breaking Changes 파악
- Adapter 레이어 구현 시 외부 라이브러리 최신 API 패턴 확인

---

## 2. Serena

### 개요
코드베이스를 깊이 분석하고 이해하는 데 도움을 주는 MCP 서버입니다. Claude가 프로젝트 구조, 파일 관계, 의존성 그래프 등을 더 정확하게 파악하여 맥락 기반의 코드 제안과 리팩토링을 수행할 수 있게 합니다.

### 설치 방법

```bash
# Claude Code 설정 파일에 추가
{
  "mcpServers": {
    "serena": {
      "command": "npx",
      "args": ["-y", "@upstash/serena-mcp"]
    }
  }
}

# 또는 전역 설치
npm install -g @upstash/serena-mcp

{
  "mcpServers": {
    "serena": {
      "command": "serena-mcp",
      "args": []
    }
  }
}
```

### 핵심 기능
- **코드베이스 인덱싱**: 프로젝트 전체 구조를 분석하여 빠른 탐색 지원
- **의존성 그래프 분석**: 모듈 간, 클래스 간 의존 관계 시각화 및 추적
- **컨텍스트 기반 코드 이해**: 파일, 클래스, 함수의 관계를 이해하여 더 정확한 제안 제공
- **리팩토링 지원**: 영향 범위 분석을 통한 안전한 리팩토링

### 실무 활용 사례

#### 사례 1: 헥사고날 아키텍처 의존성 분석
```text
// Serena를 통해 멀티모듈 프로젝트의 의존성 그래프 분석

질문: "domain 모듈을 의존하는 모든 모듈을 찾아줘"

Serena 분석 결과:
┌─────────────────┐
│  domain         │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┐
    │          │          │
┌───▼────┐ ┌──▼──────┐ ┌─▼────────┐
│application│ │adapter: │ │adapter:  │
│         │ │  web    │ │persistence│
└─────────┘ └─────────┘ └──────────┘

의존 관계:
- application → domain (Port 인터페이스 의존)
- adapter:web → application (UseCase 호출)
- adapter:persistence → domain (Entity 변환)
```

#### 사례 2: UseCase 호출 추적
```kotlin
// 질문: "PlaceOrderUseCase가 어디서 사용되는지 모두 찾아줘"

// Serena가 코드베이스를 분석하여 모든 호출 지점 찾기:

// 1. OrderController.kt (adapter:web)
@RestController
class OrderController(
    private val placeOrderUseCase: PlaceOrderUseCase  // ← 여기
) {
    @PostMapping("/api/orders")
    fun placeOrder(@RequestBody request: PlaceOrderRequest) {
        return placeOrderUseCase.execute(request)  // ← 여기
    }
}

// 2. OrderScheduler.kt (adapter:scheduler)
@Component
class OrderScheduler(
    private val placeOrderUseCase: PlaceOrderUseCase  // ← 여기
) {
    @Scheduled(cron = "0 0 * * * *")
    fun processScheduledOrders() {
        placeOrderUseCase.execute(...)  // ← 여기
    }
}

// 3. OrderControllerTest.kt (테스트)
// ...
```

#### 사례 3: 레이어 간 데이터 흐름 분석
```text
질문: "OrderRequest DTO가 어떻게 Domain 객체로 변환되는지 추적해줘"

Serena 분석 결과:

1. OrderRequest (adapter:web)
   └─ toCommand() 메서드
      └─ CreateOrderCommand (application)
         └─ UseCase에서 사용
            └─ toDomain() 메서드
               └─ Order (domain)

파일 위치:
- OrderRequest.kt: adapter/web/src/main/kotlin/dto/OrderRequest.kt:15
- CreateOrderCommand.kt: application/src/main/kotlin/command/CreateOrderCommand.kt:8
- Order.kt: domain/src/main/kotlin/model/Order.kt:12
```

#### 사례 4: 미사용 코드 탐지
```kotlin
// 질문: "ProductQueryPort를 구현한 클래스를 모두 찾고, 각 메서드가 실제로 사용되는지 확인해줘"

// Serena 분석 결과:

// 구현체: ProductR2dbcAdapter
interface ProductQueryPort {
    suspend fun findById(id: ProductId): Product?        // ✅ 7군데에서 사용
    suspend fun findByCategory(category: Category): List<Product>  // ✅ 3군데에서 사용
    suspend fun findByStatus(status: Status): List<Product>  // ❌ 미사용 (삭제 고려)
    suspend fun searchByName(name: String): List<Product>  // ✅ 2군데에서 사용
}

// 제안: findByStatus 메서드는 어디서도 호출되지 않습니다. 제거하시겠습니까?
```

#### 사례 5: 대규모 리팩토링 영향 분석
```text
질문: "Order 클래스의 status 필드명을 orderStatus로 변경하면 영향받는 파일은?"

Serena 분석 결과:

영향받는 파일 (총 23개):
├─ domain/
│  ├─ Order.kt (필드 정의)
│  └─ OrderTest.kt (테스트 코드 5군데)
├─ application/
│  ├─ PlaceOrderUseCase.kt (status 접근 2군데)
│  ├─ CancelOrderUseCase.kt (status 검증 1군데)
│  └─ ... (총 8개 파일)
├─ adapter:persistence/
│  ├─ OrderEntity.kt (매핑 로직)
│  └─ OrderMapper.kt (변환 로직 3군데)
└─ adapter:web/
   ├─ OrderResponse.kt (DTO 매핑)
   └─ ... (총 6개 파일)

수정이 필요한 총 라인 수: 47 라인
```

#### 사례 6: 신규 기능 추가 시 참고할 패턴 찾기
```text
질문: "결제 기능을 추가하려고 해. 기존 주문 기능과 비슷한 구조로 만들고 싶은데,
      어떤 파일들을 참고하면 될까?"

Serena 분석 결과:

주문 기능 구조 분석:
├─ domain/
│  ├─ Order.kt (Aggregate Root)
│  ├─ OrderId.kt (Value Object)
│  └─ OrderStatus.kt (Enum)
├─ application/
│  ├─ port/OrderPort.kt (Port 인터페이스)
│  └─ usecase/
│     ├─ PlaceOrderUseCase.kt
│     └─ CancelOrderUseCase.kt
├─ adapter:web/
│  ├─ OrderController.kt
│  └─ dto/OrderRequest.kt
└─ adapter:persistence/
   ├─ OrderEntity.kt
   ├─ OrderJpaRepository.kt
   └─ OrderPersistenceAdapter.kt

제안:
동일한 구조로 다음 파일들을 생성하세요:
├─ domain/Payment.kt, PaymentId.kt, PaymentStatus.kt
├─ application/port/PaymentPort.kt
├─ application/usecase/ProcessPaymentUseCase.kt
├─ adapter:web/PaymentController.kt
└─ adapter:persistence/PaymentPersistenceAdapter.kt
```

### 활용 팁
- 대규모 리팩토링 전 영향 범위를 먼저 분석하여 안전하게 진행
- 신규 개발자 온보딩 시 코드베이스 구조 이해를 위해 활용
- 레이어 간 의존성 규칙 위반 여부를 정기적으로 체크
- 미사용 코드(Dead Code) 탐지 및 제거를 통한 코드베이스 정리
- 복잡한 데이터 흐름 추적으로 버그 원인 빠르게 파악

---

## 3. Playwright

### 개요
웹 브라우저 자동화 및 E2E 테스트를 위한 MCP 서버입니다. 백엔드 API와 연동되는 프론트엔드의 통합 테스트, UI 자동화, 스크린샷 캡처를 수행할 수 있습니다.

### 설치 방법

```bash
# Playwright MCP 서버 설치
npm install -g @executeautomation/playwright-mcp-server

# Claude Code 설정 파일에 추가
{
  "mcpServers": {
    "playwright": {
      "command": "playwright-mcp-server",
      "args": []
    }
  }
}

# Playwright 브라우저 설치 (처음 한 번만)
npx playwright install
```

### 핵심 기능
- **E2E 테스트 자동화**: REST API 응답 기반 UI 동작 검증
- **API 응답 모킹**: 백엔드 API 응답을 가로채서 특정 시나리오 테스트
- **스크린샷/비디오 캡처**: 버그 리포트용 화면 캡처

### 실무 활용 사례

#### 사례 1: 백엔드 API와 프론트엔드 통합 검증
```typescript
// 헥사고날 아키텍처의 REST API가 프론트엔드와 올바르게 통합되는지 검증
test('주문 생성 후 주문 목록에 표시', async ({ page }) => {
  // 백엔드 API 호출 감지
  await page.route('**/api/orders', async route => {
    const response = await route.fetch();
    const body = await response.json();

    // 백엔드 응답 구조 검증 (DTO 스펙)
    expect(body).toMatchObject({
      orderId: expect.any(String),
      status: 'PENDING',
      items: expect.any(Array)
    });

    await route.fulfill({ response });
  });

  await page.goto('/orders/new');
  await page.fill('[name="productId"]', 'PROD-001');
  await page.click('button[type="submit"]');
  await expect(page.locator('.order-list')).toContainText('PROD-001');
});
```

#### 사례 2: 백엔드 예외 처리 UI 검증
```typescript
// Application Layer의 예외가 UI에 올바르게 전달되는지 검증
test('재고 부족 시 에러 메시지 표시', async ({ page }) => {
  await page.route('**/api/orders', route => {
    route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({
        errorCode: 'OUT_OF_STOCK',
        message: '재고가 부족합니다',
        productId: 'PROD-001'
      })
    });
  });

  await page.goto('/orders/new');
  await page.fill('[name="productId"]', 'PROD-001');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error-message')).toHaveText('재고가 부족합니다');
});
```

#### 사례 3: Spring Security 인증 플로우 검증
```typescript
test('인증되지 않은 사용자는 주문 불가', async ({ page }) => {
  await page.route('**/api/orders', route => {
    route.fulfill({ status: 401 });
  });

  await page.goto('/orders/new');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/login');
});
```

### 활용 팁
- REST API 스펙 변경 시 E2E 테스트로 프론트엔드 영향도 즉시 확인
- CI/CD 파이프라인에 통합하여 백엔드 배포 전 자동 검증
- API 응답 모킹으로 프론트엔드 개발자와 병렬 작업 가능

---

## 4. GitHub MCP

### 개요
GitHub 저장소 관리, 이슈 추적, PR 리뷰, Actions 모니터링을 Claude 내에서 직접 수행할 수 있는 MCP 서버입니다. 코드 리뷰, 이슈 관리, CI/CD 파이프라인 모니터링을 통합 환경에서 처리할 수 있습니다.

### 설치 방법

```bash
# GitHub Personal Access Token 생성
# https://github.com/settings/tokens 에서 생성
# 필요한 권한: repo, workflow, read:org

# Claude Code 설정 파일에 추가
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}

# 또는 환경 변수 설정
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

### 핵심 기능
- **PR 관리**: Pull Request 생성, 리뷰, 머지
- **이슈 추적**: 이슈 조회, 생성, 상태 업데이트
- **GitHub Actions 모니터링**: CI/CD 파이프라인 실행 상태 확인
- **코드 리뷰 자동화**: 자동 코드 리뷰 코멘트 생성

### 실무 활용 사례

#### 사례 1: 헥사고날 아키텍처 레이어 의존성 검증
```yaml
# .github/workflows/architecture-check.yml
name: Architecture Validation
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Check layer dependencies
        run: |
          # Domain 레이어가 Adapter 레이어를 의존하는지 검증
          ./gradlew :domain:dependencies | grep -q "adapter" && exit 1

          # Application 레이어가 Adapter 구현체를 직접 의존하는지 검증
          ./gradlew :application:dependencies | grep -q "adapter:persistence" && exit 1
```

GitHub MCP로 검증 결과 확인:
```text
PR #123 Architecture Check 실패:
- domain 모듈이 adapter:web 의존성 포함 (헥사고날 아키텍처 위반)
- 수정 필요: domain/build.gradle.kts에서 adapter:web 제거
```

#### 사례 2: 코드 리뷰 자동화 - 아키텍처 패턴 위반 감지
잘못된 코드:
```kotlin
// application/src/main/kotlin/usecase/CreateOrderUseCase.kt
class CreateOrderUseCase(
    private val orderRepository: OrderJpaRepository // ❌ Adapter 구현체 직접 의존
) {
    fun execute(command: CreateOrderCommand): Order {
        return orderRepository.save(command.toEntity())
    }
}
```

GitHub MCP 자동 리뷰 코멘트:
```markdown
🚨 Architecture Violation

Application 레이어가 Adapter 구현체(`OrderJpaRepository`)를 직접 의존하고 있습니다.

**헥사고날 아키텍처 원칙:**
- Application 레이어는 Port(인터페이스)만 의존해야 합니다
- Adapter 구현체는 DI 컨테이너에서 주입되어야 합니다

**수정 제안:**
1. Port 인터페이스 정의: application/port/OrderPort.kt
2. UseCase에서 Port 의존
3. Adapter에서 Port 구현
```

#### 사례 3: 이슈 기반 개발 워크플로우
```bash
# 1. 이슈 조회
Issue #45: [Feature] 주문 취소 기능 구현
Labels: feature, domain-layer
Assignee: @munseopsim

# 2. GitHub MCP로 자동 브랜치 생성
git checkout -b feature/45-order-cancellation

# 3. 구현 후 PR 생성 (이슈 자동 링크)
# GitHub MCP가 PR 설명 자동 생성
```

#### 사례 4: CI/CD 파이프라인 모니터링
```yaml
# .github/workflows/multi-module-build.yml
name: Multi-Module Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        module: [domain, application, adapter-web, adapter-persistence]
    steps:
      - name: Build ${{ matrix.module }}
        run: ./gradlew :${{ matrix.module }}:build
```

GitHub MCP로 실시간 모니터링:
```text
✅ domain: 빌드 성공 (23초)
✅ application: 빌드 성공 (31초)
❌ adapter-web: 빌드 실패 (12초)
   - 테스트 실패: OrderControllerTest.주문_생성_API_테스트
   - 로그: adapter-web/src/test/kotlin/OrderControllerTest.kt:45
⏳ adapter-persistence: 대기 중...
```

### 활용 팁
- PR 템플릿에 헥사고날 아키텍처 체크리스트 추가하여 자동 검증
- GitHub Actions에서 멀티모듈 빌드 실패 시 원인 자동 분석
- 이슈 라벨을 레이어별로 분류(`domain-layer`, `adapter-layer`)하여 영향도 추적
- 코드 리뷰 시 아키텍처 원칙 위반 자동 감지하여 일관성 유지

---

## 통합 활용 전략

### 개발 워크플로우에서의 MCP 활용

```text
1. 기능 개발 시작
   └─ GitHub MCP: 이슈에서 브랜치 자동 생성

2. 최신 라이브러리 확인
   └─ Context7: Spring Boot, Kotlin 최신 API 문서 조회

3. 로컬 개발 및 테스트
   ├─ Serena: 프로세스 및 네트워크 모니터링
   └─ Playwright: E2E 테스트 실행

4. PR 생성 및 리뷰
   └─ GitHub MCP: 아키텍처 규칙 자동 검증, CI/CD 모니터링

5. 배포
   └─ GitHub MCP: Actions 파이프라인 실시간 추적
```

### 헥사고날 아키텍처 품질 관리

각 레이어별 MCP 활용:
- **Domain Layer**: GitHub MCP로 외부 의존성 자동 감지
- **Application Layer**: Context7로 최신 UseCase 패턴 확인
- **Adapter Layer**: Serena로 외부 API 호출 추적, Context7로 최신 라이브러리 패턴 확인

---

## 참고 자료

### MCP 서버 공식 문서
- [Context7 공식 GitHub](https://github.com/upstash/context7)
- [Serena 공식 GitHub](https://github.com/oraios/serena)
- [Playwright MCP 공식 GitHub](https://github.com/executeautomation/mcp-playwright)
  - [Playwright MCP 공식 문서](https://executeautomation.github.io/mcp-playwright/)
- [GitHub MCP (Model Context Protocol Servers)](https://github.com/modelcontextprotocol/servers)

### MCP 프로토콜 공식 자료
- [MCP 프로토콜 공식 사이트](https://modelcontextprotocol.io/)
- [MCP 공식 GitHub Organization](https://github.com/modelcontextprotocol)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)