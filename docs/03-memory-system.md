# 3. 메모리 시스템 활용 - 프로젝트 컨텍스트 관리

> [← 메인으로 돌아가기](../claude.efficiency-strategy.md)

---

## 개요

Claude Code는 `.claude/` 디렉토리에 프로젝트별 컨텍스트 파일을 저장하여, 매번 동일한 정보를 반복해서 입력하지 않아도 됩니다. 이를 통해 일관된 코딩 스타일과 아키텍처 패턴을 유지할 수 있습니다.

---

## 프로젝트 구조 메모리 파일

**파일명**: `.claude/project-structure.md`

```markdown
# 프로젝트 구조

## 모듈 구성
- `domain`: 순수 비즈니스 로직, 엔티티, 도메인 서비스
- `application`: 유스케이스, 포트 인터페이스 정의
- `adapter-in-web`: REST API 컨트롤러
- `adapter-out-persistence`: JPA/R2DBC 리포지토리 구현
- `adapter-out-messaging`: Kafka 프로듀서/컨슈머
- `common`: 공통 유틸, 예외, 설정

## 아키텍처 원칙
1. Domain 모듈은 다른 모듈에 의존하지 않음
2. Application 모듈은 Domain에만 의존
3. Adapter는 Application과 Domain에 의존
4. 의존성 역전 원칙(DIP) 준수
```

---

## 코딩 컨벤션 메모리 파일

**파일명**: `.claude/coding-conventions.md`

```markdown
# 코딩 컨벤션

## Kotlin 스타일
- 불변성 우선: `val` 사용, immutable collections
- Null 안정성: `?`, `?.`, `?:` 적극 활용
- 확장 함수로 유틸리티 구현
- Data class로 DTO 정의
- Sealed class로 결과 타입 정의

## 패키지 구조
com.example.order
  ├── domain
  │   ├── model (Order, OrderItem)
  │   ├── service (OrderDomainService)
  │   └── event (OrderCreatedEvent)
  ├── application
  │   ├── port.in (CreateOrderUseCase)
  │   └── port.out (LoadOrderPort, SaveOrderPort)
  └── adapter
      ├── in.web (OrderController)
      └── out.persistence (OrderJpaAdapter)

## 네이밍 컨벤션
- UseCase: ~UseCase (예: CreateOrderUseCase)
- Port: ~Port (예: SaveOrderPort)
- Adapter: ~Adapter (예: OrderJpaAdapter)
- Entity: 명사형 (예: Order, Payment)
```

---

## 의존성 관리 메모리 파일

**파일명**: `.claude/dependencies.md`

```markdown
# 주요 의존성

## Core
- Kotlin: 2.0.x
- Spring Boot: 3.3.x
- Java: 21+

## Data Access
- Spring Data JPA
- Spring Data R2DBC (리액티브)
- QueryDSL
- Flyway (마이그레이션)

## Testing
- JUnit5
- Mockk
- Kotest
- TestContainers

## Messaging
- Spring Kafka
- Spring Cloud Stream

## Utilities
- Arrow (함수형 프로그래밍)
- Jackson (JSON)
```

---

## API 설계 가이드 메모리 파일

**파일명**: `.claude/api-design.md`

```markdown
# API 설계 원칙

## REST API 컨벤션
- POST: 리소스 생성
- GET: 리소스 조회
- PUT: 리소스 전체 수정
- PATCH: 리소스 부분 수정
- DELETE: 리소스 삭제

## 응답 형식
\`\`\`kotlin
data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: ErrorDetail?
)
\`\`\`

## 에러 코드 체계
- 1xxx: 인증/인가 오류
- 2xxx: 비즈니스 로직 오류
- 3xxx: 외부 시스템 연동 오류
- 9xxx: 시스템 오류
```

---

## 메모리 파일 생성 방법

### 1. 디렉토리 구조 생성

```bash
mkdir -p .claude
cd .claude
touch project-structure.md
touch coding-conventions.md
touch dependencies.md
touch api-design.md
```

### 2. 각 파일에 프로젝트 정보 작성

위의 템플릿을 참고하여 프로젝트에 맞게 수정합니다.

### 3. Git으로 관리

```bash
# .gitignore에 추가 (선택적)
.claude/
!.claude/*.md    # 메모리 파일은 공유
.claude/cache/   # 캐시는 제외
```

---

## 활용 예시

메모리 파일을 설정하면, Claude가 자동으로 프로젝트 컨텍스트를 참조합니다:

```bash
# 유스케이스 생성 요청 시
claude "주문 생성 유스케이스를 만들어줘"

# Claude는 자동으로 다음을 참조:
# - .claude/project-structure.md → 헥사고날 아키텍처 구조
# - .claude/coding-conventions.md → Kotlin 스타일, 네이밍 규칙
# - .claude/dependencies.md → 사용할 라이브러리
# - .claude/api-design.md → API 응답 형식
```

---

## 팁

1. **프로젝트 초기에 설정**: 프로젝트 시작 시 메모리 파일을 만들어두면 일관성 유지
2. **팀과 공유**: 팀 전체가 동일한 컨벤션을 따르도록 Git에 커밋
3. **주기적 업데이트**: 프로젝트 진화에 따라 메모리 파일도 업데이트
4. **프롬프트 캐싱**: 자주 사용되는 컨텍스트는 캐싱되어 비용 절감

---

## 다음 단계

- [1. 모델별 특징과 활용 전략](./01-models-and-strategies.md)
- [2. 프롬프팅 전략](./02-prompting-strategies.md)
- [8. 사용자 정의 명령어](./08-custom-commands.md)
- [전체 가이드 보기](../claude.efficiency-strategy.md)
