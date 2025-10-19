# 부트스트래핑 : 프로젝트 초기 구성 자동화

> **부트스트래핑이란?**
> 프로젝트를 시작할 때 필요한 초기 설정, 디렉토리 구조, 공통 컴포넌트 등을 자동화하여
> 반복적인 작업을 줄이고 빠르게 개발을 시작할 수 있도록 하는 과정입니다.

## 💡 Claude 활용 팁: 부트스트래핑

### 1. 프로젝트 초기 구조 생성
```
프롬프트 예시:
"Spring Boot 3.2, Kotlin 1.9, Gradle로 전자상거래 프로젝트를 시작하려고 해.
다음 기능이 필요해:
- 사용자 인증 (JWT)
- RESTful API
- JPA (MySQL)
- Redis 캐싱
- Swagger 문서화

build.gradle.kts 파일과 application.yml 설정을 만들어줘.
그리고 프로젝트 패키지 구조도 제안해줘."
```

**Claude가 생성해주는 것**:
- 완전한 build.gradle.kts (모든 필요한 의존성 포함)
- 환경별 application.yml (dev, prod)
- 디렉토리 구조
- 초기 Configuration 클래스들

### 2. 공통 컴포넌트 일괄 생성
```
프롬프트 예시:
"Spring Boot + Kotlin 프로젝트에 다음 공통 컴포넌트를 만들어줘:
1. BaseEntity (createdAt, updatedAt, createdBy, updatedBy)
2. GlobalExceptionHandler (표준 에러 처리)
3. ApiResponse wrapper (success, data, error 구조)
4. Custom 예외 클래스들 (NotFoundException, BadRequestException 등)

모두 Kotlin 스타일로 작성해줘."
```

**시간 절약**: 수동으로 30분 걸릴 작업을 1분 안에 완성

### 3. Docker 환경 설정
```
프롬프트 예시:
"개발 환경을 위한 docker-compose.yml을 만들어줘.
필요한 서비스:
- MySQL 8.0
- Redis 7.0
- Spring Boot 애플리케이션

그리고 Dockerfile도 multi-stage build로 최적화해서 만들어줘."
```

## Spring Boot 프로젝트 초기화

### Spring Initializr 사용
**Spring Initializr**: Spring 프로젝트의 기본 구조와 의존성을 자동으로 생성해주는 웹 서비스

```bash
# CLI로 프로젝트 생성
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,validation \
  -d language=kotlin \
  -d type=gradle-project \
  -d bootVersion=3.2.0 \
  -d groupId=com.example \
  -d artifactId=myapp \
  -o project.zip

# 압축 해제
unzip project.zip -d myapp
cd myapp
```

**웹 UI 사용**: https://start.spring.io

**주요 의존성 설명**:
- `web`: Spring MVC, REST API 개발을 위한 스타터
- `data-jpa`: JPA/Hibernate를 사용한 데이터베이스 접근
- `validation`: Bean Validation을 통한 입력 검증

## 필수 설정 파일 생성

### application.yml
**application.yml**: Spring Boot 애플리케이션의 설정을 정의하는 파일

```yaml
spring:
  # 데이터소스 설정
  datasource:
    url: jdbc:h2:mem:testdb              # H2 인메모리 DB 사용
    driver-class-name: org.h2.Driver
    username: sa
    password:

  # JPA/Hibernate 설정
  jpa:
    hibernate:
      ddl-auto: create-drop              # 애플리케이션 시작 시 테이블 생성, 종료 시 삭제
    show-sql: true                       # SQL 쿼리 로그 출력
    properties:
      hibernate:
        format_sql: true                 # SQL 포맷팅
        use_sql_comments: true           # 쿼리에 주석 추가

  # H2 콘솔 활성화
  h2:
    console:
      enabled: true
      path: /h2-console

# 로깅 설정
logging:
  level:
    org.hibernate.SQL: DEBUG             # SQL 쿼리 로그
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE  # 바인딩 파라미터 로그
```

**ddl-auto 옵션**:
- `none`: 아무것도 하지 않음
- `validate`: 엔티티와 테이블이 정상적으로 매핑되어 있는지만 확인
- `update`: 엔티티 변경사항을 테이블에 반영
- `create`: 애플리케이션 시작 시 테이블 재생성
- `create-drop`: 애플리케이션 종료 시 테이블 삭제

### 프로파일별 설정
```yaml
# application-dev.yml (개발 환경)
spring:
  datasource:
    url: jdbc:h2:mem:devdb
  jpa:
    hibernate:
      ddl-auto: create-drop

# application-prod.yml (운영 환경)
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/prod
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
```

### Kotlin 코드 스타일 설정
`.editorconfig` 파일을 통해 팀 전체의 코드 스타일을 통일

```
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{kt,kts}]
indent_size = 4
continuation_indent_size = 4
max_line_length = 120
```

## 공통 컴포넌트 생성

### 1. 전역 예외 처리 (Global Exception Handler)
**@RestControllerAdvice**: 모든 Controller에서 발생하는 예외를 한 곳에서 처리

```kotlin
@RestControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(javaClass)

    // 잘못된 인자 예외
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(e: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        logger.warn("Invalid argument: ${e.message}")
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(
                code = "INVALID_ARGUMENT",
                message = e.message ?: "잘못된 요청입니다"
            ))
    }

    // 리소스를 찾을 수 없음
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(e: NoSuchElementException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(
                code = "NOT_FOUND",
                message = e.message ?: "리소스를 찾을 수 없습니다"
            ))
    }

    // Bean Validation 실패
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(e: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val errors = e.bindingResult.fieldErrors
            .associate { it.field to (it.defaultMessage ?: "유효하지 않은 값입니다") }

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(
                code = "VALIDATION_FAILED",
                message = "입력값 검증에 실패했습니다",
                details = errors
            ))
    }

    // 기타 모든 예외
    @ExceptionHandler(Exception::class)
    fun handleGeneral(e: Exception): ResponseEntity<ErrorResponse> {
        logger.error("Unexpected error occurred", e)
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse(
                code = "INTERNAL_ERROR",
                message = "서버 오류가 발생했습니다"
            ))
    }
}

// 에러 응답 DTO
data class ErrorResponse(
    val code: String,
    val message: String,
    val details: Map<String, String>? = null,
    val timestamp: LocalDateTime = LocalDateTime.now()
)
```

### 2. Base Entity (공통 엔티티 추상 클래스)
생성일시, 수정일시 등 모든 엔티티에 공통으로 들어가는 필드를 추상 클래스로 정의

```kotlin
@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()

    @LastModifiedDate
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
}

// 사용 예시
@Entity
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val email: String,
    val name: String
) : BaseEntity()  // BaseEntity 상속

// Application 클래스에 @EnableJpaAuditing 추가 필요
@SpringBootApplication
@EnableJpaAuditing
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
```

### 3. Response Wrapper (일관된 API 응답 형식)
```kotlin
data class ApiResult<T>(
    val success: Boolean,
    val data: T? = null,
    val error: ErrorInfo? = null,
    val timestamp: LocalDateTime = LocalDateTime.now()
) {
    companion object {
        fun <T> success(data: T) = ApiResult(
            success = true,
            data = data
        )

        fun <T> error(code: String, message: String) = ApiResult<T>(
            success = false,
            error = ErrorInfo(code, message)
        )
    }
}

data class ErrorInfo(
    val code: String,
    val message: String
)

// 사용 예시
@GetMapping("/{id}")
fun getUser(@PathVariable id: Long): ApiResult<UserResponse> {
    val user = userService.getUser(id)
    return ApiResult.success(user.toResponse())
}
```