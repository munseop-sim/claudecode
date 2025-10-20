# Claude 효율성 전략 가이드

> Kotlin/Spring/Gradle 헥사고날 아키텍처 멀티모듈 백엔드 개발자를 위한 실무 가이드

이 가이드는 Claude를 활용하여 Kotlin, Spring Boot, Gradle 기반의 헥사고날 아키텍처 멀티모듈 프로젝트를 효율적으로 개발하기 위한 전략과 베스트 프랙티스를 제공합니다.

---

## 📚 목차

### 핵심 가이드 (빠른 참조)

1️⃣ **[모델별 특징과 활용 전략](./docs/01-models-and-strategies.md)**
   - Claude Sonnet 4.5 (플래그십 모델)
   - Claude Haiku 4 (고속 모델)
   - 모델 선택 가이드

2️⃣ **[프롬프팅 전략](./docs/02-prompting-strategies.md)**
   - Chain of Thought (CoT) - 단계적 사고
   - Sequential Thinking - 순차적 사고
   - Tree of Thought (ToT) - 분기 사고
   - Reflective Thinking - 반성적 사고
   - Role-Based Prompting - 역할 기반 프롬프팅

3️⃣ **[메모리 시스템 활용](./docs/03-memory-system.md)** ⭐
   - 프로젝트 구조 메모리 파일
   - 코딩 컨벤션 메모리 파일
   - 의존성 관리 메모리 파일
   - API 설계 가이드 메모리 파일

8️⃣ **[사용자 정의 명령어](./docs/08-custom-commands.md)** ⭐ 가장 실용적!
   - 개요 및 프론트 메터
   - 내장 명령어 vs 사용자 정의 명령어
   - 명령어 관리 및 디렉토리 구조
   - 실무 활용 예시
     - 아키텍처 리뷰
     - 유스케이스 생성
     - 통합 테스트 생성
     - PR 생성
   - 명령어 조합 활용
   - 팀 공유 및 버전 관리
   - 베스트 프랙티스

### 전체 가이드

📖 **[전체 가이드 보기](./FULL_GUIDE.md)**
   - 모든 섹션을 포함한 완전판
   - 실무 시나리오별 활용 전략
   - 효율성 향상 팁
   - 주의사항 및 체크리스트

---

## 🚀 빠른 시작

### 1. 프로젝트 설정

```bash
# .claude/ 디렉토리 생성
mkdir -p .claude/commands/{architecture,development,testing,workflow}

# 프로젝트 메모리 파일 생성
touch .claude/{project-structure,coding-conventions,dependencies,api-design}.md
```

### 2. 메모리 파일 작성

각 프로젝트에 맞는 컨벤션과 구조를 `.claude/` 디렉토리에 작성하세요:
- [프로젝트 구조 예시](./docs/03-memory-system.md#프로젝트-구조-메모리-파일)
- [코딩 컨벤션 예시](./docs/03-memory-system.md#코딩-컨벤션-메모리-파일)

### 3. 사용자 정의 명령어 생성

반복적인 작업을 명령어로 자동화하세요:
- [유스케이스 생성 명령어](./docs/08-custom-commands.md#852-유스케이스-생성-명령어)
- [아키텍처 리뷰 명령어](./docs/08-custom-commands.md#851-아키텍처-리뷰-명령어)

---

## 💡 핵심 원칙

### 1. 모델 선택
- **복잡한 작업**: Sonnet 4.5 (아키텍처 설계, 리팩토링)
- **일반 작업**: Sonnet 4.5 (기능 구현, 테스트)
- **단순 작업**: Haiku 4 (유틸리티, 문서화)

### 2. 프롬프트 작성
- **구체적 요구사항**: "SOLID 원칙을 준수하며 Kotlin 관용구를 활용한 코드"
- **제약사항 명시**: 사용할 라이브러리, 따라야 할 패턴
- **예시 제공**: 기대하는 출력 형식이나 스타일
- **단계적 요청**: 복잡한 작업은 여러 단계로 분할

### 3. 컨텍스트 관리
- 메모리 파일로 프로젝트 컨벤션 관리
- 관련 코드만 공유 (전체 파일 대신 발췌)
- 프롬프트 캐싱으로 비용 절감

---

## 🏗️ 헥사고날 아키텍처 개발 워크플로

### 신규 기능 개발
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

### 레거시 리팩토링
```bash
# 1. 아키텍처 분석
claude /review-hexagonal payment

# 2. 리팩토링
claude "PaymentService를 헥사고날 아키텍처로 리팩토링"

# 3. 성능 검증
claude /optimize-performance "POST /api/payments"

# 4. PR 생성
claude /pr-create payment-refactor
```

---

## 🛠️ 기술 스택

- **언어**: Kotlin 2.0+
- **프레임워크**: Spring Boot 3.3+
- **빌드 도구**: Gradle
- **Java**: 21+
- **아키텍처**: Hexagonal Architecture (Ports & Adapters)
- **테스트**: JUnit5, Kotest, Mockk, TestContainers

---

## 📖 참고 자료

- [Claude Code 공식 문서](https://docs.claude.com/en/docs/claude-code)
- [Anthropic API 문서](https://docs.anthropic.com/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)

---

## 🤝 기여

이 가이드를 개선하고 싶으신가요? 다음과 같이 기여해주세요:

1. 새로운 실무 시나리오 추가
2. 사용자 정의 명령어 예시 공유
3. 베스트 프랙티스 업데이트
4. 오타 및 오류 수정

---

## 📝 라이선스

이 가이드는 팀 내부에서 자유롭게 사용하고 수정할 수 있습니다.

---

**Last Updated**: 2025-01-20
