# Model Context Protocol (MCP)
- Model Context Protocol은 AI 모델이 외부 도구, 데이터베이스, API 등과 안전하게 연결할 수 있게 해주는 오픈 표준
프로토콜
## 핵심 개념
- AI와 외부 시스템 간의 표준화된 연결 방식
- 보안과 권한 관리가 내장된 구조
- 플러그인처럼 기능을 확장할 수 있는 아키텍처

# 🎯 Spring Kotlin 개발자에게 유용한 MCP들

## 1. 데이터베이스 연동
### 🔹 PostgreSQL MCP
- 데이터베이스 스키마 조회
- 쿼리 실행 및 결과 분석
- 인덱스 최적화 제안
### 🔹 Redis MCP
- 캐시 데이터 조회
- 성능 모니터링
- 키 패턴 분석

## 2. 개발 도구 연동
### 🔹 Git MCP
- 커밋 히스토리 분석
- 브랜치 관리
- 코드 리뷰 지원
### 🔹 Docker MCP
- 컨테이너 상태 모니터링
- 이미지 관리
- 로그 분석
### 🔹 Kubernetes MCP
- 클러스터 상태 확인
- 파드 로그 조회
- 리소스 사용량 모니터링

## 3. API 및 외부 서비스
### 🔹 Slack MCP
- 팀 커뮤니케이션
- 알림 발송
- 채널 메시지 조회
### 🔹 Jira MCP
- 이슈 생성/조회
- 스프린트 관리
- 프로젝트 상태 추적
### 📋 Linear MCP
- `npm install -g @linear/mcp-server`
- 주요 기능:
  - 빠른 이슈 트래킹
  - GitHub 연동
  - 자동 워크플로우
### 📝 Notion MCP
- `npm install -g @notion/mcp-server`
- 주요 기능:
  - 프로젝트 문서화
  - 팀 위키 관리
  - 태스크 데이터베이스

### 🔹 AWS MCP
- EC2, RDS 상태 확인
- CloudWatch 메트릭 조회
- S3 버킷 관리
## 4. 모니터링 & 로깅
### 🔹 Prometheus MCP
- 메트릭 조회
- 알럿 상태 확인
- 성능 분석
### 🔹 Elasticsearch MCP
- 로그 검색
- 에러 패턴 분석
- 성능 메트릭 조회

## 🚀 Claude Code에서 MCP 활용 예시
### 1. 데이터베이스 스키마 분석
- "MCP를 통해 현재 데이터베이스 스키마를 조회하고 User와 Order 테이블 간의 관계를 분석해줘"

### 2. 성능 모니터링
- "Redis MCP로 현재 캐시 히트율을 확인하고 UserService의 캐싱 전략을 개선해줘"

### 3. 배포 상태 확인
- "Kubernetes MCP로 API 서버 파드 상태를 확인하고 문제가 있다면 해결 방안을 제시해줘"

### 4. 코드 리뷰 자동화
"Git MCP로 최근 커밋을 분석하고 Spring Boot 모범 사례를 따르고 있는지 검토해줘"

## 🛠️ MCP 설정 방법
### 1. Claude Code 설정
- Claude Code 설정 파일에서 MCP 활성화 : `claude config set mcp.enabled true`

### 2. 필요한 MCP 설치

- 예: PostgreSQL MCP 설치 : `npm install -g @modelcontextprotocol/server-postgres`

- 설정 파일에 연결 정보 추가
    ```
    claude config mcp add postgres \
    --host localhost \
    --port 5432 \
    --database myapp \
    --user developer
    ```
- 권한 설정
    ```
    {
        "mcps": {
            "postgres": {
                "permissions": ["read", "schema"],
                "restrictions": ["no-delete", "no-drop"]
            }
        }
    }
    ```
## 💡 Spring Kotlin 개발자를 위한 추천 MCP 조합

### 🏗️ 개발 단계
1. Git MCP - 코드 변경사항 추적
2. PostgreSQL MCP - 스키마 설계 지원
3. Docker MCP - 로컬 개발 환경 관리

### 🧪 테스트 단계
1. TestContainers MCP - 통합 테스트 지원
2. WireMock MCP - API 모킹
3. JaCoCo MCP - 코드 커버리지 분석

### 🚀 배포 단계
1. Kubernetes MCP - 배포 상태 모니터링
2. AWS MCP - 클라우드 리소스 관리
3. Prometheus MCP - 성능 메트릭 수집

### 🔍 운영 단계
1. Elasticsearch MCP - 로그 분석
2. Slack MCP - 알림 및 커뮤니케이션
3. Jira MCP - 이슈 추적

## 🎯 실제 사용 시나리오

API 성능 이슈 해결

1. Prometheus MCP로 응답 시간 증가 감지
2. Elasticsearch MCP로 에러 로그 분석
3. PostgreSQL MCP로 느린 쿼리 식별
4. 코드 최적화 후 Git MCP로 변경사항 추적
5. Kubernetes MCP로 배포 후 상태 확인

새 기능 개발

1. Jira MCP로 요구사항 확인
2. Git MCP로 피처 브랜치 생성
3. PostgreSQL MCP로 스키마 변경 검토
4. Docker MCP로 로컬 테스트 환경 구성
5. Slack MCP로 팀에 진행 상황 공유

## 🔐 보안 고려사항

### 권한 최소화
```
{
    "postgres": {
        "permissions": ["read", "schema"],
        "denied": ["delete", "drop", "truncate"]
    }
}
```

### 환경별 분리
- 개발환경: 모든 권한
- 스테이징: 읽기 + 스키마 조회
- 운영환경: 읽기 전용