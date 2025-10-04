# 프롬프트 잘 작성하기
- 프롬프트란?
  - 프롬프트는 인공지능 모델에게 주어지는 입력 문장이나 질문을 의미
  - 좋은 프롬프트는 모델이 더 정확하고 유용한 답변을 생성하는 데 도움을 준다.

## 구성요소

### Context
- ❌ "버그 수정해줘"
- ✅ "UserController에서 POST /api/users 호출 시 500 에러가 발생해. 로그를 보니 email 중복 검사에서 문제가 있는 것
같아"
### 구체적인 요구사항
- ❌ "코드를 개선해줘"
- ✅ "UserService의 findById 메서드에서 사용자를 찾지 못했을 때 커스텀 예외를 던지도록 수정해줘"

### 예상결과물
- ❌ "테스트 작성해줘"
- ✅ "UserService.createUser() 메서드의 단위 테스트를 작성해줘. 성공 케이스와 이메일 중복 예외 케이스를 포함해서"

## 최적화 전략
### 1. 작업 + 위치 + 요구사항
```
"src/main/kotlin/service/UserService.kt의 findByEmail 메서드에
캐싱 기능을 추가해줘. @Cacheable 어노테이션을 사용하고
캐시 키는 email로 설정해줘"
```
### 2. 문제 상황 + 예상 원인 + 해결 방향
```
"API 응답 시간이 느려졌어. N+1 쿼리 문제인 것 같은데
UserRepository에서 Order와의 연관관계를 페치 조인으로
최적화해줘"
```
### 3. 기능 추가 + 제약사항 + 패턴
```
"상품 검색 API를 추가해줘.
- Querydsl을 사용해서 동적 쿼리 구현
- 이름, 카테고리, 가격 범위로 검색 가능
- 페이징 처리 포함
- 기존 ProductController 패턴을 따라서"
```


## 특수문자 숏컷으로 프롬프트 편의성 극대화
### `@` 파일참조
- 특정 파일이나 코드 위치를 직접 참조할 때 사용
- @ 키워드의 장점
  - 정확한 컨텍스트 제공 : Claude가 해당 파일을 직접 읽어서 정확한 정보를 바탕으로 작업합니다.
  - 파일 검색 시간 단축 : 파일명이나 패키지 구조를 설명할 필요 없이 바로 참조 가능합니다.
  - 다중 파일 작업 : 여러 파일을 동시에 참조해서 일관성 있는 수정이 가능합니다.
### `!` 명령어 실행
- `!` 키워드는 Claude에게 특정 명령어를 터미널에서 직접 실행할 때 사용
## 계층적 질문 전략

## 프롬프트 기법
### 1. 단계별 요청
```
"사용자 관리 기능을 단계별로 구현해줘:
1단계: User 엔티티와 UserRepository 먼저 만들어줘
2단계: 그 다음에 UserService 구현
3단계: 마지막에 UserController와 API 엔드포인트
각 단계마다 테스트도 함께 작성해줘"
```
### 2. 조건부 요청
```
"ProductService에 검색 기능을 추가해줘.
만약 Elasticsearch가 설정되어 있다면 그걸 사용하고,
없다면 JPA Specification을 사용해서 구현해줘.
먼저 현재 의존성을 확인해보고 판단해줘"
```
### 3. 참조 기반 요청
```
"UserController를 참고해서 ProductController를 만들어줘.
동일한 패턴(응답 형식, 예외 처리, 검증)을 따르되
Product 엔티티에 맞게 조정해줘"
```
### 🚫 피해야 할 프롬프트

- 너무 모호한 요청
    ```
    ❌ "코드 좀 봐줘"
    ❌ "에러가 나"
    ❌ "더 좋게 만들어줘"
    ```
- 너무 많은 요구사항을 한번에
    ```
    ❌ "사용자 관리, 상품 관리, 주문 관리, 결제 시스템,
    알림 기능을 모두 구현해줘"
    ```
- 구체적인 정보 없는 요청
    ```
    ❌ "API 만들어줘" (어떤 API? 어떤 기능?)
    ❌ "테스트 추가해줘" (어떤 클래스? 어떤 메서드?)
    ```
### 🎪 실전 예시 (Before & After)
  - Before (개선 전)
    ``` 
      "로그인 기능 만들어줘"   
    ```
  - After (개선 후)
    ```
        Spring Security를 사용해서 JWT 기반 로그인 API를 만들어줘:
        요구사항:
        - POST /auth/login 엔드포인트
        - 요청: LoginRequest(email, password)
        - 응답: LoginResponse(accessToken, refreshToken, userInfo)
        - 인증 실패 시 401 에러와 명확한 에러 메시지
    
        구현사항:
        1. AuthController에 login 메서드 추가
        2. AuthService에서 인증 로직 처리
        3. JwtTokenProvider로 토큰 생성
        4. 비밀번호는 BCrypt로 암호화 검증
        5. 실패 케이스별 예외 처리
    
        기존 SecurityConfig 설정을 유지하면서 추가해줘"
    ```


### 역할지정
### 단계적추론


# 🎯 상황별 프롬프트 예시

## 🔧 버그 수정
```
"UserController의 updateUser API에서 PATCH 요청 시
일부 필드만 업데이트하려고 하는데 null 값으로 덮어써져.
@JsonIgnore나 커스텀 매퍼를 사용해서 null이 아닌 값만
업데이트하도록 수정해줘"
```
## ✨ 기능 개발
```
"JWT 기반 인증 시스템을 구현해줘:
1. /auth/login 엔드포인트 (이메일/비밀번호)
2. JwtTokenProvider 클래스로 토큰 생성/검증
3. SecurityConfig에서 JWT 필터 설정
4. @PreAuthorize로 권한 체크
   기존 Spring Security 설정을 유지하면서 추가해줘"
```
## 🧪 테스트 작성
```
"OrderService의 createOrder 메서드 테스트를 작성해줘:
- 정상 주문 생성 케이스
- 재고 부족 예외 케이스
- 유효하지 않은 사용자 예외 케이스
  @ExtendWith(MockitoExtension::class) 사용하고
  given-when-then 패턴으로 작성해줘"
```
## 🏗️ 리팩토링
```
"UserService가 너무 커져서 책임을 분리하고 싶어.
- 인증 관련 로직 → AuthService로 분리
- 이메일 발송 로직 → EmailService로 분리
- 기존 UserService는 순수 CRUD만 담당
  의존성 주입 관계도 함께 정리해줘"
```
## 🔍 코드 분석
```
"이 프로젝트의 아키텍처를 분석해줘:
1. 패키지 구조와 레이어 분리 상태
2. 의존성 방향이 올바른지
3. Spring Boot 모범 사례를 따르고 있는지
4. 개선이 필요한 부분이 있다면 제안해줘"
```