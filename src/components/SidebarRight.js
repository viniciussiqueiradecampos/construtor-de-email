import { store } from '../store.js';

export function initSidebarRight() {
  const container = document.getElementById('properties-content');
  if (!container) return;

  store.subscribe((state) => {
    renderSidebarList(container, state);
  });

  renderSidebarList(container, store.getState());
}

function renderSidebarList(container, state) {
  const { components, selectedId } = state;

  // Use a data attribute to prevent full re-render if we are just typing in an input
  if (container.dataset.isTyping === 'true') return;

  container.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '24px';
  header.innerHTML = `
    <h2 style="margin:0; font-size: 18px; font-weight: 800; color: #1E293B; letter-spacing: -0.02em;">Configurações</h2>
    <span class="btn-icon-top" style="color: #94A3B8;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </span>
  `;
  container.appendChild(header);

  // 1. STYLE / TEMPLATE
  container.appendChild(createItem({ id: 'Estilos' }, 'Estilos', 'palette', false, state));

  // Divider
  const hr1 = document.createElement('hr');
  hr1.style.border = 'none'; hr1.style.borderTop = '1px solid #F1F5F9'; hr1.style.margin = '20px 0';
  container.appendChild(hr1);

  // 2. FIELDS
  const fieldTypes = ['input_name', 'input_email', 'input_phone', 'privacy', 'captcha'];
  const fields = components.filter(c => fieldTypes.includes(c.type));
  fields.forEach(comp => container.appendChild(createItem(comp, getLabel(comp), 'field', true, state)));

  if (fields.length > 0) {
    const hr2 = document.createElement('hr');
    hr2.style.border = 'none'; hr2.style.borderTop = '1px solid #F1F5F9'; hr2.style.margin = '20px 0';
    container.appendChild(hr2);
  }

  // 3. CONTENT
  const content = components.filter(c => !fieldTypes.includes(c.type));
  content.forEach(comp => {
    let icon = 'text';
    if (comp.type === 'button') icon = 'button';
    container.appendChild(createItem(comp, getLabel(comp), icon, true, state));
  });

  // 4. FOOTER
  const footerHr = document.createElement('hr');
  footerHr.style.border = 'none'; footerHr.style.borderTop = '1px solid #F1F5F9'; footerHr.style.margin = '20px 0';
  container.appendChild(footerHr);
  container.appendChild(createItem({ id: 'Rodapé' }, 'Rodapé', 'field', false, state));
}

function createItem(comp, label, iconType, isDraggable, state) {
  const { selectedId } = state;
  const item = document.createElement('div');
  const id = comp.id;

  // Logic for opening: selected component OR 'Estilos' if nothing selected
  const isOpen = (selectedId === id) || (id === 'Estilos' && !selectedId);
  item.className = `accordion-item ${isOpen ? 'open' : ''}`;
  item.id = `accordion-${id}`;
  if (isDraggable) item.draggable = true;

  const iconSvg = getIconSvg(iconType);
  const isVisible = comp.visible !== undefined ? comp.visible : true;

  const eyeIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOffIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  const chevronIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

  item.innerHTML = `
      <div class="accordion-header">
        <div class="accordion-title">
          <span class="accordion-icon" style="color: #64748B;">${iconSvg}</span>
          ${label}
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          ${comp.type ? `
            <span class="visibility-toggle" title="Visibilidade" style="cursor:pointer; color: ${isVisible ? '#94A3B8' : '#cbd5e1'}; display:flex; align-items:center; transition: color 0.2s;">
                ${isVisible ? eyeIcon : eyeOffIcon}
            </span>
          ` : ''}
          ${chevronIcon}
        </div>
      </div>
      <div class="accordion-content">
        <div class="properties-form"></div>
      </div>
    `;

  const contentBody = item.querySelector('.properties-form');
  const rendered = renderContent(comp, label, state);
  if (typeof rendered === 'string') {
    contentBody.innerHTML = rendered;
  } else {
    contentBody.innerHTML = '';
    contentBody.appendChild(rendered);
  }
  const header = item.querySelector('.accordion-header');
  header.onclick = (e) => {
    if (e.target.closest('.visibility-toggle')) return;
    if (selectedId === id) store.setSelected(null);
    else store.setSelected(id);
  };

  if (comp.type) {
    const toggle = item.querySelector('.visibility-toggle');
    if (toggle) toggle.onclick = (e) => {
      e.stopPropagation();
      store.toggleVisibility(comp.id);
    };

    item.querySelectorAll('.prop-input').forEach(input => {
      // Prevent sidebar re-render on focus
      input.onfocus = () => { container.dataset.isTyping = 'true'; };
      input.onblur = () => {
        container.dataset.isTyping = 'false';
        // Sync everything once typing stops
        renderSidebarList(container, store.getState());
      };

      if (input.type === 'color') {
        input.oninput = (e) => {
          store.updateComponent(comp.id, { [e.target.dataset.key]: e.target.value });
          const preview = e.target.parentElement.querySelector('.color-preview');
          if (preview) preview.style.backgroundColor = e.target.value;
        };
      } else {
        input.oninput = (e) => {
          // Update store BUT render loop is skipped because of isTyping=true
          store.updateComponent(comp.id, { [e.target.dataset.key]: e.target.value });
        };
      }
      input.onmousedown = (e) => e.stopPropagation();
    });

    const del = item.querySelector('.delete-link');
    if (del) del.onclick = (e) => {
      e.stopPropagation();
      store.removeComponent(comp.id);
    };

    const dup = item.querySelector('.duplicate-link');
    if (dup) dup.onclick = (e) => {
      e.stopPropagation();
      store.duplicateComponent(comp.id);
    };

    // Drag Drop Reordering
    item.ondragstart = (e) => {
      const index = state.components.findIndex(c => c.id === comp.id);
      e.dataTransfer.setData('source-index', index);
      item.classList.add('dragging');
    };
    item.ondragend = () => item.classList.remove('dragging');
    item.ondrop = (e) => {
      e.preventDefault();
      const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));
      const targetIndex = state.components.findIndex(c => c.id === comp.id);
      if (!isNaN(sourceIndex)) store.reorderComponents(sourceIndex, targetIndex);
    };
    item.ondragover = (e) => e.preventDefault();
  } else if (label === 'Estilos') {
    // Integration for brand name editing in styles
    const brandInput = item.querySelector('#brand-name-input');
    if (brandInput) {
      brandInput.onfocus = () => { container.dataset.isTyping = 'true'; };
      brandInput.onblur = () => { container.dataset.isTyping = 'false'; };
      brandInput.oninput = (e) => store.setBrandName(e.target.value);
    }
  }

  return item;
}

function renderContent(comp, label, state) {
  if (label === 'Estilos') return renderTemplateSelector(state);
  if (label === 'Rodapé') return renderPrivacyEditor(state);

  if (!comp.type) return '';

  return `
        ${Object.keys(comp.props).map(key => {
    if (key === 'color' || key === 'bg') {
      return `
                    <div class="prop-field">
                        <label class="prop-label">${key === 'bg' ? 'Cor do Fundo' : 'Cor do Texto'}</label>
                        <div class="color-picker-container">
                            <div class="color-preview" style="background-color: ${comp.props[key] || '#000000'};" onclick="this.nextElementSibling.click()"></div>
                            <input type="color" class="prop-input" data-key="${key}" value="${comp.props[key] || '#000000'}" style="width:0; height:0; visibility:hidden; padding:0;">
                            <span style="font-size:12px; color:#64748B; font-weight:600; font-family:monospace;">${comp.props[key] || 'Padrão'}</span>
                        </div>
                    </div>
                `;
    }
    return `
                <div class="prop-field">
                    <label class="prop-label">${getLabelForKey(key)}</label>
                    <input type="text" class="prop-input" data-key="${key}" value="${comp.props[key]}" placeholder="Digite aqui...">
                </div>
            `;
  }).join('')}
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:16px; border-top: 1px solid #F1F5F9;">
            <button class="duplicate-link" style="color: #4F46E5; border:none; background:none; cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Duplicar
            </button>
            <button class="delete-link" style="color:#EF4444; border:none; background:none; cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Remover
            </button>
        </div>
    `;
}

function renderTemplateSelector(state) {
  const container = document.createElement('div');
  const templates = [
    { id: 'moderno', name: 'Moderno', desc: 'Clean e sofisticado', bg: 'linear-gradient(135deg, #6366F1, #A855F7)' },
    { id: 'minimalista', name: 'Minimal', desc: 'Simples e direto', bg: '#1E293B' },
    { id: 'vibrante', name: 'Vibrante', desc: 'Forte e impactante', bg: 'linear-gradient(135deg, #F97316, #EF4444)' },
    { id: 'elegante', name: 'Elegante', desc: 'Refinado e clássico', bg: '#312E81' },
    { id: 'tech', name: 'Tech', desc: 'Futurista e inovador', bg: 'linear-gradient(135deg, #0EA5E9, #2563EB)' }
  ];

  container.innerHTML = `
    <div style="margin-bottom:20px;">
        <label class="prop-label">Nome da Marca</label>
        <input type="text" id="brand-name-input" class="prop-input" value="${state.brandName}" placeholder="Ex: Minha Loja">
    </div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <span style="font-size:12px; font-weight:800; color:#1E293B; text-transform:uppercase; letter-spacing:0.05em;">Visual</span>
        <span style="font-size:11px; color:#64748B; font-weight:600;">Templates</span>
    </div>
    <div id="template-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:24px;"></div>
    <div style="margin-bottom:8px;">
        <label class="prop-label">Aparência</label>
        <div style="display:flex; gap:10px;">
            <button class="theme-toggle-btn" data-theme="light" style="flex:1; padding:12px; border:1.5px solid ${state.theme === 'light' ? '#4F46E5' : '#F1F5F9'}; border-radius:12px; background:${state.theme === 'light' ? '#EEF2FF' : 'white'}; font-size:13px; font-weight:700; color:${state.theme === 'light' ? '#4F46E5' : '#64748B'}; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s;">
                Claro
            </button>
            <button class="theme-toggle-btn" data-theme="dark" style="flex:1; padding:12px; border:1.5px solid ${state.theme === 'dark' ? '#4F46E5' : '#F1F5F9'}; border-radius:12px; background:${state.theme === 'dark' ? '#EEF2FF' : 'white'}; font-size:13px; font-weight:700; color:${state.theme === 'dark' ? '#4F46E5' : '#64748B'}; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s;">
                Escuro
            </button>
        </div>
    </div>
  `;

  const grid = container.querySelector('#template-grid');
  templates.forEach(t => {
    const card = document.createElement('div');
    const isActive = state.template === t.id;
    card.style.cssText = `cursor:pointer; border: 2.5px solid ${isActive ? '#4F46E5' : '#F1F5F9'}; border-radius:14px; overflow:hidden; transition: all 0.2s; background: white; transform: ${isActive ? 'scale(1.02)' : 'scale(1)'};`;
    card.innerHTML = `
      <div style="height:54px; background: ${t.bg}; opacity: ${isActive ? '1' : '0.8'};"></div>
      <div style="padding:12px 10px;">
          <div style="font-size:13px; font-weight:800; color:#1E293B;">${t.name}</div>
          <div style="font-size:10px; color:#64748B; font-weight:600;">${t.desc}</div>
      </div>
    `;
    card.onclick = () => store.setTemplate(t.id);
    grid.appendChild(card);
  });

  const brandInput = container.querySelector('#brand-name-input');
  brandInput.oninput = (e) => store.setBrandName(e.target.value);
  brandInput.onfocus = () => { document.getElementById('properties-content').dataset.isTyping = 'true'; };
  brandInput.onblur = () => {
    document.getElementById('properties-content').dataset.isTyping = 'false';
    renderSidebarList(document.getElementById('properties-content'), store.getState());
  };

  container.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.onclick = () => store.setTheme(btn.dataset.theme);
  });

  return container;
}

function renderPrivacyEditor(state) {
  const { privacySettings } = state;

  setTimeout(() => {
    const btnEdit = document.getElementById('btn-open-privacy-editor');
    if (btnEdit) {
      btnEdit.onclick = () => {
        const modal = document.getElementById('privacy-modal');
        if (modal) {
          // Pre-fill modal with current state
          const textarea = document.getElementById('privacy-text-input');
          const urlInput = document.getElementById('privacy-url-input');
          if (textarea) textarea.value = privacySettings.text;
          if (urlInput) urlInput.value = privacySettings.url;

          // Set active tab based on source
          const tabs = document.querySelectorAll('.privacy-tab');
          const panels = document.querySelectorAll('.privacy-panel');
          tabs.forEach(t => {
            t.classList.toggle('active', t.dataset.source === privacySettings.source);
          });
          panels.forEach(p => {
            p.classList.toggle('active', p.id === `privacy-panel-${privacySettings.source}`);
          });

          modal.style.display = 'flex';
        }
      };
    }

    const checkDefault = document.getElementById('privacy-default-check');
    if (checkDefault) {
      checkDefault.onchange = (e) => {
        store.updatePrivacySettings({ defaultChecked: e.target.checked });
      };
    }
  }, 0);

  return `
        <div style="margin-bottom: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <label class="prop-label" style="margin:0;">Aceitar políticas de privacidade</label>
                <div style="display:flex; gap:8px; color:#94A3B8;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
            </div>
            
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;">
                <input type="checkbox" id="privacy-default-check" ${privacySettings.defaultChecked ? 'checked' : ''} style="width:16px; height:16px; cursor:pointer;">
                <label for="privacy-default-check" style="font-size:13px; color:#64748B; font-weight:600; cursor:pointer;">Marcado por padrão</label>
            </div>

            <button id="btn-open-privacy-editor" class="btn-primary-system" style="width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:12px; font-size:14px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Editar Texto Completo
            </button>
        </div>
    `;
}

function getIconSvg(type) {
  const fieldIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="9" x2="12" y2="9"/></svg>`;
  const textIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`;
  const btnIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>`;
  const styleIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line></svg>`;

  if (type === 'field') return fieldIcon;
  if (type === 'text') return textIcon;
  if (type === 'button') return btnIcon;
  if (type === 'palette') return styleIcon;
  return fieldIcon;
}

function getLabel(comp) {
  const labels = {
    'input_name': 'Nome completo',
    'input_email': 'E-mail',
    'input_phone': 'Telefone',
    'privacy': 'Privacidade',
    'captcha': 'reCAPTCHA',
    'title': 'Título',
    'text': 'Subtítulo',
    'button': 'Botão Main'
  };
  return labels[comp.type] || capitalize(comp.type.replace('input_', ''));
}

function getLabelForKey(key) {
  const dict = {
    'text': 'Título',
    'label': 'Rótulo do Campo',
    'placeholder': 'Dica (Placeholder)',
    'src': 'URL da Imagem'
  };
  return dict[key] || capitalize(key);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
