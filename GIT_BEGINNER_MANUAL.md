# 초보자용 Git 사용 매뉴얼

이 문서는 Git과 GitHub가 익숙하지 않은 팀원을 위한 아주 기본적인 작업 순서 설명서다.

## 1. Git이 하는 일

Git은 코드 변경 이력을 저장하고, 여러 사람이 같은 프로젝트를 안전하게 같이 작업하게 해 주는 도구다.

쉽게 말하면:

- 누가 무엇을 바꿨는지 기록
- 잘못 바꾸면 이전 상태 비교 가능
- 각자 브랜치에서 따로 작업 가능
- 최종적으로 안전하게 합치기 가능

## 2. 가장 자주 쓰는 단어

- `repository`: 프로젝트 저장소
- `clone`: 저장소를 내 컴퓨터로 가져오기
- `branch`: 내 작업 전용 가지
- `commit`: 변경사항 저장
- `push`: GitHub에 올리기
- `pull`: GitHub의 최신 내용 받아오기
- `pull request`: 내 변경을 합쳐 달라고 요청하는 절차

## 3. 처음 한 번만 하는 일

### 저장소 받기

```powershell
git clone https://github.com/juinmanin/export-marketing-hub.git
cd export-marketing-hub
```

## 4. 매번 작업할 때의 기본 순서

### 1. 최신 코드 받기

```powershell
git checkout main
git pull origin main
```

### 2. 새 브랜치 만들기

```powershell
git checkout -b codex/my-task-name
```

예시:

```powershell
git checkout -b codex/help-text-update
```

### 3. 코드 수정

- 문구 수정
- 버튼 이름 수정
- 도움말 수정
- 샘플 데이터 수정

### 4. 실행 확인

```powershell
cd C:\codex\export-marketing-hub
python -m http.server 4173
```

브라우저:

```text
http://127.0.0.1:4173/
```

## 5. 수정 후 저장하는 방법

### 수정 파일 확인

```powershell
git status
```

### 수정 파일 저장 준비

```powershell
git add .
```

처음에는 전체 추가보다 필요한 파일만 추가하는 습관이 더 좋다.

예시:

```powershell
git add README.md app.js
```

### 커밋 만들기

```powershell
git commit -m "Update help text"
```

## 6. GitHub에 올리기

```powershell
git push origin codex/help-text-update
```

그 다음 GitHub에서 `Pull Request`를 만든다.

## 7. Pull Request는 왜 필요한가

Pull Request는 “내가 바꾼 내용을 확인하고 main에 합쳐 주세요”라는 요청이다.

장점:

- 실수 방지
- 리뷰 가능
- 변경 이유 기록 가능
- 충돌 줄이기

## 8. 가장 많이 쓰는 실전 명령어

### 현재 상태 보기

```powershell
git status
```

### 현재 브랜치 보기

```powershell
git branch
```

### 최신 코드 받기

```powershell
git pull origin main
```

### 브랜치 만들기

```powershell
git checkout -b codex/new-branch-name
```

### 커밋하기

```powershell
git add .
git commit -m "Write what changed"
```

### GitHub에 올리기

```powershell
git push origin 브랜치이름
```

## 9. 초보자가 많이 하는 실수

### 실수 1. `main`에서 바로 작업

하지 말 것:

```powershell
git checkout main
```

그 상태로 바로 수정하지 말고, 새 브랜치를 만들어야 한다.

### 실수 2. `git pull` 안 하고 작업 시작

이러면 다른 사람이 바꾼 최신 내용과 충돌할 수 있다.

### 실수 3. 너무 많은 파일을 한 번에 수정

처음에는 작은 작업 하나만 하는 게 좋다.

### 실수 4. 커밋 메시지를 애매하게 쓰기

나쁜 예:

- `수정`
- `고침`
- `최종`

좋은 예:

- `Add Korean sample copy`
- `Update onboarding help text`
- `Fix button label in result view`

## 10. 충돌이 났을 때

충돌은 이상한 일이 아니다. 같이 작업하면 생길 수 있다.

초보자는 충돌이 나면 오래 혼자 끌지 말고 바로 공유하는 게 좋다.

특히 아래 파일은 충돌 위험이 높다.

- `app.js`
- `styles.css`

## 11. 초보자에게 추천하는 작업 종류

- README 문서 수정
- 도움말 문구 수정
- 라벨/버튼 이름 수정
- 샘플 문안 수정
- 특정 화면의 작은 UI 수정

## 12. 초보자에게 아직 추천하지 않는 작업

- 서비스워커 수정
- 상태관리 구조 변경
- 캐시 버전 관리
- 대규모 파일 분리
- 전체 생성 로직 변경

## 13. 작업 예시

예: 도움말 문구 수정하기

```powershell
git checkout main
git pull origin main
git checkout -b codex/help-text-update
```

파일 수정 후:

```powershell
git status
git add README.md
git commit -m "Update help text"
git push origin codex/help-text-update
```

그 뒤 GitHub에서 Pull Request 생성

## 14. 막히면 확인할 순서

1. 지금 브랜치가 `main`인지 아닌지 확인
2. `git status`로 수정 상태 확인
3. `git pull origin main` 했는지 확인
4. 실행이 되는지 확인
5. 그래도 안 되면 바로 공유

## 15. 가장 중요한 한 줄

초보자는 `main`에서 직접 수정하지 말고, 항상 `새 브랜치 -> 수정 -> 커밋 -> push -> PR` 순서로 작업하면 된다.
