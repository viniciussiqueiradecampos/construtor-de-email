import './style.css';
import { store as appStore } from './store.js';
import { initSidebarLeft } from './components/SidebarLeft.js';
import { initCanvas } from './components/Canvas.js';
import { initSidebarRight } from './components/SidebarRight.js';

document.addEventListener('DOMContentLoaded', () => {
  initSidebarLeft();
  initCanvas();
  initSidebarRight();
  initTopBar();
});

function initTopBar() {
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');
  const viewDesktop = document.getElementById('view-desktop');
  const viewMobile = document.getElementById('view-mobile');
  const previewBtn = document.getElementById('btn-preview');
  const brandNameDisplay = document.getElementById('header-brand-name');
  const backBtn = document.getElementById('btn-back-checkout');

  if (undoBtn) undoBtn.onclick = () => appStore.undo();
  if (redoBtn) redoBtn.onclick = () => appStore.redo();

  if (viewDesktop) viewDesktop.onclick = () => {
    appStore.setViewMode('desktop');
  };
  if (viewMobile) viewMobile.onclick = () => {
    appStore.setViewMode('mobile');
  };

  if (previewBtn) previewBtn.onclick = () => {
    document.body.classList.toggle('preview-mode');
    const isPreview = document.body.classList.contains('preview-mode');
    previewBtn.classList.toggle('active', isPreview);
  };

  const brandNameInput = document.getElementById('header-brand-name');
  if (brandNameInput) {
    brandNameInput.onblur = (e) => {
      appStore.setBrandName(e.target.textContent.trim());
    };
    brandNameInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        brandNameInput.blur();
      }
    };
  }

  const saveBtn = document.getElementById('btn-save');
  const publishBtn = document.getElementById('btn-publish-main');

  const runSaveFlow = (isPublish = false) => {
    const overlay = document.getElementById('loading-overlay');
    const text = document.getElementById('loading-text');
    if (!overlay) return;

    overlay.style.display = 'flex';
    text.textContent = isPublish ? 'Salvando e publicando projeto...' : 'Salvando alterações...';

    setTimeout(() => {
      overlay.style.display = 'none';
      showToast(isPublish ? 'Projeto publicado com sucesso!' : 'Alterações salvas!');

      if (isPublish) {
        setTimeout(() => {
          window.location.href = '/projects.html';
        }, 1200);
      }
    }, 1800);
  };

  if (publishBtn) publishBtn.onclick = () => runSaveFlow(true);

  const exitPreviewBtn = document.getElementById('btn-exit-preview');
  if (exitPreviewBtn) {
    exitPreviewBtn.onclick = () => {
      document.body.classList.remove('preview-mode');
      if (previewBtn) previewBtn.classList.remove('active');
    };
  }

  // Keep top bar in sync
  appStore.subscribe((state) => {
    if (brandNameDisplay && document.activeElement !== brandNameDisplay) {
      brandNameDisplay.textContent = state.brandName;
    }

    if (viewDesktop) viewDesktop.classList.toggle('active', state.viewMode === 'desktop');
    if (viewMobile) viewMobile.classList.toggle('active', state.viewMode === 'mobile');

    if (undoBtn) undoBtn.style.opacity = appStore.past.length > 0 ? '1' : '0.4';
    if (redoBtn) redoBtn.style.opacity = appStore.future.length > 0 ? '1' : '0.4';
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ${message}
    `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

