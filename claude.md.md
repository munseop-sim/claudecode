# claude.md
- `claude.md` 파일은 Claude Code에서 프로젝트별 설정과 컨텍스트를 저장하는 파일
- `/init` 명령어로 생성되며, 프로젝트의 중요한 정보를 담아 Claude가 더 효과적으로 작업할 수 있도록 도움  
- 프로젝트를 진행하고 지속적으로 프로젝트가 변화함에 따라 지속적으로 업데이트를 해주어야 한다.

## 주요 역할:
- 프로젝트 컨텍스트: 프로젝트에 대한 설명, 아키텍처, 중요한 파일 위치 등
- 빌드/테스트 명령어: npm run build, npm test 등 자주 사용하는 명령어 저장
- 코딩 가이드라인: 프로젝트의 코드 스타일, 네이밍 규칙 등
- 중요한 정보: API 엔드포인트, 환경 변수 설명, 배포 프로세스 등

## 권장 구조
```
root/   
├── claude.md              # 전체 프로젝트 개요  
├── frontend/  
│   └── claude.md          # 프론트엔드 특화 정보  
├── backend/  
│   └── claude.md          # 백엔드 특화 정보    
└── shared/  
└── claude.md          # 공유 라이브러리 정보  
```
### 각 모듈별 claude.md의 장점:
- 모듈별 특화 정보: 각 모듈의 고유한 빌드 명령어, 테스트 방법, 배포 프로세스
- 컨텍스트 정확성: Claude가 현재 작업 중인 모듈에 맞는 정보만 참조
- 팀 협업: 각 팀이 자신의 모듈 정보를 독립적으로 관리
- 유지보수성: 모듈별로 정보를 분리하여 관리가 용이

## 루트 claude.md vs 모듈별 claude.md:
- 루트: 전체 아키텍처, 모듈 간 관계, 공통 규칙
- 모듈별: 해당 모듈의 구체적인 개발/배포 가이드

## Claude는 현재 작업 디렉토리의 claude.md를 우선적으로 참조하므로, 이런 구조가 매우 효과적

# Spring, Kotlin tip
Spring Kotlin 프로젝트용 Claude.md 작성 가이드

📝 기본 구조

# 프로젝트명

## 개요
- 프로젝트 목적과 주요 기능
- Spring Boot + Kotlin + JPA 기반 REST API

## 기술 스택
- Kotlin 1.9.x
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL/MySQL
- Gradle

## 빠른 시작

  아키텍처
```
  src/main/kotlin/
  ├── controller/    # REST 컨트롤러
  ├── service/       # 비즈니스 로직
  ├── repository/    # 데이터 액세스
  ├── entity/        # JPA 엔티티
  ├── dto/          # 데이터 전송 객체
  ├── config/       # 설정 클래스
  └── exception/    # 예외 처리
```
  명령어

  - ./gradlew bootRun - 개발 서버 시작
  - ./gradlew test - 테스트 실행
  - ./gradlew build - 빌드
  - ./gradlew ktlintCheck - 코드 스타일 검사
  - ./gradlew ktlintFormat - 코드 포맷팅

  ## 🎯 Spring Kotlin 특화 팁

  ### 1. **Gradle 명령어 중심**
  
  ## 명령어
  - `./gradlew bootRun` - 개발 서버 시작 (포트: 8080)
  - `./gradlew test` - 전체 테스트 실행
  - `./gradlew testClasses --tests="*Service*"` - 서비스 테스트만 실행
  - `./gradlew build` - JAR 파일 빌드
  - `./gradlew ktlintCheck` - Kotlin 린트 검사
  - `./gradlew ktlintFormat` - 코드 자동 포맷팅
  - `./gradlew flywayMigrate` - DB 마이그레이션 실행

  2. Spring 아키텍처 구조

  ## 패키지 구조
```
  com.company.project/
  ├── controller/           # @RestController
  │   ├── UserController    # /api/users
  │   └── ProductController # /api/products
  ├── service/             # @Service│   ├── UserService
  │   └── ProductService
  ├── repository/          # @Repository (JPA)
  │   ├── UserRepository
  │   └── ProductRepository├── entity/             # @Entity
  │   ├── User
  │   └── Product
  ├── dto/               # 요청/응답 DTO
  │   ├── request/
  │   └── response/
  ├── config/           # @Configuration
  │   ├── SecurityConfig
  │   ├── JpaConfig
  │   └── WebConfig
  └── exception/       # 예외 처리
      ├── GlobalExceptionHandler
      └── CustomException
```

  3. 환경 설정

  ## 환경 설정
  - JDK 17+
  - Kotlin 1.9+
  - Spring Boot 3.x

  ### 환경변수
  - `DB_HOST` - 데이터베이스 호스트
  - `DB_NAME` - 데이터베이스 명
  - `DB_USERNAME` - DB 사용자명
  - `DB_PASSWORD` - DB 비밀번호
  - `JWT_SECRET` - JWT 시크릿 키

  ### 프로파일
  - `local` - 로컬 개발 (H2 DB)
  - `dev` - 개발 서버
  - `prod` - 운영 서버

  🚀 Spring Kotlin Best Practices

  ## 코딩 가이드라인

  ### 네이밍 규칙
  - 클래스: PascalCase (`UserService`, `ProductController`)
  - 함수/변수: camelCase (`findByUserId`, `userName`)
  - 상수: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
  - 패키지: 소문자 + 점 (`com.company.user.service`)

  ### Kotlin 스타일
  - data class 적극 활용
  - nullable 타입 명시적 처리
  - extension function 활용
  - 코루틴 사용 시 suspend fun

  ### Spring 어노테이션
  - `@RestController` - REST API 컨트롤러
  - `@Service` - 비즈니스 로직
  - `@Repository` - 데이터 액세스
  - `@Entity` - JPA 엔티티
  - `@Transactional` - 트랜잭션 처리

  자주 사용하는 패턴

  ## 자주 사용하는 패턴

  ### 컨트롤러 생성
  ```kotlin
  @RestController
  @RequestMapping("/api/users")
  class UserController(
      private val userService: UserService
  ) {
      @GetMapping("/{id}")
      fun getUser(@PathVariable id: Long): ResponseEntity<UserResponse> {
          return ResponseEntity.ok(userService.findById(id))
      }
  }

  서비스 레이어

  @Service
  @Transactional
  class UserService(
      private val userRepository: UserRepository
  ) {
      fun findById(id: Long): UserResponse {
          val user = userRepository.findByIdOrNull(id)
              ?: throw UserNotFoundException("User not found: $id")
          return UserResponse.from(user)
      }
  }

  JPA Repository

  @Repository
  interface UserRepository : JpaRepository<User, Long> {
      fun findByEmail(email: String): User?
      fun existsByEmail(email: String): Boolean
  }

  엔티티 정의

  @Entity
  @Table(name = "users")
  data class User(
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      val id: Long = 0,

      @Column(nullable = false, unique = true)
      val email: String,

      @Column(nullable = false)
      val name: String,

      @CreationTimestamp
      val createdAt: LocalDateTime = LocalDateTime.now()
  )
```
  ### **테스트 패턴**
  ## 테스트

  ### 명령어
  - `./gradlew test` - 전체 테스트
  - `./gradlew test --tests="*Controller*"` - 컨트롤러 테스트만
  - `./gradlew test --tests="*Service*"` - 서비스 테스트만
  - `./gradlew test --continuous` - 파일 변경 시 자동 테스트

  ### 테스트 구조
```
  src/test/kotlin/
  ├── controller/     # @WebMvcTest
  ├── service/        # @ExtendWith(MockitoExtension::class)├── repository/     # @DataJpaTest
  └── integration/    # @SpringBootTest
```
  ### 테스트 패턴
  ```kotlin
  // 컨트롤러 테스트
  @WebMvcTest(UserController::class)
  class UserControllerTest {
      @Autowired lateinit var mockMvc: MockMvc
      @MockBean lateinit var userService: UserService
  }

  // 서비스 테스트
  @ExtendWith(MockitoExtension::class)
  class UserServiceTest {
      @Mock lateinit var userRepository: UserRepository
      @InjectMocks lateinit var userService: UserService
  }

  // Repository 테스트
  @DataJpaTest
  class UserRepositoryTest {
      @Autowired lateinit var userRepository: UserRepository
      @Autowired lateinit var testEntityManager: TestEntityManager
  }
```
  ## 💡 멀티모듈 프로젝트 팁

  ### **루트 claude.md (멀티모듈)**
  # 프로젝트명 (멀티모듈)

  ## 모듈 구조
  - `api` - REST API 모듈
  - `core` - 비즈니스 로직
  - `infrastructure` - 외부 연동
  - `common` - 공통 유틸리티

  ## 전체 명령어
  - `./gradlew :api:bootRun` - API 서버 시작
  - `./gradlew test` - 전체 모듈 테스트
  - `./gradlew build` - 전체 빌드

  모듈별 claude.md

  # API 모듈

  ## 역할
  - REST API 엔드포인트 제공
  - 요청/응답 검증
  - 인증/인가 처리

  ## 의존성
  - core 모듈 (비즈니스 로직)
  - common 모듈 (공통 유틸)

  ## 명령어
  - `./gradlew :api:bootRun` - API 서버 시작
  - `./gradlew :api:test` - API 테스트

  🛠️ 추가 도구 설정

  ## 개발 도구

  ### Docker
  ```
  # 로컬 DB 실행
  docker-compose up -d postgres

  # 애플리케이션 컨테이너화
  docker build -t my-app .
  docker run -p 8080:8080 my-app

  데이터베이스 마이그레이션

  - Flyway 사용
  - src/main/resources/db/migration/ 에 SQL 파일 작성
  - V1__Create_user_table.sql 형식

  API 문서

  - SpringDoc OpenAPI 사용
  - Swagger UI: http://localhost:8080/swagger-ui.html
```