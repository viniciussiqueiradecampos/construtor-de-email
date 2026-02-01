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
  const { activeTab } = state;

  // Use a data attribute to prevent full re-render if we are just typing in an input
  // This check applies to both views, as typing can happen in style guide too
  if (container.dataset.isTyping === 'true') return;

  container.innerHTML = '';
  container.style.justifyContent = 'flex-start';
  container.style.alignItems = 'stretch';

  if (activeTab === 'styleguide') {
    container.appendChild(renderStyleGuide(state));
    return;
  }

  // Builder View Logic
  const { components, selectedId } = state;

  // Header with Add Custom Field Button
  const header = document.createElement('div');
  header.className = 'sidebar-header-main';
  header.style.marginBottom = '16px';
  header.innerHTML = `
    <div style="display:flex; flex-direction:column;">
        <span style="font-size:11px; color:#94A3B8; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Ajustes</span>
        <span style="font-size:16px; color:#1E293B; font-weight:800;">Opções do Campo</span>
    </div>
    <button id="btn-add-custom-field-header" style="background: var(--color-brand); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Campo
    </button>
  `;
  container.appendChild(header);

  // Attach event to custom field button
  setTimeout(() => {
    const btnCustom = document.getElementById('btn-add-custom-field-header');
    if (btnCustom) btnCustom.onclick = () => { if (window.openCustomFieldModal) window.openCustomFieldModal(); };
  }, 0);

  // Scrollable Items Container for Builder
  const list = document.createElement('div');
  list.style.flex = '1';
  list.style.overflowY = 'auto';
  list.style.paddingBottom = '40px';

  // 1. STYLE / TEMPLATE
  list.appendChild(createItem({ id: 'Estilos' }, 'Configurações', 'palette', false, state));

  // Divider
  const hr1 = document.createElement('hr');
  hr1.style.border = 'none'; hr1.style.borderTop = '1px solid #F1F5F9'; hr1.style.margin = '20px 0';
  list.appendChild(hr1);

  // 2. FIELDS (Including Custom Fields)
  const fieldTypes = ['input_name', 'input_email', 'input_phone', 'privacy', 'captcha'];
  const fields = components.filter(c => fieldTypes.includes(c.type) || c.type.startsWith('custom_'));

  fields.forEach(comp => list.appendChild(createItem(comp, getLabel(comp), 'field', true, state)));

  if (fields.length > 0) {
    const hr2 = document.createElement('hr');
    hr2.style.border = 'none'; hr2.style.borderTop = '1px solid #F1F5F9'; hr2.style.margin = '20px 0';
    list.appendChild(hr2);
  }

  // 3. CONTENT (Main elements like Button and Text)
  const content = components.filter(c => !fieldTypes.includes(c.type) && !c.type.startsWith('custom_'));
  content.forEach(comp => {
    let icon = 'text';
    if (comp.type === 'button') icon = 'button';
    list.appendChild(createItem(comp, getLabel(comp), icon, true, state));
  });

  // 4. FOOTER
  const footerHr = document.createElement('hr');
  footerHr.style.border = 'none'; footerHr.style.borderTop = '1px solid #F1F5F9'; footerHr.style.margin = '20px 0';
  list.appendChild(footerHr);
  list.appendChild(createItem({ id: 'Rodapé' }, 'Avisos Legais', 'field', false, state));

  container.appendChild(list);
}

function renderStyleGuide(state) {
  const styleGuideContainer = document.createElement('div');
  styleGuideContainer.style.width = '100%';
  styleGuideContainer.style.display = 'flex';
  styleGuideContainer.style.flexDirection = 'column';
  // height 100% removed to avoid cutoff

  // Header for Style Guide
  const header = document.createElement('div');
  header.className = 'sidebar-header-main';
  header.innerHTML = `
    <div style="display:flex; flex-direction:column;">
        <span style="font-size:11px; color:#94A3B8; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Design</span>
        <span style="font-size:16px; color:#1E293B; font-weight:800;">Cores e Letras</span>
    </div>
    <div class="header-action-wrapper" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
        <button class="btn-icon-top" style="color: #94A3B8;" onclick="store.setSelected(null)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
  `;
  styleGuideContainer.appendChild(header);

  // Scrollable Items Container
  const list = document.createElement('div');
  // Internal scrolling removed
  list.style.paddingBottom = '40px';

  const sections = [
    { id: 'colors', label: 'Cores', icon: 'palette' },
    { id: 'typography', label: 'Tipografia', icon: 'text' },
    { id: 'spacing', label: 'Espaçamento', icon: 'spacing' },
    { id: 'borders', label: 'Bordas e Formas', icon: 'border' },
    { id: 'shadows', label: 'Sombras', icon: 'shadow' },
  ];

  sections.forEach(section => {
    list.appendChild(createItem({ id: section.id, type: section.id }, section.label, section.icon, false, state));
    const hr = document.createElement('hr');
    hr.style.border = 'none'; hr.style.borderTop = '1px solid #F1F5F9'; hr.style.margin = '12px 0';
    list.appendChild(hr);
  });

  styleGuideContainer.appendChild(list);
  return styleGuideContainer;
}

function createItem(comp, label, iconType, isDraggable, state) {
  const { selectedId } = state;
  const item = document.createElement('div');
  const id = comp.id;

  // Logic for opening: selected component
  const isOpen = (selectedId === id);
  item.className = `accordion-item ${isOpen ? 'active' : ''}`;
  item.id = `accordion-${id}`;
  if (isDraggable && comp.type !== 'privacy' && comp.type !== 'button') {
    item.draggable = true;
  }

  const iconSvg = getIconSvg(iconType);
  const isVisible = comp.visible !== undefined ? comp.visible : true;

  const eyeIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOffIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  const chevronIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

  const dragHandleIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" style="cursor:grab; margin-right:8px;"><circle cx="9" cy="5" r="1.5"></circle><circle cx="15" cy="5" r="1.5"></circle><circle cx="9" cy="12" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="9" cy="19" r="1.5"></circle><circle cx="15" cy="19" r="1.5"></circle></svg>`;

  const previewText = getPreviewText(comp, state);

  item.innerHTML = `
      <div class="accordion-header" style="height: auto; padding: 14px 20px; overflow: hidden;">
        <div class="accordion-title" style="display:flex; align-items:center; flex:1; overflow:hidden; min-width:0;">
          ${isDraggable && comp.type !== 'privacy' && comp.type !== 'button' ? dragHandleIcon : ''}
          <span class="accordion-icon" style="color: #64748B; margin-right:12px; flex-shrink:0;">${iconSvg}</span>
          <div style="display:flex; flex-direction:column; overflow:hidden; min-width:0; flex:1;">
            <span style="font-size:9px; color:#94A3B8; font-weight:800; text-transform:uppercase; letter-spacing:1px; line-height:1.2;">${label}</span>
            <span style="font-size:13px; color:#334155; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.4;">${previewText}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:16px; flex-shrink:0; margin-left:10px;">
          ${comp.type && comp.type !== 'privacy' && comp.type !== 'button' && !['colors', 'typography', 'spacing', 'borders', 'shadows'].includes(comp.id) ? `
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
    const isFixed = comp.type === 'privacy' || comp.type === 'button' || ['colors', 'typography', 'spacing', 'borders', 'shadows', 'templates'].includes(comp.id);
    const toggle = item.querySelector('.visibility-toggle');
    if (toggle) toggle.onclick = (e) => {
      e.stopPropagation();
      store.toggleVisibility(comp.id);
    };

    // Style Guide Inputs sync
    item.querySelectorAll('.prop-input-guide').forEach(input => {
      input.onfocus = () => { container.dataset.isTyping = 'true'; };
      input.onblur = () => {
        container.dataset.isTyping = 'false';
        // Force consistency on blur 
        setTimeout(() => store.notify(), 50);
      };

      const updateHandler = (value, dataset) => {
        const { section, subset, key } = dataset;
        let update = { [section]: { ...state.styleGuide[section], [key]: value } };
        if (subset) {
          update[section][subset] = { ...state.styleGuide[section][subset], [key]: value };
        }
        store.updateStyleGuide(update);
      };

      if (input.type === 'color') {
        input.oninput = (e) => {
          updateHandler(e.target.value, e.target.dataset);
          // Update visual preview immediately
          const preview = e.target.parentElement?.querySelector('.color-preview');
          if (preview) preview.style.backgroundColor = e.target.value;
          const text = e.target.parentElement?.querySelector('span'); // Text hex code
          if (text) text.textContent = e.target.value;
        };
        input.onchange = (e) => {
          updateHandler(e.target.value, e.target.dataset);
          setTimeout(() => store.notify(), 50);
        };
      } else {
        input.oninput = (e) => {
          updateHandler(e.target.value, e.target.dataset);
        };
      }
    });

    item.querySelectorAll('.prop-input').forEach(input => {
      // Prevent sidebar re-render on focus
      input.onfocus = () => {
        const propsContainer = document.getElementById('properties-content');
        if (propsContainer) propsContainer.dataset.isTyping = 'true';
      };
      input.onblur = () => {
        const propsContainer = document.getElementById('properties-content');
        if (propsContainer) {
          propsContainer.dataset.isTyping = 'false';
          // Small delay to ensure state is updated
          setTimeout(() => renderSidebarList(propsContainer, store.getState()), 50);
        }
      };

      if (input.type === 'color') {
        // Special handling for color picker to prevent focus loss during selection
        input.oninput = (e) => {
          const propsContainer = document.getElementById('properties-content');
          if (propsContainer) propsContainer.dataset.isTyping = 'true';

          store.updateComponent(comp.id, { [e.target.dataset.key]: e.target.value });
          const preview = e.target.parentElement.querySelector('.color-preview');
          if (preview) preview.style.backgroundColor = e.target.value;
        };
        input.onchange = (e) => {
          const propsContainer = document.getElementById('properties-content');
          if (propsContainer) {
            propsContainer.dataset.isTyping = 'false';
            // Ensure final state is consistent
            setTimeout(() => renderSidebarList(propsContainer, store.getState()), 50);
          }
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
    if (del) {
      if (isFixed) del.style.display = 'none';
      else del.onclick = (e) => {
        e.stopPropagation();
        store.removeComponent(comp.id);
      };
    }

    const dup = item.querySelector('.duplicate-link');
    if (dup) {
      if (isFixed) dup.style.display = 'none';
      else dup.onclick = (e) => {
        e.stopPropagation();
        store.duplicateComponent(comp.id);
      };
    }

    // Drag Drop Reordering for non-fixed components
    if (!isFixed && isDraggable) {
      item.ondragstart = (e) => {
        const index = state.components.findIndex(c => c.id === comp.id);
        e.dataTransfer.setData('source-index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        item.style.opacity = '0.5';
      };

      item.ondragend = () => {
        item.style.opacity = '1';
      };

      item.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      };

      item.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));
        const targetIndex = state.components.findIndex(c => c.id === comp.id);
        if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
          store.reorderComponents(sourceIndex, targetIndex);
        }
      };
    }
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
  const { id } = comp;
  const guide = state.styleGuide || {};

  // -- STYLE GUIDE SECTIONS --
  if (id === 'colors') {
    return `
      <div class="prop-field">
          <label class="prop-label">Cor dos Botões</label>
          <div class="color-picker-container">
              <div class="color-preview" style="background-color: ${guide.colors?.primary || '#4F46E5'};" onclick="this.nextElementSibling.click()"></div>
              <input type="color" class="prop-input-guide" data-section="colors" data-key="primary" value="${guide.colors?.primary || '#4F46E5'}" style="width:0; height:0; visibility:hidden; padding:0;">
              <span style="font-size:12px; color:#64748B; font-weight:600;">${guide.colors?.primary || '#4F46E5'}</span>
          </div>
          <p style="font-size:11px; color:#94A3B8; margin-top:4px;">Esta é a cor que mais vai aparecer no seu site.</p>
      </div>
      <div class="prop-field">
          <label class="prop-label">Cor de Destaque</label>
          <div class="color-picker-container">
              <div class="color-preview" style="background-color: ${guide.colors?.secondary || '#8B5CF6'};" onclick="this.nextElementSibling.click()"></div>
              <input type="color" class="prop-input-guide" data-section="colors" data-key="secondary" value="${guide.colors?.secondary || '#8B5CF6'}" style="width:0; height:0; visibility:hidden; padding:0;">
              <span style="font-size:12px; color:#64748B; font-weight:600;">${guide.colors?.secondary || '#8B5CF6'}</span>
          </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="prop-field">
              <label class="prop-label">Deu Certo</label>
              <div class="color-picker-container">
                  <div class="color-preview" style="background-color: ${guide.colors?.success || '#10B981'};" onclick="this.nextElementSibling.click()"></div>
                  <input type="color" class="prop-input-guide" data-section="colors" data-key="success" value="${guide.colors?.success || '#10B981'}" style="width:0; height:0; visibility:hidden; padding:0;">
              </div>
          </div>
          <div class="prop-field">
              <label class="prop-label">Deu Erro</label>
              <div class="color-picker-container">
                  <div class="color-preview" style="background-color: ${guide.colors?.error || '#EF4444'};" onclick="this.nextElementSibling.click()"></div>
                  <input type="color" class="prop-input-guide" data-section="colors" data-key="error" value="${guide.colors?.error || '#EF4444'}" style="width:0; height:0; visibility:hidden; padding:0;">
              </div>
          </div>
      </div>
    `;
  }

  if (id === 'typography') {
    const container = document.createElement('div');

    // Font Family Selector with Visual Previews
    const fontSection = document.createElement('div');
    fontSection.className = 'prop-field';
    fontSection.innerHTML = `
      <label class="prop-label">Escolha o estilo das letras</label>
      <p style="font-size:11px; color:#94A3B8; margin-bottom:12px;">Isso muda o visual de todos os textos do site.</p>
    `;

    const fontGrid = document.createElement('div');
    fontGrid.style.display = 'grid';
    fontGrid.style.gridTemplateColumns = '1fr 1fr';
    fontGrid.style.gap = '10px';
    fontGrid.style.marginBottom = '20px';

    const fonts = [
      { name: 'Plus Jakarta Sans', label: 'Jakarta', preview: 'Aa' },
      { name: 'Inter', label: 'Inter', preview: 'Aa' },
      { name: 'Montserrat', label: 'Montserrat', preview: 'Aa' },
      { name: 'Outfit', label: 'Outfit', preview: 'Aa' },
      { name: 'Poppins', label: 'Poppins', preview: 'Aa' },
      { name: 'Roboto', label: 'Roboto', preview: 'Aa' }
    ];

    fonts.forEach(font => {
      const isActive = guide.typography?.fontFamily === font.name;
      const card = document.createElement('button');
      card.type = 'button';
      card.style.cssText = `
        padding: 16px 12px;
        border: 2px solid ${isActive ? 'var(--color-brand)' : '#F1F5F9'};
        border-radius: 12px;
        background: ${isActive ? 'rgba(79, 70, 229, 0.05)' : 'white'};
        cursor: pointer;
        transition: all 0.2s;
        font-family: '${font.name}', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      `;
      card.innerHTML = `
        <div style="font-size: 28px; font-weight: 700; color: #1E293B; pointer-events: none;">${font.preview}</div>
        <div style="font-size: 11px; font-weight: 600; color: #64748B; pointer-events: none;">${font.label}</div>
      `;

      // Use addEventListener for better event handling
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        store.updateStyleGuide({ typography: { ...guide.typography, fontFamily: font.name } });
      });

      fontGrid.appendChild(card);
    });

    fontSection.appendChild(fontGrid);
    container.appendChild(fontSection);

    // Typography Size Controls with Sliders
    const sizeSection = document.createElement('div');
    sizeSection.innerHTML = `
      <div style="margin-bottom: 8px;">
        <label class="prop-label">Tamanho das Letras</label>
        <p style="font-size:11px; color:#94A3B8; margin-top:4px;">Deixe as letras do tamanho que você preferir.</p>
      </div>
    `;

    const textTypes = [
      { key: 'h1', label: 'Título Principal', min: 24, max: 48, default: 32, icon: '📰' },
      { key: 'h2', label: 'Título Secundário', min: 18, max: 32, default: 24, icon: '📝' },
      { key: 'h3', label: 'Subtítulo', min: 16, max: 24, default: 20, icon: '📄' },
      { key: 'body', label: 'Texto Normal', min: 13, max: 18, default: 15, icon: '📖' },
      { key: 'legend', label: 'Texto Pequeno', min: 10, max: 14, default: 12, icon: '🏷️' }
    ];

    textTypes.forEach(type => {
      const currentSize = parseInt(guide.typography?.[type.key]?.size) || type.default;

      const typeCard = document.createElement('div');
      typeCard.style.cssText = `
        padding: 16px;
        background: #FFFFFF;
        border-radius: 12px;
        margin-top: 12px;
        border: 1px solid #F1F5F9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      `;

      typeCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${type.icon}</span>
            <span style="font-size: 13px; font-weight: 700; color: #1E293B;">${type.label}</span>
          </div>
          <span id="size-value-${type.key}" style="font-size: 14px; font-weight: 800; color: var(--color-brand); min-width: 45px; text-align: right;">${currentSize}px</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">Pequeno</span>
          <input 
            type="range" 
            id="slider-${type.key}"
            min="${type.min}" 
            max="${type.max}" 
            value="${currentSize}"
            style="flex: 1; height: 6px; border-radius: 10px; outline: none; -webkit-appearance: none; background: linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${((currentSize - type.min) / (type.max - type.min)) * 100}%, #E2E8F0 ${((currentSize - type.min) / (type.max - type.min)) * 100}%, #E2E8F0 100%);"
          />
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">Grande</span>
        </div>
        <div id="preview-${type.key}" style="margin-top: 12px; padding: 12px; background: #F8FAFC; border-radius: 8px; font-size: ${currentSize}px; font-weight: ${guide.typography?.[type.key]?.weight || '500'}; color: #1E293B; text-align: center;">
          Exemplo de texto
        </div>
      `;

      sizeSection.appendChild(typeCard);

      // Add slider event listener after DOM insertion
      setTimeout(() => {
        const slider = document.getElementById(`slider-${type.key}`);
        const valueDisplay = document.getElementById(`size-value-${type.key}`);
        const preview = document.getElementById(`preview-${type.key}`);

        if (slider) {
          // Style the slider thumb
          const style = document.createElement('style');
          style.textContent = `
            #slider-${type.key}::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--color-brand);
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            #slider-${type.key}::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--color-brand);
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `;
          document.head.appendChild(style);

          slider.oninput = (e) => {
            const newSize = e.target.value;
            if (valueDisplay) valueDisplay.textContent = `${newSize}px`;
            if (preview) preview.style.fontSize = `${newSize}px`;

            // Update slider background
            const percentage = ((newSize - type.min) / (type.max - type.min)) * 100;
            slider.style.background = `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

            const propsContainer = document.getElementById('properties-content');
            if (propsContainer) propsContainer.dataset.isTyping = 'true';

            const currentTypography = guide.typography?.[type.key] || {};
            store.updateStyleGuide({
              typography: {
                ...guide.typography,
                [type.key]: { ...currentTypography, size: `${newSize}px` }
              }
            });
          };

          slider.onmouseup = slider.ontouchend = () => {
            const propsContainer = document.getElementById('properties-content');
            if (propsContainer) {
              setTimeout(() => {
                propsContainer.dataset.isTyping = 'false';
              }, 100);
            }
          };
        }
      }, 0);
    });

    container.appendChild(sizeSection);
    return container;
  }

  if (id === 'spacing') {
    const container = document.createElement('div');

    const spacingTypes = [
      {
        key: 'globalMargin',
        label: 'Espaço nas Bordas',
        description: 'Deixa o conteúdo mais centralizado ou mais espalhado',
        min: 20,
        max: 80,
        default: 40,
        icon: '↔️'
      },
      {
        key: 'blockGap',
        label: 'Espaço entre Itens',
        description: 'Distância entre uma pergunta e outra',
        min: 12,
        max: 48,
        default: 24,
        icon: '↕️'
      },
      {
        key: 'columns',
        label: 'Lado a Lado?',
        description: 'Quantos itens aparecem na mesma linha',
        min: 1,
        max: 3,
        default: 1,
        icon: '▦',
        isNumber: true
      }
    ];

    spacingTypes.forEach(type => {
      const currentValue = parseInt(guide.spacing?.[type.key]) || type.default;

      const card = document.createElement('div');
      card.style.cssText = `
        padding: 16px;
        background: #FFFFFF;
        border-radius: 12px;
        margin-bottom: 16px;
        border: 1px solid #F1F5F9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      `;

      card.innerHTML = `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 18px;">${type.icon}</span>
            <span style="font-size: 13px; font-weight: 700; color: #1E293B;">${type.label}</span>
          </div>
          <p style="font-size: 11px; color: #94A3B8; margin: 0;">${type.description}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">Menos</span>
          <input 
            type="range" 
            id="slider-spacing-${type.key}"
            min="${type.min}" 
            max="${type.max}" 
            value="${currentValue}"
            style="flex: 1; height: 6px; border-radius: 10px; outline: none; -webkit-appearance: none; background: linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${((currentValue - type.min) / (type.max - type.min)) * 100}%, #E2E8F0 ${((currentValue - type.min) / (type.max - type.min)) * 100}%, #E2E8F0 100%);"
          />
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">Mais</span>
          <span id="spacing-value-${type.key}" style="font-size: 14px; font-weight: 800; color: var(--color-brand); min-width: 45px; text-align: right;">${currentValue}${type.isNumber ? '' : 'px'}</span>
        </div>
      `;

      container.appendChild(card);

      setTimeout(() => {
        const slider = document.getElementById(`slider-spacing-${type.key}`);
        const valueDisplay = document.getElementById(`spacing-value-${type.key}`);

        if (slider) {
          const style = document.createElement('style');
          style.textContent = `
            #slider-spacing-${type.key}::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--color-brand);
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            #slider-spacing-${type.key}::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--color-brand);
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `;
          document.head.appendChild(style);

          slider.oninput = (e) => {
            const newValue = e.target.value;
            if (valueDisplay) valueDisplay.textContent = `${newValue}${type.isNumber ? '' : 'px'}`;

            const percentage = ((newValue - type.min) / (type.max - type.min)) * 100;
            slider.style.background = `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

            const propsContainer = document.getElementById('properties-content');
            if (propsContainer) propsContainer.dataset.isTyping = 'true';

            store.updateStyleGuide({
              spacing: {
                ...guide.spacing,
                [type.key]: type.isNumber ? parseInt(newValue) : `${newValue}px`
              }
            });
          };

          slider.onmouseup = slider.ontouchend = () => {
            const propsContainer = document.getElementById('properties-content');
            if (propsContainer) {
              setTimeout(() => {
                propsContainer.dataset.isTyping = 'false';
              }, 100);
            }
          };
        }
      }, 0);
    });

    return container;
  }

  if (id === 'borders' || id === 'shadows') {
    const isBorder = id === 'borders';
    const currentStyle = isBorder
      ? (guide.interactive?.style || 'soft')
      : (guide.interactive?.shadow || 'soft');

    const options = isBorder ? [
      { value: 'square', label: 'Quadrado', icon: '<rect x="3" y="3" width="18" height="18"></rect>' },
      { value: 'soft', label: 'Suave', icon: '<rect x="3" y="3" width="18" height="18" rx="6"></rect>' },
      { value: 'round', label: 'Redondo', icon: '<rect x="3" y="3" width="18" height="18" rx="9"></rect>' }
    ] : [
      { value: 'none', label: 'Zero', icon: '<circle cx="12" cy="12" r="10" stroke-width="1"></circle>' },
      { value: 'soft', label: 'Leve', icon: '<circle cx="12" cy="12" r="10" stroke-width="2" style="filter:drop-shadow(0 2px 2px rgba(0,0,0,0.2))"></circle>' },
      { value: 'medium', label: 'Médio', icon: '<circle cx="12" cy="12" r="10" stroke-width="2" style="filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3))"></circle>' },
      { value: 'hard', label: 'Forte', icon: '<circle cx="12" cy="12" r="10" stroke-width="2" style="filter:drop-shadow(0 8px 8px rgba(0,0,0,0.4))"></circle>' }
    ];

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="prop-field">
          <label class="prop-label">${isBorder ? 'Redondinho ou Quadrado?' : 'Quanto de Sombra?'}</label>
          <div style="display: grid; grid-template-columns: repeat(${options.length}, 1fr); gap: 8px;">
              ${options.map(opt => {
      const isActive = currentStyle === opt.value;
      return `
                      <button class="pref-card" data-section="interactive" data-key="${isBorder ? 'style' : 'shadow'}" data-value="${opt.value}" 
                      style="
                          padding: 12px 8px; 
                          background: ${isActive ? 'var(--color-brand-light)' : 'white'}; 
                          border: 2px solid ${isActive ? 'var(--color-brand)' : '#E2E8F0'}; 
                          border-radius: 10px; 
                          cursor: pointer; 
                          display: flex; 
                          flex-direction: column; 
                          align-items: center; 
                          gap: 6px; 
                          transition: all 0.2s;
                      ">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isActive ? 'var(--color-brand)' : '#64748B'}" stroke-width="2">
                              ${opt.icon}
                          </svg>
                          <span style="font-size: 11px; font-weight: 700; color: ${isActive ? 'var(--color-brand)' : '#64748B'};">${opt.label}</span>
                      </button>
                  `;
    }).join('')}
          </div>
          <p style="font-size:11px; color:#94A3B8; margin-top:8px;">${isBorder ? 'Isso muda como os cantos dos itens aparecem.' : 'Isso dá um efeito de profundidade no seu site.'}</p>
      </div>
    `;

    // Add event listeners
    container.querySelectorAll('.pref-card').forEach(card => {
      card.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const section = card.dataset.section;
        const key = card.dataset.key;
        const val = card.dataset.value;

        // Force immediate update - do not block rendering with isTyping
        const currentSection = state.styleGuide?.[section] || {};
        store.updateStyleGuide({ [section]: { ...currentSection, [key]: val } });
      };
    });

    return container;
  }

  if (id === 'templates') return renderTemplateSelector(state);

  // -- BUILDER SECTIONS (Legacy IDs) --
  if (id === 'Estilos') return renderTemplateSelector(state);
  if (id === 'Rodapé') return renderPrivacyEditor(state);

  if (!comp.type) return '';

  // Standard component props rendering
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
                    <label class="prop-label">${getLabelForKey(key, comp)}</label>
                    <input type="text" class="prop-input" data-key="${key}" value="${comp.props[key]}" placeholder="Digite aqui...">
                    ${(comp.type === 'image' && key === 'src') ? `
                        <button class="btn-secondary-system" style="width:100%; margin-top:8px;" onclick="if(window.triggerImageUpload) window.triggerImageUpload('${comp.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Fazer Upload
                        </button>
                    ` : ''}
                </div>
            `;
  }).join('')}
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:16px; border-top: 1px solid #F1F5F9;">
            <button class="duplicate-link" style="color: #4F46E5; border:none; background:none; cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Fazer Cópia
            </button>
            <button class="delete-link" style="color:#EF4444; border:none; background:none; cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Apagar campo
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
    <!-- Seção 1: Identificação Básica -->
    <div style="margin-bottom:24px; padding:16px; background:#F8FAFC; border-radius:16px; border:1px solid #E2E8F0;">
        <div style="margin-bottom:16px;">
            <label class="prop-label" style="display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Nome do formulário
            </label>
            <input type="text" id="brand-name-input" class="prop-input" value="${state.brandName}" placeholder="Dê um nome fácil, ex: Cadastro Promo">
            <p style="font-size:11px; color:#94A3B8; margin-top:6px;">Apenas para sua organização interna.</p>
        </div>

        <div style="margin-bottom:0;">
            <label class="prop-label" style="display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                Identificador de campanha
            </label>
            <div id="tags-pill-container" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
                ${state.formTags ? state.formTags.split(',').filter(t => t.trim()).map(tag => `
                    <span style="background:var(--color-brand-light); color:var(--color-brand); font-size:11px; font-weight:800; padding:4px 10px; border-radius:100px; display:flex; align-items:center; gap:6px; border:1px solid rgba(79,70,229,0.1);">
                        ${tag.trim()}
                        <svg onclick="window.removeFormTag('${tag.trim()}')" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" style="cursor:pointer; opacity:0.6;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </span>
                `).join('') : ''}
            </div>
            <input type="text" id="form-tags-input" class="prop-input" placeholder="Digite uma tag e aperte Enter">
            <p style="font-size:11px; color:#94A3B8; margin-top:6px;">Ajuda a saber de onde veio o contato.</p>
        </div>
    </div>

    <!-- Seção 2: Como o produto aparece -->
    <div style="margin-bottom:24px; padding:16px; border:1px solid #F1F5F9; border-radius:16px;">
        <label class="prop-label" style="margin-bottom:12px; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Como ele vai aparecer?
        </label>
        <div style="display:flex; gap:10px;">
            <button class="display-mode-btn" data-mode="fixed" style="flex:1; padding:12px; border:2px solid ${state.productDisplay === 'fixed' ? 'var(--color-brand)' : '#F1F5F9'}; border-radius:12px; background:${state.productDisplay === 'fixed' ? 'var(--color-brand-light)' : 'white'}; font-size:13px; font-weight:800; color:${state.productDisplay === 'fixed' ? 'var(--color-brand)' : '#64748B'}; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:8px; transition:all 0.2s;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                Fixo na página
            </button>
            <button class="display-mode-btn" data-mode="popup" style="flex:1; padding:12px; border:2px solid ${state.productDisplay === 'popup' ? 'var(--color-brand)' : '#F1F5F9'}; border-radius:12px; background:${state.productDisplay === 'popup' ? 'var(--color-brand-light)' : 'white'}; font-size:13px; font-weight:800; color:${state.productDisplay === 'popup' ? 'var(--color-brand)' : '#64748B'}; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:8px; transition:all 0.2s;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M12 5v14M5 12h14"/></svg>
                Como Popup
            </button>
        </div>

        ${state.productDisplay === 'popup' ? `
            <div style="margin-top:16px; padding:16px; background:#FFFFFF; border-radius:16px; border:1.5px solid #E2E8F0; box-shadow: var(--shadow-sm);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:32px; height:32px; background:var(--color-brand-light); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--color-brand);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <span style="font-size:13px; font-weight:800; color:#1E293B;">Aparecer após</span>
                    </div>
                    <div style="background:var(--color-brand); color:white; font-size:13px; font-weight:900; padding:4px 12px; border-radius:100px; box-shadow: 0 4px 10px rgba(79,70,229,0.2);">${state.popupDelay} segundos</div>
                </div>
                <div style="position:relative; padding:10px 0;">
                    <input type="range" id="popup-delay-slider" min="0" max="30" step="1" value="${state.popupDelay}" style="width:100%; -webkit-appearance:none; height:6px; background:#E2E8F0; border-radius:10px; outline:none; cursor:pointer;">
                    <style>
                        #popup-delay-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 20px;
                            height: 20px;
                            background: white;
                            border: 3px solid var(--color-brand);
                            border-radius: 50%;
                            cursor: pointer;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                            transition: transform 0.2s;
                        }
                        #popup-delay-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
                    </style>
                </div>
                <p style="font-size:11px; color:#94A3B8; text-align:center; font-weight:600;">O formulário vai "pular" na tela automaticamente.</p>
            </div>
        ` : ''}
    </div>

    <!-- Seção 3: Visual Pronto -->
    <div style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <label class="prop-label" style="margin:0;">Escolha um visual pronto</label>
            <span style="font-size:10px; font-weight:800; color:white; background:var(--color-brand); padding:2px 8px; border-radius:10px; text-transform:uppercase;">Temas</span>
        </div>
        <div id="template-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;"></div>
    </div>

    <div style="margin-bottom:8px; padding:16px; border:1px solid #F1F5F9; border-radius:16px;">
        <label class="prop-label" style="margin-bottom:12px; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            Modo de Cor
        </label>
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
    card.style.cssText = `cursor:pointer; border: 2.5px solid ${isActive ? 'var(--color-brand)' : '#F1F5F9'}; border-radius:14px; overflow:hidden; transition: all 0.2s; background: white; transform: ${isActive ? 'scale(1.02)' : 'scale(1)'};`;
    card.innerHTML = `
      <div style="height:54px; background: ${t.bg}; opacity: ${isActive ? '1' : '0.8'};"></div>
      <div style="padding:12px 10px;">
          <div style="font-size:13px; font-weight:800; color:#1E293B;">${t.name}</div>
          <div style="font-size:10px; color:#64748B; font-weight:600;">${t.desc}</div>
      </div>
    `;
    card.onclick = () => {
      store.setTemplate(t.id);
      // Reset style guide colors to ensure template defaults take priority
      store.updateStyleGuide({
        colors: { primary: null, secondary: null, success: null, error: null }
      });
    };
    grid.appendChild(card);
  });

  const brandInput = container.querySelector('#brand-name-input');
  brandInput.oninput = (e) => store.setBrandName(e.target.value);
  brandInput.onfocus = () => { document.getElementById('properties-content').dataset.isTyping = 'true'; };
  brandInput.onblur = () => {
    document.getElementById('properties-content').dataset.isTyping = 'false';
    renderSidebarList(document.getElementById('properties-content'), store.getState());
  };

  const tagsInput = container.querySelector('#form-tags-input');
  if (tagsInput) {
    tagsInput.onkeydown = (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        e.preventDefault();
        const currentTags = state.formTags ? state.formTags.split(',') : [];
        const newTag = e.target.value.trim();
        if (!currentTags.includes(newTag)) {
          currentTags.push(newTag);
          store.setFormTags(currentTags.filter(t => t.trim()).join(','));
          e.target.value = '';
          // Force render since we are technically "typing" but hit enter
          const propsContent = document.getElementById('properties-content');
          propsContent.dataset.isTyping = 'false';
          renderSidebarList(propsContent, store.getState());
        }
      }
    };
    tagsInput.onfocus = () => { document.getElementById('properties-content').dataset.isTyping = 'true'; };
    tagsInput.onblur = () => {
      document.getElementById('properties-content').dataset.isTyping = 'false';
    };
  }

  window.removeFormTag = (tag) => {
    const currentTags = store.getState().formTags.split(',');
    const filtered = currentTags.filter(t => t.trim() !== tag.trim());
    store.setFormTags(filtered.join(','));
    renderSidebarList(document.getElementById('properties-content'), store.getState());
  };

  container.querySelectorAll('.display-mode-btn').forEach(btn => {
    btn.onclick = () => store.setProductDisplay(btn.dataset.mode);
  });

  const popupSlider = container.querySelector('#popup-delay-slider');
  if (popupSlider) {
    popupSlider.onmousedown = popupSlider.ontouchstart = () => {
      document.getElementById('properties-content').dataset.isTyping = 'true';
    };

    popupSlider.oninput = (e) => {
      const val = e.target.value;
      const percentage = (val / 30) * 100;
      e.target.style.background = `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

      store.setPopupDelay(val);

      const card = e.target.closest('div[style*="background:#FFFFFF"]');
      if (card) {
        const bubble = card.querySelector('div[style*="background:var(--color-brand)"]');
        if (bubble) bubble.textContent = val + ' segundos';
      }
    };

    popupSlider.onmouseup = popupSlider.ontouchend = popupSlider.onchange = () => {
      const propsContent = document.getElementById('properties-content');
      propsContent.dataset.isTyping = 'false';
      setTimeout(() => {
        if (propsContent.dataset.isTyping === 'false') {
          renderSidebarList(propsContent, store.getState());
        }
      }, 10);
    };
  }

  const logoBtn = container.querySelector('#btn-upload-brand-logo');
  if (logoBtn) {
    logoBtn.onclick = () => { if (window.triggerBrandLogoUpload) window.triggerBrandLogoUpload(); };
  }

  container.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    const isThisActive = state.theme === btn.dataset.theme;
    btn.style.borderColor = isThisActive ? 'var(--color-brand)' : '#F1F5F9';
    // Active: Brand Background + White Text (High Contrast)
    // Inactive: White Background + Gray Text
    btn.style.background = isThisActive ? 'var(--color-brand)' : 'white';
    btn.style.color = isThisActive ? '#FFFFFF' : '#64748B';

    btn.onclick = () => store.setTheme(btn.dataset.theme);
  });

  return container;
}

function renderPrivacyEditor(state) {
  const { privacySettings } = state;

  setTimeout(() => {
    const btnEdit = document.getElementById('btn-open-privacy-editor');
    const headerBtnEdit = document.getElementById('privacy-header-edit');
    const headerBtnEye = document.getElementById('privacy-header-eye');

    const openEdit = () => { if (window.openPrivacyModal) window.openPrivacyModal(); };
    const openMock = () => {
      if (window.showCustomAlert) {
        window.showCustomAlert('Pré-visualização da Política', 'PRÉ-VISUALIZAÇÃO DA POLÍTICA (Dados Mockados):\n\nNa [EMPRESA], sua privacidade é prioridade. Em [DATA], atualizamos nossas diretrizes para garantir que seu contato [EMAIL_CONTATO] esteja sempre protegido.\n\nTermos Adicionais:\n1. Coleta de dados limitada.\n2. Uso exclusivo para melhoria do serviço.\n3. Cancelamento a qualquer momento.');
      }
    };

    if (btnEdit) btnEdit.onclick = openEdit;
    if (headerBtnEdit) headerBtnEdit.onclick = (e) => { e.stopPropagation(); openEdit(); };
    if (headerBtnEye) headerBtnEye.onclick = (e) => { e.stopPropagation(); openMock(); };

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
                <div style="display:flex; gap:12px; color:#94A3B8;">
                    <svg id="privacy-header-edit" style="cursor:pointer;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <svg id="privacy-header-eye" style="cursor:pointer;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
            </div>
            
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;">
                <input type="checkbox" id="privacy-default-check" ${privacySettings.defaultChecked ? 'checked' : ''} style="width:16px; height:16px; cursor:pointer; accent-color:#4F46E5;">
                <label for="privacy-default-check" style="font-size:13px; color:#64748B; font-weight:600; cursor:pointer;">Marcado por padrão</label>
            </div>

            <button id="btn-open-privacy-editor" class="btn-primary-system" style="width:100%; height:48px; gap:12px; font-size:14px; margin-top:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Editar Texto Completo
            </button>
        </div>
    `;
}

function getIconSvg(type) {
  const fieldIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
  const textIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 6.1L12.6 19.4a1 1 0 0 1-1.9 0L6.3 6.1C6 5.5 6.5 5 7.1 5h9.8c.6 0 1 .5.9 1.1z"/></svg>`;
  const btnIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 12h6"/></svg>`;
  const styleIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 1-10-10"/><circle cx="12" cy="12" r="3"/></svg>`;
  const spacingIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 21H3V3"/><path d="M7 14l5-5 4 4 5-5"/></svg>`;
  const borderIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>`;
  const shadowIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2z"/><path d="M4 11v2M12 11v2"/></svg>`;

  if (type === 'spacing') return spacingIcon;
  if (type === 'border') return borderIcon;
  if (type === 'shadow') return shadowIcon;
  if (type === 'template') return styleIcon;
  if (type === 'field') return fieldIcon;
  if (type === 'text') return textIcon;
  if (type === 'button') return btnIcon;
  if (type === 'palette') return styleIcon;
  return fieldIcon;
}

function getLabel(comp) {
  const labels = {
    'input_name': 'Campo de Nome',
    'input_email': 'Campo de E-mail',
    'input_phone': 'Campo de Telefone',
    'privacy': 'Termos de Uso',
    'captcha': 'Teste de Robô',
    'title': 'Título Grande',
    'text': 'Texto Menor',
    'button': 'Botão de Envio',
    'custom_text': 'Pergunta de Texto',
    'custom_select': 'Escolha uma Opção',
    'custom_checkbox': 'Várias Opções',
    'custom_radio': 'Uma Opção Só',
    'custom_list': 'Lista de Itens',
    // Style Guide Labels
    'colors': 'Cores do Site',
    'typography': 'Letras e Tamanhos',
    'spacing': 'Espaços e Organização',
    'borders': 'Formatos das Bordas',
    'shadows': 'Efeitos de Profundidade',
    'templates': 'Escolha um Visual'
  };
  return labels[comp.type] || labels[comp.id] || capitalize(comp.type?.replace('custom_', '').replace('input_', '') || '');
}

function getLabelForKey(key, comp = null) {
  if (comp && comp.type === 'custom_list' && key === 'placeholder') return 'Escreva os itens (separe por vírgula)';
  const dict = {
    'text': 'O que está escrito?',
    'label': 'Nome que aparece em cima',
    'placeholder': 'Dica dentro do campo',
    'src': 'Link da Imagem',
    'height': 'Altura (em pixels)',
    'name': 'Nome do dado (interno)'
  };
  return dict[key] || capitalize(key);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPreviewText(comp, state) {
  if (comp.id === 'Rodapé') return 'Avisos e Termos do seu Site';
  if (comp.id === 'Estilos') return state.brandName || 'Sua Marca e Visual';
  if (comp.id === 'colors') return 'Cores Globais do Projeto';
  if (comp.id === 'typography') return 'Estilos de H1, H2 e Parágrafos';
  if (comp.id === 'spacing') return 'Margens e Respiros Globais';
  if (comp.id === 'borders') return 'Estilos de Arredondamento';
  if (comp.id === 'shadows') return 'Efeitos de Profundidade';
  if (comp.id === 'templates') return 'Escolha um tema pronto';

  const props = comp.props || {};
  if (comp.type === 'image') return 'Alt: ' + (props.alt || 'Imagem carregada');
  if (comp.type === 'divisor') return 'Linha Divisória';
  if (comp.type === 'espaco') return `Tamanho: ${props.size || '24px'}`;
  if (comp.type === 'button') return props.text || 'Botão de Envio';

  // Custom or standard fields
  return props.text || props.label || props.placeholder || 'Campo sem texto';
}
