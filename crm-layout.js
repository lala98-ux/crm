/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   crm-layout.js  —  공통 헤더 · 사이드바 · 패널 자동 주입기
   새 페이지: <script src="crm-layout.js"></script> 포함 후
             <script src="crm-common.js"></script> 순서로 로드
   기존 페이지: 이미 .header 가 있으면 중복 주입 안 됨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function () {
  'use strict';

  /* ── HEADER ─────────────────────────────────────────── */
  var HEADER_HTML = [
    '<header class="header">',
    '  <div class="header-brand">',
    '    <div class="brand-icon">E</div>',
    '    <div class="brand-text">',
    '      <div class="brand-name">ENTWIZ CRM</div>',
    '      <div class="brand-version">v1.0 Beta</div>',
    '    </div>',
    '    <button class="header-toggle" onclick="toggleSidebar()" title="사이드바 접기/펼치기">&#9776;</button>',
    '  </div>',
    '  <div class="header-right">',
    '    <button class="icon-btn" id="btnNoti" onclick="toggleNoti()" title="알림">',
    '      🔔<span class="dot" id="notiDot"></span>',
    '    </button>',
    '    <button class="icon-btn" id="btnSetting" onclick="toggleSetting()" title="설정">⚙️</button>',
    '    <div class="header-user" id="btnUser" onclick="toggleUser()">',
    '      <div class="avatar">김</div>',
    '      <div>',
    '        <div class="user-name">김운영</div>',
    '        <div class="user-role">마케팅팀 · 관리자</div>',
    '      </div>',
    '      <span class="user-arrow" id="userArrow">▾</span>',
    '    </div>',
    '  </div>',
    '</header>'
  ].join('\n');

  /* ── SIDEBAR ────────────────────────────────────────── */
  var SIDEBAR_HTML = [
    '<aside class="sidebar" id="sidebar">',
    '  <nav>',
    '    <div class="gnb-item" data-page="index.html" onclick="location.href=\'index.html\'">',
    '      <span class="gnb-icon">📊</span><span class="gnb-label2">홈</span>',
    '    </div>',
    '    <div class="gnb-item" data-page="CRM_캠페인시작하기.html" onclick="location.href=\'CRM_캠페인시작하기.html\'">',
    '      <span class="gnb-icon">🚀</span><span class="gnb-label2">캠페인 시작하기</span>',
    '    </div>',

    '    <div class="gnb-label">고객</div>',
    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">👥</span><span class="gnb-label2">고객 관리</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_고객관리.html" data-hash="list"',
    '           onclick="crmNavigate(\'CRM_고객관리.html\',\'list\')">고객 목록/검색</div>',
    '      <div class="lnb-item" data-page="CRM_고객관리.html" data-hash="segment"',
    '           onclick="crmNavigate(\'CRM_고객관리.html\',\'segment\')">세그먼트 관리</div>',
    '      <div class="lnb-item" data-page="CRM_고객관리.html" data-hash="autotag"',
    '           onclick="crmNavigate(\'CRM_고객관리.html\',\'autotag\')">자동 태그 관리</div>',
    '      <div class="lnb-item" data-page="CRM_고객관리.html" data-hash="grade"',
    '           onclick="crmNavigate(\'CRM_고객관리.html\',\'grade\')">등급 관리</div>',
    '    </div>',

    '    <div class="gnb-label">자동화</div>',
    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">💰</span><span class="gnb-label2">자동화 캠페인</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="upsell"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'upsell\')">업셀/크로스셀 설정</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="cart"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'cart\')">장바구니 이탈 복구</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="remarketing"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'remarketing\')">구매 후 리마케팅 시퀀스</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="repurchase"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'repurchase\')">재구매 리마인드</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="churnprev"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'churnprev\')">이탈 방지 시퀀스 설정</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="reactivate"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'reactivate\')">휴면 고객 재활성</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="vip"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'vip\')">VIP 자동화 설정</div>',
    '      <div class="lnb-item" data-page="CRM_자동화캠페인.html" data-hash="aioptimize"',
    '           onclick="crmNavigate(\'CRM_자동화캠페인.html\',\'aioptimize\')">AI 발송 최적화 설정</div>',
    '    </div>',

    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">📣</span><span class="gnb-label2">메시지 캠페인</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_메시지캠페인.html" data-hash="list" onclick="crmNavigate(\'CRM_메시지캠페인.html\',\'list\')">캠페인 목록</div>',
    '      <div class="lnb-item" data-page="CRM_메시지캠페인.html" data-hash="create" onclick="crmNavigate(\'CRM_메시지캠페인.html\',\'create\')">캠페인 만들기</div>',
    '      <div class="lnb-item" data-page="CRM_메시지캠페인.html" data-hash="event" onclick="crmNavigate(\'CRM_메시지캠페인.html\',\'event\')">이벤트 자동 메시지</div>',
    '      <div class="lnb-item" data-page="CRM_메시지캠페인.html" data-hash="lead" onclick="crmNavigate(\'CRM_메시지캠페인.html\',\'lead\')">리드 관리</div>',
    '      <div class="lnb-item" data-page="CRM_메시지캠페인.html" data-hash="abtest" onclick="crmNavigate(\'CRM_메시지캠페인.html\',\'abtest\')">A/B 테스트</div>',
    '      <div class="lnb-item" data-page="CRM_메시지캠페인.html" data-hash="channel" onclick="crmNavigate(\'CRM_메시지캠페인.html\',\'channel\')">채널 관리</div>',
    '    </div>',

    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">🔒</span><span class="gnb-label2">리텐션</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_리텐션.html" data-hash="point" onclick="crmNavigate(\'CRM_리텐션.html\',\'point\')">포인트 관리</div>',
    '      <div class="lnb-item" data-page="CRM_리텐션.html" data-hash="referral" onclick="crmNavigate(\'CRM_리텐션.html\',\'referral\')">레퍼럴 관리</div>',
    '      <div class="lnb-item" data-page="CRM_리텐션.html" data-hash="membership" onclick="crmNavigate(\'CRM_리텐션.html\',\'membership\')">구독/멤버십</div>',
    '      <div class="lnb-item" data-page="CRM_리텐션.html" data-hash="review" onclick="crmNavigate(\'CRM_리텐션.html\',\'review\')">리뷰 &amp; 커뮤니티</div>',
    '    </div>',

    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">🤝</span><span class="gnb-label2">영업 관리</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_영업관리.html" data-hash="pipeline" onclick="crmNavigate(\'CRM_영업관리.html\',\'pipeline\')">영업 파이프라인</div>',
    '      <div class="lnb-item" data-page="CRM_영업관리.html" data-hash="assignment" onclick="crmNavigate(\'CRM_영업관리.html\',\'assignment\')">담당자 배정 규칙 설정</div>',
    '      <div class="lnb-item" data-page="CRM_영업관리.html" data-hash="followup" onclick="crmNavigate(\'CRM_영업관리.html\',\'followup\')">팔로업 자동화 설정</div>',
    '    </div>',

    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">⚡</span><span class="gnb-label2">워크플로우</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_워크플로우.html" data-hash="trigger" onclick="crmNavigate(\'CRM_워크플로우.html\',\'trigger\')">트리거 목록</div>',
    '      <div class="lnb-item" data-page="CRM_워크플로우.html" data-hash="scenario" onclick="crmNavigate(\'CRM_워크플로우.html\',\'scenario\')">시나리오 관리</div>',
    '      <div class="lnb-item" data-page="CRM_워크플로우.html" data-hash="history" onclick="crmNavigate(\'CRM_워크플로우.html\',\'history\')">발송 이력</div>',
    '    </div>',

    '    <div class="gnb-label">서비스</div>',
    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">🎧</span><span class="gnb-label2">고객 지원</span>',
    '      <span class="gnb-badge">3</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_고객지원.html" data-hash="ticket" onclick="crmNavigate(\'CRM_고객지원.html\',\'ticket\')">문의 목록</div>',
    '      <div class="lnb-item" data-page="CRM_고객지원.html" data-hash="health" onclick="crmNavigate(\'CRM_고객지원.html\',\'health\')">고객 건강도 현황</div>',
    '      <div class="lnb-item" data-page="CRM_고객지원.html" data-hash="counsel" onclick="crmNavigate(\'CRM_고객지원.html\',\'counsel\')">상담 이력</div>',
    '      <div class="lnb-item" data-page="CRM_고객지원.html" data-hash="churn" onclick="crmNavigate(\'CRM_고객지원.html\',\'churn\')">이탈 위험 고객 목록</div>',
    '    </div>',

    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">🛒</span><span class="gnb-label2">커머스 관리</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_커머스관리.html" data-hash="display" onclick="crmNavigate(\'CRM_커머스관리.html\',\'display\')">개인화 진열 설정</div>',
    '      <div class="lnb-item" data-page="CRM_커머스관리.html" data-hash="stock" onclick="crmNavigate(\'CRM_커머스관리.html\',\'stock\')">재고 알림 설정</div>',
    '      <div class="lnb-item" data-page="CRM_커머스관리.html" data-hash="airecommend" onclick="crmNavigate(\'CRM_커머스관리.html\',\'airecommend\')">AI 추천 엔진 설정</div>',
    '    </div>',

    '    <div class="gnb-label">데이터</div>',
    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">📈</span><span class="gnb-label2">애널리틱스</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="kpi" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'kpi\')">KPI 대시보드</div>',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="cohort" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'cohort\')">코호트 분석</div>',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="journey" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'journey\')">고객 여정 (퍼널)</div>',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="revenue" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'revenue\')">세그먼트별 매출</div>',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="campaign" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'campaign\')">캠페인 성과</div>',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="channel" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'channel\')">채널별 지표</div>',
    '      <div class="lnb-item" data-page="CRM_애널리틱스.html" data-hash="report" onclick="crmNavigate(\'CRM_애널리틱스.html\',\'report\')">자동 리포트 설정</div>',
    '    </div>',
    '  </nav>',

    '  <div class="sidebar-bottom">',
    '    <div class="gnb-item" onclick="toggleGnb(this)">',
    '      <span class="gnb-icon">⚙️</span><span class="gnb-label2">설정</span><span class="gnb-arrow">▶</span>',
    '    </div>',
    '    <div class="lnb">',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="segment" onclick="crmNavigate(\'CRM_설정.html\',\'segment\')">세그먼트 기준 설정</div>',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="grade" onclick="crmNavigate(\'CRM_설정.html\',\'grade\')">등급 기준 설정</div>',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="health" onclick="crmNavigate(\'CRM_설정.html\',\'health\')">건강도 점수 가중치 설정</div>',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="channel" onclick="crmNavigate(\'CRM_설정.html\',\'channel\')">채널 연동 설정</div>',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="data" onclick="crmNavigate(\'CRM_설정.html\',\'data\')">데이터 관리</div>',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="permission" onclick="crmNavigate(\'CRM_설정.html\',\'permission\')">권한/계정 관리</div>',
    '      <div class="lnb-item" data-page="CRM_설정.html" data-hash="notification" onclick="crmNavigate(\'CRM_설정.html\',\'notification\')">알림 설정</div>',
    '    </div>',
    '  </div>',
    '</aside>'
  ].join('\n');

  /* ── PANELS + TOAST + GNB TOOLTIP ───────────────────── */
  var PANELS_HTML = [
    '<!-- 알림 패널 -->',
    '<div id="notiPanel" class="header-panel">',
    '  <div class="panel-head">',
    '    <span class="panel-title">알림 <span class="panel-unread-count" id="unreadCount">3</span></span>',
    '    <button class="panel-read-all" onclick="markAllRead()">모두 읽음</button>',
    '  </div>',
    '  <div class="noti-list">',
    '    <div class="noti-item unread">',
    '      <span class="noti-icon">🚨</span>',
    '      <div class="noti-body">',
    '        <div class="noti-title">이탈 위험 고객 41명 감지</div>',
    '        <div class="noti-desc">세그먼트 \'이탈위험\' 고객이 전주 대비 증가했습니다.</div>',
    '        <div class="noti-time">방금 전</div>',
    '      </div>',
    '      <span class="noti-dot"></span>',
    '    </div>',
    '    <div class="noti-item unread">',
    '      <span class="noti-icon">🎫</span>',
    '      <div class="noti-body">',
    '        <div class="noti-title">새 CS 문의 5건 접수</div>',
    '        <div class="noti-desc">긴급 문의 2건 포함 · 미처리 문의를 확인하세요.</div>',
    '        <div class="noti-time">8분 전</div>',
    '      </div>',
    '      <span class="noti-dot"></span>',
    '    </div>',
    '    <div class="noti-item unread">',
    '      <span class="noti-icon">📊</span>',
    '      <div class="noti-body">',
    '        <div class="noti-title">주간 캠페인 성과 리포트 도착</div>',
    '        <div class="noti-desc">지난주 대비 전환율 +12% 상승했습니다.</div>',
    '        <div class="noti-time">32분 전</div>',
    '      </div>',
    '      <span class="noti-dot"></span>',
    '    </div>',
    '    <div class="noti-item">',
    '      <span class="noti-icon">✅</span>',
    '      <div class="noti-body">',
    '        <div class="noti-title">봄 프로모션 캠페인 발송 완료</div>',
    '        <div class="noti-desc">총 2,847명에게 알림톡이 발송되었습니다.</div>',
    '        <div class="noti-time">1시간 전</div>',
    '      </div>',
    '      <span class="noti-dot"></span>',
    '    </div>',
    '    <div class="noti-item">',
    '      <span class="noti-icon">⚠️</span>',
    '      <div class="noti-body">',
    '        <div class="noti-title">이메일 채널 발송 지연 감지</div>',
    '        <div class="noti-desc">현재 이메일 발송이 지연되고 있습니다. 확인 필요.</div>',
    '        <div class="noti-time">2시간 전</div>',
    '      </div>',
    '      <span class="noti-dot"></span>',
    '    </div>',
    '  </div>',
    '  <div class="panel-footer"><a href="#">전체 알림 보기 →</a></div>',
    '</div>',

    '<!-- 유저 패널 -->',
    '<div id="userPanel" class="header-panel">',
    '  <div style="padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;">',
    '    <div class="avatar" style="width:40px;height:40px;font-size:15px;flex-shrink:0;">김</div>',
    '    <div>',
    '      <div style="font-size:14px;font-weight:700;">김운영</div>',
    '      <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">마케팅팀 · 관리자</div>',
    '      <div style="font-size:11px;color:var(--text-muted);">lala98@entwiz.com</div>',
    '    </div>',
    '  </div>',
    '  <div style="padding:6px 0;">',
    '    <div class="setting-panel-item" onclick="navWIP(\'내 프로필\')">👤&nbsp; 내 프로필</div>',
    '    <div class="setting-panel-item" onclick="navWIP(\'알림 설정\')">🔔&nbsp; 알림 설정</div>',
    '    <div class="setting-panel-item" style="border-top:1px solid var(--border);margin-top:4px;color:var(--danger);"',
    '         onclick="doLogout()">🚪&nbsp; 로그아웃</div>',
    '  </div>',
    '</div>',

    '<!-- 설정 드롭다운 -->',
    '<div id="settingPanel" class="header-panel">',
    '  <div class="setting-panel-item" onclick="navToSetting(\'세그먼트 기준 설정\')">⚙️&nbsp; 세그먼트 기준 설정</div>',
    '  <div class="setting-panel-item" onclick="navToSetting(\'등급 기준 설정\')">🏅&nbsp; 등급 기준 설정</div>',
    '  <div class="setting-panel-item" onclick="navToSetting(\'건강도 점수 가중치 설정\')">💚&nbsp; 건강도 점수 가중치 설정</div>',
    '  <div class="setting-panel-item" onclick="navToSetting(\'채널 연동 설정\')">🔗&nbsp; 채널 연동 설정</div>',
    '  <div class="setting-panel-item" onclick="navToSetting(\'데이터 관리\')">🗂️&nbsp; 데이터 관리</div>',
    '  <div class="setting-panel-item" onclick="navToSetting(\'권한/계정 관리\')">👥&nbsp; 권한/계정 관리</div>',
    '  <div class="setting-panel-item" onclick="navToSetting(\'알림 설정\')">🔔&nbsp; 알림 설정</div>',
    '</div>',

    '<div class="toast-stack" id="toastStack"></div>',
    '<div id="gnbTooltip"></div>'
  ].join('\n');

  /* ── 사이드바 active 상태 자동 감지 ─────────────────── */
  function setActiveSidebar() {
    // 기존 active 초기화
    document.querySelectorAll('.lnb-item.active').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('.gnb-item.active').forEach(function (el) { el.classList.remove('active'); });

    var rawFilename = decodeURIComponent(window.location.pathname.split('/').pop());
    var hash = window.location.hash.replace('#', '') || '';

    document.querySelectorAll('[data-page]').forEach(function (el) {
      var elPage = el.getAttribute('data-page') || '';
      var elHash = el.getAttribute('data-hash') || '';

      if (elPage !== rawFilename) return;

      if (el.classList.contains('lnb-item')) {
        if (!elHash || elHash === hash || !hash) {
          el.classList.add('active');
          var lnb = el.closest('.lnb');
          if (lnb) {
            lnb.classList.add('open');
            var gnb = lnb.previousElementSibling;
            if (gnb && gnb.classList.contains('gnb-item')) {
              gnb.classList.add('active', 'open');
            }
          }
        }
      } else if (el.classList.contains('gnb-item')) {
        el.classList.add('active');
      }
    });
  }

  // showScreen() 등에서 해시 변경 후 사이드바를 재동기화할 때 사용
  window.crmSetActiveSidebar = setActiveSidebar;

  // 같은 페이지면 showScreen() 호출, 다른 페이지면 href 이동
  window.crmNavigate = function (file, hash) {
    var currentFile = decodeURIComponent(window.location.pathname.split('/').pop());
    if (currentFile === file && typeof window.showScreen === 'function') {
      window.showScreen(hash, true);
    } else {
      location.href = file + (hash ? '#' + hash : '');
    }
  };

  /* ── 주입 실행 ───────────────────────────────────────── */
  function injectLayout() {
    if (document.querySelector('.header')) return; // 기존 페이지 보호
    document.body.insertAdjacentHTML('afterbegin', HEADER_HTML + SIDEBAR_HTML);
    document.body.insertAdjacentHTML('beforeend', PANELS_HTML);
    setActiveSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
  } else {
    injectLayout();
  }

})();
