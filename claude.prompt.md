# 프롬프트 잘 작성하기

> Kotlin/Spring/Gradle 헥사고날 아키텍처 멀티모듈 백엔드 개발자를 위한 실전 프롬프트 가이드

---

## 프롬프트란?

프롬프트는 Claude와 같은 AI 모델에게 주어지는 입력 문장이나 질문을 의미합니다.

**좋은 프롬프트의 특징:**
- 명확한 컨텍스트 제공
- 구체적인 요구사항 명시
- 제약사항과 기대결과 포함
- 프로젝트 아키텍처 이해 반영

---

## 헥사고날 아키텍처 프롬프트 핵심 원칙

### 1. 레이어를 명확히 지정

```kotlin
// ❌ 나쁜 예
"주문 생성 기능 만들어줘"

// ✅ 좋은 예
"주문 생성 기능을 헥사고날 아키텍처로 구현해줘:

**Domain Layer** (order-domain 모듈)
- Order 애그리게잇 (Entity, ValueObjects)
- OrderCreatedEvent 도메인 이벤트

**Application Layer** (order-application 모듈)
- CreateOrderUseCase 인터페이스 (인바운드 포트)
- CreateOrderService 구현체
- SaveOrderPort 인터페이스 (아웃바운드 포트)

**Adapter Layer**
- OrderController (adapter-in-web 모듈) - REST API
- OrderJpaAdapter (adapter-out-persistence 모듈) - 영속성 구현

Kotlin 관용구와 불변성을 활용해서 구현해줘."
```

### 2. 의존성 방향 명시

```kotlin
// ✅ 올바른 의존성 방향 지정
"PaymentService를 리팩토링해줘:

**의존성 규칙:**
- Domain: 외부 의존성 없음 (순수 Kotlin)
- Application: Domain에만 의존
- Adapter: Application과 Domain에 의존
- Infrastructure는 모든 레이어를 조립

현재 PaymentService가 JpaRepository를 직접 의존하고 있어서
헥사고날 원칙 위반. 포트-어댑터 패턴으로 분리해줘."
```

### 3. 포트 인터페이스 설계 요청

```kotlin
// ✅ 명확한 포트 정의 요청
"주문 조회 기능의 포트 인터페이스를 설계해줘:

**인바운드 포트** (application/port/in/LoadOrderUseCase.kt)
- 입력: OrderId
- 출력: Order 도메인 엔티티
- 예외: OrderNotFoundException

**아웃바운드 포트** (application/port/out/LoadOrderPort.kt)
- 영속성 계층과의 계약 정의
- Optional이 아닌 Nullable 타입 사용

Kotlin sealed class로 결과 타입 정의 고려해줘."
```

---

## 프롬프트 구성요소

### 1. Context (컨텍스트)

**멀티모듈 프로젝트 컨텍스트 제공:**

```kotlin
// ❌ 불충분한 컨텍스트
"버그 수정해줘"

// ✅ 충분한 컨텍스트
"order-application 모듈의 CreateOrderService에서 버그가 발생해:

**현재 상황:**
- POST /api/orders 호출 시 500 에러
- 로그: 'org.springframework.dao.DataIntegrityViolationException'
- OrderJpaAdapter에서 SaveOrderPort 구현 중 예외 발생

**프로젝트 구조:**
```
order/
├── order-domain/          (순수 도메인)
├── order-application/     (유스케이스)
├── adapter-in-web/        (REST API)
└── adapter-out-persistence/ (JPA 구현)
```

**기술 스택:**
- Kotlin 2.0, Spring Boot 3.3, JPA
- 데이터베이스: PostgreSQL 15

재고 검증 로직에서 트랜잭션 경계 문제인 것 같아."
```

### 2. 구체적인 요구사항

```kotlin
// ❌ 모호한 요구사항
"코드를 개선해줘"

// ✅ 구체적인 요구사항
"OrderService의 findById 메서드를 개선해줘:

**현재 문제:**
- Optional.orElseThrow() 사용 중
- 예외 메시지가 불명확

**개선 요구사항:**
1. Kotlin Nullable 타입으로 변경 (Optional 제거)
2. 커스텀 도메인 예외 사용 (OrderNotFoundException)
3. 예외 메시지에 주문 ID 포함
4. 로깅 추가 (찾지 못한 경우 WARN 레벨)

**도메인 예외 정의:**
```kotlin
// order-domain 모듈
sealed class OrderException(message: String) : RuntimeException(message) {
    data class OrderNotFoundException(val orderId: String) :
        OrderException("Order not found: $orderId")
}
```

이 패턴으로 수정해줘."
```

### 3. 예상 결과물

```kotlin
// ❌ 불명확한 결과물
"테스트 작성해줘"

// ✅ 명확한 결과물
"CreateOrderService의 단위 테스트를 작성해줘:

**테스트 프레임워크:** Kotest (BehaviorSpec)
**모킹:** Mockk

**테스트 케이스:**
1. 정상 주문 생성
   - Given: 유효한 CreateOrderCommand
   - When: execute() 호출
   - Then: SaveOrderPort.save() 1회 호출, OrderCreatedEvent 발행

2. 재고 부족 예외
   - Given: 재고가 0인 상품
   - When: execute() 호출
   - Then: InsufficientStockException 발생

3. 중복 주문 검증
   - Given: 이미 존재하는 주문 번호
   - When: execute() 호출
   - Then: DuplicateOrderException 발생

**코드 스타일:**
- Given-When-Then 패턴
- Kotlin DSL 활용
- 모든 포트는 relaxedMockk()로 모킹"
```

---

## 최적화 전략

### 1. 작업 + 위치 + 요구사항

```kotlin
"adapter-out-persistence 모듈의 OrderJpaAdapter에
낙관적 락(Optimistic Locking) 기능을 추가해줘:

**구현 요구사항:**
1. OrderJpaEntity에 @Version 추가
2. 충돌 시 OptimisticLockException 핸들링
3. 도메인 예외로 변환: OrderConcurrencyException
4. 재시도 로직 추가 (최대 3회, exponential backoff)

**참고:**
- SaveOrderPort 인터페이스는 수정하지 않음 (계약 유지)
- 어댑터 내부에서만 처리"
```

### 2. 문제 상황 + 예상 원인 + 해결 방향

```kotlin
"주문 목록 조회 API(GET /api/orders)의 응답 시간이 3초 이상 걸려:

**예상 원인:**
- OrderJpaAdapter에서 N+1 쿼리 발생
- Order -> OrderItems 연관관계 지연 로딩

**해결 방향:**
1. 페치 조인으로 한 번에 조회
2. QueryDSL로 동적 쿼리 구현
3. 페이징 처리 (Page<Order> 반환)

**제약사항:**
- LoadOrderPort 인터페이스 시그니처 변경 가능
- Pageable을 도메인 레이어로 전달하지 말 것
  (애플리케이션 레이어에서 PaginationQuery로 래핑)

Kotlin extension function 활용해서 깔끔하게 구현해줘."
```

### 3. 기능 추가 + 제약사항 + 패턴

```kotlin
"상품 검색 기능을 추가해줘:

**레이어별 구현:**

1. **Domain (product-domain)**
   ```kotlin
   data class ProductSearchCriteria(
       val keyword: String?,
       val category: Category?,
       val priceRange: PriceRange?
   )
   ```

2. **Application (product-application)**
   - SearchProductsUseCase (인바운드 포트)
   - SearchProductsService (유스케이스 구현)
   - SearchProductsPort (아웃바운드 포트)

3. **Adapter-In-Web**
   - GET /api/products/search
   - QueryParam으로 받아서 ProductSearchCriteria로 변환

4. **Adapter-Out-Persistence**
   - QueryDSL로 동적 쿼리 구현
   - BooleanBuilder 사용
   - 페이징 + 정렬 지원

**제약사항:**
- Spring Data JPA Specification 사용하지 말 것 (QueryDSL 사용)
- 모든 검색 조건은 AND 연산
- keyword는 상품명과 설명에서 LIKE 검색

**기존 패턴:**
- OrderController의 응답 형식 따르기 (ApiResponse<T>)
- 페이징은 PageResponse<T> 래퍼 사용"
```

---

## 특수 기호 활용

### `@` 파일 참조

파일이나 코드를 직접 참조할 때 사용합니다.

```kotlin
// 단일 파일 참조
"@order-domain/src/main/kotlin/domain/Order.kt 파일을 분석해서
도메인 이벤트 발행 로직을 추가해줘"

// 여러 파일 동시 참조
"@CreateOrderUseCase.kt
@CreateOrderService.kt
@CreateOrderCommand.kt

이 세 파일을 기반으로 UpdateOrderUseCase를 만들어줘.
동일한 패턴을 따르되 업데이트 로직에 맞게 조정해줘"

// 전체 모듈 참조
"@order-application 모듈의 모든 유스케이스를 분석하고
중복되는 검증 로직을 추출해서 공통 클래스로 만들어줘"
```

**장점:**
- 정확한 컨텍스트 제공 (파일 내용을 Claude가 직접 읽음)
- 파일 검색 시간 단축
- 여러 파일 간 일관성 유지

### `!` 명령어 실행

터미널 명령어를 직접 실행할 때 사용합니다.

```bash
# Gradle 빌드 및 테스트
"! ./gradlew clean build
빌드 실패 시 에러를 분석하고 수정해줘"

# 특정 모듈 테스트
"! ./gradlew :order-application:test
테스트 실패 케이스를 확인하고 수정 방향 제시해줘"

# 의존성 트리 분석
"! ./gradlew :order-domain:dependencies
order-domain이 외부 프레임워크에 의존하고 있는지 확인해줘.
헥사고날 원칙 위반 사항이 있으면 지적해줘"

# 아키텍처 검증
"! ./gradlew archUnit
ArchUnit 테스트 실패 원인을 분석하고
의존성 규칙 위반 부분을 수정해줘"
```

---

## 프롬프트 기법

### 1. 단계별 요청 (Sequential Prompting)

복잡한 기능을 단계적으로 구현합니다.

```kotlin
"결제 기능을 헥사고날 아키텍처로 단계별로 구현해줘:

**1단계: Domain 설계**
- Payment 애그리게잇 (Entity)
- PaymentStatus (Enum)
- PaymentMethod (ValueObject)
- PaymentCompletedEvent (Domain Event)

완료되면 다음 단계로 진행해줘.

**2단계: Application 설계**
- ProcessPaymentUseCase (인바운드 포트)
- ProcessPaymentCommand (입력 DTO)
- ProcessPaymentService (유스케이스 구현)
- SavePaymentPort, LoadPaymentPort (아웃바운드 포트)
- 트랜잭션 경계 설정 (@Transactional)

**3단계: Adapter 구현**
- PaymentController (adapter-in-web)
  - POST /api/payments 엔드포인트
  - 입력 검증 (@Valid)
- PaymentJpaAdapter (adapter-out-persistence)
  - JPA 엔티티 변환 (Domain ↔ JPA)
  - 포트 구현

**4단계: 외부 PG 연동 (Adapter-Out-External)**
- PaymentGatewayAdapter
- WebClient로 비동기 HTTP 호출
- Kotlin Coroutine 활용
- 실패 시 재시도 로직

**5단계: 테스트 작성**
- 도메인 단위 테스트 (Kotest)
- 유스케이스 단위 테스트 (Mockk)
- 통합 테스트 (TestContainers)

각 단계마다 완료 확인 후 다음 단계로 진행해줘."
```

### 2. 조건부 요청 (Conditional Prompting)

환경이나 설정에 따라 다른 구현을 요청합니다.

```kotlin
"상품 검색 기능에 캐싱을 추가해줘:

**조건 분기:**
1. Redis가 설정되어 있는지 먼저 확인
   - ! ./gradlew :common:dependencies | grep redis

2. Redis가 있다면:
   - @Cacheable("products") 사용
   - RedisTemplate으로 TTL 설정 (1시간)
   - 캐시 키: "product:search:{criteria.hashCode()}"

3. Redis가 없다면:
   - @Cacheable with ConcurrentHashMap
   - 로컬 캐시 구현 (Caffeine)
   - 최대 1000개 항목, LRU 정책

**추가 요구사항:**
- 캐시 설정은 adapter-out-cache 모듈에 분리
- 캐시 미스 시 로그 기록
- 캐시 무효화 API 추가 (POST /api/admin/cache/clear)"
```

### 3. 참조 기반 요청 (Reference-Based Prompting)

기존 코드를 참조하여 일관성을 유지합니다.

```kotlin
"@order-application/CreateOrderService.kt를 참고해서
UpdateOrderService를 만들어줘:

**동일하게 유지:**
- 트랜잭션 처리 패턴
- 도메인 이벤트 발행 방식
- 예외 처리 구조
- 로깅 형식

**변경 사항:**
- 입력: UpdateOrderCommand (orderId, items, status)
- 비즈니스 규칙: 배송 완료 상태는 수정 불가
- 이벤트: OrderUpdatedEvent 발행

**추가 검증:**
- 주문이 존재하는지 확인
- 주문 상태가 업데이트 가능한지 확인
- 재고 재검증 (수량 증가 시)

Kotlin sealed class로 업데이트 결과 타입 정의해줘."
```

### 4. 역할 기반 요청 (Role-Based Prompting)

Claude에게 특정 전문가 역할을 부여합니다.

```kotlin
"당신은 10년 경력의 Kotlin 백엔드 아키텍트입니다.
헥사고날 아키텍처 전문가로서 다음 코드를 리뷰해주세요:

@order-application/CreateOrderService.kt

**리뷰 관점:**

1. **아키텍처 준수 (최우선)**
   - 의존성 방향이 올바른가?
   - 포트-어댑터 패턴이 명확한가?
   - 도메인 로직이 순수한가?

2. **Kotlin 관용구 활용**
   - data class, sealed class 적절히 사용했는가?
   - 불변성이 보장되는가? (val, immutable collections)
   - Null 안정성이 확보되는가?
   - extension function 활용 가능한 부분이 있는가?

3. **비즈니스 로직**
   - 도메인 규칙이 올바르게 표현되었는가?
   - 예외 상황이 적절히 처리되는가?
   - 트랜잭션 경계가 명확한가?

4. **테스트 용이성**
   - 모킹이 쉬운 구조인가?
   - 의존성 주입이 명확한가?
   - 부수 효과가 격리되어 있는가?

5. **성능 및 동시성**
   - N+1 문제가 없는가?
   - 동시성 이슈가 없는가?
   - 불필요한 연산이 없는가?

**출력 형식:**
1. 현재 코드 평가 (5단계 등급)
2. 발견된 문제점 (우선순위별)
3. 구체적인 개선 코드 예시
4. 리팩토링 로드맵"
```

### 5. 비교 분석 요청 (Comparative Analysis)

여러 방식을 비교하여 최선의 선택을 요청합니다.

```kotlin
"주문 목록 조회 성능을 개선하려고 해. 다음 3가지 방식을 비교 분석해줘:

**Option A: 페치 조인 (Fetch Join)**
```kotlin
@Query(\"\"\"
    SELECT o FROM Order o
    JOIN FETCH o.orderItems
    WHERE o.userId = :userId
\"\"\")
fun findByUserIdWithItems(userId: Long): List<Order>
```

**Option B: Entity Graph**
```kotlin
@EntityGraph(attributePaths = ["orderItems"])
fun findByUserId(userId: Long): List<Order>
```

**Option C: QueryDSL + DTO Projection**
```kotlin
queryFactory
    .select(QOrderDto(...))
    .from(order)
    .join(order.orderItems, orderItem)
    .where(order.userId.eq(userId))
    .fetch()
```

**비교 기준:**
1. 성능 (쿼리 개수, 실행 시간)
2. 메모리 사용량 (엔티티 vs DTO)
3. 코드 복잡도
4. 유지보수성
5. 헥사고날 아키텍처 관점 (레이어 분리)
6. 페이징 처리 용이성

**현재 컨텍스트:**
- 주문 1건당 평균 5개 아이템
- 사용자당 평균 100건 주문
- 페이징 필수 (20건씩)

각 옵션의 장단점을 분석하고 최종 추천안을 제시해줘."
```

---

## 피해야 할 프롬프트 ❌

### 1. 너무 모호한 요청

```kotlin
❌ "코드 좀 봐줘"
❌ "에러가 나"
❌ "더 좋게 만들어줘"
❌ "최적화해줘"
```

**개선 방법:**
```kotlin
✅ "OrderService의 createOrder 메서드에서
재고 검증 로직이 트랜잭션 외부에 있어서 동시성 문제가 발생해.
@Transactional 경계를 조정해서 원자성을 보장하도록 수정해줘"
```

### 2. 너무 많은 요구사항을 한 번에

```kotlin
❌ "사용자 관리, 상품 관리, 주문 관리, 결제 시스템,
알림 기능, 배송 추적, 리뷰 시스템을 모두 헥사고날 아키텍처로
구현해줘. 각각 멀티모듈로 분리하고 테스트도 작성해줘"
```

**개선 방법:**
```kotlin
✅ "먼저 주문 관리 기능만 헥사고날 아키텍처로 구현해줘:
- order-domain: Order 애그리게잇
- order-application: CreateOrderUseCase
- adapter-in-web: OrderController
- adapter-out-persistence: OrderJpaAdapter

완료되면 다음 기능(결제)으로 진행할게."
```

### 3. 구체적인 정보 없는 요청

```kotlin
❌ "API 만들어줘"
❌ "테스트 추가해줘"
❌ "리팩토링해줘"
```

**개선 방법:**
```kotlin
✅ "주문 상세 조회 API를 만들어줘:

**Endpoint:** GET /api/orders/{orderId}
**인바운드 포트:** LoadOrderUseCase
**응답:** OrderDetailResponse (주문 정보 + 주문 아이템 목록)
**에러:** 404 - OrderNotFoundException

기존 OrderController의 패턴을 따라서 구현해줘."
```

### 4. 레이어 경계를 무시한 요청

```kotlin
❌ "Order 엔티티에 @Entity 어노테이션 추가하고
JPA 설정해줘"
```

**문제:**
- Domain 레이어는 순수해야 함 (JPA 의존하면 안 됨)
- 헥사고날 원칙 위반

**개선 방법:**
```kotlin
✅ "Order 도메인 엔티티는 순수하게 유지하고,
adapter-out-persistence에 OrderJpaEntity를 별도로 만들어줘.

**Domain:** Order (순수 Kotlin, JPA 의존 없음)
**Persistence:** OrderJpaEntity (@Entity 사용)
**Mapper:** OrderJpaEntity ↔ Order 변환 로직

이렇게 레이어를 분리해서 구현해줘."
```

---

## 실전 프롬프트 예시

### 🔧 1. 버그 수정

#### Before (개선 전)
```
"PATCH API에서 null 문제 있어"
```

#### After (개선 후)
```kotlin
"adapter-in-web/OrderController의 updateOrder API에서 버그 발생:

**현재 상황:**
- PATCH /api/orders/{orderId}
- 요청: UpdateOrderRequest(status = "CONFIRMED", items = null)
- 문제: items가 null일 때 기존 주문 아이템이 모두 삭제됨

**원인 분석:**
OrderJpaAdapter에서 Order.update() 호출 시
null 필드를 빈 리스트로 해석

**해결 방안:**
1. Kotlin의 copy() 메서드 활용
2. null과 empty를 구분 (null = 업데이트 안 함, empty = 삭제)
3. UpdateOrderCommand에서 nullable 필드 명시
4. 매퍼에서 조건부 업데이트 로직 추가

**테스트 케이스:**
- items = null → 기존 아이템 유지
- items = emptyList() → 모든 아이템 삭제
- items = listOf(...) → 아이템 교체

Kotlin sealed class로 업데이트 전략을 타입으로 표현해줘."
```

### ✨ 2. 기능 개발

#### Before (개선 전)
```
"로그인 만들어줘"
```

#### After (개선 후)
```kotlin
"JWT 기반 인증 시스템을 헥사고날 아키텍처로 구현해줘:

**모듈 구조:**
```
auth/
├── auth-domain/
│   ├── User (애그리게잇)
│   ├── RefreshToken (ValueObject)
│   └── AuthenticationException (도메인 예외)
├── auth-application/
│   ├── port/in/
│   │   ├── LoginUseCase
│   │   └── RefreshTokenUseCase
│   ├── port/out/
│   │   ├── LoadUserPort
│   │   └── SaveRefreshTokenPort
│   └── service/
│       ├── LoginService
│       └── RefreshTokenService
├── adapter-in-web/
│   └── AuthController
│       ├── POST /auth/login
│       └── POST /auth/refresh
└── adapter-out-security/
    ├── JwtTokenProvider (토큰 생성/검증)
    ├── JwtAuthenticationFilter
    └── SecurityConfig
```

**구현 요구사항:**

1. **Domain Layer (auth-domain)**
   ```kotlin
   data class User(
       val id: UserId,
       val email: Email,
       val password: EncryptedPassword,
       val roles: Set<Role>
   )

   sealed class AuthenticationException {
       object InvalidCredentials : AuthenticationException()
       object TokenExpired : AuthenticationException()
   }
   ```

2. **Application Layer (auth-application)**
   - LoginUseCase: email/password → JwtTokenPair
   - RefreshTokenUseCase: refreshToken → new JwtTokenPair
   - 비밀번호 검증은 도메인 서비스로 분리

3. **Adapter-In-Web**
   ```kotlin
   @PostMapping("/auth/login")
   fun login(@Valid @RequestBody request: LoginRequest):
       ResponseEntity<LoginResponse>

   // LoginRequest(email, password)
   // LoginResponse(accessToken, refreshToken, expiresIn)
   ```

4. **Adapter-Out-Security**
   - JwtTokenProvider (JWT 라이브러리 의존)
   - HS256 알고리즘, 비밀키는 환경변수
   - Access Token: 1시간, Refresh Token: 7일

**보안 요구사항:**
- 비밀번호는 BCrypt 암호화
- Refresh Token은 Redis에 저장 (TTL 7일)
- 로그인 실패 5회 시 계정 잠금 (15분)
- JWT에 민감정보 포함 금지 (userId, roles만)

**에러 처리:**
- 인증 실패 → 401 Unauthorized
- 토큰 만료 → 401 with "TOKEN_EXPIRED" 코드
- 잘못된 형식 → 400 Bad Request

기존 SecurityConfig를 유지하면서 JWT 필터를 추가해줘."
```

### 🧪 3. 테스트 작성

#### Before (개선 전)
```
"테스트 만들어줘"
```

#### After (개선 후)
```kotlin
"CreateOrderService의 통합 테스트를 작성해줘:

**테스트 환경:**
- Kotest (FreeSpec)
- TestContainers (PostgreSQL)
- 실제 Spring Context 로딩 (@SpringBootTest)
- 트랜잭션 롤백 (@Transactional)

**테스트 케이스:**

1. **정상 주문 생성**
   ```kotlin
   "정상적인 주문 생성 시 주문이 저장되고 이벤트가 발행된다" {
       // Given
       val user = userRepository.save(createUser())
       val product = productRepository.save(createProduct(stock = 10))
       val command = CreateOrderCommand(
           userId = user.id,
           items = listOf(OrderItemDto(product.id, quantity = 2))
       )

       // When
       val result = createOrderService.execute(command)

       // Then
       result shouldBeInstanceOf Order::class
       orderRepository.findById(result.id) shouldNotBe null
       // 이벤트 발행 검증
       eventPublisher.publishedEvents shouldContain OrderCreatedEvent::class
   }
   ```

2. **재고 부족 예외**
   - Given: 재고 1개인 상품에 2개 주문 시도
   - When: execute() 호출
   - Then: InsufficientStockException 발생
   - 롤백 확인: 주문이 저장되지 않음

3. **동시성 테스트 (낙관적 락)**
   - Given: 동일한 상품에 대해 10개의 스레드가 동시에 주문
   - When: 병렬 실행 (Dispatchers.IO)
   - Then: OptimisticLockException 발생, 재시도 후 성공
   - 최종 재고 검증

4. **트랜잭션 경계 테스트**
   - 주문 생성 실패 시 이벤트도 발행되지 않아야 함
   - 부분 성공 (partial success) 없어야 함

**테스트 헬퍼:**
```kotlin
fun createUser(email: String = "test@example.com"): User
fun createProduct(stock: Int = 100): Product
fun createOrderCommand(): CreateOrderCommand
```

**검증 항목:**
- 데이터베이스 상태
- 이벤트 발행 여부
- 재고 차감 확인
- 트랜잭션 롤백 확인

Kotlin Coroutine과 TestContainers를 활용해서 작성해줘."
```

### 🏗️ 4. 리팩토링

#### Before (개선 전)
```
"OrderService가 너무 커"
```

#### After (개선 후)
```kotlin
"order-application 모듈의 OrderService를 CQRS 패턴으로 리팩토링해줘:

**현재 문제:**
- OrderService가 1000줄 이상
- 명령(Command)과 조회(Query)가 혼재
- 단일 책임 원칙(SRP) 위반
- 테스트 작성이 어려움

**리팩토링 목표:**

1. **Command (쓰기) 분리**
   ```kotlin
   // CreateOrderService
   interface CreateOrderUseCase {
       fun execute(command: CreateOrderCommand): Order
   }

   // UpdateOrderService
   interface UpdateOrderUseCase {
       fun execute(command: UpdateOrderCommand): Order
   }

   // CancelOrderService
   interface CancelOrderUseCase {
       fun execute(command: CancelOrderCommand): Order
   }
   ```

2. **Query (읽기) 분리**
   ```kotlin
   // LoadOrderQuery
   interface LoadOrderUseCase {
       fun loadById(orderId: OrderId): Order?
       fun loadByUserId(userId: UserId): List<Order>
   }

   // SearchOrdersQuery (복잡한 조회)
   interface SearchOrdersUseCase {
       fun search(criteria: OrderSearchCriteria): Page<OrderSummary>
   }
   ```

3. **포트 분리**
   ```kotlin
   // Command용 포트
   interface SaveOrderPort
   interface DeleteOrderPort

   // Query용 포트
   interface LoadOrderPort
   interface SearchOrdersPort
   ```

4. **어댑터 최적화**
   - Command: OrderJpaAdapter (쓰기 최적화, 엔티티 사용)
   - Query: OrderQueryAdapter (읽기 최적화, DTO projection)

**리팩토링 순서:**
1. 인터페이스 정의 (포트)
2. 유스케이스별 서비스 클래스 생성
3. 기존 OrderService 로직 이동
4. 어댑터 분리 (Command/Query)
5. 테스트 작성
6. 기존 OrderService 삭제

**주의사항:**
- 기존 API 엔드포인트는 유지 (클라이언트 호환성)
- OrderController는 여러 유스케이스를 조합해서 사용
- 트랜잭션 경계는 유스케이스 단위로 설정
- 도메인 이벤트 발행은 Command 유스케이스에서만

Kotlin DSL과 extension function을 활용해서 깔끔하게 작성해줘."
```

### 🔍 5. 코드 분석

#### Before (개선 전)
```
"아키텍처 분석해줘"
```

#### After (개선 후)
```kotlin
"현재 프로젝트를 헥사고날 아키텍처 관점에서 분석해줘:

**분석 대상:**
```
@order/           # order 모듈 전체
```

**분석 관점:**

1. **모듈 구조 검증**
   - domain, application, adapter 레이어 분리 여부
   - Gradle 멀티모듈 설정 확인
   - 각 모듈의 dependencies.gradle.kts 분석

2. **의존성 방향 검증**
   ```
   올바른 방향:
   adapter-in → application → domain
   adapter-out → application → domain

   위반 사항 찾기:
   - domain이 외부 프레임워크 의존하는 경우
   - adapter가 다른 adapter 직접 의존하는 경우
   ```

3. **포트 인터페이스 분석**
   - 인바운드 포트(UseCase) 명명 규칙 준수 여부
   - 아웃바운드 포트(Port) 정의 위치 확인
   - 포트 구현체가 adapter에만 있는지 검증

4. **도메인 순수성 검증**
   ```kotlin
   # domain 모듈의 의존성 확인
   ! ./gradlew :order-domain:dependencies

   # 다음 의존성이 없어야 함:
   - Spring Framework (except spring-context for @Component)
   - JPA (@Entity 금지)
   - Jackson (@JsonProperty 금지)
   ```

5. **안티패턴 탐지**
   - [ ] 도메인에 @Entity 사용
   - [ ] 유스케이스에서 @RestController 직접 호출
   - [ ] 어댑터 간 직접 의존
   - [ ] 도메인 로직이 서비스 레이어에 누출
   - [ ] 트랜잭션이 어댑터에 위치

6. **개선 가능성 분석**
   - 중복 코드 식별
   - 책임 분리 가능 부분
   - 성능 병목 구간
   - 테스트 커버리지 낮은 부분

**출력 형식:**

1. **현재 상태 요약** (표 형식)
   | 항목 | 상태 | 점수 |
   |------|------|------|
   | 모듈 분리 | ✅ Good | 9/10 |
   | 의존성 방향 | ⚠️ Warning | 6/10 |
   | 포트 정의 | ❌ Poor | 3/10 |

2. **발견된 문제점** (우선순위별)
   - Critical: 즉시 수정 필요
   - High: 빠른 시일 내 수정
   - Medium: 리팩토링 시 개선
   - Low: 선택적 개선

3. **구체적인 개선안** (코드 예시 포함)

4. **리팩토링 로드맵** (단계별 계획)

ArchUnit 테스트 코드도 함께 제안해줘."
```

### 🚀 6. 성능 최적화

```kotlin
"주문 목록 조회 API의 성능을 최적화해줘:

**현재 상황:**
- Endpoint: GET /api/orders?userId={userId}&page=0&size=20
- 응답 시간: 평균 3초, 최대 10초
- 데이터: 사용자당 평균 1000건 주문

**분석 요청:**
1. ! ./gradlew :adapter-out-persistence:test --tests "*OrderJpaAdapterTest"
   --info

2. SQL 쿼리 로그 확인 (show-sql=true)

3. N+1 쿼리 발생 여부 확인

**최적화 방안 제시:**
1. 페치 조인 vs Entity Graph vs DTO Projection 비교
2. 인덱스 추가 필요 여부
3. 캐싱 전략 (Redis)
4. 페이지네이션 개선 (커서 기반)
5. 읽기 전용 쿼리 최적화 (@Transactional(readOnly = true))

**제약사항:**
- LoadOrderPort 인터페이스 시그니처 변경 가능
- 도메인 레이어에 Pageable 노출 금지
- 기존 API 응답 형식 유지

**성능 목표:**
- 평균 응답 시간 500ms 이하
- P99 1초 이하
- DB 쿼리 개수 최소화

벤치마크 코드(JMH)도 함께 제공해줘."
```

---

## 체크리스트: 좋은 프롬프트 작성

프롬프트 작성 전에 다음을 확인하세요:

### 필수 항목 ✅

- [ ] **명확한 목표**: 무엇을 원하는지 구체적으로 명시
- [ ] **컨텍스트 제공**: 모듈 구조, 기술 스택, 현재 상황 설명
- [ ] **레이어 지정**: domain/application/adapter 중 어디에 위치할지 명시
- [ ] **제약사항**: 사용할/피할 라이브러리, 패턴, 스타일 명시
- [ ] **예상 결과물**: 파일 위치, 클래스명, 메서드 시그니처 등
- [ ] **헥사고날 원칙**: 의존성 방향, 포트-어댑터 패턴 명시

### 권장 항목 ⭐

- [ ] **예시 제공**: 기존 코드나 원하는 스타일 예시
- [ ] **우선순위**: 여러 작업이 있을 경우 순서 지정
- [ ] **검증 방법**: 테스트 방법, 실행 명령어 포함
- [ ] **에러 처리**: 예외 상황과 처리 방법 명시
- [ ] **성능 요구사항**: 응답 시간, 처리량 목표

### 피해야 할 것 ❌

- [ ] 모호한 표현 ("좀", "대충", "적당히")
- [ ] 레이어 혼동 (domain에 JPA 요청 등)
- [ ] 너무 많은 요구사항을 한 번에
- [ ] 컨텍스트 없는 요청
- [ ] 결과물이 불명확한 요청

---

## 부록: 프롬프트 템플릿

### 신규 기능 개발 템플릿

```kotlin
"[기능명]을 헥사고날 아키텍처로 구현해줘:

**Domain Layer ([모듈명]-domain)**
- [애그리게잇/엔티티 목록]
- [ValueObject 목록]
- [도메인 이벤트 목록]

**Application Layer ([모듈명]-application)**
- 인바운드 포트: [UseCase 인터페이스 목록]
- 아웃바운드 포트: [Port 인터페이스 목록]
- 유스케이스 구현: [Service 클래스 목록]

**Adapter Layer**
- adapter-in-web: [Controller 목록]
  - [HTTP 메서드] [경로]
- adapter-out-persistence: [Adapter 클래스 목록]
  - [데이터베이스/기술 스택]

**구현 요구사항:**
1. [요구사항 1]
2. [요구사항 2]

**제약사항:**
- [제약사항 1]
- [제약사항 2]

**테스트:**
- [테스트 프레임워크 및 전략]"
```

### 버그 수정 템플릿

```kotlin
"[모듈명]/[클래스명]에서 버그 발생:

**현재 상황:**
- [API/메서드] 호출 시 [증상]
- 로그: [에러 메시지]
- 재현 조건: [재현 방법]

**예상 원인:**
- [원인 추측]

**해결 방향:**
1. [해결 방법 1]
2. [해결 방법 2]

**제약사항:**
- [변경 불가 사항]

**검증 방법:**
- [테스트 시나리오]"
```

### 리팩토링 템플릿

```kotlin
"[클래스명]을 리팩토링해줘:

**현재 문제:**
- [문제점 1]
- [문제점 2]

**리팩토링 목표:**
1. [목표 1]
2. [목표 2]

**리팩토링 방법:**
- [패턴/기법 제안]

**주의사항:**
- [기존 동작 유지 사항]
- [호환성 고려 사항]

**검증:**
- [테스트 전략]"
```

---

**마지막 업데이트:** 2025-01-20

**관련 문서:**
- [메모리 시스템 활용](./docs/03-memory-system.md)
- [사용자 정의 명령어](./docs/08-custom-commands.md)
- [프롬프팅 전략](./docs/02-prompting-strategies.md)
