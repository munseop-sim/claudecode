# 프로젝트 설계

> **프로젝트 설계란?**
> 소프트웨어를 개발하기 전에 시스템의 구조, 기술 스택, 아키텍처 패턴 등을 결정하는 단계입니다.
> 좋은 설계는 유지보수성, 확장성, 테스트 용이성을 높여줍니다.

## 💡 Claude 활용 팁: 프로젝트 설계

### 1. 요구사항 분석 및 아키텍처 선택
```
프롬프트 예시:
"전자상거래 플랫폼을 만들려고 해. 다음 요구사항이 있어:
- 사용자, 상품, 주문, 결제 도메인
- 월 10만명의 사용자 예상
- 외부 결제 API, 재고 관리 시스템 연동 필요
- 향후 모바일 앱도 지원 예정

레이어드 아키텍처와 헥사고날 아키텍처 중 어떤 것이 적합할까?
각각의 장단점과 이 프로젝트에 맞는 추천을 해줘."
```

**Claude가 도와줄 수 있는 것**:
- 프로젝트 규모와 복잡도에 따른 아키텍처 추천
- 각 아키텍처의 트레이드오프 설명
- 팀 상황(경험, 일정)을 고려한 현실적인 조언

### 2. 패키지 구조 설계
```
프롬프트 예시:
"Spring Boot + Kotlin으로 레이어드 아키텍처를 사용하는
전자상거래 프로젝트의 패키지 구조를 설계해줘.
User, Product, Order 도메인이 있고,
각 도메인마다 CRUD 기능과 몇 가지 비즈니스 로직이 있어."
```

**결과물**: 완전한 디렉토리 구조와 각 패키지의 역할 설명

### 3. 도메인 모델링
```
프롬프트 예시:
"전자상거래에서 Order(주문) 도메인을 설계하려고 해.
- 주문은 여러 주문 항목(OrderItem)을 가짐
- 주문 상태: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
- 각 상태 전환에 비즈니스 규칙이 있음

Kotlin data class로 Entity와 DTO를 설계하고,
상태 전환 로직도 추가해줘."
```

**Claude가 생성해주는 것**:
- JPA Entity 설계 (연관관계 포함)
- 상태 패턴 또는 Sealed Class를 활용한 상태 관리
- DTO 및 Mapper 함수

## 아키텍처 설계

### 1. 레이어드 아키텍처 (Layered Architecture)
**정의**: 애플리케이션을 여러 계층으로 분리하여 각 계층이 명확한 책임을 가지도록 하는 아키텍처 패턴

**주요 계층**:
- **Presentation Layer (Controller)**: HTTP 요청/응답 처리, 입력 검증
- **Business Layer (Service)**: 비즈니스 로직 수행, 트랜잭션 관리
- **Persistence Layer (Repository)**: 데이터베이스 접근, 데이터 영속화
- **Domain Layer (Entity/Model)**: 도메인 객체 정의

**계층 간 의존성 규칙**:
```
Controller → Service → Repository → Entity
(상위 계층은 하위 계층에만 의존)
```

**패키지 구조 예시**:
```
com.example.project
├── controller/      # API 엔드포인트
├── service/         # 비즈니스 로직
├── repository/      # 데이터 접근
├── domain/          # 도메인 엔티티
├── dto/             # 데이터 전송 객체
└── config/          # 설정 클래스
```

**코드 예시**:
```kotlin
// Presentation Layer
@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService  // 하위 계층 의존
) {
    @PostMapping
    fun createUser(@RequestBody request: UserCreateRequest) =
        userService.createUser(request)
}

// Business Layer
@Service
class UserService(
    private val userRepository: UserRepository  // 하위 계층 의존
) {
    @Transactional
    fun createUser(request: UserCreateRequest): User {
        return userRepository.save(request.toEntity())
    }
}

// Persistence Layer
interface UserRepository : JpaRepository<User, Long>

// Domain Layer
@Entity
data class User(
    @Id @GeneratedValue
    val id: Long = 0,
    val email: String,
    val name: String
)
```

**장점**:
- ✅ 이해하기 쉽고 직관적
- ✅ 계층별 역할이 명확
- ✅ 작은~중간 규모 프로젝트에 적합
- ✅ Spring Boot와 자연스럽게 통합

**단점**:
- ❌ 데이터베이스 중심 설계 (DB가 비즈니스 로직을 지배)
- ❌ 비즈니스 로직이 인프라에 의존 (Repository 인터페이스가 JPA에 의존)
- ❌ 테스트 시 전체 계층을 모킹해야 할 수 있음
- ❌ 복잡한 비즈니스 로직을 표현하기 어려움

---

### 2. 헥사고날 아키텍처 (Hexagonal Architecture / Ports and Adapters)
**정의**: 비즈니스 로직을 중심에 두고, 외부 시스템(DB, API, UI 등)을 교체 가능한 어댑터로 분리하는 아키텍처 패턴

**별칭**: 포트 앤 어댑터 아키텍처 (Ports and Adapters), 클린 아키텍처의 한 형태

**핵심 개념**:
- **Domain (핵심 비즈니스 로직)**: 외부 의존성 없는 순수한 비즈니스 로직
- **Port (인터페이스)**: 내부와 외부를 연결하는 계약
  - **Inbound Port (Use Case)**: 애플리케이션으로 들어오는 요청 (예: 사용자 생성)
  - **Outbound Port**: 애플리케이션에서 나가는 요청 (예: DB 저장, 외부 API 호출)
- **Adapter (구현체)**: Port의 실제 구현
  - **Inbound Adapter**: REST Controller, GraphQL Resolver 등
  - **Outbound Adapter**: JPA Repository, HTTP Client 등

**의존성 규칙**:
```
Adapter → Port → Domain
(모든 의존성은 안쪽(Domain)을 향함)
```

**패키지 구조 예시**:
```
com.example.project
├── domain/                      # 핵심 비즈니스 로직 (의존성 없음)
│   ├── model/
│   │   └── User.kt
│   └── service/
│       └── UserDomainService.kt
│
├── application/                 # 유스케이스 (Inbound Port)
│   ├── port/
│   │   ├── in/
│   │   │   └── CreateUserUseCase.kt      # 인터페이스
│   │   └── out/
│   │       └── UserPersistencePort.kt    # 인터페이스
│   └── service/
│       └── UserService.kt                # UseCase 구현
│
└── adapter/                     # 어댑터 (Port 구현)
    ├── in/
    │   └── web/
    │       └── UserController.kt         # Inbound Adapter
    └── out/
        └── persistence/
            ├── UserJpaEntity.kt
            ├── UserRepository.kt
            └── UserPersistenceAdapter.kt  # Outbound Adapter
```

**코드 예시**:
```kotlin
// ===== Domain Layer (외부 의존성 없음) =====
// 순수한 비즈니스 객체
data class User(
    val id: Long?,
    val email: String,
    val name: String
) {
    fun validateEmail() {
        require(email.contains("@")) { "Invalid email format" }
    }
}

// ===== Application Layer (Ports) =====
// Inbound Port (Use Case 인터페이스)
interface CreateUserUseCase {
    fun createUser(command: CreateUserCommand): User
}

data class CreateUserCommand(
    val email: String,
    val name: String
)

// Outbound Port (저장소 인터페이스 - 기술 독립적)
interface UserPersistencePort {
    fun save(user: User): User
    fun findByEmail(email: String): User?
}

// Use Case 구현
@Service
class UserService(
    private val persistencePort: UserPersistencePort  // 인터페이스에만 의존
) : CreateUserUseCase {

    override fun createUser(command: CreateUserCommand): User {
        // 비즈니스 로직
        val user = User(
            id = null,
            email = command.email,
            name = command.name
        )
        user.validateEmail()

        // 저장 (어떤 DB인지 모름)
        return persistencePort.save(user)
    }
}

// ===== Adapter Layer (Inbound) =====
@RestController
@RequestMapping("/api/users")
class UserController(
    private val createUserUseCase: CreateUserUseCase  // Use Case에만 의존
) {
    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): UserResponse {
        val command = CreateUserCommand(
            email = request.email,
            name = request.name
        )
        val user = createUserUseCase.createUser(command)
        return user.toResponse()
    }
}

// ===== Adapter Layer (Outbound) =====
// JPA Entity (Infrastructure 관심사)
@Entity
@Table(name = "users")
data class UserJpaEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val email: String,
    val name: String
)

// JPA Repository
interface UserJpaRepository : JpaRepository<UserJpaEntity, Long> {
    fun findByEmail(email: String): UserJpaEntity?
}

// Persistence Adapter (Port 구현)
@Component
class UserPersistenceAdapter(
    private val jpaRepository: UserJpaRepository
) : UserPersistencePort {

    override fun save(user: User): User {
        val entity = UserJpaEntity(
            id = user.id,
            email = user.email,
            name = user.name
        )
        val saved = jpaRepository.save(entity)
        return saved.toDomain()
    }

    override fun findByEmail(email: String): User? {
        return jpaRepository.findByEmail(email)?.toDomain()
    }
}

// Mapper
fun UserJpaEntity.toDomain() = User(
    id = this.id,
    email = this.email,
    name = this.name
)
```

**장점**:
- ✅ 비즈니스 로직이 인프라에 독립적 (DB, 프레임워크 변경 용이)
- ✅ 테스트하기 쉬움 (Port만 모킹하면 됨)
- ✅ 복잡한 비즈니스 로직을 표현하기 좋음
- ✅ 도메인 중심 설계 (DDD와 잘 어울림)
- ✅ 외부 시스템을 쉽게 교체 가능 (H2 → MySQL, REST → GraphQL)

**단점**:
- ❌ 초기 설정이 복잡함 (보일러플레이트 코드 증가)
- ❌ 러닝 커브가 높음
- ❌ 작은 프로젝트에는 과도한 설계
- ❌ 도메인과 인프라 객체 간 매핑 비용

---

### 아키텍처 비교표

| 특징 | 레이어드 아키텍처 | 헥사고날 아키텍처 |
|------|------------------|------------------|
| **의존성 방향** | 상위 → 하위 (단방향) | 외부 → 내부 (Domain 중심) |
| **핵심** | 계층 분리 | 비즈니스 로직 보호 |
| **복잡도** | 낮음 | 높음 |
| **테스트 용이성** | 보통 | 높음 |
| **유연성** | 낮음 | 높음 |
| **적합한 프로젝트** | 작은~중간 규모, CRUD 중심 | 중간~대규모, 복잡한 비즈니스 로직 |
| **러닝 커브** | 낮음 | 높음 |
| **인프라 독립성** | 낮음 (DB 의존적) | 높음 (인프라 교체 용이) |

**선택 가이드**:
- **레이어드 아키텍처를 선택하는 경우**:
  - CRUD 중심의 간단한 애플리케이션
  - 빠른 개발이 필요한 경우
  - 팀원의 Spring 경험이 풍부하지만 DDD 경험이 부족한 경우

- **헥사고날 아키텍처를 선택하는 경우**:
  - 복잡한 비즈니스 로직을 가진 도메인
  - 외부 시스템 통합이 많은 경우
  - 장기적인 유지보수와 확장성이 중요한 경우
  - 높은 테스트 커버리지가 필요한 경우

### 도메인 모델링 (Domain Modeling)
**정의**: 비즈니스 도메인의 개념을 코드로 표현하는 과정

**Kotlin data class 활용**:
```kotlin
// Entity: 데이터베이스 테이블과 매핑되는 영속성 객체
@Entity
@Table(name = "users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    val name: String,

    @CreatedDate
    val createdAt: LocalDateTime = LocalDateTime.now()
)

// DTO (Data Transfer Object): 계층 간 데이터 전달 객체
data class UserCreateRequest(
    val email: String,
    val name: String
) {
    fun toEntity() = User(email = email, name = name)
}

data class UserResponse(
    val id: Long,
    val email: String,
    val name: String
)
```

**Entity vs DTO 분리 이유**:
- Entity는 데이터베이스 스키마와 강하게 결합
- DTO는 API 스펙과 결합하여 클라이언트 요구사항에 맞게 변경 가능
- 분리를 통해 각각 독립적으로 변경 가능 (단일 책임 원칙)

### 패키지 구조 전략

**1. Layer-based (계층 기반)**
```
src/main/kotlin/com/example/
├── controller/
│   ├── UserController.kt
│   └── OrderController.kt
├── service/
│   ├── UserService.kt
│   └── OrderService.kt
└── repository/
    ├── UserRepository.kt
    └── OrderRepository.kt
```
- **장점**: 계층별 역할이 명확, 작은 프로젝트에 적합
- **단점**: 도메인이 분산되어 응집도 낮음

**2. Feature-based (기능 기반)**
```
src/main/kotlin/com/example/
├── user/
│   ├── UserController.kt
│   ├── UserService.kt
│   ├── UserRepository.kt
│   └── User.kt
└── order/
    ├── OrderController.kt
    ├── OrderService.kt
    ├── OrderRepository.kt
    └── Order.kt
```
- **장점**: 높은 응집도, 도메인별 독립적 개발 가능
- **단점**: 공통 코드 관리 필요

## 기술 스택 선정

### 핵심 의존성 설명
```kotlin
// build.gradle.kts 예시
plugins {
    kotlin("jvm") version "1.9.0"                    // Kotlin JVM 플러그인
    kotlin("plugin.spring") version "1.9.0"          // Spring 지원 (open class 자동화)
    kotlin("plugin.jpa") version "1.9.0"             // JPA 지원 (no-arg 생성자 자동화)
    id("org.springframework.boot") version "3.2.0"   // Spring Boot 플러그인
}

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")        // RESTful API
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")   // JPA/Hibernate

    // Kotlin 지원
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")     // JSON 직렬화
    implementation("org.jetbrains.kotlin:kotlin-reflect")                     // Reflection

    // 테스트
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.mockk:mockk:1.13.8")                              // Kotlin Mocking
}
```

**주요 플러그인 설명**:
- `kotlin("plugin.spring")`: Kotlin 클래스는 기본적으로 final인데, Spring은 CGLIB 프록시를 위해 open 클래스가 필요. 이 플러그인이 @Component, @Service 등이 붙은 클래스를 자동으로 open으로 만듦
- `kotlin("plugin.jpa")`: JPA Entity는 no-arg 생성자가 필요한데, Kotlin data class는 생성자 파라미터가 필수. 이 플러그인이 자동으로 no-arg 생성자를 생성

## API 설계

### RESTful API 설계 원칙
**REST (Representational State Transfer)**: HTTP 프로토콜의 특성을 활용한 아키텍처 스타일

**HTTP 메서드별 용도**:
- `GET`: 리소스 조회 (안전, 멱등성)
- `POST`: 리소스 생성
- `PUT`: 리소스 전체 수정 (멱등성)
- `PATCH`: 리소스 부분 수정
- `DELETE`: 리소스 삭제 (멱등성)

**API 엔드포인트 설계 예시**:
```
GET    /api/users          # 사용자 목록 조회
GET    /api/users/{id}     # 특정 사용자 조회
POST   /api/users          # 사용자 생성
PUT    /api/users/{id}     # 사용자 전체 수정
PATCH  /api/users/{id}     # 사용자 부분 수정
DELETE /api/users/{id}     # 사용자 삭제
```

### Sealed Class를 활용한 응답 타입 설계
**Sealed Class**: 제한된 하위 클래스만 가질 수 있는 추상 클래스 (ADT - Algebraic Data Type)

```kotlin
// API 응답을 성공/실패로 명확히 구분
sealed class ApiResponse<out T> {
    data class Success<T>(val data: T) : ApiResponse<T>()
    data class Error(val code: String, val message: String) : ApiResponse<Nothing>()
}

// 사용 예시
fun getUser(id: Long): ApiResponse<UserResponse> {
    return try {
        val user = userService.getUser(id)
        ApiResponse.Success(user.toResponse())
    } catch (e: NotFoundException) {
        ApiResponse.Error("NOT_FOUND", "사용자를 찾을 수 없습니다")
    }
}

// when 표현식으로 타입 안전하게 처리
when (val response = getUser(1L)) {
    is ApiResponse.Success -> println(response.data)
    is ApiResponse.Error -> println(response.message)
    // 컴파일러가 모든 케이스를 체크 (exhaustive check)
}
```