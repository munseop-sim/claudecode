# Claude Code 학습 자료 모음집

> Claude Code를 활용한 효율적인 개발 워크플로우 구축을 위한 종합 가이드

이 리포지토리는 Claude Code를 실무 프로젝트에서 효과적으로 활용하기 위한 학습 자료와 베스트 프랙티스를 모아놓은 곳입니다. 특히 **Kotlin/Spring/Gradle 기반의 헥사고날 아키텍처 멀티모듈 백엔드 개발**에 최적화된 가이드를 제공합니다.

---

## 📚 목차

- [핵심 가이드](#-핵심-가이드)
- [워크플로우 전략](#-워크플로우-전략)
- [고급 기능](#-고급-기능)
- [샘플 코드](#-샘플-코드)
- [시작하기](#-시작하기)

---

## 🎯 핵심 가이드

### 1. [멀티에이전트](./claude.agent.md)
Claude Code의 Task Tool과 서브에이전트를 활용한 작업 자동화

**주요 내용:**
- **Task Tool & 서브에이전트**: general-purpose, Explore 에이전트 활용법
- **Custom Subagent**: 프로젝트 특화 작업 흐름 자동화
- **Claude Squad**: GitHub 기반 협업 에이전트 시스템
- **Claude Swarm**: 대규모 병렬 작업 처리

**활용 예시:**
- 유스케이스 생성 에이전트
- 아키텍처 검증 에이전트
- API 엔드포인트 생성 자동화

---

### 2. [효율성 전략 가이드](./claude.efficiency-strategy.md)
Claude 모델 선택, 프롬프팅 전략, 메모리 시스템 활용

**주요 내용:**
- **[모델별 특징과 활용 전략](./docs/01-models-and-strategies.md)**: Sonnet 4.5 vs Haiku 4
- **[프롬프팅 전략](./docs/02-prompting-strategies.md)**: CoT, Sequential, ToT, Reflective Thinking
- **[메모리 시스템](./docs/03-memory-system.md)**: 프로젝트 컨벤션 및 구조 관리
- **[사용자 정의 명령어](./docs/08-custom-commands.md)**: 반복 작업 자동화 (가장 실용적!)

**빠른 시작:**
```bash
mkdir -p .claude/commands/{architecture,development,testing,workflow}
touch .claude/{project-structure,coding-conventions,dependencies,api-design}.md
```

---

### 3. [프롬프트 작성 가이드](./claude.prompt.md)
헥사고날 아키텍처 개발을 위한 효과적인 프롬프트 작성법

**핵심 원칙:**
- 레이어를 명확히 지정 (Domain, Application, Adapter)
- 의존성 방향 명시
- 구체적인 요구사항과 제약사항 포함
- 예상 결과물 명시

**실전 템플릿 제공:**
- 신규 기능 개발
- 버그 수정
- 리팩토링
- 코드 분석
- 성능 최적화

---

### 4. [Model Context Protocol (MCP)](./claude.mcp.md)
외부 도구, 데이터베이스, API와의 연동

**필수 MCP:**
- **데이터베이스**: PostgreSQL, Redis
- **개발 도구**: Git, Docker, Kubernetes, Gradle
- **모니터링**: Prometheus, Elasticsearch
- **협업**: Slack, Jira, Notion

**실무 시나리오:**
- N+1 쿼리 문제 해결
- 헥사고날 아키텍처 의존성 검증
- 배포 후 성능 모니터링
- 캐시 전략 최적화

**추가 자료:**
- [MCP 예시](./claude.mcp.ex.md)

---

### 5. [확장 기능: Hooks & Output-Style](./claude.extension.md)
워크플로우 자동화와 출력 형식 커스터마이징

**Hooks 활용:**
- `onBeforeWriteFile`: 파일 생성 전 검증
- `onAfterEditFile`: 코드 포맷팅 자동화
- `onUserPromptSubmit`: Git 상태 확인

**Output-Style 커스터마이징:**
- `kotlin-spring-backend`: Kotlin/Spring 개발에 최적화
- `hexagonal-strict`: 아키텍처 규칙 엄격 검증
- `refactoring-focus`: 리팩토링 중심
- `code-review`: 코드 리뷰 모드

---

## 🔄 워크플로우 전략

### [Spring & Kotlin 개발 가이드](./claude.workflow.md)
프로젝트 설계부터 테스트, 리팩토링, 문서화까지 전 과정 가이드

#### 개발 단계별 가이드

| 단계 | 문서 | 주요 내용 |
|------|------|-----------|
| **설계** | [프로젝트 설계](./docs/01-project-design.md) | 아키텍처 선택, 패키지 구조, API 설계 |
| **초기화** | [부트스트래핑](./docs/02-bootstrapping.md) | 프로젝트 초기 구성 자동화 |
| **개발** | [테스트](./docs/03-testing.md) | TDD, 단위/통합 테스트 |
| **개선** | [코드리뷰 & 리팩토링](./docs/04-improvement.md) | 코드 품질 향상, 성능 최적화 |
| **문서화** | [명세 작성](./docs/05-documentation.md) | API 문서, KDoc, README |

#### 신규 기능 개발 워크플로우
```bash
# 1. 유스케이스 생성
claude /create-usecase Order Create

# 2. 어댑터 생성
claude /create-adapter web Order
claude /create-adapter persistence Order

# 3. 통합 테스트
claude /test-integration OrderAPI

# 4. 아키텍처 검증
claude /review-hexagonal order

# 5. PR 생성
claude /pr-create order-feature
```

---

## 🚀 고급 기능

### 추가 가이드 문서

- [**명령어 가이드**](./claude_code_command.md): Claude Code 명령어 활용법
- [**마크다운 가이드**](./claude.md.md): 문서 작성 베스트 프랙티스
- [**전체 효율성 가이드**](./claude.full-efficiency-strategy.md): 심화 학습 자료

---

## 📦 샘플 코드

### [book_sample_code/](./book_sample_code/)
Claude Code를 활용한 실습 예제 코드

**출처:** [_Book_Claude-Code](https://github.com/sysnet4admin/_Book_Claude-Code)

---

## 🎓 K8s 학습 자료

### [k8s/](./k8s/)
Kubernetes 환경에서 Claude Code 활용하기

**주요 내용:**
- [Kubernetes 학습 계획](./k8s/study_plan.md)
- Claude를 활용한 K8s 리소스 관리

---

## 🏁 시작하기

### 1. 프로젝트 초기 설정

```bash
# Claude 설정 디렉토리 생성
mkdir -p .claude/commands/{architecture,development,testing,workflow}
mkdir -p .claude/subagents

# 메모리 파일 생성
touch .claude/project-structure.md
touch .claude/coding-conventions.md
touch .claude/dependencies.md
touch .claude/api-design.md
```

### 2. 메모리 파일 작성

각 프로젝트의 컨벤션과 구조를 `.claude/` 디렉토리에 작성하세요:
- [프로젝트 구조 예시](./docs/03-memory-system.md#프로젝트-구조-메모리-파일)
- [코딩 컨벤션 예시](./docs/03-memory-system.md#코딩-컨벤션-메모리-파일)

### 3. 사용자 정의 명령어 생성

반복적인 작업을 명령어로 자동화:
- [유스케이스 생성](./docs/08-custom-commands.md#852-유스케이스-생성-명령어)
- [아키텍처 리뷰](./docs/08-custom-commands.md#851-아키텍처-리뷰-명령어)

### 4. 추천 학습 경로

```mermaid
graph LR
    A[효율성 전략 가이드] --> B[프롬프트 작성 가이드]
    B --> C[워크플로우 전략]
    C --> D[멀티에이전트]
    D --> E[MCP 연동]
    E --> F[확장 기능]
```

1. **[효율성 전략 가이드](./claude.efficiency-strategy.md)** - 기본 개념 이해
2. **[프롬프트 작성 가이드](./claude.prompt.md)** - 효과적인 커뮤니케이션
3. **[워크플로우 전략](./claude.workflow.md)** - 실무 적용
4. **[멀티에이전트](./claude.agent.md)** - 작업 자동화
5. **[MCP 연동](./claude.mcp.md)** - 외부 도구 통합
6. **[확장 기능](./claude.extension.md)** - 커스터마이징

---

## 💡 핵심 원칙

### 모델 선택
- **복잡한 작업**: Sonnet 4.5 (아키텍처 설계, 리팩토링)
- **일반 작업**: Sonnet 4.5 (기능 구현, 테스트)
- **단순 작업**: Haiku 4 (유틸리티, 문서화)

### 프롬프트 작성
- **구체적 요구사항**: "SOLID 원칙을 준수하며 Kotlin 관용구를 활용한 코드"
- **제약사항 명시**: 사용할 라이브러리, 따라야 할 패턴
- **예시 제공**: 기대하는 출력 형식이나 스타일
- **단계적 요청**: 복잡한 작업은 여러 단계로 분할

### 컨텍스트 관리
- 메모리 파일로 프로젝트 컨벤션 관리
- 관련 코드만 공유 (전체 파일 대신 발췌)
- 프롬프트 캐싱으로 비용 절감

---

## 🛠️ 기술 스택

**주요 타겟:**
- **언어**: Kotlin 2.0+
- **프레임워크**: Spring Boot 3.3+
- **빌드 도구**: Gradle
- **Java**: 21+
- **아키텍처**: Hexagonal Architecture (Ports & Adapters)
- **테스트**: JUnit5, Kotest, Mockk, TestContainers

---

## 📖 참고 자료

### 공식 문서
- [Claude Code 공식 문서](https://docs.claude.com/en/docs/claude-code)
- [Anthropic API 문서](https://docs.anthropic.com/)
- [Model Context Protocol](https://modelcontextprotocol.io)

### 아키텍처 & 설계
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Kotlin 공식 문서](https://kotlinlang.org/docs/home.html)

---

## 🤝 기여

이 가이드를 개선하고 싶으신가요? 다음과 같이 기여해주세요:

1. 새로운 실무 시나리오 추가
2. 사용자 정의 명령어 예시 공유
3. 베스트 프랙티스 업데이트
4. 오타 및 오류 수정

---

## 📝 라이선스

이 가이드는 학습 및 팀 내부에서 자유롭게 사용하고 수정할 수 있습니다.

---

## 📅 업데이트 정보

**최종 업데이트**: 2025-01-20
**작성자**: Claude Code Study Group

---

## ⭐ Quick Links

### 가장 실용적인 가이드
1. [사용자 정의 명령어](./docs/08-custom-commands.md) - 생산성 10배 향상
2. [프롬프트 작성 가이드](./claude.prompt.md) - 효과적인 커뮤니케이션
3. [메모리 시스템](./docs/03-memory-system.md) - 컨텍스트 관리

### 초보자를 위한 가이드
1. [효율성 전략 가이드](./claude.efficiency-strategy.md) - 기본 개념
2. [워크플로우 전략](./claude.workflow.md) - 단계별 학습
3. [프로젝트 설계](./docs/01-project-design.md) - 실습 시작

### 고급 사용자를 위한 가이드
1. [멀티에이전트](./claude.agent.md) - 작업 자동화
2. [MCP 연동](./claude.mcp.md) - 도구 통합
3. [확장 기능](./claude.extension.md) - 커스터마이징

---

**Happy Coding with Claude! 🚀**
