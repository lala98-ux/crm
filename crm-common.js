/**
 * crm-common.js — ENTWIZ CRM 어드민 공통 기능
 * 모든 어드민 페이지에 <script src="crm-common.js"> 로 포함하세요.
 */

/* ── 사이드바 접기/펼치기 ──────────────────────────── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed');
}

/* ── GNB 서브메뉴 아코디언 ────────────────────────── */
function toggleGnb(el) {
  const lnb = el.nextElementSibling;
  if (!lnb || !lnb.classList.contains('lnb')) return;
  // 접힌 상태: 첫 번째 LNB 항목 클릭으로 위임
  if (document.getElementById('sidebar').classList.contains('collapsed')) {
    const firstItem = lnb.querySelector('.lnb-item');
    if (firstItem) firstItem.click();
    return;
  }
  const isOpen = lnb.classList.contains('open');
  document.querySelectorAll('.gnb-item').forEach(i => { if (i !== el) i.classList.remove('open'); });
  document.querySelectorAll('.lnb').forEach(l => { if (l !== lnb) l.classList.remove('open'); });
  el.classList.toggle('open', !isOpen);
  lnb.classList.toggle('open', !isOpen);
}

/* ── 알림 패널 ────────────────────────────────────── */
function toggleNoti() {
  _closeOtherPanels('notiPanel');
  document.getElementById('notiPanel').classList.toggle('open');
}
function markAllRead() {
  document.querySelectorAll('.noti-item').forEach(i => i.classList.remove('unread'));
  document.querySelectorAll('.noti-dot').forEach(d => d.style.visibility = 'hidden');
  document.getElementById('unreadCount')?.style && (document.getElementById('unreadCount').style.display = 'none');
  document.getElementById('notiDot')?.style && (document.getElementById('notiDot').style.display = 'none');
}

/* ── 유저 드롭다운 ────────────────────────────────── */
function toggleUser() {
  _closeOtherPanels('userPanel');
  document.getElementById('userPanel').classList.toggle('open');
  document.getElementById('userArrow')?.classList.toggle('open');
}
function doLogout() {
  _closeOtherPanels();
  showToast('info', '로그아웃', '안전하게 로그아웃되었습니다.');
  setTimeout(() => { window.location.href = 'CRM_로그인.html'; }, 1400);
}

/* ── 설정 드롭다운 ───────────────────────────────── */
function toggleSetting() {
  _closeOtherPanels('settingPanel');
  document.getElementById('settingPanel').classList.toggle('open');
}
function navToSetting(page) {
  _closeOtherPanels();
  showToast('info', '준비 중', `설정 › ${page} 페이지는 개발 중입니다.`);
}

/* ── 내부 헬퍼: 지정 패널 외 모두 닫기 ──────────── */
function _closeOtherPanels(keep) {
  ['notiPanel', 'userPanel', 'settingPanel'].forEach(id => {
    if (id !== keep) document.getElementById(id)?.classList.remove('open');
  });
  if (keep !== 'userPanel') {
    document.getElementById('userArrow')?.classList.remove('open');
  }
}

/* ── 아직 개발 중인 페이지 ───────────────────────── */
function navWIP(name) {
  showToast('info', '준비 중', `"${name}" 메뉴는 현재 개발 중입니다.`);
}

/* ── 모달 열기/닫기 ──────────────────────────────── */
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

/* ── 토스트 알림 ─────────────────────────────────── */
const _toastIcos = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
function showToast(type, title, msg) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const t = document.createElement('div');
  t.className = 'toast t-' + type;
  t.innerHTML = `<span class="toast-ico">${_toastIcos[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
    <button class="toast-x" onclick="this.parentElement.remove()">×</button>`;
  stack.appendChild(t);
  setTimeout(() => t.parentElement && t.remove(), 4000);
}

/* ── DOM 초기화 ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // 패널 외부 클릭 시 닫기
  document.addEventListener('click', e => {
    if (!e.target.closest('#notiPanel') && !e.target.closest('#btnNoti'))
      document.getElementById('notiPanel')?.classList.remove('open');
    if (!e.target.closest('#settingPanel') && !e.target.closest('#btnSetting'))
      document.getElementById('settingPanel')?.classList.remove('open');
    if (!e.target.closest('#userPanel') && !e.target.closest('#btnUser')) {
      document.getElementById('userPanel')?.classList.remove('open');
      document.getElementById('userArrow')?.classList.remove('open');
    }
  });

  // 모달 backdrop 클릭 닫기
  document.querySelectorAll('.backdrop').forEach(b => {
    b.addEventListener('click', e => { if (e.target === b) b.classList.remove('open'); });
  });

  // ESC 키 모달 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.backdrop.open').forEach(b => b.classList.remove('open'));
  });

  // 접힌 사이드바 GNB 아이콘 툴팁
  const tip = document.createElement('div');
  tip.id = 'gnbTooltip';
  document.body.appendChild(tip);
  document.querySelectorAll('.gnb-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!document.getElementById('sidebar')?.classList.contains('collapsed')) return;
      const lbl = item.querySelector('.gnb-label2');
      if (!lbl) return;
      const r = item.getBoundingClientRect();
      tip.textContent = lbl.textContent.trim();
      tip.style.top = (r.top + r.height / 2) + 'px';
      tip.classList.add('visible');
    });
    item.addEventListener('mouseleave', () => tip.classList.remove('visible'));
  });
});
