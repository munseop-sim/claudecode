# 멀티에이전트

## 클로드 코드의 Task Tool과 서브에이전트

### 개요
Task Tool은 Claude Code에서 복잡한 작업을 자율적으로 수행하는 전문화된 서브에이전트를 실행할 수 있는 도구입니다. 각 서브에이전트는 특정 목적에 최적화되어 있으며, 여러 에이전트를 동시에 실행하여 병렬 처리가 가능합니다.

### 설정
Task Tool은 기본 제공되며 별도 설정이 필요하지 않습니다. 단, 효율적인 사용을 위해서는:
- 작업 범위와 목적을 명확히 정의
- 적절한 서브에이전트 타입 선택
- 병렬 실행 가능 여부 판단

### 주요 서브에이전트 타입

#### 1. general-purpose
**용도**: 복잡한 리서치, 코드 검색, 다단계 작업
**사용 예시**:
```
"헥사고날 아키텍처의 application 레이어에서 사용되는 모든 UseCase 인터페이스를 찾아서
구현 패턴을 분석하고, 누락된 테스트 케이스를 찾아줘"
```

**실무 활용**:
- 멀티모듈 간 의존성 분석 및 순환 참조 탐지
- 도메인 이벤트 발행/구독 패턴 일관성 검증
- API 엔드포인트와 유즈케이스 매핑 관계 추적

#### 2. Explore (quick/medium/very thorough)
**용도**: 코드베이스 탐색, 파일 패턴 검색, 키워드 검색
**thoroughness 레벨**:
- `quick`: 기본 검색 (단일 패턴, 빠른 응답)
- `medium`: 중간 탐색 (여러 위치 검색)
- `very thorough`: 심층 분석 (모든 변형 및 네이밍 컨벤션 탐색)

**사용 예시**:
```kotlin
// quick - 특정 파일 찾기
"adapter/out/**/JpaRepository*.kt 패턴으로 모든 JPA 리포지토리 찾아줘"

// medium - 관련 구현 탐색
"UserService 관련된 모든 구현 클래스와 테스트 코드 찾아줘"

// very thorough - 아키텍처 패턴 분석
"포트/어댑터 패턴이 올바르게 구현되어 있는지 전체 모듈에서 검증해줘"
```

**실무 활용**:
- Gradle 멀티모듈 구조에서 특정 의존성 사용 현황 파악
- `@Transactional` 사용 패턴 및 전파 레벨 일관성 체크
- 공통 예외 처리 전략 구현 현황 분석

### 병렬 실행 전략

여러 에이전트를 동시에 실행하여 효율성을 극대화할 수 있습니다:

```kotlin
// 예시: 리팩토링 전 분석
"다음 작업을 병렬로 실행해줘:
1. domain 모듈의 모든 엔티티 분석 (Explore - medium)
2. application 모듈의 UseCase 패턴 분석 (Explore - medium)
3. adapter 모듈의 외부 API 호출 패턴 분석 (general-purpose)
4. 전체 모듈의 테스트 커버리지 확인 (general-purpose)"
```

### 실무 시나리오별 활용

#### 시나리오 1: 새로운 도메인 기능 추가
```
1. Explore (medium): 유사 기능의 기존 구현 패턴 탐색
2. general-purpose: 영향받는 모듈 및 인터페이스 분석
3. Explore (quick): 필요한 공통 유틸리티 존재 여부 확인
```

#### 시나리오 2: 성능 최적화
```
1. general-purpose: N+1 쿼리 문제 탐지 (JPA 관련 코드)
2. Explore (very thorough): 캐시 적용 현황 및 일관성 분석
3. general-purpose: 비동기 처리 적용 가능 지점 식별
```

#### 시나리오 3: 레거시 코드 리팩토링
```
1. Explore (very thorough): 대상 코드의 모든 의존 관계 파악
2. general-purpose: 테스트 코드 존재 여부 및 품질 검증
3. Explore (medium): 리팩토링 패턴 적용 가능 여부 분석
```

### 주의사항
- 에이전트는 상태를 유지하지 않음 (각 실행은 독립적)
- 코드 작성 vs 리서치 목적을 명확히 구분하여 지시
- 에이전트 출력은 신뢰 가능하지만, 최종 검증은 개발자가 수행

---

## Custom Subagent

### 개요
Custom Subagent는 프로젝트 특화된 작업 흐름을 자동화하기 위해 직접 정의하는 맞춤형 에이전트입니다. `.claude/subagents/` 디렉토리에 YAML 파일로 정의하며, 반복적인 작업을 일관되게 수행할 수 있습니다.

### 설정
1. 디렉토리 생성: `.claude/subagents/`
2. YAML 파일 작성: `<agent-name>.subagent.yaml`
3. 파일 구조:
```yaml
name: "에이전트 이름"
description: "에이전트 설명 및 사용 시점"
tools: ["도구1", "도구2", ...]
instructions: |
  에이전트가 수행할 작업의 상세 지침
```

### 실무 예시: Kotlin/Spring 헥사고날 아키텍처

#### 1. 유즈케이스 생성 에이전트
**파일**: `.claude/subagents/create-usecase.subagent.yaml`
```yaml
name: "create-usecase"
description: "헥사고날 아키텍처의 새로운 유즈케이스를 생성합니다. 인터페이스(포트)와 구현체를 자동으로 생성하고 필요한 테스트 코드를 작성합니다."
tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
instructions: |
  # 유즈케이스 생성 워크플로우

  1. 기존 패턴 분석
     - application/port/in 디렉토리에서 유사한 유즈케이스 인터페이스 탐색
     - 네이밍 컨벤션 확인 (예: {Action}{Entity}UseCase)
     - 공통 응답 타입 (Result, Response) 패턴 확인

  2. 인터페이스 생성 (application/port/in)
     ```kotlin
     interface {Action}{Entity}UseCase {
         fun execute(command: {Action}{Entity}Command): {Action}{Entity}Result
     }

     data class {Action}{Entity}Command(
         // 입력 파라미터
     )

     sealed class {Action}{Entity}Result {
         data class Success(val data: {Entity}) : {Action}{Entity}Result()
         data class Failure(val error: ErrorType) : {Action}{Entity}Result()
     }
     ```

  3. 구현체 생성 (application/service)
     ```kotlin
     @UseCase
     @Transactional
     class {Action}{Entity}Service(
         // 필요한 포트 주입
     ) : {Action}{Entity}UseCase {
         override fun execute(command: {Action}{Entity}Command): {Action}{Entity}Result {
             // 구현
         }
     }
     ```

  4. 테스트 코드 생성
     - 단위 테스트: application/service 테스트
     - 통합 테스트: adapter/in/web 또는 adapter/in/api 테스트
     - 픽스처 및 모킹 패턴 적용

  5. 검증
     - Gradle 빌드 성공 확인
     - 코드 스타일 검증 (ktlint)
     - 아키텍처 규칙 준수 확인 (ArchUnit 테스트)
```

**사용법**:
```
"CreateUser 유즈케이스를 create-usecase 에이전트로 생성해줘.
이메일 중복 검증과 비밀번호 암호화가 필요해."
```

#### 2. 어댑터 생성 에이전트
**파일**: `.claude/subagents/create-adapter.subagent.yaml`
```yaml
name: "create-adapter"
description: "외부 시스템 연동을 위한 아웃바운드 어댑터를 생성합니다. 포트 인터페이스, 어댑터 구현, 설정 클래스를 포함합니다."
tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
instructions: |
  # 아웃바운드 어댑터 생성 워크플로우

  1. 포트 인터페이스 생성 (application/port/out)
     ```kotlin
     interface {Action}{Entity}Port {
         fun {action}(param: ParamType): ResultType
     }
     ```

  2. 어댑터 구현 선택
     - JPA: JpaRepository, Entity, Mapper
     - REST API: RestTemplate/WebClient, DTO
     - Event: Kafka Producer/Consumer
     - Cache: Redis Template

  3. 어댑터 구현 (adapter/out/{type})
     ```kotlin
     @Component
     class {Type}{Entity}Adapter(
         // 필요한 의존성
     ) : {Action}{Entity}Port {
         override fun {action}(param: ParamType): ResultType {
             // 구현
         }
     }
     ```

  4. 설정 클래스 (필요시)
     - JPA: @EntityScan, @EnableJpaRepositories
     - REST: RestTemplate/WebClient Bean
     - Event: KafkaTemplate Configuration

  5. 테스트 코드
     - 단위 테스트: 어댑터 로직 테스트
     - 통합 테스트: @DataJpaTest, @RestClientTest 등
     - Testcontainers 활용 (DB, Kafka, Redis)

  6. 문서화
     - application.yml 설정 항목 추가
     - README에 외부 의존성 명시
```

#### 3. API 엔드포인트 생성 에이전트
**파일**: `.claude/subagents/create-api.subagent.yaml`
```yaml
name: "create-api"
description: "REST API 엔드포인트를 생성합니다. Controller, Request/Response DTO, API 문서, 테스트를 포함합니다."
tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
instructions: |
  # API 엔드포인트 생성 워크플로우

  1. 기존 API 패턴 분석
     - adapter/in/web/controller 구조 확인
     - 공통 응답 포맷 확인 (ApiResponse wrapper)
     - 예외 처리 전략 확인 (@ControllerAdvice)

  2. Controller 생성
     ```kotlin
     @RestController
     @RequestMapping("/api/v1/{resource}")
     class {Entity}Controller(
         private val {action}UseCase: {Action}{Entity}UseCase
     ) {
         @PostMapping
         fun {action}(
             @Valid @RequestBody request: {Action}{Entity}Request
         ): ResponseEntity<ApiResponse<{Entity}Response>> {
             return when (val result = {action}UseCase.execute(request.toCommand())) {
                 is Success -> ResponseEntity.ok(ApiResponse.success(result.data.toResponse()))
                 is Failure -> ResponseEntity.badRequest().body(ApiResponse.error(result.error))
             }
         }
     }
     ```

  3. DTO 생성
     - Request: 입력 검증 애노테이션 (@NotBlank, @Email 등)
     - Response: 필요한 필드만 노출
     - Mapper 확장 함수

  4. API 문서화
     - Swagger/SpringDoc 애노테이션
     - @Operation, @ApiResponse 등
     - 예시 요청/응답 작성

  5. 테스트 코드
     - @WebMvcTest 단위 테스트
     - MockMvc를 사용한 엔드포인트 테스트
     - 요청 검증, 응답 검증, 예외 시나리오

  6. 보안 설정 확인
     - Spring Security 설정 확인
     - 인증/인가 요구사항 적용
```

#### 4. 아키텍처 검증 에이전트
**파일**: `.claude/subagents/verify-architecture.subagent.yaml`
```yaml
name: "verify-architecture"
description: "헥사고날 아키텍처 규칙 준수 여부를 검증합니다. 모듈 간 의존성, 레이어 분리, 네이밍 컨벤션을 체크합니다."
tools: ["Read", "Glob", "Grep", "Bash"]
instructions: |
  # 아키텍처 검증 워크플로우

  1. 모듈 구조 검증
     - domain: 외부 의존성 없음 (순수 Kotlin)
     - application: domain만 의존
     - adapter: application 및 domain 의존
     - 순환 참조 검증

  2. 패키지 구조 검증
     - domain/{entity}/
     - application/port/{in,out}/
     - application/service/
     - adapter/{in,out}/{type}/

  3. 의존성 방향 검증
     - adapter -> application -> domain (단방향)
     - port 인터페이스와 구현체 분리
     - 도메인 객체가 외부 프레임워크 의존하지 않음

  4. 네이밍 컨벤션 검증
     - UseCase 인터페이스: {Action}{Entity}UseCase
     - Port 인터페이스: {Action}{Entity}Port
     - Service 구현: {Action}{Entity}Service
     - Adapter 구현: {Type}{Entity}Adapter

  5. 애노테이션 사용 검증
     - @UseCase는 application/service에만
     - @Component는 adapter에만
     - @Entity는 adapter/out/jpa에만 (도메인 모델과 분리)

  6. ArchUnit 테스트 실행
     - 레이어 의존성 규칙 테스트
     - 네이밍 규칙 테스트
     - 애노테이션 사용 규칙 테스트

  7. 리포트 생성
     - 위반 사항 목록
     - 개선 제안
     - 우선순위 지정
```

### 고급 활용: 체이닝 및 조합

여러 에이전트를 순차적으로 실행하여 복잡한 워크플로우 구현:

```
"다음 작업을 순서대로 실행해줘:
1. create-usecase로 RegisterUser 유즈케이스 생성
2. create-adapter로 UserRepository JPA 어댑터 생성
3. create-api로 POST /api/v1/users 엔드포인트 생성
4. verify-architecture로 아키텍처 규칙 검증"
```

### 모범 사례
- 에이전트는 단일 책임 원칙 준수
- 명확한 입력/출력 정의
- 기존 코드 패턴 분석 후 생성
- 생성 후 자동 검증 포함
- 팀 컨벤션 문서화 및 반영

---

## Claude Squad

### 개요
Claude Squad는 GitHub 저장소 기반으로 여러 개발자와 협업하는 것처럼 각각의 전문화된 역할을 가진 에이전트들이 협력하여 작업하는 시스템입니다. 프로젝트를 GitHub에 푸시하고, 각 에이전트가 브랜치를 생성하여 PR을 제출하는 방식으로 동작합니다.

### 설정

#### 1. 프로젝트 준비
```bash
# GitHub 저장소 생성 및 푸시
git init
git remote add origin https://github.com/{org}/{repo}.git
git push -u origin main

# .claude/squad/ 디렉토리 생성
mkdir -p .claude/squad
```

#### 2. Squad 멤버 정의
각 에이전트는 `.claude/squad/{role}.agent.yaml` 형식으로 정의합니다.

#### 예시: Backend 팀 Squad

**파일**: `.claude/squad/architect.agent.yaml`
```yaml
name: "architect"
role: "Software Architect"
description: "아키텍처 설계 및 기술 의사결정 담당"
expertise:
  - "헥사고날 아키텍처 설계"
  - "멀티모듈 구조 설계"
  - "기술 스택 선정"
  - "아키텍처 문서 작성"
tools: ["Read", "Write", "Glob", "Grep", "Bash"]
responsibilities: |
  1. 새로운 기능의 아키텍처 설계
  2. 모듈 간 의존성 관리
  3. 기술 부채 식별 및 개선 방안 제시
  4. ADR (Architecture Decision Record) 작성
  5. 아키텍처 규칙 정의 (ArchUnit)
workflow: |
  1. 요구사항 분석
  2. 아키텍처 설계 문서 작성 (docs/architecture/)
  3. 모듈 구조 및 인터페이스 정의
  4. ArchUnit 테스트 작성
  5. PR 생성 (라벨: architecture)
```

**파일**: `.claude/squad/backend-developer.agent.yaml`
```yaml
name: "backend-developer"
role: "Backend Developer"
description: "비즈니스 로직 및 API 구현 담당"
expertise:
  - "Kotlin/Spring Boot 개발"
  - "UseCase 및 Service 구현"
  - "JPA/Querydsl"
  - "REST API 설계 및 구현"
tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
responsibilities: |
  1. 유즈케이스 구현
  2. 도메인 로직 구현
  3. API 엔드포인트 구현
  4. 데이터베이스 스키마 설계
  5. 비즈니스 로직 테스트 작성
workflow: |
  1. architect가 정의한 인터페이스 확인
  2. 유즈케이스 구현 (application/service)
  3. 도메인 모델 구현 (domain)
  4. 어댑터 구현 (adapter/out)
  5. API 컨트롤러 구현 (adapter/in/web)
  6. 단위 테스트 작성
  7. PR 생성 (라벨: feature)
dependencies:
  - architect
```

**파일**: `.claude/squad/qa-engineer.agent.yaml`
```yaml
name: "qa-engineer"
role: "QA Engineer"
description: "품질 보증 및 테스트 자동화 담당"
expertise:
  - "통합 테스트 작성"
  - "E2E 테스트 시나리오"
  - "Testcontainers"
  - "성능 테스트"
tools: ["Read", "Write", "Edit", "Bash", "Grep"]
responsibilities: |
  1. 통합 테스트 시나리오 설계 및 구현
  2. API 테스트 자동화
  3. 테스트 커버리지 관리
  4. 성능 테스트 및 부하 테스트
  5. 버그 리포트 작성
workflow: |
  1. backend-developer의 PR 리뷰
  2. 통합 테스트 시나리오 작성
  3. Testcontainers 기반 테스트 구현
  4. API 계약 테스트 (RestAssured)
  5. 성능 테스트 (k6, Gatling)
  6. 테스트 리포트 생성
  7. PR에 테스트 결과 코멘트
dependencies:
  - backend-developer
```

**파일**: `.claude/squad/devops.agent.yaml`
```yaml
name: "devops"
role: "DevOps Engineer"
description: "CI/CD 및 인프라 관리 담당"
expertise:
  - "GitHub Actions"
  - "Gradle 빌드 최적화"
  - "Docker/Kubernetes"
  - "모니터링 설정"
tools: ["Read", "Write", "Edit", "Bash"]
responsibilities: |
  1. CI/CD 파이프라인 구축
  2. 빌드 스크립트 최적화
  3. Docker 이미지 생성
  4. 배포 자동화
  5. 모니터링 및 알람 설정
workflow: |
  1. GitHub Actions 워크플로우 설정
  2. Gradle 빌드 캐싱 최적화
  3. Multi-stage Docker 빌드
  4. Kubernetes manifest 작성
  5. 모니터링 대시보드 설정 (Grafana)
  6. PR 생성 (라벨: devops)
```

**파일**: `.claude/squad/code-reviewer.agent.yaml`
```yaml
name: "code-reviewer"
role: "Code Reviewer"
description: "코드 리뷰 및 품질 관리 담당"
expertise:
  - "코드 품질 분석"
  - "Best Practice 적용"
  - "리팩토링 제안"
  - "보안 취약점 검토"
tools: ["Read", "Grep", "Bash"]
responsibilities: |
  1. PR 코드 리뷰
  2. 코딩 컨벤션 준수 확인
  3. 잠재적 버그 및 안티패턴 식별
  4. 성능 최적화 제안
  5. 보안 이슈 검토
workflow: |
  1. 새로운 PR 감지
  2. 코드 변경 사항 분석
  3. 정적 분석 도구 실행 (ktlint, detekt)
  4. 아키텍처 규칙 검증
  5. 리뷰 코멘트 작성
  6. 개선 사항 제안
review_checklist: |
  - [ ] 헥사고날 아키텍처 원칙 준수
  - [ ] 의존성 방향 올바름
  - [ ] 테스트 코드 존재 및 충분성
  - [ ] 예외 처리 적절함
  - [ ] 트랜잭션 경계 올바름
  - [ ] 로깅 적절함
  - [ ] 성능 고려사항 반영
  - [ ] 보안 취약점 없음
  - [ ] 문서화 충분함
```

### 사용 방법

#### 1. Squad 실행
```
"architect, backend-developer, qa-engineer를 squad로 실행해서
주문 취소 기능을 구현해줘.
환불 처리와 재고 복구가 포함되어야 해."
```

#### 2. 워크플로우
1. **Architect**: 설계 문서 및 인터페이스 정의 → PR 생성
2. **Backend Developer**: Architect의 설계를 바탕으로 구현 → PR 생성
3. **QA Engineer**: Backend Developer의 PR에 테스트 추가 → 코멘트 또는 별도 PR
4. **Code Reviewer**: 모든 PR 리뷰 및 피드백 → 코멘트
5. **DevOps**: CI/CD 파이프라인 검증 및 배포 스크립트 → PR 생성

#### 3. 실무 시나리오

**시나리오 1: 대규모 기능 개발**
```
"squad 전체를 투입해서 결제 시스템을 구현해줘.
요구사항:
- PG사 연동 (Toss Payments)
- 결제 상태 관리 (FSM 패턴)
- 결제 이벤트 발행 (Kafka)
- 멱등성 보장
- 실패 시 재시도 및 보상 트랜잭션"

실행 순서:
1. architect: 결제 도메인 설계, 이벤트 스토밍, FSM 설계
2. backend-developer: 결제 유즈케이스, PG 어댑터, 이벤트 발행
3. qa-engineer: 통합 테스트, 결제 시나리오 테스트, 멱등성 테스트
4. devops: Kafka 설정, 배포 파이프라인, 모니터링
5. code-reviewer: 전체 PR 리뷰 및 보안 검토
```

**시나리오 2: 레거시 리팩토링**
```
"architect와 backend-developer를 투입해서
UserService를 헥사고날 아키텍처로 리팩토링해줘"

실행 순서:
1. architect: 현재 구조 분석, 리팩토링 계획 수립, 인터페이스 재설계
2. backend-developer: 점진적 리팩토링 수행, Strangler Fig 패턴 적용
3. qa-engineer: 회귀 테스트 작성 및 실행
4. code-reviewer: 리팩토링 품질 검증
```

### 고급 설정: Squad 조율

**파일**: `.claude/squad/squad-coordinator.yaml`
```yaml
name: "squad-coordinator"
role: "Squad Coordinator"
description: "Squad 멤버 간 작업 조율 및 병렬 실행 관리"
coordination_strategy: |
  1. 의존성 그래프 분석
     - architect → backend-developer → qa-engineer
     - devops (병렬 실행 가능)
     - code-reviewer (모든 PR에 대해)

  2. 병렬 실행 가능 작업 식별
     - 여러 모듈에 걸친 독립적인 기능
     - 인프라 작업 (devops)
     - 문서화 작업

  3. PR 전략
     - Draft PR: 초기 구현 단계
     - Ready for Review: 자가 검증 완료
     - 자동 리뷰 요청: code-reviewer 배정

  4. 충돌 해결
     - 동일 파일 수정 시 순차 실행
     - 브랜치 전략: feature/{agent-name}/{feature-name}
```

### 모범 사례
- 명확한 역할 분담 및 책임 정의
- 의존성 순서 준수 (dependencies 필드)
- PR 단위는 리뷰 가능한 크기로 제한
- Squad 멤버 간 통신은 PR 코멘트 활용
- 자동화된 검증 (CI/CD, 정적 분석)

---

## Claude Swarm

### 개요
Claude Swarm은 대규모 코드베이스에서 여러 에이전트가 분산 방식으로 동시에 작업하는 시스템입니다. Squad가 협업에 초점을 맞춘다면, Swarm은 규모와 속도에 초점을 맞춥니다. 멀티모듈 프로젝트에서 각 모듈별로 독립적인 에이전트가 작업하거나, 대량의 반복 작업을 병렬로 처리할 때 유용합니다.

### 설정

#### 1. Swarm 정의
**파일**: `.claude/swarm/swarm-config.yaml`
```yaml
swarm_name: "backend-parallel-swarm"
description: "멀티모듈 백엔드 프로젝트의 병렬 작업 처리"
strategy: "divide-and-conquer"
max_concurrent_agents: 8
coordination_mode: "autonomous"  # autonomous | coordinated

modules:
  - name: "user-module"
    path: "modules/user"
  - name: "order-module"
    path: "modules/order"
  - name: "payment-module"
    path: "modules/payment"
  - name: "inventory-module"
    path: "modules/inventory"
  - name: "notification-module"
    path: "modules/notification"

task_distribution:
  type: "module-based"  # module-based | feature-based | file-based
```

#### 2. Worker 에이전트 템플릿
**파일**: `.claude/swarm/worker-template.yaml`
```yaml
name: "swarm-worker-{id}"
role: "Autonomous Worker"
capabilities:
  - "코드 분석"
  - "리팩토링"
  - "테스트 작성"
  - "문서 생성"
tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
operating_mode: "autonomous"
reporting: "results-only"  # 작업 완료 후 결과만 보고
```

### 실무 활용 시나리오

#### 시나리오 1: 전체 모듈 의존성 업그레이드
```
"swarm을 사용해서 모든 모듈의 Spring Boot를 3.2.0에서 3.3.0으로 업그레이드해줘"

Swarm 실행 계획:
- 워커 수: 5 (모듈 수)
- 작업 범위: 각 모듈의 build.gradle.kts
- 병렬 처리: 모든 워커 동시 실행

각 워커 작업:
1. build.gradle.kts 버전 업데이트
2. 의존성 호환성 체크
3. 빌드 테스트 실행
4. 마이그레이션 가이드 확인
5. Breaking changes 처리
6. 전체 테스트 실행
7. 결과 보고
```

#### 시나리오 2: 전체 엔티티 Auditing 추가
```
"모든 JPA 엔티티에 @EntityListeners(AuditingEntityListener::class)와
created/updated 필드를 추가해줘"

Swarm 실행 계획:
- 워커 수: 8 (동시 처리)
- 작업 범위: adapter/out/jpa/**/*Entity.kt
- 협업 모드: autonomous

작업 분배:
1. 모든 Entity 파일 스캔
2. 파일을 워커에 균등 분배
3. 각 워커가 할당된 파일 처리:
   - BaseEntity 상속 또는 필드 추가
   - @EntityListeners 애노테이션 추가
   - created_at, updated_at 컬럼 추가
   - Liquibase/Flyway 마이그레이션 스크립트 생성
4. 충돌 검사 및 병합
```

#### 시나리오 3: API 문서 자동 생성
```
"모든 REST API 엔드포인트에 Swagger 문서를 추가해줘"

Swarm 실행 계획:
- 작업 단위: Controller 파일
- 병렬 처리: 파일 단위

각 워커 작업:
1. Controller 분석
2. @Operation, @ApiResponse 추가
3. Request/Response 스키마 문서화
4. 예시 코드 작성
5. 에러 응답 문서화
```

#### 시나리오 4: 전체 로깅 표준화
```
"모든 서비스 클래스에 구조화된 로깅을 적용해줘"

작업 내용:
- logger 초기화: private val logger = LoggerFactory.getLogger(javaClass)
- 메서드 시작: logger.info("Starting {}", method, structured_params)
- 메서드 종료: logger.info("Completed {}", method, result)
- 예외 처리: logger.error("Failed {}", method, exception)

Swarm 이점:
- 100개 이상의 서비스 클래스를 동시 처리
- 일관된 로깅 패턴 보장
- 수동 작업 대비 시간 단축
```

### Swarm 조율 전략

#### 1. Autonomous Mode (자율 모드)
```yaml
coordination_mode: "autonomous"
characteristics:
  - 각 워커가 독립적으로 작업
  - 충돌 가능성 낮은 작업에 적합
  - 최대 속도 및 효율성
  - 최소한의 동기화
use_cases:
  - 독립적인 모듈별 작업
  - 읽기 전용 분석 작업
  - 파일별 독립 작업
```

#### 2. Coordinated Mode (조율 모드)
```yaml
coordination_mode: "coordinated"
characteristics:
  - 중앙 조율자가 작업 분배
  - 의존성 고려한 순차 처리
  - 충돌 방지 메커니즘
  - 진행 상황 실시간 모니터링
use_cases:
  - 공유 파일 수정
  - 의존성 있는 작업
  - 트랜잭션 보장 필요
```

### 성능 최적화

#### 작업 분배 전략
```yaml
load_balancing:
  strategy: "work-stealing"  # round-robin | work-stealing | hash-based

  # 작업 복잡도 기반 분배
  complexity_estimation:
    - file_size: 0.3
    - dependency_count: 0.5
    - test_coverage: 0.2

  # 동적 재분배
  dynamic_rebalancing: true
  rebalancing_threshold: 0.3  # 30% 불균형 시 재분배
```

#### 충돌 해결
```yaml
conflict_resolution:
  strategy: "optimistic-locking"

  detection:
    - 파일 수정 타임스탬프 체크
    - Git 상태 모니터링

  resolution:
    - 먼저 완료된 작업 우선 적용
    - 충돌 발생 시 다른 워커 재실행
    - 자동 병합 시도
    - 수동 해결 필요 시 알림
```

### 모니터링 및 결과 집계

**파일**: `.claude/swarm/swarm-monitor.yaml`
```yaml
monitoring:
  real_time_dashboard: true
  metrics:
    - name: "작업 완료율"
      formula: "completed / total * 100"
    - name: "평균 처리 시간"
      formula: "sum(duration) / completed"
    - name: "에러율"
      formula: "errors / total * 100"

  alerts:
    - condition: "error_rate > 10%"
      action: "pause_swarm"
    - condition: "avg_duration > 5min"
      action: "notify_coordinator"

result_aggregation:
  format: "markdown"
  sections:
    - summary: "전체 작업 개요"
    - completed: "완료된 작업 목록"
    - failed: "실패한 작업 및 원인"
    - changes: "변경 사항 통계"
    - next_steps: "후속 조치 필요 항목"
```

### 실행 예시

```bash
# 1. Swarm 초기화
"swarm을 초기화해줘. 8개 워커로 모든 모듈에
Kotlin 1.9.20을 적용하는 작업을 수행할거야"

# 2. 작업 분배 확인
# Coordinator: 5개 모듈 감지, 워커 8개 중 5개 활성화

# 3. 실시간 진행 상황
# Worker-1 (user-module): 완료 ✓
# Worker-2 (order-module): 진행 중 [=====     ] 50%
# Worker-3 (payment-module): 완료 ✓
# Worker-4 (inventory-module): 테스트 중...
# Worker-5 (notification-module): 완료 ✓

# 4. 결과 보고
"Swarm 작업 완료:
- 성공: 5/5 모듈
- 소요 시간: 3분 42초
- 변경 파일: 23개
- 테스트 통과: 187/187
- 다음 단계: 전체 통합 테스트 권장"
```

### 제약사항 및 주의사항

1. **리소스 제한**: 동시 실행 워커 수는 시스템 리소스 고려
2. **충돌 위험**: 동일 파일 수정 시 조율 모드 사용
3. **테스트 필수**: Swarm 작업 후 전체 테스트 실행
4. **점진적 적용**: 소규모 테스트 후 확대
5. **롤백 계획**: Git 커밋 단위로 작업하여 롤백 가능하도록

### Squad vs Swarm 비교

| 특성 | Squad | Swarm |
|------|-------|-------|
| 목적 | 협업 및 품질 | 규모 및 속도 |
| 에이전트 수 | 5-10개 (역할별) | 10-100개 (작업별) |
| 통신 | PR 리뷰, 코멘트 | 최소한 또는 없음 |
| 작업 유형 | 복잡한 기능 개발 | 반복적 대량 작업 |
| 의사결정 | 협의 및 리뷰 | 자율적 |
| 적합 상황 | 신규 기능, 아키텍처 변경 | 리팩토링, 업그레이드, 표준화 |

### 모범 사례
- 독립적 작업에만 Swarm 사용
- 작업 전 스냅샷/브랜치 생성
- 점진적 롤아웃 (일부 모듈 먼저 테스트)
- 작업 후 자동화된 검증 (CI)
- 결과 리뷰 및 수동 확인