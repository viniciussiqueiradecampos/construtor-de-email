# Projeto MBA - Page Builder
Status da Implementação em 31/01/2026

## O que já foi feito:
- [x] Estrutura base com TopBar, Sidebar Esquerda (Toolbox), Canvas Central e Sidebar Direita (Propriedades).
- [x] Gerenciamento de estado (Store) para componentes e seleção.
- [x] Toolbox com ícones coloridos arredondados seguindo design premium.
- [x] Drag & Drop da Sidebar Esquerda para o Canvas.
- [x] Reordenação de elementos via Drag & Drop na Sidebar Direita.
- [x] Edição de propriedades (Texto, Placeholder, etc) via Accordions na Sidebar Direita.
- [x] Deleção de elementos via botão de ação rápida no Canvas e link na Sidebar Direita.
- [x] Estilização Premium com fontes 'Inter' e 'Outfit', sombras suaves e layout responsivo.

## Pasta "MBA- IA"
- Contém o código exportado do Figma (React/Tailwind).
- Servindo como referência técnica para estilos e variáveis de cores (oklch).

## Problemas Resolvidos:
- Correção de layout quebrado (IDs desalinhados e importação de CSS via Vite).
- **Correção Crítica (31/01)**: Restaurados imports de `store.js` que estavam ausentes em `SidebarLeft` e `SidebarRight`, causando falhas no carregamento da UI.
- Sincronização de design com o Figma (Logo "F", agrupamento de camadas e ícones SVG).
- Implementação de deleção de itens conforme solicitado pelo usuário.

