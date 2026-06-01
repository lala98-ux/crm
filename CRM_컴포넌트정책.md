# ENTWIZ CRM — 컴포넌트 아키텍처 정책

> 이 문서는 ENTWIZ CRM HTML 프로토타입의 공통 레이아웃 컴포넌트 분리 구조와  
> 신규 페이지 제작 시 반드시 따라야 할 규칙을 정의합니다.

---

## 1. 핵심 원칙

**"헤더·사이드바·패널은 각 페이지에 직접 작성하지 않는다."**

공통 레이아웃 요소(헤더, 사이드바, 알림/유저/설정 패널, 토스트)는  
`crm-layout.js` 하나에서 관리하며, 각 페이지는 이 파일을 `import`해서 자동 주입받는다.

---

## 2. 공통 파일 역할

| 파일 | 역할 |
|---|---|
| `crm-layout.css` | 헤더·사이드바·`.content` 레이아웃의 CSS 변수(디자인 토큰) 및 스타일 |
| `crm-layout.js` | 헤더·사이드바·패널 HTML을 DOM에 자동 주입하는 컴포넌트 |
| `crm-common.js` | `toggleSidebar`, `toggleNoti`, `showToast` 등 공통 기능 함수 |

---

## 3. 신규 페이지 제작 규칙

### 3-1. 파일 구조 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ① 공통 레이아웃 CSS (반드시 가장 먼저) -->
  <link rel="stylesheet" href="crm-layout.css">

  <title>페이지 제목 | ENTWIZ CRM</title>

  <!-- ② 페이지 전용 CSS -->
  <style>
    /* 디자인 토큰은 crm-layout.css에 있으므로 여기서 다시 선언하지 않음 */
    /* 이 페이지만의 컴포넌트 스타일만 작성 */
  </style>
</head>
<body>

  <!-- ③ 헤더·사이드바는 crm-layout.js가 자동 주입 → 직접 작성 금지 -->

  <!-- ④ 메인 콘텐츠 영역 (.content 클래스 필수) -->
  <main class="content">
    <!-- 브레드크럼 -->
    <div class="breadcrumb">
      <span>ENTWIZ CRM</span>
      <span class="sep">›</span>
      <span class="curr">페이지 제목</span>
    </div>

    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div>
        <div class="page-title">페이지 제목</div>
        <div class="page-desc">페이지 설명</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary">+ 추가</button>
      </div>
    </div>

    <!-- 페이지 본문 콘텐츠 -->

  </main>

  <!-- ⑤ 공통 스크립트 (순서 중요) -->
  <script src="crm-layout.js"></script>   <!-- 헤더·사이드바 주입 -->
  <script src="crm-common.js"></script>   <!-- toggleNoti, showToast 등 -->

  <!-- ⑥ 페이지 전용 JS -->
  <script>
    /* 이 페이지에서만 사용하는 함수 */
  </script>

</body>
</html>
```

### 3-2. 스크립트 로딩 순서 (변경 금지)

```
crm-layout.js  →  crm-common.js  →  페이지 전용 <script>
```

- `crm-layout.js`가 먼저 헤더·사이드바 DOM을 삽입
- `crm-common.js`가 그 DOM에 이벤트를 바인딩
- 페이지 JS는 마지막에 실행

---

## 4. 서브스크린(탭 전환)이 있는 페이지 규칙

고객 관리, 자동화 캠페인, 설정처럼 한 HTML 안에 여러 화면이 있는 경우:

### 4-1. 화면 전환 함수 패턴

```js
const SCREEN_META = {
  list: { label: '고객 목록/검색' },
  segment: { label: '세그먼트 관리' },
  // ...
};

function showScreen(name, pushState = true) {
  if (!SCREEN_META[name]) return;

  // 모든 .screen 숨기기
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // 해당 스크린 보이기
  document.getElementById('screen-' + name)?.classList.add('active');

  // 스크롤 초기화 (.content가 fixed overflow 영역이므로 window 아님)
  document.querySelector('.content')?.scrollTo({ top: 0 });

  // URL 해시 갱신
  if (pushState) history.pushState({ screen: name }, '', '#' + name);
  else           history.replaceState({ screen: name }, '', '#' + name);

  // 사이드바 active 상태 동기화 (크루 네비게이트 후 필수)
  if (typeof crmSetActiveSidebar === 'function') crmSetActiveSidebar();
}
```

### 4-2. 초기 로드 + 뒤로가기 처리

```js
document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '') || 'defaultScreen';
  showScreen(SCREEN_META[hash] ? hash : 'defaultScreen', false);
});

window.addEventListener('popstate', e => {
  showScreen(e.state?.screen || 'defaultScreen', false);
});
```

---

## 5. 사이드바 네비게이션 규칙

### 5-1. 같은 페이지 내 서브스크린 이동 → `crmNavigate()` 사용

```html
<!-- crm-layout.js 사이드바 LNB 항목 -->
<div class="lnb-item"
     data-page="CRM_고객관리.html"
     data-hash="segment"
     onclick="crmNavigate('CRM_고객관리.html', 'segment')">
  세그먼트 관리
</div>
```

`crmNavigate(file, hash)` 동작:
- 현재 파일 == 대상 파일 → `showScreen(hash)` 직접 호출 (페이지 재로드 없음)
- 현재 파일 ≠ 대상 파일 → `location.href`로 이동

### 5-2. 단일 페이지 이동 → `location.href` 사용

```html
<div class="gnb-item"
     data-page="CRM_홈.html"
     onclick="location.href='CRM_홈.html'">
```

### 5-3. `data-page` / `data-hash` 속성 (active 상태 자동 감지)

모든 사이드바 링크에 `data-page`와 `data-hash`를 반드시 추가해야  
`crmSetActiveSidebar()`가 현재 페이지를 자동 하이라이트한다.

---

## 6. 금지 사항

| 금지 | 이유 |
|---|---|
| 각 페이지에 `<header>`, `<aside>` 직접 작성 | crm-layout.js와 중복 → 가드 조건에 걸려 주입 안 됨 |
| `body { padding: 24px }` 설정 | `.content`가 padding을 담당 → 이중 여백 발생 |
| `window.scrollTo({ top: 0 })` | `.content`가 fixed 영역이므로 `document.querySelector('.content').scrollTo()` 사용 |
| `window.parent.activateLnb()` | iframe 방식 제거됨 → `crmSetActiveSidebar()` 사용 |
| `window.parent.showToast()` | iframe 방식 제거됨 → `crm-common.js`의 `showToast()` 직접 사용 |

---

## 7. 현재 구현된 페이지 목록

| 파일명 | 설명 | 서브스크린 |
|---|---|---|
| `CRM_홈.html` | KPI 대시보드 | 없음 |
| `CRM_고객관리.html` | 고객 목록/상세/세그먼트/태그/등급 | list, detail, segment, autotag, grade |
| `CRM_자동화캠페인.html` | 8종 자동화 캠페인 설정 | upsell, cart, remarketing, repurchase, churnprev, reactivate, vip, aioptimize |
| `CRM_캠페인시작하기.html` | 캠페인 유형 선택 · 추천 | 없음 (탭 UI) |
| `CRM_설정.html` | 시스템 전반 설정 | segment, grade, health, channel, data, permission, notification |
| `CRM_페이지템플릿.html` | 신규 페이지 제작 시 복사 기준 | - |
| `CRM_어드민_공통UI.html` | iframe 기반 레거시 셸 (deprecated) | - |

---

## 8. 컴포넌트 수정이 필요할 때

### 헤더·사이드바 UI 변경
→ `crm-layout.js`의 `HEADER_HTML` 또는 `SIDEBAR_HTML` 배열 수정  
→ 모든 페이지에 즉시 반영됨

### 사이드바에 새 메뉴 추가
1. `crm-layout.js` SIDEBAR_HTML에 GNB/LNB 항목 추가
2. 대응하는 HTML 파일 생성 (crm-layout.css + crm-layout.js + crm-common.js import)
3. LNB 항목에 `data-page`, `data-hash` 속성 추가
4. onclick에 `crmNavigate()` 또는 `location.href` 적용

### 레이아웃 CSS 변경
→ `crm-layout.css` 수정  
→ 모든 페이지에 즉시 반영됨

---

*최종 업데이트: 2026-05-28*
