# AI React Learning

Next.js + TypeScript 기반 AI React 학습 플랫폼입니다.

사용자는 React 학습 중 필요한 내용을 AI에게 질문하고, 설명 / 문제 / 힌트를 받을 수 있습니다.

## 실행 명령어

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속합니다.

```bash
npm run build
```

배포 전에 프로젝트가 정상적으로 빌드되는지 확인합니다.

```bash
npm run lint
```

코드 규칙 오류를 확인합니다.

## 폴더 구조

```text
src/
  app/
    api/
      ai/
        route.ts          # OpenAI API를 서버에서 호출하는 API Route
    components/
      Header.tsx          # 공통 헤더
      Header.module.scss
      StudyCard.tsx       # 학습 카드 컴포넌트
      StudyCard.module.scss
    study/
      page.tsx            # /study 페이지
      study.module.scss
    weather/
      page.tsx            # /weather 페이지
      weather.module.scss
    layout.tsx            # 모든 페이지에 공통으로 적용되는 레이아웃
    page.tsx              # 메인 페이지 /
    page.module.scss

  data/
    studyData.ts          # 화면에 보여줄 임시 학습 데이터

  styles/
    _reset.scss           # 브라우저 기본 스타일 초기화
    globals.scss          # 전체 공통 스타일

  types/
    study.ts              # AI 학습 관련 타입
    weather.ts            # 날씨 API 관련 타입
```

## 직접 수정하는 폴더

- `src/app`: 페이지와 API Route
- `src/app/components`: 재사용 컴포넌트
- `src/data`: 임시 데이터
- `src/types`: TypeScript 타입
- `src/styles`: 전역 스타일

## 직접 수정하지 않는 폴더

- `.next`: Next.js가 자동 생성하는 빌드 결과물과 캐시
- `node_modules`: 설치된 라이브러리

`.next`와 `node_modules`는 삭제해도 다시 생성됩니다. GitHub에는 올리지 않습니다.

## 환경변수

API Key는 `.env.local`에 저장합니다.

```env
OPENAI_API_KEY=your_openai_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

Secret Key가 필요한 API는 클라이언트 컴포넌트에서 직접 호출하지 않고, `src/app/api` 안의 Route Handler에서 호출합니다.
