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
    const modal = document.getElementById('preview-modal');
    const container = document.getElementById('preview-canvas-container');
    const currentCanvas = document.querySelector('.canvas-paper');

    if (modal && container && currentCanvas) {
      container.innerHTML = '';
      const clone = currentCanvas.cloneNode(true);
      clone.classList.remove('selected');
      clone.style.boxShadow = 'none';
      clone.querySelectorAll('.canvas-item').forEach(item => {
        item.classList.remove('selected');
        const actions = item.querySelector('.canvas-actions');
        if (actions) actions.remove();
      });

      container.appendChild(clone);
      modal.style.display = 'flex';
    }
  };

  const closePreviewBtn = document.getElementById('btn-close-preview');
  if (closePreviewBtn) {
    closePreviewBtn.onclick = () => {
      const modal = document.getElementById('preview-modal');
      if (modal) modal.style.display = 'none';
    };
  }

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
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const lottiePlayer = document.getElementById('lottie-player');

    if (!overlay) return;

    overlay.style.display = 'flex';
    progressBarContainer.style.display = 'block';
    progressBar.style.width = '0%';

    // Modern Lottie URLs
    lottiePlayer.src = "https://lottie.host/68224d03-e83e-4b77-8025-06a9d187768e/vD6I5LghkR.json";

    text.textContent = isPublish ? 'Dando vida ao seu projeto...' : 'Salvando alterações...';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);

        // Success state
        lottiePlayer.src = "https://lottie.host/07fb5880-60b6-4558-a968-3b3671236173/7H27rR1I5d.json";
        text.textContent = isPublish ? 'Publicado' : 'Salvo com sucesso!';
        progressBarContainer.style.display = 'none';

        setTimeout(() => {
          overlay.style.display = 'none';
          if (isPublish) {
            window.location.href = '/projects.html';
          } else {
            showToast('Projeto salvo com sucesso!');
          }
        }, 1800);
      }
      progressBar.style.width = `${progress}%`;
    }, 250);
  };

  if (saveBtn) saveBtn.onclick = () => runSaveFlow(false);
  if (publishBtn) publishBtn.onclick = () => runSaveFlow(true);


  function initPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const closeBtn = document.getElementById('btn-close-privacy-modal');
    const saveBtn = document.getElementById('btn-save-privacy-settings');
    const tabs = document.querySelectorAll('.privacy-tab');
    const panels = document.querySelectorAll('.privacy-panel');
    const pageOptions = document.querySelectorAll('.page-option-system');

    let currentSource = 'text';
    let currentPageId = 'p1';

    if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; };

    tabs.forEach(tab => {
      tab.onclick = () => {
        currentSource = tab.dataset.source;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        panels.forEach(p => p.classList.toggle('active', p.id === `privacy-panel-${currentSource}`));
      };
    });

    pageOptions.forEach(opt => {
      opt.onclick = () => {
        currentPageId = opt.dataset.id;
        pageOptions.forEach(o => o.classList.toggle('active', o === opt));
      };
    });

    if (saveBtn) {
      saveBtn.onclick = () => {
        const text = document.getElementById('privacy-text-input').value;
        const url = document.getElementById('privacy-url-input').value;

        appStore.updatePrivacySettings({
          source: currentSource,
          text: text,
          url: url,
          pageId: currentPageId
        });

        modal.style.display = 'none';
        showToast('Configurações de privacidade salvas!');
      };
    }
  }

  initPrivacyModal();

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

