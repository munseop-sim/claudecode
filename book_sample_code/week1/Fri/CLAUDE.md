# Project Context

고양이 댄싱 애니메이션 웹페이지 개발 프로젝트
- 고양이 이미지가 춤추는 애니메이션을 구현하는 React 웹페이지
- CSS 애니메이션 또는 JavaScript 기반 움직임 효과 적용

## Development Process - 7단계 개발 프로세스

사용자가 웹페이지 개발을 요청할 때 아래 7단계를 순차적으로 따라 진행하세요:

**절대 중요**: 사용자에게 1번만 물어보고 승인을 받는다. 승인 후에는 더 이상 질문하지 않고 모든 작업을 완료한다.

**작업 진행 방식**: 
- 각 단계는 한 번에 완전히 완료해야 함
- 단계를 세분화하여 2단계로 나누지 말고 1단계로 통합 진행
- 예: "프로젝트 생성" + "의존성 설치"를 별도로 나누지 말고 한 번에 처리
- 사용자 승인 후 추가 확인 없이 진행

### 1단계: React 프로젝트 초기 설정
- **Vite** 템플릿 사용 권장 (빠른 개발 서버)
- `npm create vite@latest [프로젝트명] -- --template react`
- 의존성 설치: `npm install`
- **중요**: 프로젝트 생성과 의존성 설치를 한 번에 실행
  - `npm create vite@latest [프로젝트명] -- --template react && cd [프로젝트명] && npm install`

### 2단계: 프로젝트 구조 생성 및 기본 파일 설정
- 필요한 폴더 구조 생성: `mkdir -p [프로젝트명]/src/components [프로젝트명]/src/assets/images [프로젝트명]/src/styles [프로젝트명]/src/hooks`
- 기존 템플릿 파일 정리 및 수정
- 전역 스타일 리셋 적용

### 3단계: 이미지/리소스 준비 및 최적화
- **SVG 형태** 벡터 이미지 제작 권장
- 반응형 대응을 위한 확장 가능한 형식
- `assets/images/` 폴더에 배치

### 4단계: 메인 컴포넌트 개발
- 핵심 기능을 담는 주요 컴포넌트 구현
- `useState` 등 React Hook 활용한 상태 관리
- 이벤트 핸들러 및 사용자 인터랙션 구현

### 5단계: CSS 애니메이션 구현 (keyframes)
- `@keyframes`를 활용한 애니메이션 정의
- `transform` 속성 활용: `translateY`, `rotate`, `scale`
- 부드러운 전환을 위한 `transition` 적용
- 성능 최적화를 고려한 GPU 가속 속성 사용

### 6단계: 반응형 디자인 적용
- 모바일, 태블릿, 데스크탑 대응
- `@media` 쿼리를 활용한 화면 크기별 최적화
- 터치 인터페이스 고려

### 7단계: 최종 애니메이션 제어 기능 추가
- 애니메이션 시작/정지 토글 기능
- 사용자 친화적인 컨트롤 UI
- 접근성 고려 (키보드 네비게이션 등)

### 개발 완료 후 서버 실행
- **중요**: 백그라운드 실행 금지
- `cd [프로젝트명] && npm run dev`
- 브라우저에서 정상 동작 확인

---

## Current Tasks (참고용)

- [x] React 프로젝트 초기 설정 (Vite 사용)
- [x] 고양이 이미지 리소스 준비 및 최적화 (SVG)
- [x] 춤추는 애니메이션 컴포넌트 개발
  - CSS keyframes 기반 애니메이션
  - 회전, 이동, 크기 변화 등 다양한 춤 동작 구현
- [x] 반응형 웹 디자인 적용
- [x] 애니메이션 성능 최적화
- [x] 애니메이션 제어 기능 완성

## Tech Stack

- **Frontend**: React 18+
- **언어**: JavaScript/TypeScript
- **스타일링**: CSS3 (keyframes), Styled-components, 또는 CSS Modules
- **빌드 도구**: Vite 또는 Create React App
- **이미지 최적화**: WebP, SVG 지원
- **배포**: GitHub Pages, Vercel, 또는 Netlify

## Development Commands

```bash
# 프로젝트 생성
npx create-react-app cat-dancing-page
# 또는
npm create vite@latest cat-dancing-page -- --template react

# 개발 서버 실행
npm run dev
# 또는
npm start

# 빌드
npm run build

# 테스트
npm test

# 타입 체크 (TypeScript 사용 시)
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── DancingCat.jsx        # 메인 고양이 댄싱 컴포넌트
│   ├── AnimationControls.jsx # 애니메이션 제어 UI
│   └── Layout.jsx            # 페이지 레이아웃
├── assets/
│   └── images/
│       └── cat.png           # 고양이 이미지 파일
├── styles/
│   ├── animations.css        # CSS 애니메이션 정의
│   └── global.css           # 전역 스타일
├── hooks/
│   └── useAnimation.js       # 애니메이션 관련 커스텀 훅
└── App.jsx                   # 메인 앱 컴포넌트
```

## Implementation Details

- **애니메이션 타입**: CSS keyframes를 사용한 연속적인 춤 동작
- **고양이 동작**: 좌우 흔들기, 점프, 회전, 크기 변화 조합
- **사용자 인터랙션**: 클릭으로 애니메이션 시작/정지 기능
- **반응형**: 모바일, 태블릿, 데스크탑 대응

---

# 개발 서버 실행 가이드

## 중요 사항: 백그라운드 실행 방지

웹 페이지 생성 후 개발 서버를 실행할 때는 반드시 **일반 실행 모드**를 사용하세요.

### ✅ 올바른 실행 방법
```bash
# 프로젝트 디렉토리로 이동 후 개발 서버 실행
cd cat-dancing-page
npm run dev

# 또는 한 줄로
cd cat-dancing-page && npm run dev
```

### ❌ 피해야 할 실행 방법
```bash
# 백그라운드 실행 금지 - 서버 상태 확인이 어려움
npm run dev &

# run_in_background 옵션 사용 금지
# 개발 서버는 실시간 모니터링이 필요
```

### 개발 서버 특징
- **실시간 핫 리로드**: 코드 변경 시 자동으로 브라우저 새로고침
- **에러 표시**: 컴파일 에러나 런타임 에러를 콘솔에 실시간 표시
- **포트 정보**: 서버가 실행되는 로컬 주소 확인 가능 (예: http://localhost:5173/)
- **종료 방법**: Ctrl+C로 안전하게 종료

### 서버 실행 후 확인사항
1. 콘솔에 "Local: http://localhost:XXXX/" 메시지 표시 확인
2. 브라우저에서 해당 주소로 접속하여 페이지 로딩 확인
3. 애니메이션 및 인터랙션 정상 동작 확인

---

# 웹사이트 배포 Best Practices

## 배포 진행 방식 - 중요 사항

**절대 중요**: 사용자가 웹페이지를 GitHub Pages에 공개 요청할 때 **1번만 물어보고 승인을 받는다**. 승인 후에는 더 이상 질문하지 않고 모든 배포 작업을 완료한다.

**배포 작업 진행 방식**:
- **TodoWrite 도구로 3단계 배포 todo 생성**: GitHub 배포 전용 todo 리스트 생성
- 각 배포 단계는 한 번에 완전히 완료해야 함
- 단계를 세분화하여 여러 번 나누지 말고 통합 진행
- 예: "Git 초기화" + "커밋" + "푸시"를 별도로 나누지 말고 한 번에 처리
- 사용자 승인 후 추가 확인 없이 배포 진행

### GitHub Pages 배포 3단계 TodoWrite 프로세스

사용자가 웹페이지를 GitHub Pages에 공개 요청할 때:

**첫 번째**: TodoWrite 도구로 다음 3단계 배포 전용 todo 리스트 생성
1. GitHub 저장소 생성
2. 코드 업로드 및 배포
3. GitHub Pages 설정 완료

**두 번째**: 사용자에게 1번만 승인 요청 후 모든 단계 자동 진행

### 3단계 배포 프로세스 상세

1. **GitHub 저장소 생성**: 수동으로 GitHub 웹사이트에서 저장소 생성 (GitHub CLI 사용 금지)
   - https://github.com 접속
   - 우상단 "+" → "New repository" 클릭
   - Repository name 입력
   - Public 선택 후 "Create repository" 클릭
   - **중요**: 사용자에게 저장소 URL 제공 후 자동으로 2단계 진행

2. **코드 업로드 및 GitHub Pages 배포**: 
   - /tmp 디렉터리에 workspace 폴더 생성: `mkdir -p /tmp/workspace`
   - workspace로 이동 후 git clone: `cd /tmp/workspace && git clone [저장소URL]`
   - 현재 웹페이지 파일들을 클론된 폴더로 복사
   - 의존성 재설치: `rm -rf node_modules && npm install`
   - 빌드 실행: `npm run build`
   - gh-pages 설치: `npm install gh-pages --save-dev`
   - GitHub Pages 배포: `npx gh-pages -d dist`
   - **중요**: 배포 후 상대 경로 수정 필수
   - gh-pages 브랜치 체크아웃: `git fetch origin && git stash && git checkout gh-pages`
   - index.html 절대 경로를 상대 경로로 수정
   - 수정 후 커밋 및 푸시
   - git add, commit, push 실행

3. **GitHub Pages 최종 설정**: 
   - 사용자에게 GitHub Settings → Pages 설정 안내
   - Source: "Deploy from a branch" 선택
   - Branch: "gh-pages" 선택
   - 배포 완료 URL 제공: `https://[username].github.io/[repository]`

### 중요 사항
- **GitHub CLI (`gh`) 사용 금지**: 모든 GitHub 관련 작업은 웹 인터페이스 또는 git 명령어로만 수행

## 배포 과정에서 발생한 주요 문제 및 해결책

### 문제 1: node_modules 의존성 오류
**증상**: `Cannot find module '/private/tmp/workspace/cat-dancing-page/node_modules/dist/node/cli.js'`
**원인**: 복사된 node_modules가 제대로 작동하지 않음
**해결책**: 
```bash
rm -rf node_modules
npm install
```

### 문제 2: 중첩된 폴더 구조로 인한 Git 오류
**증상**: `error: 'cat-dancing-page/' does not have a commit checked out`
**원인**: cp 명령어로 복사할 때 중첩된 폴더 구조 생성
**해결책**: 
```bash
rm -rf cat-dancing-page  # 중첩 폴더 제거
git add .
```

### 문제 3: Git 작업 디렉토리 변경사항 충돌
**증상**: `Your local changes to the following files would be overwritten by checkout`
**원인**: gh-pages 브랜치 체크아웃 시 package.json 변경사항 충돌
**해결책**: 
```bash
git stash  # 변경사항 임시 저장
git checkout gh-pages
```

### 문제 4: GitHub Pages 절대 경로 문제
**증상**: 배포된 사이트에서 CSS/JS 파일 로드 실패
**원인**: Vite 빌드 시 생성되는 절대 경로(`/assets/...`)가 GitHub Pages에서 작동하지 않음
**해결책**: gh-pages 브랜치에서 index.html 수정
```html
<!-- 변경 전 -->
<script src="/assets/index-jqnrVJWH.js"></script>
<link href="/assets/index-BYtPq8ts.css" rel="stylesheet">

<!-- 변경 후 -->
<script src="./assets/index-jqnrVJWH.js"></script>
<link href="./assets/index-BYtPq8ts.css" rel="stylesheet">
```

### 권장 배포 프로세스 (개선된 버전)

1. **임시 작업공간에서 클린 배포**:
   ```bash
   mkdir -p /tmp/workspace
   cd /tmp/workspace
   git clone [저장소URL]
   cd [저장소명]
   ```

2. **의존성 재설치 및 빌드**:
   ```bash
   rm -rf node_modules  # 기존 의존성 제거
   npm install          # 깨끗한 의존성 설치
   npm run build        # 프로덕션 빌드
   ```

3. **gh-pages 배포 및 경로 수정**:
   ```bash
   npm install gh-pages --save-dev
   npx gh-pages -d dist
   git fetch origin
   git stash  # 변경사항이 있다면
   git checkout gh-pages
   # index.html에서 절대 경로를 상대 경로로 수정
   git add . && git commit -m "Fix asset paths for GitHub Pages" && git push
   ```

### 배포 후 필수 확인 과정

**중요**: GitHub Pages 배포 후 반드시 다음 단계를 수행하세요:

1. **5분 대기**: GitHub Pages CDN 캐시 업데이트 시간
2. **curl로 배포 상태 확인**:
   ```bash
   curl https://[username].github.io/[repository]/
   ```
3. **상대 경로 재확인**: 
   - 빌드된 `dist/index.html`에서 절대 경로(`/assets/...`) 확인
   - 필요시 상대 경로(`./assets/...`)로 수정 후 재배포
   - **주의**: Vite 빌드는 기본적으로 절대 경로를 생성하므로 매번 확인 필요

### GitHub Pages CDN 캐시 문제 해결

**증상**: 배포 후에도 이전 버전이 보이는 경우
**원인**: GitHub Pages CDN 캐시 지연
**해결책**:
- 5-10분 대기 후 재확인
- 브라우저 캐시 지우기 (Ctrl+F5, Cmd+Shift+R)
- 시크릿 모드로 접속하여 캐시 없이 확인

### gh-pages Submodule 문제 방지

**문제**: GitHub Actions에서 `fatal: No url found for submodule path 'node_modules/.cache/gh-pages/...'` 오류
**원인**: gh-pages 패키지의 캐시 폴더가 git submodule로 잘못 인식됨
**증상**: 
```
Error: fatal: No url found for submodule path 'node_modules/.cache/gh-pages/https!github.com!...' in .gitmodules
Error: The process '/usr/bin/git' failed with exit code 128
```

**해결책**:
```bash
# 문제가 발생한 경우 즉시 실행
cd /tmp/workspace/[repository-name]
git rm --cached node_modules/.cache/gh-pages/[repository-url]
rm -rf node_modules/.cache/gh-pages
git add . && git commit -m "Remove gh-pages cache submodule" && git push origin gh-pages
```

**방지 대책**:
1. **.gitignore에 캐시 폴더 추가**:
   ```
   # gh-pages 캐시 방지
   node_modules/.cache/
   .cache/
   ```

2. **배포 전 캐시 폴더 정리**:
   ```bash
   rm -rf node_modules/.cache/gh-pages
   npx gh-pages -d dist
   ```

3. **배포 후 즉시 캐시 폴더 확인**:
   ```bash
   # 캐시 폴더가 git에 추가되었는지 확인
   git status | grep "cache"
   # 만약 있다면 즉시 제거
   git rm --cached node_modules/.cache/gh-pages/* 2>/dev/null || true
   ```

**주의사항**: 
- gh-pages 패키지는 배포 시 자동으로 캐시 폴더 생성
- 이 폴더가 git에 추가되면 submodule 오류 발생
- 반드시 .gitignore에 캐시 경로 추가하여 예방

### GitHub Pages 배포 시 중요 사항

**상대 경로 수정 필수**:
- GitHub Pages에서는 절대 경로(`/assets/...`)가 작동하지 않음
- gh-pages 브랜치의 index.html에서 모든 asset 경로를 상대 경로로 수정 필요
- 수정 예시:
  ```html
  <!-- 잘못된 경로 (절대 경로) -->
  <script src="/assets/index-abc123.js"></script>
  <link href="/assets/index-abc123.css" rel="stylesheet">
  
  <!-- 올바른 경로 (상대 경로) -->
  <script src="./assets/index-abc123.js"></script>
  <link href="./assets/index-abc123.css" rel="stylesheet">
  ```
- gh-pages 브랜치로 체크아웃한 후 index.html 파일 수정 후 재배포 필요

## 배포 플랫폼 선택 가이드

### 실습 및 학습 목적: GitHub Pages 추천 ⭐
**실습 편의성을 고려하면 GitHub Pages가 가장 적합합니다.**

**GitHub Pages 장점:**
- ✅ **무료** 및 **무제한** 정적 사이트 호스팅
- ✅ **Git 기반** 배포로 버전 관리와 연동
- ✅ **간단한 설정**: Repository Settings에서 클릭 몇 번으로 배포
- ✅ **학습 친화적**: Git workflow 이해에 도움
- ✅ **GitHub Actions** 무료 사용으로 CI/CD 학습 가능
- ✅ **커스텀 도메인** 지원 (무료)

**실습용 배포 과정:**
1. GitHub Repository 생성
2. 코드 push
3. Settings → Pages 에서 배포 설정
4. 자동으로 `https://[username].github.io/[repository]` URL 생성

### 프로덕션 환경: Vercel 추천
**실제 서비스 운영 시에는 Vercel이 더 우수합니다.**

**Vercel 장점:**
- ⚡ **매우 빠른 배포**: 수초 내 전 세계 CDN 배포
- 🔄 **자동 프리뷰**: PR 생성시 자동 미리보기 배포
- 📊 **고급 분석**: 상세한 성능 및 사용자 분석
- 🚀 **서버리스 함수** 지원 (API Routes)
- 💰 **Hobby 플랜 무료**: 개인 프로젝트는 무료

### 권장사항
- **학습/실습 단계**: GitHub Pages 사용
- **포트폴리오/개인 프로젝트**: GitHub Pages → Vercel 순서로 경험
- **상용 서비스**: Vercel 또는 전문 호스팅 서비스

## 전제 조건
- GitHub 계정이 있다고 가정

## 1. GitHub Pages 배포

### 정적 사이트 배포
```bash
# 빌드 후 dist/build 폴더를 gh-pages 브랜치에 배포
npm run build
npx gh-pages -d dist

# 또는 GitHub Actions 사용
# .github/workflows/deploy.yml 생성
```

### GitHub Pages 설정
1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages 또는 main/docs
4. Custom domain 설정 (선택사항)

## 2. Vercel 배포

```bash
# Vercel CLI 설치 및 배포
npm i -g vercel
vercel

# 또는 GitHub 연동으로 자동 배포
```

## 3. Netlify 배포

```bash
# Netlify CLI 사용
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# 또는 GitHub 연동으로 자동 배포
```

## 4. 배포 전 체크리스트

- [ ] 빌드 성공 확인: `npm run build`
- [ ] 환경변수 설정 확인
- [ ] HTTPS 설정
- [ ] Custom domain 설정 (필요시)
- [ ] Analytics 설정 (Google Analytics 등)
- [ ] SEO 최적화 (meta tags, sitemap)
- [ ] 성능 최적화 (이미지 압축, 코드 분할)

## 5. CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml 예시
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 6. 도메인 및 SSL

- Custom domain 설정시 CNAME 파일 추가
- Let's Encrypt 자동 SSL 인증서
- DNS 설정 확인 (A record, CNAME)

## 7. 모니터링 및 분석

- Google Analytics / Google Search Console 설정
- 성능 모니터링 (Lighthouse, WebPageTest)
- 에러 트래킹 (Sentry 등)

# Development Workflow Guidelines

## TodoWrite Tool 사용 가이드

웹페이지 개발 시 **반드시** TodoWrite 도구를 활용하여 작업을 체계적으로 관리하세요:

### 1. 프로젝트 시작 시
- 7단계 개발 프로세스를 기반으로 todo 리스트 생성
- 각 단계를 개별 todo 항목으로 등록
- 모든 항목을 'pending' 상태로 초기화

### 2. 작업 진행 중
- 현재 작업하는 단계를 'in_progress'로 변경
- **한 번에 하나의 작업만** in_progress 상태 유지
- 작업 완료 즉시 'completed'로 변경

### 3. Todo 상태 관리
- `pending`: 아직 시작하지 않은 작업
- `in_progress`: 현재 진행 중인 작업 (1개만 유지)
- `completed`: 완료된 작업

### 4. 실시간 업데이트
- 각 단계 완료 후 **즉시** todo 상태 업데이트
- 배치로 여러 작업을 한 번에 완료 처리 금지
- 사용자에게 진행 상황 투명하게 공개

## 개발 프로세스 준수사항

1. **순차적 진행**: 1단계부터 7단계까지 순서대로 진행
2. **단계별 완성**: 각 단계가 완전히 끝난 후 다음 단계 진행
3. **실시간 모니터링**: TodoWrite로 진행 상황 지속적 추적
4. **품질 확인**: 각 단계 완료 시 결과물 검증

---

# Communication Guidelines

- 응답 시 CLAUDE.md 파일이나 프로젝트 지침 파일을 직접 언급하지 않기
- 사용자와의 대화에서 내부 설정 파일 참조 언급 금지
- TodoWrite 도구를 적극 활용하여 작업 진행 상황을 투명하게 공개