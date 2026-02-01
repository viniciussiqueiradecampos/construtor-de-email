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
  const saveBtn = document.getElementById('btn-save');
  const publishBtn = document.getElementById('btn-publish-main');

  if (undoBtn) undoBtn.onclick = () => appStore.undo();
  if (redoBtn) redoBtn.onclick = () => appStore.redo();

  if (viewDesktop) viewDesktop.onclick = () => appStore.setViewMode('desktop');
  if (viewMobile) viewMobile.onclick = () => appStore.setViewMode('mobile');

  const tabBuilder = document.querySelector('.nav-item:nth-child(1)');
  const tabStyle = document.querySelector('.nav-item:nth-child(2)');

  if (tabBuilder) tabBuilder.onclick = () => appStore.setActiveTab('builder');
  if (tabStyle) tabStyle.onclick = () => appStore.setActiveTab('styleguide');

  appStore.subscribe((state) => {
    if (tabBuilder) tabBuilder.classList.toggle('active', state.activeTab === 'builder');
    if (tabStyle) tabStyle.classList.toggle('active', state.activeTab === 'styleguide');
    if (brandNameDisplay) brandNameDisplay.textContent = state.brandName;
  });

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

  if (brandNameDisplay) {
    brandNameDisplay.onblur = (e) => appStore.setBrandName(e.target.textContent.trim());
    brandNameDisplay.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        brandNameDisplay.blur();
      }
    };
  }

  const showFeedback = (type) => {
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackSuccess = document.getElementById('feedback-success-screen');
    const feedbackPublish = document.getElementById('feedback-publish-screen');

    if (!feedbackOverlay) return;

    feedbackOverlay.style.display = 'flex';
    if (type === 'save') {
      feedbackSuccess.style.display = 'block';
      feedbackPublish.style.display = 'none';
      document.getElementById('feedback-title').textContent = 'Alterações Salvas';
      document.getElementById('feedback-msg').textContent = 'Seu progresso foi guardado com sucesso no sistema.';

      // Hide view page button for save
      const viewPageBtn = document.getElementById('btn-view-page');
      if (viewPageBtn) viewPageBtn.style.display = 'none';
    } else {
      feedbackSuccess.style.display = 'none';
      feedbackPublish.style.display = 'block';

      const fill = document.getElementById('publish-progress-fill');
      const title = document.getElementById('publish-title');
      const msg = document.getElementById('publish-msg');

      if (fill) fill.style.width = '0%';
      if (title) title.textContent = 'Publicando Projeto';
      if (msg) msg.textContent = 'Estamos preparando tudo para colocar sua página no ar...';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            feedbackPublish.style.display = 'none';
            feedbackSuccess.style.display = 'block';
            document.getElementById('feedback-title').textContent = 'Publicado com Sucesso!';
            document.getElementById('feedback-msg').textContent = 'Sua página já está online e pronta para receber visitas.';

            // Show view page button
            const viewPageBtn = document.getElementById('btn-view-page');
            if (viewPageBtn) viewPageBtn.style.display = 'inline-flex';
          }, 500);
        }
        if (fill) fill.style.width = `${progress}%`;
      }, 300);
    }
  };

  if (saveBtn) saveBtn.onclick = () => showFeedback('save');
  if (publishBtn) publishBtn.onclick = () => showFeedback('publish');

  const btnFeedbackClose = document.getElementById('btn-feedback-close');
  if (btnFeedbackClose) {
    btnFeedbackClose.onclick = () => {
      document.getElementById('feedback-overlay').style.display = 'none';
      document.getElementById('feedback-title').textContent = 'Alterações Salvas';
      document.getElementById('feedback-msg').textContent = 'Seu progresso foi guardado com sucesso no sistema.';
    };
  }

  // View Page Logic - Generates a preview
  const viewPageBtn = document.getElementById('btn-view-page');
  if (viewPageBtn) {
    viewPageBtn.onclick = () => {
      const canvas = document.querySelector('.canvas-paper');
      if (!canvas) return;

      // Clone to clean up
      const clone = canvas.cloneNode(true);
      clone.classList.remove('selected');
      clone.style.margin = '40px auto'; // Center nicely
      clone.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
      clone.querySelectorAll('.canvas-actions').forEach(el => el.remove());
      clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
      clone.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${appStore.getState().brandName || 'Minha Página'}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="${window.location.origin}/src/style.css">
            <style>
                body { margin: 0; padding: 0; background: #F1F5F9; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; overflow-y: auto; }
            </style>
        </head>
        <body>
            ${clone.outerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
  }

  function initCustomAlertModal() {
    const overlay = document.getElementById('custom-alert-modal');
    const closeX = document.getElementById('btn-close-alert-x');
    const closeBtn = document.getElementById('btn-close-alert');
    const titleEl = document.getElementById('alert-title');
    const msgEl = document.getElementById('alert-message');

    const close = () => { if (overlay) overlay.style.display = 'none'; };
    if (closeX) closeX.onclick = close;
    if (closeBtn) closeBtn.onclick = close;

    window.showCustomAlert = (title, message) => {
      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.textContent = message;
      if (overlay) overlay.style.display = 'flex';
    };
  }

  function initPrivacyModal() {
    const overlay = document.getElementById('privacy-modal-overlay');
    const closeBtnX = document.getElementById('btn-close-privacy-modal-x');
    const cancelBtn = document.getElementById('btn-cancel-privacy');
    const savePrivacyBtn = document.getElementById('btn-save-privacy-new');
    const cards = document.querySelectorAll('.privacy-option-card');
    const panels = document.querySelectorAll('.privacy-selection-area');
    const pageItems = document.querySelectorAll('.page-item');
    const varTags = document.querySelectorAll('.var-tag');

    let currentSource = 'page';
    let currentPageId = 'p2';

    const closeModal = () => { if (overlay) overlay.style.display = 'none'; };
    if (closeBtnX) closeBtnX.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    varTags.forEach(tag => {
      tag.onclick = () => {
        const textArea = document.getElementById('privacy-text-input-new');
        if (!textArea) return;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const text = textArea.value;
        const tagText = tag.dataset.tag;
        textArea.value = text.substring(0, start) + tagText + text.substring(end);
        textArea.focus();
        textArea.selectionStart = textArea.selectionEnd = start + tagText.length;
      };
    });

    cards.forEach(card => {
      card.onclick = () => {
        currentSource = card.dataset.source;
        cards.forEach(c => c.classList.toggle('active', c === card));
        panels.forEach(p => p.classList.toggle('active', p.id === `selection-area-${currentSource}`));
      };
    });

    pageItems.forEach(item => {
      item.onclick = () => {
        currentPageId = item.dataset.id;
        pageItems.forEach(i => i.classList.toggle('selected', i === item));
      };
    });

    if (savePrivacyBtn) {
      savePrivacyBtn.onclick = () => {
        const textArea = document.getElementById('privacy-text-input-new');
        const urlInput = document.getElementById('privacy-url-input-new');
        appStore.updatePrivacySettings({
          source: currentSource,
          text: textArea ? textArea.value : '',
          url: urlInput ? urlInput.value : '',
          pageId: currentPageId
        });
        closeModal();
        showCustomAlert('Sucesso!', 'Política de privacidade atualizada!');
      };
    }

    window.openPrivacyModal = () => {
      const settings = appStore.getState().privacySettings;
      currentSource = settings.source;
      currentPageId = settings.pageId;
      const t = document.getElementById('privacy-text-input-new');
      const u = document.getElementById('privacy-url-input-new');
      if (t) t.value = settings.text;
      if (u) u.value = settings.url;
      cards.forEach(c => c.classList.toggle('active', c.dataset.source === currentSource));
      panels.forEach(p => p.classList.toggle('active', p.id === `selection-area-${currentSource}`));
      pageItems.forEach(i => i.classList.toggle('selected', i.dataset.id === currentPageId));
      if (overlay) overlay.style.display = 'flex';
    };
  }

  function initCustomFieldModal() {
    const overlay = document.getElementById('custom-field-modal-overlay');
    const closeX = document.getElementById('btn-close-custom-field-x');
    const cancel = document.getElementById('btn-cancel-custom-field');
    const addAction = document.getElementById('btn-add-custom-field-action');
    const typeCards = document.querySelectorAll('.field-type-card');
    let selectedType = 'text';

    const closeModal = () => { if (overlay) overlay.style.display = 'none'; };
    if (closeX) closeX.onclick = closeModal;
    if (cancel) cancel.onclick = closeModal;

    typeCards.forEach(card => {
      card.onclick = () => {
        selectedType = card.dataset.type;
        typeCards.forEach(c => c.classList.toggle('active', c === card));
        const phLabel = document.getElementById('label-placeholder-dynamic');
        const phInput = document.getElementById('custom-field-placeholder');

        if (phLabel && phInput) {
          if (['select', 'radio', 'checkbox'].includes(selectedType)) {
            phLabel.textContent = 'OPÇÕES (Separadas por vírgula):';
            phInput.placeholder = 'Ex: Opção 1, Opção 2, Opção 3';
          } else if (selectedType === 'list') {
            phLabel.textContent = 'ITENS DA LISTA:';
            phInput.placeholder = 'Ex: Item A, Item B, Item C';
          } else {
            phLabel.textContent = 'PLACEHOLDER:';
            phInput.placeholder = 'Ex: Digite aqui...';
          }
        }
      };
    });

    if (addAction) {
      addAction.onclick = () => {
        const name = document.getElementById('custom-field-name');
        const lib = document.getElementById('custom-field-label');
        const phInput = document.getElementById('custom-field-placeholder');
        const req = document.getElementById('custom-field-required');
        if (!lib.value) { showToast('Por favor, defina um rótulo.'); return; }
        appStore.addComponent(`custom_${selectedType}`, {
          label: lib.value,
          placeholder: phInput.value,
          name: name.value || `campo_${Date.now()}`,
          required: req ? req.checked : false
        });
        closeModal();
        showToast('Campo adicionado!');
        if (name) name.value = '';
        if (lib) lib.value = '';
        if (phInput) phInput.value = '';
        if (req) req.checked = false;
      };
    }
    window.openCustomFieldModal = () => { if (overlay) overlay.style.display = 'flex'; };
  }

  initCustomAlertModal();
  function initImageUpload() {
    const fileInput = document.getElementById('image-upload-input');
    if (!fileInput) return;

    let replaceTargetId = null;

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (replaceTargetId) {
          appStore.updateComponent(replaceTargetId, { src: event.target.result });
          showToast('Imagem atualizada!');
        } else {
          appStore.addComponent('image', {
            src: event.target.result,
            height: 'auto'
          });
          showToast('Imagem adicionada!');
        }
        fileInput.value = ''; // Reset
        replaceTargetId = null;
      };
      reader.readAsDataURL(file);
    };

    window.triggerImageUpload = (targetId = null) => {
      replaceTargetId = targetId;
      fileInput.click();
    };
  }

  initImageUpload();
  initPrivacyModal();
  initCustomFieldModal();

  appStore.subscribe((state) => {
    if (brandNameDisplay && document.activeElement !== brandNameDisplay) brandNameDisplay.textContent = state.brandName;
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
  toast.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
