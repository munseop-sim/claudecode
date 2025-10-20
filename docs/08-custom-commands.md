# 8. 사용자 정의 명령어

> [← 메인으로 돌아가기](../claude.efficiency-strategy.md)

---

## 개요

Claude Code는 `.claude/commands/` 디렉토리에 마크다운 파일을 생성하여 프로젝트별 사용자 정의 명령어(Slash Command)를 만들 수 있습니다.

**주요 장점:**
- 반복적인 프롬프트를 재사용 가능한 명령어로 저장
- 팀 전체가 공유하는 표준 워크플로 정의
- 프로젝트별 컨텍스트와 규칙을 명령어에 내장
- 복잡한 작업을 간단한 명령어로 실행

---

## 디렉토리 구조

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

## 프론트 메터 (Front Matter)

명령어 파일 상단에 YAML 형식으로 메타데이터를 정의합니다.

### 기본 구조

```markdown
---
description: 명령어에 대한 간단한 설명 (50자 이내)
---

여기에 실제 프롬프트 내용을 작성합니다.
```

### 인자를 받는 명령어

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

## 실무 활용 예시

### 1. 아키텍처 리뷰 명령어

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

### 2. 유스케이스 생성 명령어

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

### 3. PR 생성 명령어

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
./gradlew clean build
./gradlew test
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

**PR 생성:**
\`\`\`bash
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
```

**사용법:**
```bash
claude /pr-create review-system
```

---

## 명령어 조합 활용

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

## 팀 공유 및 버전 관리

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

**claude.efficiency-strategy.md에 명령어 가이드 추가:**

```markdown
## Claude Code 사용자 정의 명령어

### 개발
- `/create-usecase <domain> <action>` - 유스케이스 생성
- `/create-adapter <type> <domain>` - 어댑터 생성

### 테스트
- `/test-unit <class>` - 단위 테스트 생성
- `/test-integration <feature>` - 통합 테스트 생성

### 아키텍처
- `/review-hexagonal <target>` - 헥사고날 아키텍처 리뷰

### 워크플로
- `/pr-create <feature>` - PR 생성
- `/optimize-performance <endpoint>` - 성능 최적화
```

---

## 베스트 프랙티스

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

### DON'T ❌

1. **모호한 지시** - "코드를 개선해줘" ❌
2. **프롬프트가 너무 김** - 한 명령어는 한 가지 목적에 집중
3. **컨텍스트 누락** - 프로젝트 구조, 컨벤션 참조 누락
4. **출력 검증 없음** - 생성된 코드를 확인하는 방법 제공 필요

---

## 더 많은 예시

전체 명령어 예시 및 상세 내용은 [전체 가이드](../claude.efficiency-strategy.md#8-claude-code-확장하기---사용자-정의-명령어)를 참고하세요.

---

## 다음 단계

- [1. 모델별 특징과 활용 전략](./01-models-and-strategies.md)
- [2. 프롬프팅 전략](./02-prompting-strategies.md)
- [3. 메모리 시스템 활용](./03-memory-system.md)
- [전체 가이드 보기](../claude.efficiency-strategy.md)
