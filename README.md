# Export Marketing Hub

수출기업이 브랜드, 제품, 시장 정보를 한 번 구조화하면 플랫폼별 마케팅 산출물을 생성, 검수, 승인, 재사용할 수 있도록 설계한 정적 웹 앱입니다.

이 프로젝트는 PRD 2.0 기준의 `수출기업용 마케팅 산출물 운영 허브` 프로토타입으로, 로그인 없이 브라우저에서 바로 실행할 수 있는 프런트엔드 중심 데모입니다.

## 핵심 목적

- 수출기업의 브랜드 자산과 제품 Truth를 한 곳에서 관리
- 플랫폼별 마케팅 산출물 생성 흐름 제공
- 품질 점수, 자동 체크리스트, 승인 저장 흐름 제공
- 승인본과 Gold Sample을 재사용 가능한 자산으로 보관

## 주요 화면

- 대시보드
- 온보딩
- 회사 및 브랜드 프로필
- Product Truth 라이브러리
- Output Studio
- 결과물 상세 편집 화면
- Playbook Center
- Prompt Stack Studio
- Repository
- Quality Center
- Ops Console
- 사용설명 페이지

## 현재 구현 범위

- `한/영/일/중` 언어 전환
- 온보딩 입력 초안 유지
- 결과물 생성 및 섹션별 재생성
- 자동 체크리스트 기반 승인 제어
- 새 버전 복제
- 로컬 보관함 및 Gold Sample 저장
- 테스트 워크스페이스 아카이브 후 리셋
- PWA 메타파일 포함

## 기술 구성

- HTML
- CSS
- Vanilla JavaScript
- `localStorage` 기반 상태 저장

## 로컬 실행 방법

```powershell
cd C:\codex\export-marketing-hub
python -m http.server 4173
```

브라우저에서 아래 주소로 접속합니다.

```text
http://127.0.0.1:4173/
```

## 파일 구조

```text
index.html               앱 진입점
app.js                   화면 렌더링, 상태 관리, 생성/검수 로직
styles.css               UI 스타일
manifest.webmanifest     PWA 메타데이터
sw.js                    서비스 워커
README.md                프로젝트 소개 문서
```

## 주의 사항

- 현재 버전은 서버 DB가 아니라 브라우저 `localStorage`에 저장됩니다.
- 생성 결과와 점수는 실제 LLM 파이프라인이 아니라 데모용 로직 기반입니다.
- 외부 플랫폼 자동 업로드, 실제 권한 체계, 실운영용 백엔드는 아직 포함되어 있지 않습니다.

## 다음 확장 방향

- 실제 AI API 연동
- 서버 DB 및 파일 저장소 연결
- 회사별 권한 분리
- GitHub Pages 또는 정식 호스팅 배포
- 다국어 문구 전면 현지화

## 저장소 목적

이 저장소는 수출기업용 마케팅 운영 허브를 빠르게 검토하고, 화면과 흐름을 실제처럼 체험할 수 있도록 만든 프로토타입 저장소입니다.
