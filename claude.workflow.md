# Claude 워크플로 전략 : Spring & Kotlin 개발 가이드

> **이 문서는 무엇인가요?**
> Spring Boot와 Kotlin을 사용한 실제 개발 과정에서 Claude를 효과적으로 활용하는 방법을 정리한 가이드입니다.
> 프로젝트 설계부터 테스트, 리팩토링, 문서화까지 전 과정을 다룹니다.

## 📚 목차

### 1. [프로젝트 설계](./docs/01-project-design.md)
프로젝트를 시작하기 전 아키텍처 선택, 패키지 구조, API 설계 등을 다룹니다.

**주요 내용**:
- 레이어드 아키텍처 vs 헥사고날 아키텍처
- 도메인 모델링 (Entity, DTO 설계)
- 패키지 구조 전략 (Layer-based vs Feature-based)
- RESTful API 설계 원칙
- Sealed Class를 활용한 응답 타입 설계

**Claude 활용 팁**:
- 요구사항 분석 및 아키텍처 추천 받기
- 패키지 구조 자동 설계
- 도메인 모델 설계 및 코드 생성

---

### 2. [부트스트래핑 : 프로젝트 초기 구성 자동화](./docs/02-bootstrapping.md)
프로젝트 초기 설정과 공통 컴포넌트 생성을 자동화합니다.

**주요 내용**:
- Spring Initializr 사용법
- application.yml 설정 (프로파일별 설정 포함)
- 공통 컴포넌트 (GlobalExceptionHandler, BaseEntity, Response Wrapper)
- Kotlin 코드 스타일 설정 (.editorconfig)

**Claude 활용 팁**:
- 프로젝트 초기 구조 일괄 생성
- 공통 컴포넌트 30분 → 1분으로 단축
- Docker 환경 설정 자동화

---

### 3. [테스트 : 클로드 코드와 함께하는 TDD](./docs/03-testing.md)
테스트 주도 개발(TDD)을 Claude와 함께 실천합니다.

**주요 내용**:
- 단위 테스트 (JUnit 5 + Kotest)
- 통합 테스트 (@SpringBootTest)
- Repository 테스트 (@DataJpaTest)
- Mockk를 활용한 Mocking

**Claude 활용 팁**:
- 테스트 케이스 자동 생성 (모든 엣지 케이스 포함)
- 테스트 커버리지 분석 및 누락된 케이스 찾기
- 통합 테스트 시나리오 작성
- 테스트 코드 리팩토링

---

### 4. [개선 : 코드리뷰, 리팩토링, 성능 최적화](./docs/04-improvement.md)
작성된 코드를 지속적으로 개선합니다.

**주요 내용**:
- Kotlin 관용적 코드로 리팩토링
- N+1 문제 해결
- QueryDSL 활용
- 코루틴을 활용한 비동기 처리
- AOP를 활용한 성능 모니터링

**Claude 활용 팁**:
- 코드 리뷰 자동화
- 리팩토링 제안 받기
- 성능 병목 찾기 및 최적화
- Java 스타일 → Kotlin 스타일 변환

---

### 5. [명세 작성 및 문서화 : 살아있는 문서 만들기](./docs/05-documentation.md)
코드와 함께 자동으로 업데이트되는 문서를 작성합니다.

**주요 내용**:
- Swagger/OpenAPI 설정
- API 문서화 애노테이션
- KDoc 작성
- Spring REST Docs로 테스트 기반 문서화
- README.md 템플릿

**Claude 활용 팁**:
- API 문서 자동 생성
- KDoc 일괄 생성
- README 작성 자동화
- ADR (Architecture Decision Record) 작성

---

## 🎯 이 가이드의 활용법

### 프로젝트 시작 단계
1. [프로젝트 설계](./docs/01-project-design.md)에서 아키텍처 결정
2. [부트스트래핑](./docs/02-bootstrapping.md)으로 초기 구조 생성

### 개발 단계
3. [테스트](./docs/03-testing.md)로 TDD 실천
4. [개선](./docs/04-improvement.md)으로 코드 품질 향상

### 완성 단계
5. [문서화](./docs/05-documentation.md)로 유지보수성 확보

---

## 💡 Claude 활용의 핵심 원칙

### 1. 구체적으로 요청하기
❌ "코드를 개선해줘"
✅ "다음 코드를 Kotlin 관용구를 적용해서 리팩토링해줘. scope functions도 활용해줘."

### 2. 컨텍스트 제공하기
프로젝트의 기술 스택, 아키텍처, 요구사항을 명확히 전달하세요.

### 3. 반복 작업 자동화하기
공통 컴포넌트, 테스트 코드, 문서화 등 반복적인 작업은 Claude에게 맡기세요.

### 4. 검토와 학습
Claude가 생성한 코드를 그대로 사용하지 말고, 이해하고 검토한 후 필요시 수정하세요.

---

## 📖 관련 자료

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Kotlin 공식 문서](https://kotlinlang.org/docs/home.html)
- [Claude Code 문서](https://docs.claude.com/en/docs/claude-code)

---

**만든 이**: Claude Code Study Group
**최종 수정일**: 2025-01-19