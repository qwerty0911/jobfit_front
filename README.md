# JOBFIT Frontend

JOBFIT은 사용자의 프로필과 이력서를 기반으로 채용 공고를 탐색하는 AI 커리어 파트너의 프론트엔드입니다. 아이디로 로그인한 뒤 AI와 대화하고, 스킬·이력서·추천 공고를 한 화면에서 관리할 수 있습니다.

## 주요 기능

- 사용자 ID 기반 로그인
- 로그인 응답의 `user_uuid` 로컬 저장 및 로그아웃 시 삭제
- AI 채팅 요청, 응답 로딩, 오류 표시
- 줄바꿈이 포함된 채팅 메시지 표시
- 프로필, 스킬, 저장된 이력서 조회
- 인라인 입력을 통한 스킬 추가
- 모달을 통한 이력서 작성
- 저장된 추천 공고 조회
- 채팅 완료 후 추천 공고 자동 갱신
- 데스크톱·모바일 반응형 레이아웃

## 기술 스택

- React 19
- React Router DOM 7
- Vite 7
- ESLint 9
- CSS

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 백엔드 서버 실행

현재 프론트엔드는 다음 주소의 API를 사용합니다.

```text
http://localhost:8000
```

백엔드를 `localhost:8000`에서 실행한 뒤 프론트엔드를 실행합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시된 주소(기본 `http://localhost:5173`)로 접속합니다.

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 배포용 파일 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint 정적 검사 |

## 화면 구성

### 로그인 (`/`)

사용자 ID를 입력하고 로그인합니다. 성공 응답의 `user_uuid`는 `localStorage`의 `jobfit_user_uuid` 키에 저장됩니다.

### 채팅 (`/chat`)

- 왼쪽: AI 채팅, 응답 로딩, 로그아웃
- 오른쪽 프로필 탭: 사용자 이름, 스킬, 이력서
- 오른쪽 추천 공고 탭: 저장된 공고의 기업명, 제목, 근무지

채팅 메시지가 많아지면 페이지 대신 채팅 영역 안에 스크롤이 생성됩니다.

## API 연동

### 로그인

```http
POST /login
Content-Type: application/json
```

```json
{
  "user_id": "test001"
}
```

프론트엔드는 성공 응답에 `user_uuid`가 포함되어 있을 것으로 가정합니다.

### 프로필 조회

```http
GET /profile/{user_uuid}
```

사용하는 응답 필드:

```json
{
  "user_uuid": "uuid",
  "name": "test001",
  "skills": ["React", "JavaScript"],
  "documents": [
    {
      "document_id": "document-id",
      "document_type": "resume",
      "title": "이력서 제목",
      "content": "이력서 내용",
      "embedding_status": "indexed",
      "created_at": "2026-07-21T12:45:30.447000"
    }
  ]
}
```

`documents`의 항목 중 `document_type` 값이 `resume`인 문서만 이력서 목록에 표시합니다.

### 스킬 추가

```http
POST /profile/add_skills
Content-Type: application/json
```

```json
{
  "user_uuid": "uuid",
  "skill": "React"
}
```

### 이력서 추가

```http
POST /profile/documents
Content-Type: application/json
```

```json
{
  "user_uuid": "uuid",
  "title": "프론트엔드 개발자 이력서",
  "content": "이력서 내용"
}
```

### AI 채팅

```http
POST /chat
Content-Type: application/json
```

```json
{
  "user_uuid": "uuid",
  "message": "내가 지원할 만한 공고를 찾아줘"
}
```

채팅 응답은 JSON의 `message`, `response`, `answer`, `content` 필드 또는 문자열 응답을 표시할 수 있습니다.

### 저장된 추천 공고 조회

```http
GET /postings/{user_uuid}
```

프론트엔드에서 사용하는 필드:

- `id`
- `company_name` → 기업명
- `job_title` → 공고 제목
- `location` → 근무지

채팅 응답이 완료되면 이 API를 다시 호출해 추천 공고 탭을 갱신합니다.

## 프로젝트 구조

```text
src/
├── components/
│   ├── chat/
│   │   ├── ChatPanel.jsx       # 채팅 헤더, 메시지, 입력창
│   │   ├── ResumeModal.jsx     # 이력서 작성 모달
│   │   └── SidePanel.jsx       # 프로필·추천 공고 탭
│   └── login.jsx                   # 로그인 폼 및 API 요청
├── pages/
│   ├── Chat.jsx                   # 채팅 페이지 상태·API 관리
│   ├── Chat.css                   # 채팅 페이지 스타일
│   ├── Home.jsx                   # 로그인 페이지
│   ├── Home.css                   # 로그인 페이지 스타일
│   └── NotFound.jsx               # 404 페이지
├── utils/
│   └── auth.js                    # user_uuid 저장·조회·삭제
├── App.jsx                            # 라우팅
└── main.jsx                           # React 엔트리 포인트
```

## CORS 설정

프론트엔드와 백엔드의 포트가 다르므로 백엔드에서 프론트엔드 Origin을 허용해야 합니다. FastAPI 예시:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 빌드 및 검사

```bash
npm run lint
npm run build
```

`dist/` 디렉터리에 배포용 파일이 생성됩니다.
