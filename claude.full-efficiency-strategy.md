# Claude 효율성 전략 가이드
> Kotlin/Spring/Gradle 헥사고날 아키텍처 멀티모듈 백엔드 개발자를 위한 실무 가이드

## 1. 각 모델별 특징과 활용 전략

### Claude Sonnet 4.5 (플래그십 모델)
**특징:**
- 최고 수준의 코딩 능력과 복잡한 추론 능력
- 200K 토큰 컨텍스트 윈도우
- 멀티모달 지원 (텍스트, 이미지, PDF 등)
- Extended Thinking 지원 (복잡한 문제 해결 시 사고 확장)
- 프롬프트 캐싱 지원 (비용 최적화)

**실무 활용 시나리오:**
- **아키텍처 설계 및 리팩토링**: 헥사고날 아키텍처의 전체 구조 설계, 모듈 간 의존성 분석
- **복잡한 비즈니스 로직 구현**: 도메인 주도 설계(DDD) 패턴 적용, 애그리게잇 설계
- **대규모 코드베이스 분석**: 멀티모듈 프로젝트 전체 구조 파악 및 개선 제안
- **성능 최적화 전략**: N+1 쿼리 해결, 캐싱 전략, 비동기 처리 최적화
- **일반적인 기능 구현**: API 엔드포인트 개발, 서비스 로직 구현
- **테스트 코드 작성**: JUnit5, Mockk, Kotest를 활용한 단위/통합 테스트
- **코드 리뷰 및 개선**: 코드 품질 개선, 리팩토링 제안
- **버그 수정**: 로그 분석, 예외 처리, 디버깅

**프롬프트 예시:**
```
헥사고날 아키텍처 기반 주문 처리 시스템을 설계해줘.
- 도메인: Order, Payment, Inventory
- 외부 연동: 결제 게이트웨이(PG사), 재고 관리 시스템
- 요구사항: 트랜잭션 보장, 이벤트 기반 아키텍처, Kotlin Coroutine 활용
- 각 레이어(domain, application, adapter)별 책임과 구현 방향을 제시해줘
```

**Extended Thinking 활용:**
```
<thinking>
복잡한 결제 시스템 설계를 단계별로 깊이 사고하며 분석
</thinking>

다음 요구사항을 만족하는 결제 시스템을 설계해줘:
- 멀티 PG사 지원 (토스, 네이버페이, 카카오페이)
- 부분 취소, 환불 처리
- 재시도 로직 및 멱등성 보장
- 이벤트 소싱 패턴 적용

각 설계 결정의 트레이드오프를 깊이 분석하고 최적의 방안을 제시해줘.
```

### Claude Haiku 4 (고속 모델)
**특징:**
- 가장 빠른 응답 속도 (Sonnet 4.5 대비 3배 이상 빠름)
- 200K 토큰 컨텍스트 윈도우 (이전 버전 대비 크게 확대)
- 비용 효율적
- 간단하면서도 정확한 작업에 최적화
- 프롬프트 캐싱 지원

**실무 활용 시나리오:**
- **빠른 코드 스니펫 생성**: 유틸리티 함수, 확장 함수, 데이터 클래스
- **간단한 버그 수정**: 문법 오류, 간단한 로직 수정
- **코드 설명**: 특정 함수나 클래스의 동작 설명
- **Gradle 스크립트 작성**: 의존성 추가, 플러그인 설정
- **간단한 쿼리 작성**: JPQL, QueryDSL 기본 쿼리
- **문서화**: README, API 문서 초안 작성
- **간단한 테스트 케이스 생성**: 기본적인 단위 테스트

**프롬프트 예시:**
```
Kotlin의 Result 타입을 활용한 에러 핸들링 확장 함수를 만들어줘.
- runCatching을 래핑
- 로깅 포함
- 도메인 예외를 애플리케이션 예외로 변환
```

### 모델 선택 가이드
| 작업 유형 | 추천 모델 | 이유 |
|----------|----------|------|
| 아키텍처 설계 | Sonnet 4.5 | 복잡한 추론과 전체적인 시스템 이해 필요 |
| 복잡한 비즈니스 로직 | Sonnet 4.5 | 다양한 엣지 케이스와 도메인 지식 필요 |
| 일반 기능 구현 | Sonnet 4.5 | 균형잡힌 품질과 속도 |
| 간단한 유틸리티 | Haiku 4 | 빠른 응답으로 생산성 향상 |
| 코드 설명/문서화 | Haiku 4 | 비용 효율적이면서 정확 |
| 대량 배치 작업 | Haiku 4 | 비용 최적화 |

---

## 2. 프롬프팅 전략

### Chain of Thought (CoT) - 단계적 사고
**개념**: 복잡한 문제를 단계별로 나누어 해결하도록 유도

**실무 적용:**
```
다음 순서대로 분석하고 구현해줘:
1. 현재 PaymentAdapter의 문제점 파악
2. 헥사고날 아키텍처 원칙에 맞게 개선 방향 제시
3. 인터페이스와 구현체 분리 설계
4. Kotlin Coroutine 적용한 비동기 처리 구현
5. 에러 핸들링 전략 수립
6. 테스트 전략 제시
```

### Sequential Thinking - 순차적 사고
**개념**: 이전 단계의 결과를 다음 단계의 입력으로 사용

**실무 적용:**
```
Step 1: 주문 도메인 엔티티 설계
- 애그리게잇 루트 식별
- 불변성 보장
- 도메인 이벤트 정의

Step 2: Step 1의 도메인 엔티티를 바탕으로 UseCase 구현
- 주문 생성, 주문 취소, 주문 조회

Step 3: Step 2의 UseCase를 호출하는 REST API 어댑터 구현
- Spring WebFlux 활용
- 요청/응답 DTO 정의
```

### Tree of Thought (ToT) - 분기 사고
**개념**: 여러 가능성을 탐색하고 최선의 방안 선택

**실무 적용:**
```
결제 모듈의 외부 PG 연동 방식을 3가지 대안으로 제시하고 비교해줘:

Option A: 동기 HTTP 클라이언트 (RestTemplate)
Option B: 비동기 HTTP 클라이언트 (WebClient + Coroutine)
Option C: 메시지 큐 기반 비동기 처리 (Kafka)

각 옵션별로 다음을 분석해줘:
- 성능 특성
- 장애 복구 전략
- 구현 복잡도
- 유지보수성
- 비용

최종 추천안과 그 이유를 제시해줘.
```

### Reflective Thinking - 반성적 사고
**개념**: 자신의 답변을 검토하고 개선

**실무 적용:**
```
다음 코드를 분석하고 개선안을 제시해줘:

[기존 코드]

먼저 문제점을 식별하고,
개선안을 제시한 뒤,
왜 이 개선안이 더 나은지 설명해줘.
특히 다음 관점에서 검토해줘:
- 헥사고날 아키텍처 원칙 준수 여부
- SOLID 원칙 위반 여부
- Kotlin 관용구 활용 여부
- 테스트 용이성
```

### Role-Based Prompting - 역할 기반 프롬프팅
**개념**: 특정 역할을 부여하여 전문성 강화

**실무 적용:**
```
당신은 10년 경력의 Kotlin 백엔드 시니어 개발자입니다.
다음 코드를 코드 리뷰해주세요:

[코드]

다음 관점에서 피드백해주세요:
1. 아키텍처 관점 (헥사고날 아키텍처 준수)
2. 코드 품질 관점 (가독성, 유지보수성)
3. 성능 관점 (N+1, 동시성 처리)
4. 보안 관점 (인증/인가, 입력 검증)
5. 테스트 관점 (테스트 가능성)
```

---

## 3. 메모리 시스템 활용 - 프로젝트 컨텍스트 관리

### 프로젝트 구조 메모리 파일
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

### 코딩 컨벤션 메모리 파일
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

### 의존성 관리 메모리 파일
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

### API 설계 가이드 메모리 파일
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

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: ErrorDetail?
)


## 에러 코드 체계
- 1xxx: 인증/인가 오류
- 2xxx: 비즈니스 로직 오류
- 3xxx: 외부 시스템 연동 오류
- 9xxx: 시스템 오류
```
---

## 4. 실무 시나리오별 활용 전략

### 시나리오 1: 신규 기능 개발
**1단계 - 아키텍처 설계 (Sonnet 4.5 사용)**
```
헥사고날 아키텍처로 상품 리뷰 기능을 설계해줘.
요구사항:
- 사용자는 구매한 상품에 리뷰 작성 가능
- 리뷰 작성 시 포인트 적립
- 리뷰에 이미지 첨부 가능 (S3 연동)
- 욕설 필터링 (외부 API 연동)

모듈 구조, 포트/어댑터 인터페이스, 도메인 모델을 설계해줘.
```

**2단계 - 도메인 로직 구현 (Sonnet 4.5 사용)**
```
앞서 설계한 구조를 바탕으로 Review 애그리게잇을 구현해줘.
- 불변성 보장
- 도메인 이벤트 발행 (ReviewCreatedEvent)
- 비즈니스 규칙 검증 (구매 이력 확인, 중복 리뷰 방지)
```

**3단계 - 테스트 코드 작성 (Sonnet 4.5 사용)**
```
CreateReviewUseCase에 대한 테스트 코드를 작성해줘.
- Kotest 사용
- Given-When-Then 패턴
- 포트는 Mockk로 모킹
```

### 시나리오 2: 레거시 코드 리팩토링
**1단계 - 코드 분석 (Sonnet 4.5 사용)**
```
다음 레거시 서비스 코드를 분석해줘:
[대량의 코드 첨부]

문제점을 다음 관점에서 식별해줘:
1. 아키텍처 위반 사항
2. SOLID 원칙 위반
3. 성능 이슈
4. 테스트 어려움
```

**2단계 - 리팩토링 계획 수립 (Sonnet 4.5 사용)**
```
앞서 식별한 문제를 해결하기 위한 리팩토링 계획을 수립해줘.
- 단계별 리팩토링 전략 (한 번에 전체 변경 불가)
- 각 단계별 목표와 예상 작업 시간
- 롤백 전략
```

**3단계 - 단계별 리팩토링 실행 (Sonnet 4.5 사용)**
```
리팩토링 1단계: 서비스 레이어 분리
현재 XxxService를 도메인 서비스와 애플리케이션 서비스로 분리해줘.
```

### 시나리오 3: 성능 최적화
**1단계 - 프로파일링 분석 (Sonnet 4.5 사용)**
```
다음 API 엔드포인트가 느립니다:
- GET /api/orders/{id}
- 평균 응답 시간: 3초

현재 구현 코드:
[코드 첨부]

문제를 분석하고 최적화 방안을 제시해줘.
```

**2단계 - 최적화 구현 (Sonnet 4.5 사용)**
```
N+1 쿼리 문제를 해결하기 위해:
1. QueryDSL을 사용한 fetch join 쿼리 작성
2. DTO 프로젝션 적용
3. 캐싱 전략 적용 (Redis)
```

### 시나리오 4: 버그 수정
**Haiku 4 또는 Sonnet 4.5 사용**
```
다음 예외가 발생합니다:

java.lang.NullPointerException: Cannot invoke "User.getEmail()" because "user" is null
    at com.example.UserService.sendEmail(UserService.kt:42)


관련 코드:
[코드 첨부]

문제를 분석하고 수정해줘.
Kotlin의 null 안정성을 활용한 해결 방법을 제시해줘.
```

---

## 5. 효율성 향상 팁

### 컨텍스트 최적화
1. **관련 코드만 공유**: 전체 파일보다는 문제가 되는 부분만 발췌
2. **메모리 파일 활용**: 프로젝트 설정, 컨벤션은 메모리 파일로 관리
3. **이전 대화 참조**: "앞서 작성한 Order 엔티티를 기반으로..." 같은 방식으로 컨텍스트 재사용

### 프롬프트 작성 원칙
1. **구체적 요구사항**: "좋은 코드 작성해줘" ❌ → "SOLID 원칙을 준수하며 Kotlin 관용구를 활용한 코드" ✅
2. **제약사항 명시**: 사용할 라이브러리, 따라야 할 패턴 명시
3. **예시 제공**: 기대하는 출력 형식이나 스타일 예시 제공
4. **단계적 요청**: 복잡한 작업은 여러 단계로 나누어 요청

### 코드 리뷰 활용
```
다음 PR을 리뷰해줘:
- 변경 내용: 결제 모듈 리팩토링
- 체크포인트:
  ✓ 헥사고날 아키텍처 준수
  ✓ 테스트 커버리지 80% 이상
  ✓ 성능 저하 없음
  ✓ Breaking change 없음

[git diff 또는 변경된 파일들]
```

### 문서 자동 생성
```
다음 UseCase 인터페이스들을 기반으로 API 문서를 작성해줘:
- OpenAPI 3.0 스펙
- 예시 요청/응답 포함
- 에러 코드 설명 포함

[인터페이스 코드들]
```

---

## 6. 주의사항

### 보안
- API 키, DB 비밀번호 등 민감 정보를 프롬프트에 포함하지 말 것
- 프로덕션 데이터를 공유하지 말 것
- 생성된 코드의 보안 취약점 검토 (SQL Injection, XSS 등)

### 코드 검증
- 생성된 코드를 그대로 사용하지 말고 반드시 리뷰
- 컴파일 오류, 논리 오류 확인
- 테스트 코드 작성 및 실행

### 비용 최적화
- 단순 작업은 Haiku 4 활용
- 대부분의 작업은 Sonnet 4.5 활용
- 불필요하게 긴 프롬프트 지양
- **프롬프트 캐싱 활용**: 프로젝트 컨벤션, 의존성 정보 등 반복적으로 사용되는 컨텍스트는 캐싱하여 비용 절감

### 프롬프트 캐싱 전략
```
# 캐싱 대상 (시스템 프롬프트에 포함)
- 프로젝트 구조 및 아키텍처 원칙
- 코딩 컨벤션 및 네이밍 규칙
- 주요 의존성 목록
- API 설계 가이드

# 캐싱하지 않을 대상
- 구체적인 비즈니스 로직 코드
- 특정 문제 상황 설명
- 일회성 요구사항
```

### Claude Code (CLI) 활용
Claude Code는 터미널에서 직접 Claude를 활용할 수 있는 공식 CLI 도구입니다.

**주요 기능:**
- **파일 직접 편집**: Read, Edit, Write 툴로 프로젝트 파일 직접 수정
- **Bash 명령 실행**: 빌드, 테스트, Git 명령 실행
- **프로젝트 컨텍스트 유지**: `.claude/` 디렉토리에 프로젝트 설정 저장
- **Task 에이전트**: 복잡한 작업을 자동화하는 에이전트 실행

**실무 활용 예시:**
```bash
# 1. 전체 테스트 실행 및 실패 시 자동 수정
claude "Run all tests and fix any failures"

# 2. 특정 패키지 리팩토링
claude "Refactor the payment adapter to follow hexagonal architecture"

# 3. PR 생성
claude "Create a PR for the review feature implementation"

# 4. 성능 프로파일링 후 최적화
claude "Profile the order API and optimize slow endpoints"
```

**프로젝트 메모리 설정:**
```bash
# .claude/ 디렉토리 구조
.claude/
├── project-structure.md      # 프로젝트 구조
├── coding-conventions.md     # 코딩 컨벤션
├── dependencies.md           # 의존성 정보
└── api-design.md            # API 설계 가이드
```

---

## 7. 체크리스트
```
### 코드 작성 시
- [ ] 헥사고날 아키텍처 원칙 준수
- [ ] 의존성 방향 올바름 (Domain ← Application ← Adapter)
- [ ] 불변성 보장 (val, immutable collections)
- [ ] Null 안정성 확보
- [ ] 예외 처리 적절
- [ ] 로깅 적절
- [ ] 테스트 코드 작성

### 코드 리뷰 시
- [ ] 비즈니스 요구사항 충족
- [ ] SOLID 원칙 준수
- [ ] 성능 이슈 없음
- [ ] 보안 취약점 없음
- [ ] 문서화 완료 (KDoc, README)
- [ ] 테스트 커버리지 충족
```

---

# 8. Claude Code 확장하기 - 사용자 정의 명령어

## 8.1 개요

Claude Code는 `.claude/commands/` 디렉토리에 마크다운 파일을 생성하여 프로젝트별 사용자 정의 명령어(Slash Command)를 만들 수 있습니다. 이를 통해 반복적인 작업을 자동화하고 팀 전체가 일관된 개발 패턴을 따르도록 할 수 있습니다.

**주요 장점:**
- 반복적인 프롬프트를 재사용 가능한 명령어로 저장
- 팀 전체가 공유하는 표준 워크플로 정의
- 프로젝트별 컨텍스트와 규칙을 명령어에 내장
- 복잡한 작업을 간단한 명령어로 실행

---

## 8.2 내장 명령어 vs 사용자 정의 명령어

### 내장 명령어
Claude Code가 기본 제공하는 시스템 명령어:

```bash
/help          # 도움말 표시
/clear         # 대화 내용 초기화
/model         # 모델 변경 (Sonnet 4.5, Haiku 4 등)
/attach        # 파일 첨부
/web           # 웹 검색
```

### 사용자 정의 명령어
프로젝트에 맞게 직접 만드는 명령어:

```bash
/review-code          # 코드 리뷰 수행
/create-usecase      # 유스케이스 생성
/test-integration    # 통합 테스트 생성
/refactor-hexagonal  # 헥사고날 아키텍처 리팩토링
```

---

## 8.3 프론트 메터 (Front Matter)

사용자 정의 명령어 파일의 상단에 YAML 형식으로 메타데이터를 정의합니다.

### 기본 구조

```markdown
---
description: 명령어에 대한 간단한 설명 (50자 이내)
---

여기에 실제 프롬프트 내용을 작성합니다.
```

### 주요 필드

| 필드 | 설명 | 필수 여부 |
|------|------|----------|
| `description` | 명령어 설명 (목록에 표시) | 선택 |
| `prompt` | 사용자에게 입력 요청 | 선택 |
| `tags` | 명령어 분류 태그 | 선택 |

### 예시: 인자를 받는 명령어

```markdown
---
description: 특정 모듈의 코드 리뷰 수행
prompt:
  - name: module_name
    description: 리뷰할 모듈 이름 (예: payment, order)
---

다음 모듈을 헥사고날 아키텍처 관점에서 코드 리뷰해줘:
- 모듈: {{module_name}}

리뷰 체크리스트:
1. 의존성 방향이 올바른가? (Domain ← Application ← Adapter)
2. 포트와 어댑터가 명확히 분리되어 있는가?
3. 도메인 로직이 순수한가? (외부 의존성 없음)
4. SOLID 원칙을 준수하는가?
5. Kotlin 관용구를 적절히 활용하는가?
```

---

## 8.4 사용자 정의 명령어 관리

### 디렉토리 구조

```bash
.claude/
├── commands/
│   ├── architecture/           # 아키텍처 관련
│   │   ├── review-hexagonal.md
│   │   ├── create-module.md
│   │   └── dependency-check.md
│   ├── development/            # 개발 관련
│   │   ├── create-usecase.md
│   │   ├── create-adapter.md
│   │   └── create-dto.md
│   ├── testing/                # 테스트 관련
│   │   ├── test-unit.md
│   │   ├── test-integration.md
│   │   └── test-e2e.md
│   └── workflow/               # 워크플로 관련
│       ├── pr-create.md
│       ├── release-prepare.md
│       └── hotfix.md
├── project-structure.md
├── coding-conventions.md
├── dependencies.md
└── api-design.md
```

---

## 8.5 실무 활용 예시

### 8.5.1 아키텍처 리뷰 명령어

**파일:** `.claude/commands/architecture/review-hexagonal.md`

```markdown
---
description: 헥사고날 아키텍처 준수 여부 리뷰
prompt:
  - name: target
    description: 리뷰 대상 (module/package/file)
---

당신은 헥사고날 아키텍처 전문가입니다.
다음 대상을 분석하고 개선사항을 제시해주세요:

**리뷰 대상:** {{target}}

**리뷰 체크리스트:**

### 1. 모듈 구조
- [ ] Domain 모듈이 다른 모듈에 의존하지 않는가?
- [ ] Application 모듈이 Domain에만 의존하는가?
- [ ] Adapter가 Application과 Domain에 의존하는가?

### 2. 포트와 어댑터
- [ ] 인바운드 포트(UseCase)가 명확히 정의되어 있는가?
- [ ] 아웃바운드 포트가 인터페이스로 정의되어 있는가?
- [ ] 어댑터가 포트를 구현하는가?

### 3. 도메인 로직
- [ ] 도메인 엔티티가 순수한가? (프레임워크 의존성 없음)
- [ ] 비즈니스 규칙이 도메인에 위치하는가?
- [ ] 도메인 이벤트가 적절히 사용되는가?

### 4. 의존성 규칙
- [ ] DIP(의존성 역전 원칙)를 준수하는가?
- [ ] 순환 의존성이 없는가?

**출력 형식:**
1. 현재 상태 요약
2. 발견된 문제점 (우선순위별)
3. 구체적인 개선 방안 (코드 예시 포함)
4. 리팩토링 순서 제안
```

**사용법:**
```bash
claude /review-hexagonal payment
```

---

### 8.5.2 유스케이스 생성 명령어

**파일:** `.claude/commands/development/create-usecase.md`

```markdown
---
description: 헥사고날 아키텍처 유스케이스 생성
prompt:
  - name: domain
    description: 도메인 이름 (예: Order, Payment)
  - name: action
    description: 액션 (예: Create, Update, Delete, Query)
---

다음 스펙으로 유스케이스를 생성해줘:

**도메인:** {{domain}}
**액션:** {{action}}

**생성할 파일:**

### 1. 인바운드 포트 (UseCase 인터페이스)
- 위치: `application/port/in/{{action}}{{domain}}UseCase.kt`
- 명명: `{{action}}{{domain}}UseCase`
- 입력: `{{action}}{{domain}}Command` (data class)
- 출력: `{{domain}}` or `{{domain}}Response`

### 2. 유스케이스 구현
- 위치: `application/service/{{action}}{{domain}}Service.kt`
- 명명: `{{action}}{{domain}}Service`
- 애노테이션: `@UseCase`, `@Transactional`

### 3. 아웃바운드 포트 (필요시)
- 위치: `application/port/out/Load{{domain}}Port.kt`, `Save{{domain}}Port.kt`

**구현 요구사항:**
1. Kotlin 관용구 활용 (data class, sealed class, extension function)
2. 불변성 보장 (val, immutable collections)
3. Null 안정성 확보
4. 도메인 이벤트 발행 (필요시)
5. 예외 처리 (도메인 예외 사용)
6. 로깅 추가
7. KDoc 주석 작성

**테스트 코드도 함께 생성:**
- 위치: `application/service/{{action}}{{domain}}ServiceTest.kt`
- 프레임워크: Kotest
- 패턴: Given-When-Then
- 모킹: Mockk
```

**사용법:**
```bash
claude /create-usecase Order Create
```

---

### 8.5.3 통합 테스트 생성 명령어

**파일:** `.claude/commands/testing/test-integration.md`

```markdown
---
description: 통합 테스트 생성 (TestContainers 사용)
prompt:
  - name: feature
    description: 테스트할 기능 (예: OrderAPI, PaymentFlow)
---

다음 기능에 대한 통합 테스트를 작성해줘:

**테스트 대상:** {{feature}}

**테스트 설정:**

### 1. TestContainers 구성
\`\`\`kotlin
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class {{feature}}IntegrationTest {

    companion object {
        @Container
        val postgresContainer = PostgreSQLContainer<Nothing>("postgres:15-alpine")

        @Container
        val redisContainer = GenericContainer<Nothing>("redis:7-alpine")
            .withExposedPorts(6379)
    }
}
\`\`\`

### 2. 테스트 시나리오
- Happy Path: 정상 플로우
- Edge Cases: 경계값, 예외 상황
- Concurrency: 동시성 처리
- Transaction: 트랜잭션 롤백/커밋

### 3. Given-When-Then 패턴
\`\`\`kotlin
@Test
fun \`should create order successfully\`() {
    // Given
    val request = createOrderRequest()

    // When
    val response = restTemplate.postForEntity(
        "/api/orders",
        request,
        OrderResponse::class.java
    )

    // Then
    response.statusCode shouldBe HttpStatus.CREATED
    response.body?.orderId shouldNotBe null
}
\`\`\`

### 4. 데이터 정리
- @AfterEach로 테스트 데이터 정리
- 또는 @Transactional로 자동 롤백

**요구사항:**
1. 실제 DB 사용 (H2 아님)
2. 외부 의존성은 TestContainers로 구성
3. RestTemplate 또는 WebTestClient 사용
4. 응답 검증 상세히 (상태코드, 바디, 헤더)
5. 로그 확인 (필요시)
```

**사용법:**
```bash
claude /test-integration OrderAPI
```

---

### 8.5.4 PR 생성 명령어

**파일:** `.claude/commands/workflow/pr-create.md`

```markdown
---
description: Pull Request 생성 및 체크리스트 확인
prompt:
  - name: feature_name
    description: 기능 이름 (예: review-system, payment-refactor)
---

다음 기능에 대한 PR을 생성해줘:

**기능:** {{feature_name}}

**PR 생성 전 체크리스트:**

### 1. 코드 품질
\`\`\`bash
# 빌드 성공 확인
./gradlew clean build

# 테스트 실행
./gradlew test

# 코드 커버리지 확인 (80% 이상)
./gradlew jacocoTestReport
\`\`\`

### 2. 아키텍처 검증
- [ ] 헥사고날 아키텍처 원칙 준수
- [ ] 의존성 방향 올바름
- [ ] 순환 의존성 없음

### 3. 코딩 컨벤션
- [ ] Kotlin 스타일 가이드 준수
- [ ] 네이밍 컨벤션 준수
- [ ] KDoc 주석 작성

### 4. Git 히스토리
- [ ] 커밋 메시지 명확
- [ ] 불필요한 파일 제외 (.gitignore)
- [ ] 민감 정보 미포함

**PR 생성:**
\`\`\`bash
# 현재 브랜치 확인
git status

# 변경사항 확인
git diff main...HEAD

# PR 생성
gh pr create --title "feat: {{feature_name}}" --body "$(cat <<'EOF'
## Summary
[기능 요약]

## Changes
- [변경사항 1]
- [변경사항 2]

## Test Plan
- [ ] 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 수동 테스트 완료

## Checklist
- [ ] 헥사고날 아키텍처 준수
- [ ] 테스트 커버리지 80% 이상
- [ ] Breaking change 없음
- [ ] 문서 업데이트 완료

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
\`\`\`

**자동으로 수행할 작업:**
1. git diff로 변경사항 확인
2. 테스트 실행 및 결과 확인
3. PR 본문 자동 생성
4. 리뷰어 자동 지정 (선택)
```

**사용법:**
```bash
claude /pr-create review-system
```

---

### 8.5.5 어댑터 생성 명령어

**파일:** `.claude/commands/development/create-adapter.md`

```markdown
---
description: 헥사고날 아키텍처 어댑터 생성
prompt:
  - name: adapter_type
    description: 어댑터 타입 (web/persistence/messaging/external)
  - name: domain
    description: 도메인 이름 (예: Order, Payment)
---

다음 스펙으로 어댑터를 생성해줘:

**타입:** {{adapter_type}}
**도메인:** {{domain}}

### Web Adapter (Inbound)
(adapter_type이 'web'인 경우)

**1. REST Controller**
- 위치: \`adapter/in/web/{{domain}}Controller.kt\`
- 애노테이션: \`@RestController\`, \`@RequestMapping("/api/{{domain|lower}}s")\`
- 의존성: UseCase 인터페이스만 주입

\`\`\`kotlin
@RestController
@RequestMapping("/api/orders")
class {{domain}}Controller(
    private val create{{domain}}UseCase: Create{{domain}}UseCase,
    private val query{{domain}}UseCase: Query{{domain}}UseCase
) {

    @PostMapping
    fun create(@RequestBody @Valid request: Create{{domain}}Request): ResponseEntity<{{domain}}Response> {
        val command = request.toCommand()
        val result = create{{domain}}UseCase.execute(command)
        return ResponseEntity.status(HttpStatus.CREATED).body(result.toResponse())
    }
}
\`\`\`

**2. Request/Response DTO**
- 위치: \`adapter/in/web/dto/{{domain}}Request.kt\`
- Validation 애노테이션 추가
- toCommand() 확장 함수 제공

### Persistence Adapter (Outbound)
(adapter_type이 'persistence'인 경우)

**1. JPA Entity**
- 위치: \`adapter/out/persistence/entity/{{domain}}JpaEntity.kt\`
- 도메인 모델과 분리

**2. Repository**
- 위치: \`adapter/out/persistence/{{domain}}Repository.kt\`
- JpaRepository 또는 R2dbcRepository 상속

**3. Adapter 구현**
- 위치: \`adapter/out/persistence/{{domain}}PersistenceAdapter.kt\`
- 포트 인터페이스 구현
- 매퍼 사용 (Entity ↔ Domain)

\`\`\`kotlin
@Component
class {{domain}}PersistenceAdapter(
    private val repository: {{domain}}Repository,
    private val mapper: {{domain}}Mapper
) : Load{{domain}}Port, Save{{domain}}Port {

    override fun load(id: {{domain}}Id): {{domain}}? {
        return repository.findById(id.value)
            ?.let { mapper.toDomain(it) }
    }

    override fun save(domain: {{domain}}): {{domain}} {
        val entity = mapper.toEntity(domain)
        val saved = repository.save(entity)
        return mapper.toDomain(saved)
    }
}
\`\`\`

**공통 요구사항:**
1. 포트 인터페이스 구현
2. 도메인 모델과 어댑터 모델 분리
3. 매퍼 사용 (필요시)
4. 예외 처리 (도메인 예외로 변환)
5. 로깅 추가
6. 테스트 코드 작성
```

**사용법:**
```bash
claude /create-adapter web Order
claude /create-adapter persistence Payment
```

---

### 8.5.6 성능 최적화 명령어

**파일:** `.claude/commands/workflow/optimize-performance.md`

```markdown
---
description: API 성능 프로파일링 및 최적화
prompt:
  - name: endpoint
    description: 최적화할 API 엔드포인트 (예: GET /api/orders/{id})
---

다음 API를 프로파일링하고 최적화해줘:

**대상:** {{endpoint}}

**1. 현재 성능 측정**
\`\`\`bash
# 1. 로컬 부하 테스트
hey -n 1000 -c 10 http://localhost:8080{{endpoint}}

# 2. 응답 시간 분석
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080{{endpoint}}
\`\`\`

**2. 문제 분석 체크리스트**

### Database
- [ ] N+1 쿼리 발생하는가?
- [ ] 인덱스가 적절히 설정되어 있는가?
- [ ] 불필요한 JOIN이 있는가?
- [ ] Lazy Loading으로 인한 성능 저하가 있는가?

### Application
- [ ] 불필요한 객체 변환이 많은가?
- [ ] 동기 처리를 비동기로 전환할 수 있는가?
- [ ] 캐싱 가능한 데이터가 있는가?
- [ ] 로깅이 과도한가?

### Network
- [ ] 응답 페이로드가 큰가?
- [ ] 여러 API 호출을 하나로 합칠 수 있는가?

**3. 최적화 방안**

### 쿼리 최적화
\`\`\`kotlin
// Before: N+1 쿼리
fun findOrders(): List<Order> {
    return orderRepository.findAll()  // 각 Order마다 Item 조회
}

// After: Fetch Join
fun findOrders(): List<Order> {
    return orderRepository.findAllWithItems()  // 한 번에 조회
}
\`\`\`

### DTO Projection
\`\`\`kotlin
// 필요한 필드만 조회
@Query("SELECT new OrderSummaryDto(o.id, o.status, o.totalAmount) FROM Order o")
fun findOrderSummaries(): List<OrderSummaryDto>
\`\`\`

### 캐싱
\`\`\`kotlin
@Cacheable(value = "orders", key = "#id")
fun findById(id: OrderId): Order? {
    return orderRepository.findById(id.value)?.toDomain()
}
\`\`\`

### 비동기 처리
\`\`\`kotlin
// Coroutine 활용
suspend fun processOrder(command: CreateOrderCommand): Order = coroutineScope {
    val validation = async { validateOrder(command) }
    val inventory = async { checkInventory(command.items) }

    validation.await()
    inventory.await()

    createOrder(command)
}
\`\`\`

**4. 최적화 후 재측정**
- 응답 시간 개선율
- 쿼리 수 감소
- CPU/메모리 사용량 변화

**5. 보고서 작성**
- 개선 전/후 비교
- 적용한 기법
- 추가 개선 가능 영역
```

**사용법:**
```bash
claude /optimize-performance "GET /api/orders/{id}"
```

---

## 8.6 명령어 조합 활용

### 신규 기능 개발 워크플로

```bash
# 1. 유스케이스 생성
claude /create-usecase Review Create

# 2. 어댑터 생성
claude /create-adapter web Review
claude /create-adapter persistence Review

# 3. 통합 테스트 생성
claude /test-integration ReviewAPI

# 4. 아키텍처 검증
claude /review-hexagonal review

# 5. PR 생성
claude /pr-create review-system
```

### 레거시 리팩토링 워크플로

```bash
# 1. 현재 아키텍처 분석
claude /review-hexagonal payment

# 2. 리팩토링 수행
claude "현재 PaymentService를 헥사고날 아키텍처로 리팩토링해줘"

# 3. 테스트 생성
claude /test-unit PaymentService
claude /test-integration PaymentAPI

# 4. 성능 검증
claude /optimize-performance "POST /api/payments"

# 5. PR 생성
claude /pr-create payment-refactor
```

---

## 8.7 팀 공유 및 버전 관리

### Git으로 관리

```bash
# .gitignore에 제외할 파일 지정
.claude/
!.claude/commands/        # 명령어는 공유
!.claude/*.md            # 프로젝트 문서는 공유
.claude/cache/           # 캐시는 제외
.claude/history/         # 히스토리는 제외
```

### 문서화

**README.md에 명령어 가이드 추가:**

```markdown
## Claude Code 사용자 정의 명령어

### 개발
- \`/create-usecase <domain> <action>\` - 유스케이스 생성
- \`/create-adapter <type> <domain>\` - 어댑터 생성

### 테스트
- \`/test-unit <class>\` - 단위 테스트 생성
- \`/test-integration <feature>\` - 통합 테스트 생성

### 아키텍처
- \`/review-hexagonal <target>\` - 헥사고날 아키텍처 리뷰

### 워크플로
- \`/pr-create <feature>\` - PR 생성
- \`/optimize-performance <endpoint>\` - 성능 최적화
```

---

## 8.8 고급 활용 팁

### 1. 템플릿 변수 활용

```markdown
---
description: 도메인 주도 설계 애그리게잇 생성
prompt:
  - name: aggregate_name
    description: 애그리게잇 이름
  - name: entities
    description: 포함할 엔티티들 (쉼표로 구분)
---

다음 애그리게잇을 생성해줘:

**애그리게잇 루트:** {{aggregate_name}}
**포함 엔티티:** {{entities}}

애그리게잇 설계 원칙:
1. 불변성 보장
2. 트랜잭션 경계 명확
3. 도메인 이벤트 발행
```

### 2. 컨텍스트 파일 참조

명령어에서 프로젝트 컨벤션 파일을 참조하여 일관성 유지:

```markdown
현재 프로젝트의 코딩 컨벤션을 참고하여 코드를 생성해줘.

참고 파일:
- .claude/coding-conventions.md
- .claude/project-structure.md
- .claude/dependencies.md
```

### 3. 다단계 명령어

복잡한 작업을 여러 단계로 나누어 실행:

```markdown
---
description: 완전한 기능 구현 (도메인-어댑터-테스트)
prompt:
  - name: feature_name
    description: 기능 이름
---

다음 순서로 기능을 구현해줘:

**Step 1: 도메인 모델 설계**
- 애그리게잇 식별
- 엔티티 및 값 객체 정의
- 도메인 이벤트 정의

**Step 2: 유스케이스 구현**
- 인바운드 포트 정의
- 아웃바운드 포트 정의
- 서비스 구현

**Step 3: 어댑터 구현**
- Web Adapter (Controller)
- Persistence Adapter (Repository)
- 매퍼 구현

**Step 4: 테스트 작성**
- 단위 테스트 (도메인, 서비스)
- 통합 테스트 (API)

**Step 5: 검증**
- 아키텍처 리뷰
- 빌드 및 테스트 실행
```

---

## 8.9 명령어 작성 베스트 프랙티스

### DO ✅

1. **명확한 설명 작성**
   ```markdown
   ---
   description: 유스케이스 생성 (헥사고날 아키텍처)
   ---
   ```

2. **구체적인 출력 형식 지정**
   ```markdown
   **출력 형식:**
   1. 파일 경로
   2. 코드
   3. 테스트 코드
   ```

3. **체크리스트 제공**
   ```markdown
   **검증 항목:**
   - [ ] 컴파일 성공
   - [ ] 테스트 통과
   - [ ] 컨벤션 준수
   ```

4. **예제 포함**
   ```markdown
   **예시:**
   \`\`\`kotlin
   // 예상되는 코드 형태
   \`\`\`
   ```

### DON'T ❌

1. **모호한 지시**
   ```markdown
   코드를 개선해줘  ❌
   ```

2. **프롬프트가 너무 김**
   - 한 명령어는 한 가지 목적에 집중

3. **컨텍스트 누락**
   - 프로젝트 구조, 컨벤션 참조 누락

4. **출력 검증 없음**
   - 생성된 코드를 확인하는 방법 제공 필요

---

## 8.10 요약

사용자 정의 명령어를 활용하면:

1. **생산성 향상**: 반복 작업을 명령어로 자동화
2. **일관성 유지**: 팀 전체가 동일한 패턴 사용
3. **품질 향상**: 체크리스트와 검증 단계 내장
4. **지식 공유**: 베스트 프랙티스를 명령어로 공유

이제 실무에서 바로 활용할 수 있는 사용자 정의 명령어를 만들고 팀과 공유할 수 있습니다!