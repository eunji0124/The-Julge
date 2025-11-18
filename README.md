# The-Julge (더 줄게)

> 알바 구인/구직 매칭 플랫폼

## 🎯 프로젝트 소개

**The-Julge(더 줄게)**는 사장님과 알바님을 연결하는 알바 구인/구직 매칭 플랫폼입니다.

사장님은 가게와 공고를 등록하여 필요한 인력을 모집하고, 알바님은 프로필을 등록하여 원하는 조건의 일자리에 지원할 수 있습니다. 시급 인상률 기반 정렬과 주소 기반 맞춤 공고 추천 기능으로 더욱 효율적인 매칭을 제공합니다.

### 프로젝트 정보

- **프로젝트 기간**: 2025.11.18 ~ 2025.12.05
- **발표일**: 2025.12.03 (수) 13:00 ~ 16:00
- **팀명**: Team 3 (19기 Part3 3팀)

### 주요 목표

- ✅ 매칭 플랫폼의 핵심 기능(검색, 지원, 승인) 구현
- ✅ 시급 인상률 기반 정렬 및 주소 기반 맞춤 공고 추천
- ✅ 모달, 검색, 필터 등 복잡한 UI 컴포넌트 구현
- ✅ 재사용 가능한 컴포넌트 설계 및 반응형 웹 구현

## ✨ 주요 기능

### 👤 인증 및 프로필

- **회원가입/로그인**
  - 이메일 기반 인증
  - 실시간 유효성 검증
  - 사장님/알바님 역할 구분
- **프로필 관리**
  - 알바님 프로필 등록 및 수정
  - 프로필 이미지 업로드 (AWS S3)
  - 주소 기반 맞춤 공고 추천

### 🏪 가게 및 공고 관리 (사장님)

- **가게 관리**
  - 가게 정보 등록/수정
  - 가게 이미지 업로드
  - 가게별 1개 제한
- **공고 관리**
  - 공고 등록/수정/삭제
  - 시급, 근무시간, 모집인원 설정
  - 시급 인상률 자동 계산
- **지원자 관리**
  - 지원자 목록 확인
  - 지원 승인/거절
  - 지원자에게 알림 전송

### 🔍 공고 검색 및 지원 (알바님)

- **공고 검색**
  - 가게 이름 검색
  - 위치, 시작일, 시급 필터링
  - 다양한 정렬 옵션 (마감 임박순, 시급 많은순 등)
- **맞춤 공고**
  - 주소 기반 추천
  - 시급 인상률 하이라이트
- **공고 지원**
  - 공고 지원 및 취소
  - 신청 내역 확인
  - 지원 결과 알림

### 🔔 편의 기능

- **알림 시스템**
  - 실시간 알림
  - 지원 결과 알림 (승인/거절)
  - 읽지 않은 알림 개수 표시
- **최근 본 공고**
  - 최대 6개 공고 저장
  - 브라우저 로컬 스토리지 활용
- **반응형 디자인**
  - 모바일, 태블릿, 데스크톱 지원
  - 사용자 친화적 UI/UX

## 🛠 기술 스택

| Category             | Technology                                                                                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**         | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) |
| **Styling**          | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)                                                                                                                                                                                     |
| **State Management** | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=react-query&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=react&logoColor=white)                                                                                          |
| **HTTP Client**      | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)                                                                                                                                                                                                          |
| **Authentication**   | ![OAuth](https://img.shields.io/badge/OAuth-000000?style=flat&logo=oauth&logoColor=white)                                                                                                                                                                                                          |
| **Version Control**  | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)                                                                                                                   |
| **Deployment**       | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)                                                                                                                                                                                                       |
| **Collaboration**    | ![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white)                                                                                                       |

## 📁 프로젝트 구조

```
The-Julge/
├── .github/             # GitHub 액션, 템플릿
├── .husky/              # Git Hook 설정
├── components/          # UI 컴포넌트
│   └── common/          # 공통 컴포넌트
├── hooks/               # Custom Hook
├── pages/               # 웹 페이지 및 라우팅
│   ├── api/             # API Routes
│   ├── _app.tsx         # 전역 컴포넌트, 상태 관리 초기화
│   ├── _document.tsx    # HTML 문서 구조
│   └── index.tsx        # 메인 페이지 (/)
├── public/              # 정적 리소스
│   ├── images/          # 이미지 파일
│   ├── fonts/           # 폰트 파일
│   └── favicon.svg      # 파비콘
├── store/               # 상태 관리
├── styles/              # 전역 CSS 및 기타 스타일 설정
├── utils/               # 유틸리티 함수 및 순수 로직
├── .prettierrc.json     # Prettier 설정 파일
├── eslint.config.mjs    # ESLint 설정 파일
├── next-env.d.ts        # Next.js 환경 타입 정의
├── next.config.ts       # Next.js 설정
├── package-lock.json    # 의존성 고정 파일
├── package.json         # 프로젝트 메타 정보
├── postcss.config.mjs   # PostCSS 설정
├── README.md
└── tsconfig.json        # TypeScript 설정
```

## 🚀 시작하기

### 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

1. **저장소 클론**

```bash
git clone https://github.com/Codeit-FE19-Part3-Team3/The-Julge.git
cd The-Julge
```

2. **의존성 설치**

```bash
npm install
# 또는
yarn install
```

3. **환경 변수 설정**

`.env.local` 파일을 생성하고 아래 내용을 추가하세요:

```env
# API
NEXT_PUBLIC_API_BASE_URL=https://bootcamp-api.codeit.kr/api/19-3/the-julge
```

4. **개발 서버 실행**

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📚 API 문서

### Base URL

```
https://bootcamp-api.codeit.kr/api/19-3/the-julge
```

### 주요 엔드포인트

#### 인증

- `POST /users` - 회원가입
- `POST /token` - 로그인

#### 가게

- `POST /shops` - 가게 등록
- `GET /shops/:shopId` - 가게 조회
- `PUT /shops/:shopId` - 가게 수정

#### 공고

- `GET /notices` - 공고 목록 조회
- `POST /shops/:shopId/notices` - 공고 등록
- `GET /shops/:shopId/notices/:noticeId` - 공고 상세 조회
- `PUT /shops/:shopId/notices/:noticeId` - 공고 수정

#### 지원

- `POST /shops/:shopId/notices/:noticeId/applications` - 지원하기
- `PUT /shops/:shopId/notices/:noticeId/applications/:applicationId` - 지원 상태 변경

### 자세한 API 문서

- [Swagger 문서](https://bootcamp-api.codeit.kr/docs/the-julge)
- [Notion API 명세](https://www.notion.so/API-10a715ce7c2240fd9d16aa47b5a6bc34)

## 👥 팀원 소개

| <img src="https://github.com/Jihyun0522.png" alt="Jihyun0522" width="100"> | <img src="https://github.com/Augustineku.png" alt="Augustineku" width="100"> | <img src="https://github.com/eunji0124.png" alt="eunji0124" width="100"> | <img src="https://github.com/le2yunji.png" alt="le2yunji" width="100"> | <img src="https://github.com/taewoo26.png" alt="taewoo26" width="100"> |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [강지현](https://github.com/Jihyun0522)                                    | [구영철](https://github.com/Augustineku)                                     | [양은지](https://github.com/eunji0124)                                   | [이윤지](https://github.com/le2yunji)                                  | [황태우](https://github.com/taewoo26)                                  |

## 📝 라이선스

Copyright 2025 코드잇 Inc. All rights reserved.

본 프로젝트는 교육 목적으로 제작되었습니다.

---

⭐️ From [Team 3](https://github.com/Codeit-FE19-Part3-Team3)
