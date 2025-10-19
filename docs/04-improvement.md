# 개선 : 코드리뷰, 리팩토링, 성능 최적화

> **코드 개선의 중요성**
> 작동하는 코드를 작성하는 것도 중요하지만, 읽기 쉽고 유지보수하기 좋은 코드로
> 지속적으로 개선하는 것이 장기적으로 더 중요합니다.

## 💡 Claude 활용 팁: 코드 개선

### 1. 코드 리뷰 요청
```
프롬프트 예시:
"다음 코드를 리뷰해줘. 개선할 점을 찾아줘:

[코드 붙여넣기]

특히 다음 관점에서 봐줘:
- Kotlin 관용구 적용 여부
- 불필요한 코드나 중복
- 성능 이슈
- 가독성"
```

**Claude의 리뷰 내용**:
- 구체적인 개선 포인트 지적
- Before/After 코드 제시
- 개선 이유 설명

### 2. 리팩토링 제안 받기
```
프롬프트 예시:
"이 코드가 너무 길고 복잡해. 리팩토링해줘:

[코드 붙여넣기]

읽기 쉽고 테스트하기 좋게 만들어줘."
```

### 3. 성능 최적화
```
프롬프트 예시:
"다음 코드에서 성능 병목이 있을까? 있다면 최적화 방법을 제안해줘:

[코드 붙여넣기]

특히 N+1 문제나 불필요한 쿼리가 있는지 확인해줘."
```

### 4. Kotlin 스타일 가이드 적용
```
프롬프트 예시:
"Java 스타일로 작성된 Kotlin 코드야. Kotlin 스타일로 리팩토링해줘:

[코드 붙여넣기]

scope functions (let, apply, run 등)도 적절히 활용해줘."
```

## Kotlin 관용적 코드로 리팩토링

### Before (Java 스타일)
```kotlin
fun getUser(id: Long): User? {
    val user = userRepository.findById(id)
    if (user.isPresent) {
        return user.get()
    } else {
        return null
    }
}
```

### After (Kotlin 스타일)
```kotlin
fun getUser(id: Long): User? =
    userRepository.findById(id).orElse(null)
```

## N+1 문제 해결
```kotlin
interface UserRepository : JpaRepository<User, Long> {
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    fun findByIdWithOrders(id: Long): User?
}
```

## Kotlin DSL 활용
```kotlin
// QueryDSL with Kotlin
fun searchUsers(condition: UserSearchCondition): List<User> {
    return queryFactory
        .selectFrom(user)
        .where(
            emailContains(condition.email),
            nameContains(condition.name)
        )
        .fetch()
}

private fun emailContains(email: String?): BooleanExpression? {
    return email?.let { user.email.contains(it) }
}
```

## 코루틴을 활용한 비동기 처리
```kotlin
@Service
class AsyncUserService(
    private val userRepository: UserRepository
) {
    suspend fun getAllUsersAsync(): List<User> = withContext(Dispatchers.IO) {
        userRepository.findAll()
    }

    suspend fun getUsersByIds(ids: List<Long>): List<User> = coroutineScope {
        ids.map { id ->
            async { userRepository.findById(id).orElse(null) }
        }.awaitAll().filterNotNull()
    }
}
```

## 성능 모니터링
```kotlin
@Aspect
@Component
class PerformanceAspect {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Around("@annotation(org.springframework.web.bind.annotation.GetMapping)")
    fun logExecutionTime(joinPoint: ProceedingJoinPoint): Any? {
        val start = System.currentTimeMillis()
        val result = joinPoint.proceed()
        val executionTime = System.currentTimeMillis() - start
        logger.info("${joinPoint.signature} executed in ${executionTime}ms")
        return result
    }
}
```