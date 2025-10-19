# 명세 작성 및 문서화 : 살아있는 문서 만들기

> **살아있는 문서란?**
> 코드와 함께 자동으로 업데이트되는 문서로, 항상 최신 상태를 유지하는 문서를 의미합니다.
> 코드 주석, API 문서, README 등이 이에 해당합니다.

## 💡 Claude 활용 팁: 문서화

### 1. API 문서 자동 생성
```
프롬프트 예시:
"다음 Controller의 모든 엔드포인트에 Swagger 애노테이션을 추가해줘:

[코드 붙여넣기]

각 파라미터, 응답 코드, 에러 케이스에 대한 설명도 포함해줘."
```

**결과**: 완전한 API 문서화 애노테이션이 추가된 코드

### 2. KDoc 자동 생성
```
프롬프트 예시:
"다음 클래스와 메서드에 KDoc을 작성해줘:

[코드 붙여넣기]

각 파라미터, 반환값, 예외에 대한 설명을 포함해줘."
```

### 3. README 작성
```
프롬프트 예시:
"우리 프로젝트의 README.md를 작성해줘. 다음 정보를 포함해:
- 프로젝트 개요
- 기술 스택 (Spring Boot 3.2, Kotlin 1.9, MySQL, Redis)
- 설치 및 실행 방법
- API 문서 링크
- 환경 변수 설정 방법
- 기여 가이드

개발자가 5분 안에 프로젝트를 이해하고 실행할 수 있도록 작성해줘."
```

### 4. ADR (Architecture Decision Record) 작성
```
프롬프트 예시:
"우리가 레이어드 아키텍처 대신 헥사고날 아키텍처를 선택한 것에 대한
ADR 문서를 작성해줘. 다음 형식으로:

- 상황(Context)
- 결정(Decision)
- 결과(Consequences)
- 대안(Alternatives)"
```

## Swagger/OpenAPI 설정
```kotlin
@Configuration
class SwaggerConfig {
    @Bean
    fun openAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("User API")
                    .version("v1.0.0")
                    .description("사용자 관리 API 문서")
            )
    }
}
```

## API 문서화 애노테이션
```kotlin
@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "사용자 관리 API")
class UserController(
    private val userService: UserService
) {
    @Operation(summary = "사용자 생성", description = "새로운 사용자를 생성합니다")
    @ApiResponses(
        ApiResponse(responseCode = "201", description = "생성 성공"),
        ApiResponse(responseCode = "400", description = "잘못된 요청")
    )
    @PostMapping
    fun createUser(
        @RequestBody @Valid request: UserCreateRequest
    ): ResponseEntity<UserResponse> {
        val user = userService.createUser(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(user.toResponse())
    }
}
```

## Kdoc 작성
```kotlin
/**
 * 사용자 서비스
 *
 * 사용자의 생성, 조회, 수정, 삭제를 담당하는 서비스 클래스입니다.
 *
 * @property userRepository 사용자 저장소
 */
@Service
class UserService(
    private val userRepository: UserRepository
) {
    /**
     * 사용자를 생성합니다.
     *
     * @param request 사용자 생성 요청 정보
     * @return 생성된 사용자 엔티티
     * @throws IllegalArgumentException 이메일 형식이 올바르지 않을 경우
     */
    fun createUser(request: UserCreateRequest): User {
        validateEmail(request.email)
        return userRepository.save(request.toEntity())
    }
}
```

## Spring REST Docs로 테스트 기반 문서화
```kotlin
@SpringBootTest
@AutoConfigureRestDocs
class UserApiDocumentationTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun `사용자 생성 API 문서화`() {
        mockMvc.perform(
            post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email": "test@example.com", "name": "Test User"}""")
        )
            .andExpect(status().isCreated)
            .andDo(
                document(
                    "user-create",
                    requestFields(
                        fieldWithPath("email").description("사용자 이메일"),
                        fieldWithPath("name").description("사용자 이름")
                    ),
                    responseFields(
                        fieldWithPath("id").description("사용자 ID"),
                        fieldWithPath("email").description("사용자 이메일"),
                        fieldWithPath("name").description("사용자 이름")
                    )
                )
            )
    }
}
```

## README.md 템플릿
```markdown
# Project Name

## 기술 스택
- Kotlin 1.9.0
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database

## 실행 방법
```bash
./gradlew bootRun
```

## API 문서
http://localhost:8080/swagger-ui.html

## 테스트 실행
```bash
./gradlew test
```
```