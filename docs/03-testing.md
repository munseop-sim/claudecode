# 테스트 : 클로드 코드와 함께하는 TDD

> **TDD (Test-Driven Development)**
> 테스트를 먼저 작성하고, 테스트를 통과하는 코드를 작성하는 개발 방법론입니다.

## 💡 Claude 활용 팁: TDD

### 1. 테스트 케이스 생성
```
프롬프트 예시:
"UserService 클래스의 createUser 메서드에 대한 테스트를 작성해줘.
다음 케이스들을 포함해줘:
- 정상적인 사용자 생성
- 중복된 이메일로 생성 시도 (예외 발생 예상)
- 유효하지 않은 이메일 형식 (예외 발생 예상)
- null 값 전달 시 처리

Mockk를 사용해서 작성해줘."
```

**Claude가 생성하는 것**:
- 모든 엣지 케이스를 포함한 완전한 테스트 스위트
- given-when-then 패턴으로 구조화
- 적절한 assertion과 verification

### 2. 테스트 커버리지 분석
```
프롬프트 예시:
"다음 UserService 코드를 보고, 누락된 테스트 케이스를 찾아줘:

[코드 붙여넣기]

그리고 누락된 케이스에 대한 테스트를 작성해줘."
```

### 3. 통합 테스트 시나리오 작성
```
프롬프트 예시:
"주문 생성 API의 통합 테스트를 작성해줘.
시나리오:
1. 사용자가 로그인한다
2. 장바구니에 상품을 추가한다
3. 주문을 생성한다
4. 재고가 차감되는지 확인한다
5. 주문 상태가 올바른지 확인한다

MockMvc를 사용하고, 각 단계를 명확히 구분해줘."
```

### 4. 테스트 리팩토링
```
프롬프트 예시:
"다음 테스트 코드에 중복이 많아. @BeforeEach를 활용해서 리팩토링해줘:

[테스트 코드 붙여넣기]"
```

## 단위 테스트 (JUnit 5 + Kotest)
```kotlin
@Test
fun `사용자 생성 시 이메일 형식이 올바르지 않으면 예외가 발생한다`() {
    // given
    val invalidEmail = "invalid-email"

    // when & then
    assertThrows<IllegalArgumentException> {
        User(email = invalidEmail, name = "Test User")
    }
}
```

## 통합 테스트 (Spring Boot Test)
```kotlin
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `사용자 등록 API 테스트`() {
        // given
        val request = UserCreateRequest(
            email = "test@example.com",
            name = "Test User"
        )

        // when & then
        mockMvc.perform(
            post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.email").value("test@example.com"))
    }
}
```

## Repository 테스트 (@DataJpaTest)
```kotlin
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Test
    fun `이메일로 사용자를 조회할 수 있다`() {
        // given
        val user = User(email = "test@example.com", name = "Test")
        userRepository.save(user)

        // when
        val found = userRepository.findByEmail("test@example.com")

        // then
        assertThat(found).isNotNull
        assertThat(found?.email).isEqualTo("test@example.com")
    }
}
```

## Mockk를 활용한 Mocking
```kotlin
@Test
fun `서비스 계층 테스트 - Repository Mock`() {
    // given
    val userRepository = mockk<UserRepository>()
    val userService = UserService(userRepository)

    every { userRepository.findById(any()) } returns Optional.of(
        User(id = 1L, email = "test@example.com", name = "Test")
    )

    // when
    val user = userService.getUser(1L)

    // then
    assertThat(user.email).isEqualTo("test@example.com")
    verify(exactly = 1) { userRepository.findById(1L) }
}
```