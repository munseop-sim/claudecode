## 개요
- hooks: 특정 이벤트 발생 시 자동으로 실행되는 쉘 명령어를 설정하여 워크플로우를 자동화
- output-style: 클로드 코드의 출력 형식을 커스터마이징하여 프로젝트나 팀의 요구사항에 맞게 조정

## hooks
### 동작 및 설정

hooks는 클로드 코드의 특정 이벤트에 반응하여 쉘 명령어를 실행하는 기능입니다.
`~/.config/claude-code/settings.json`에서 설정할 수 있습니다.

**기본 구조:**
```json
{
  "hooks": {
    "onBeforeWriteFile": ["echo 'Writing: ${file_path}'"],
    "onAfterEditFile": ["./gradlew ktlintFormat --quiet"]
  }
}
```

**주요 특징:**
- 여러 명령어를 순차 실행 가능 (배열 형태)
- 클로드 코드 전용 변수 사용 가능 (예: `${file_path}`, `${cwd}`, `${prompt}`)
  - 이 변수들은 **클로드 코드가 쉘 명령어 실행 전에 실제 값으로 치환**합니다
  - 쉘 변수가 아닌 클로드 코드의 플레이스홀더입니다
- 명령어 실패 시 작업이 차단됨
- 차단 메시지를 통해 클로드에게 피드백 제공

**변수 치환 예시:**
```json
{
  "hooks": {
    "onAfterEditFile": ["echo 'Edited: ${file_path}'"]
  }
}
```
실제 실행 시: `echo 'Edited: /Users/username/project/src/Main.kt'`

### 이벤트

클로드 코드는 다음 이벤트를 지원합니다:

#### 1. onBeforeWriteFile
파일을 생성하거나 덮어쓰기 전에 실행됩니다.

**사용 가능한 변수 (클로드 코드가 자동 치환):**
- `${file_path}`: 작성할 파일의 절대 경로 (예: `/Users/user/project/src/User.kt`)
- `${cwd}`: 현재 작업 디렉토리 (예: `/Users/user/project`)

**실무 활용 예시:**

```json
{
  "hooks": {
    "onBeforeWriteFile": [
      "# 멀티모듈 구조 검증 - 도메인 모듈에만 엔티티 작성 허용",
      "if [[ '${file_path}' == *'/domain/'*'Entity.kt' ]] || [[ '${file_path}' == *'/domain/model/'* ]]; then exit 0; elif [[ '${file_path}' == *'Entity.kt' ]]; then echo 'Error: Entity files must be in domain module'; exit 1; fi",

      "# 테스트 파일 네이밍 규칙 검증",
      "if [[ '${file_path}' == *'/test/'* ]] && [[ '${file_path}' == *'.kt' ]] && [[ '${file_path}' != *'Test.kt' ]] && [[ '${file_path}' != *'Fixture.kt' ]]; then echo 'Error: Test files must end with Test.kt or Fixture.kt'; exit 1; fi"
    ]
  }
}
```

#### 2. onAfterEditFile
파일 편집 후 실행됩니다.

**사용 가능한 변수 (클로드 코드가 자동 치환):**
- `${file_path}`: 편집된 파일의 절대 경로 (예: `/Users/user/project/src/User.kt`)
- `${cwd}`: 현재 작업 디렉토리 (예: `/Users/user/project`)

**실무 활용 예시:**

```json
{
  "hooks": {
    "onAfterEditFile": [
      "# Kotlin 코드 포맷팅 (ktlint)",
      "./gradlew ktlintFormat -PktlintFiles='${file_path}' --quiet",

      "# 변경된 파일이 adapter 레이어면 해당 모듈 테스트 실행",
      "if [[ '${file_path}' == *'/adapter/'* ]]; then MODULE=$(echo '${file_path}' | sed -E 's|.*/([^/]+)/src/.*|\\1|'); ./gradlew :$MODULE:test --tests '*AdapterTest' --quiet; fi",

      "# import 최적화",
      "./gradlew :optimizeImports -PfilePath='${file_path}' --quiet"
    ]
  }
}
```

#### 3. onAfterWriteFile
파일 생성/덮어쓰기 후 실행됩니다.

**사용 가능한 변수 (클로드 코드가 자동 치환):**
- `${file_path}`: 생성/덮어쓴 파일의 절대 경로 (예: `/Users/user/project/src/User.kt`)
- `${cwd}`: 현재 작업 디렉토리 (예: `/Users/user/project`)

**실무 활용 예시:**

```json
{
  "hooks": {
    "onAfterWriteFile": [
      "# 새 Kotlin 파일에 자동으로 저작권 헤더 추가",
      "if [[ '${file_path}' == *'.kt' ]] && ! grep -q 'Copyright' '${file_path}'; then sed -i '1i/*\\n * Copyright (c) 2025 Company Name\\n */' '${file_path}'; fi",

      "# 새 모듈 생성 시 자동으로 의존성 업데이트",
      "if [[ '${file_path}' == *'build.gradle.kts' ]]; then ./gradlew dependencies --quiet; fi",

      "# Kotlin 포맷팅",
      "./gradlew ktlintFormat -PktlintFiles='${file_path}' --quiet"
    ]
  }
}
```

#### 4. onUserPromptSubmit
사용자가 프롬프트를 제출한 직후 실행됩니다.

**사용 가능한 변수 (클로드 코드가 자동 치환):**
- `${prompt}`: 사용자가 입력한 프롬프트 텍스트 (예: `"Add user authentication"`)
- `${cwd}`: 현재 작업 디렉토리 (예: `/Users/user/project`)

**실무 활용 예시:**

```json
{
  "hooks": {
    "onUserPromptSubmit": [
      "# Git 상태가 깨끗한지 확인",
      "if [[ ! -z $(git status -s) ]]; then echo 'Warning: You have uncommitted changes. Consider committing before major refactoring.'; fi",

      "# 프로덕션 데이터 접근 관련 키워드 감지",
      "if echo '${prompt}' | grep -iq 'production\\|prod\\|real.*data'; then echo 'Warning: This prompt mentions production data. Please ensure you are not exposing sensitive information.'; exit 1; fi",

      "# 의존성 추가 요청 시 자동으로 최신 버전 정보 제공",
      "if echo '${prompt}' | grep -iq 'add.*dependency\\|gradle.*implementation'; then echo 'Tip: Check https://mvnrepository.com for latest versions'; fi"
    ]
  }
}
```

### 헥사고날 아키텍처 멀티모듈을 위한 hooks 조합 예시

```json
{
  "hooks": {
    "onBeforeWriteFile": [
      "# 레이어 분리 규칙 검증",
      "LAYER_CHECK=\"./scripts/validate-hexagonal-layer.sh '${file_path}'\"",
      "if ! eval $LAYER_CHECK; then exit 1; fi"
    ],
    "onAfterEditFile": [
      "# 코드 포맷팅",
      "./gradlew ktlintFormat -PktlintFiles='${file_path}' --quiet",

      "# 편집된 파일의 모듈 테스트 실행",
      "MODULE=$(echo '${file_path}' | grep -oP '(?<=modules/)[^/]+' | head -1)",
      "if [ ! -z \"$MODULE\" ]; then ./gradlew :$MODULE:test --tests '*' -x integrationTest --quiet; fi"
    ],
    "onAfterWriteFile": [
      "# 새 파일 생성 시 모듈 의존성 그래프 업데이트",
      "./gradlew projectReport --quiet"
    ],
    "onUserPromptSubmit": [
      "# 안전성 체크",
      "if echo '${prompt}' | grep -iq 'delete.*module\\|remove.*dependency'; then echo 'Warning: Structural changes detected. Make sure to run full test suite after completion.'; fi"
    ]
  }
}
```

### validate-hexagonal-layer.sh 스크립트 예시

```bash
#!/bin/bash
# scripts/validate-hexagonal-layer.sh

FILE_PATH=$1

# Domain 레이어: 외부 의존성 없음
if [[ $FILE_PATH == *"/domain/"* ]]; then
    if grep -q "import.*springframework\|import.*jakarta" "$FILE_PATH"; then
        echo "Error: Domain layer must not depend on frameworks (Spring, Jakarta, etc.)"
        exit 1
    fi
fi

# Application 레이어: Domain만 의존 가능
if [[ $FILE_PATH == *"/application/"* ]]; then
    if grep -q "import.*adapter\|import.*infrastructure" "$FILE_PATH"; then
        echo "Error: Application layer must not depend on adapter or infrastructure"
        exit 1
    fi
fi

# Adapter 레이어: Application과 Domain만 의존 가능
if [[ $FILE_PATH == *"/adapter/"* ]]; then
    if grep -q "import.*infrastructure" "$FILE_PATH" && [[ $FILE_PATH != *"/adapter/infrastructure/"* ]]; then
        echo "Error: Adapter layer should not depend on infrastructure (consider dependency injection)"
        exit 1
    fi
fi

exit 0
```

## output-style

### 내장 output-style 활용

클로드 코드는 기본적으로 여러 내장 output-style을 제공합니다:

- **default**: 기본 출력 스타일
- **concise**: 간결한 출력 (토큰 사용량 감소)
- **verbose**: 상세한 출력 (디버깅에 유용)

**설정 방법:**
```json
{
  "outputStyle": "concise"
}
```

### 커스텀 output-style 생성 및 활용

프로젝트나 팀의 요구사항에 맞는 커스텀 output-style을 생성할 수 있습니다.

**생성 위치:** `~/.config/claude-code/output-styles/[style-name].md`

#### Kotlin Spring 백엔드 개발자를 위한 커스텀 스타일 예시

**파일:** `~/.config/claude-code/output-styles/kotlin-spring-backend.md`

```markdown
# Kotlin Spring Backend Output Style

## Code Style Preferences
- Use Kotlin idioms (data classes, extension functions, scope functions)
- Prefer immutability (val over var)
- Use functional programming patterns where appropriate
- Follow Spring Boot best practices
- Use constructor-based dependency injection

## Architecture Guidelines
- Follow hexagonal architecture principles
- Domain layer: pure Kotlin, no framework dependencies
- Application layer: use cases and ports
- Adapter layer: implementations of ports (REST controllers, JPA repositories, etc.)
- Infrastructure layer: cross-cutting concerns (security, logging, etc.)

## Code Organization
- One class per file
- Group by feature, not by layer
- Keep package structure: [module]/[feature]/[layer]

## Naming Conventions
- UseCase suffix for application services
- Port suffix for interfaces
- Adapter suffix for implementations
- Repository for data access
- Controller for REST endpoints
- Dto for data transfer objects
- Entity for domain models

## Documentation Requirements
- KDoc for public APIs
- Include @param and @return tags
- Add usage examples for complex functions
- Document architectural decisions

## Testing Guidelines
- Use Kotest for unit tests
- Use MockK for mocking
- Follow Given-When-Then pattern
- Test file naming: [ClassName]Test.kt
- Integration tests in separate source set

## Error Handling
- Use Result<T> or Arrow's Either for error handling
- Create custom exception hierarchy
- Use @ControllerAdvice for global exception handling
- Return meaningful error responses

## Dependencies
- Use version catalog (libs.versions.toml)
- Minimize transitive dependencies
- Document why each dependency is needed

## Performance Considerations
- Use lazy initialization where appropriate
- Consider coroutines for async operations
- Use database indexing
- Implement caching strategies

## Code Review Checklist
Before considering code complete, verify:
- [ ] Follows hexagonal architecture
- [ ] No circular dependencies between modules
- [ ] Unit tests with >80% coverage
- [ ] KDoc added to public APIs
- [ ] No hardcoded values (use configuration)
- [ ] Proper exception handling
- [ ] Logging at appropriate levels
- [ ] No commented-out code
```

**사용 방법:**
```json
{
  "outputStyle": "kotlin-spring-backend"
}
```

#### 헥사고날 아키텍처 검증을 위한 output-style

**파일:** `~/.config/claude-code/output-styles/hexagonal-strict.md`

```markdown
# Hexagonal Architecture Strict Mode

## Mandatory Checks Before Any Code Generation

### 1. Layer Dependency Validation
BEFORE writing any code, verify:
- Domain layer imports: ONLY other domain classes
- Application layer imports: domain + application only
- Adapter layer imports: domain, application, and framework specific
- NO reverse dependencies (outer layers cannot be imported by inner layers)

### 2. Module Structure Validation
Ensure the following structure:
```
[module-name]/
├── domain/          # Pure business logic
├── application/     # Use cases & ports
├── adapter/
│   ├── in/          # Driving adapters (REST, GraphQL, etc.)
│   └── out/         # Driven adapters (DB, external APIs, etc.)
└── infrastructure/  # Cross-cutting concerns
```

### 3. Naming Enforcement
- Ports (interfaces): [Action][Resource]Port (e.g., CreateUserPort)
- Adapters: [Framework][Port]Adapter (e.g., JpaCreateUserAdapter)
- Use Cases: [Action][Resource]UseCase (e.g., CreateUserUseCase)
- Domain Models: No suffixes, pure business names

### 4. Dependency Direction
Always verify dependency arrows:
```
Adapter (in) -> Application -> Domain
Adapter (out) <- Application -> Domain
```

### 5. Code Generation Template

When generating new features, follow this order:

#### Step 1: Domain Model
```kotlin
// [module]/domain/model/[Entity].kt
package com.company.module.domain.model

data class User(
    val id: UserId,
    val email: Email,
    val name: UserName
)
```

#### Step 2: Port Definitions
```kotlin
// File: [module]/application/port/out/CreateUserPort.kt
interface CreateUserPort {
    fun create(user: User): User
}

// File: [module]/application/port/in/CreateUserUseCase.kt
interface CreateUserUseCase {
    fun execute(command: CreateUserCommand): User
}
```

#### Step 3: Use Case Implementation
```kotlin
// File: [module]/application/service/CreateUserService.kt
@Service
class CreateUserService(
    private val createUserPort: CreateUserPort
) : CreateUserUseCase {
    override fun execute(command: CreateUserCommand): User {
        // Business logic here
    }
}
```

#### Step 4: Adapters
```kotlin
// File: [module]/adapter/out/persistence/JpaCreateUserAdapter.kt
@Component
class JpaCreateUserAdapter(
    private val repository: UserJpaRepository
) : CreateUserPort {
    override fun create(user: User): User {
        // Framework-specific implementation
    }
}

// File: [module]/adapter/in/web/UserController.kt
@RestController
@RequestMapping("/api/users")
class UserController(
    private val createUserUseCase: CreateUserUseCase
) {
    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): ResponseEntity<UserResponse> {
        // Controller logic
    }
}
```

### 6. Testing Structure
- Domain tests: Pure unit tests, no mocking
- Application tests: Mock ports, test business logic
- Adapter tests: Test framework integration

### 7. Gradle Module Configuration
Each module should have clear dependencies:
```kotlin
// domain module: no external dependencies except Kotlin stdlib
// application module: depends on domain only
// adapter module: depends on application, domain, and frameworks
```

## Output Format
When suggesting code changes:
1. State which layer is being modified
2. Confirm no dependency violations
3. Show the full file path following hexagonal structure
4. Provide complete code (no truncation)
5. List any new dependencies required

## Red Flags to Reject
- Domain importing Spring annotations
- Application importing JPA entities
- Adapter importing other adapter code
- Circular dependencies between modules
```

### 프로젝트 단계별 output-style 설정

프로젝트의 단계나 작업 유형에 따라 output-style을 전환할 수 있습니다.

#### 1. 초기 개발 단계
```json
{
  "outputStyle": "hexagonal-strict"
}
```
- 아키텍처 규칙을 엄격하게 준수
- 구조와 네이밍 검증에 집중

#### 2. 기능 개발 단계
```json
{
  "outputStyle": "kotlin-spring-backend"
}
```
- 생산성과 코드 품질의 균형
- 실용적인 Kotlin 코딩 패턴 적용

#### 3. 리팩토링/최적화 단계
**파일:** `~/.config/claude-code/output-styles/refactoring-focus.md`

```markdown
# Refactoring Focus Output Style

## Primary Goals
- Improve code readability
- Reduce complexity
- Eliminate duplication
- Improve testability
- Optimize performance

## Before Refactoring
- Run all tests and ensure they pass
- Check code coverage
- Review git status (should be clean)

## Refactoring Patterns to Apply
- Extract method for complex logic
- Replace conditional with polymorphism
- Use Kotlin extension functions
- Apply scope functions (let, run, apply, also)
- Convert to data classes where appropriate
- Use sealed classes for state representation

## After Refactoring
- Ensure all tests still pass
- Verify code coverage hasn't decreased
- Run performance benchmarks if applicable
- Update documentation

## Metrics to Track
- Cyclomatic complexity (aim for <10)
- Method length (aim for <20 lines)
- Class size (aim for <300 lines)
- Test coverage (aim for >80%)
```

#### 4. 코드 리뷰 단계
**파일:** `~/.config/claude-code/output-styles/code-review.md`

```markdown
# Code Review Output Style

## Review Checklist

### Architecture
- [ ] Follows hexagonal architecture principles
- [ ] No layer violations
- [ ] Proper separation of concerns
- [ ] No circular dependencies

### Code Quality
- [ ] Follows Kotlin idioms
- [ ] Proper error handling
- [ ] No code duplication
- [ ] Meaningful variable/function names
- [ ] No magic numbers or strings

### Testing
- [ ] Unit tests present and meaningful
- [ ] Integration tests for adapter layer
- [ ] Edge cases covered
- [ ] Test names follow Given-When-Then

### Security
- [ ] Input validation
- [ ] No SQL injection vulnerabilities
- [ ] Sensitive data not logged
- [ ] Proper authentication/authorization

### Performance
- [ ] No N+1 query problems
- [ ] Appropriate use of indexes
- [ ] Lazy loading where appropriate
- [ ] No unnecessary object creation

### Documentation
- [ ] Public APIs documented with KDoc
- [ ] Complex logic explained
- [ ] README updated if needed
- [ ] API documentation updated

## Output Format
For each file reviewed, provide:
1. Summary (1-2 sentences)
2. Strengths (2-3 points)
3. Issues Found (categorized by severity)
4. Suggestions for Improvement
5. Overall Assessment (Approve/Request Changes)

## Severity Levels
- **Critical**: Must fix before merge (security, data loss risk)
- **Major**: Should fix before merge (bugs, major design flaws)
- **Minor**: Consider fixing (code style, minor improvements)
- **Nit**: Optional (personal preferences, very minor issues)
```

### 실무 워크플로우 예시

#### 시나리오 1: 새 기능 개발
```bash
# 1. Hexagonal strict mode로 시작
claude --output-style hexagonal-strict
# "Create a new feature for user registration"

# 2. 기본 구조 생성 후 일반 모드로 전환
claude --output-style kotlin-spring-backend
# "Implement the business logic and add validation"

# 3. 코드 리뷰 모드로 최종 검증
claude --output-style code-review
# "Review the user registration feature"
```

#### 시나리오 2: 레거시 코드 개선
```bash
# 1. 먼저 코드 분석
claude --output-style default
# "Analyze the UserService class and identify issues"

# 2. 리팩토링 모드로 개선
claude --output-style refactoring-focus
# "Refactor UserService to improve testability"

# 3. Hexagonal 아키텍처 적용
claude --output-style hexagonal-strict
# "Convert UserService to follow hexagonal architecture"
```

### 팀 단위 output-style 공유

팀 전체가 동일한 output-style을 사용하도록 설정할 수 있습니다:

**1. Git 저장소에 output-style 저장**
```bash
# 프로젝트 루트에 저장
mkdir -p .claude/output-styles
cp ~/.config/claude-code/output-styles/kotlin-spring-backend.md .claude/output-styles/
```

**2. 팀원들에게 배포**
```bash
# 각 팀원이 실행
ln -s $(pwd)/.claude/output-styles/* ~/.config/claude-code/output-styles/
```

**3. 프로젝트별 설정 파일 사용**

`.claude/settings.json` 파일을 생성하여 프로젝트별 설정을 관리합니다:

```json
{
  "outputStyle": "kotlin-spring-backend",
  "hooks": {
    "onAfterEditFile": [
      "./gradlew ktlintFormat -PktlintFiles='${file_path}' --quiet"
    ]
  }
}
```

### 고급 활용: 동적 output-style 전환

프롬프트에 따라 자동으로 적절한 output-style을 제안하도록 설정:

**파일:** `~/.config/claude-code/output-styles/smart-router.md`

```markdown
# Smart Router Output Style

Based on the user's prompt, automatically apply the most appropriate style:

- If prompt contains "create new feature" or "implement": Use kotlin-spring-backend
- If prompt contains "refactor" or "improve": Use refactoring-focus
- If prompt contains "review" or "check": Use code-review
- If prompt contains "architecture" or "structure": Use hexagonal-strict
- Otherwise: Use default

Before proceeding, state which style is being applied and why.
```

이 문서의 내용들을 조합하여 사용하면, Kotlin Spring 기반 헥사고날 아키텍처 멀티모듈 프로젝트에서 클로드 코드의 생산성을 극대화할 수 있습니다.
