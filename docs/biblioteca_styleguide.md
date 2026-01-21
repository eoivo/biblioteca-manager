# Styleguide

Guia de estilo visual para manter consistência e identidade do sistema.

---

## 1. IDENTIDADE VISUAL

### Conceito
Sistema administrativo profissional com foco em usabilidade e clareza. A paleta transmite confiabilidade (azuis), organização (neutros) e feedback claro (cores de status).

### Personalidade da Marca
- **Profissional:** Interface limpa e organizada
- **Acessível:** Fácil de usar, sem complexidade desnecessária
- **Confiável:** Visual sólido e consistente

---

## 2. PALETA DE CORES

### Cores Principais

```css
/* Primary - Azul Profissional */
--color-primary-50:  #E3F2FD;
--color-primary-100: #BBDEFB;
--color-primary-200: #90CAF9;
--color-primary-300: #64B5F6;
--color-primary-400: #42A5F5;
--color-primary-500: #2196F3;  /* Principal */
--color-primary-600: #1E88E5;
--color-primary-700: #1976D2;
--color-primary-800: #1565C0;
--color-primary-900: #0D47A1;

/* Secondary - Verde Ação */
--color-secondary-500: #4CAF50;  /* Ações positivas */
--color-secondary-600: #43A047;
--color-secondary-700: #388E3C;
```

### Cores Neutras

```css
/* Grays - Textos e Backgrounds */
--color-gray-50:  #FAFAFA;
--color-gray-100: #F5F5F5;  /* Background claro */
--color-gray-200: #EEEEEE;
--color-gray-300: #E0E0E0;  /* Bordas */
--color-gray-400: #BDBDBD;
--color-gray-500: #9E9E9E;  /* Texto secundário */
--color-gray-600: #757575;
--color-gray-700: #616161;  /* Texto principal */
--color-gray-800: #424242;
--color-gray-900: #212121;  /* Texto escuro */

/* White & Black */
--color-white: #FFFFFF;
--color-black: #000000;
```

### Cores de Status

```css
/* Success - Verde */
--color-success-light: #C8E6C9;
--color-success:       #4CAF50;
--color-success-dark:  #388E3C;

/* Warning - Amarelo */
--color-warning-light: #FFF9C4;
--color-warning:       #FFC107;
--color-warning-dark:  #FFA000;

/* Error - Vermelho */
--color-error-light: #FFCDD2;
--color-error:       #F44336;
--color-error-dark:  #D32F2F;

/* Info - Azul claro */
--color-info-light: #B3E5FC;
--color-info:       #03A9F4;
--color-info-dark:  #0288D1;
```

### Uso das Cores

| Elemento | Cor | Variável |
|----------|-----|----------|
| Botão principal | Azul | `--color-primary-500` |
| Botão hover | Azul escuro | `--color-primary-700` |
| Links | Azul | `--color-primary-600` |
| Texto principal | Cinza escuro | `--color-gray-700` |
| Texto secundário | Cinza médio | `--color-gray-500` |
| Bordas | Cinza claro | `--color-gray-300` |
| Background | Branco/Cinza claro | `--color-white` / `--color-gray-100` |
| Mensagem sucesso | Verde | `--color-success` |
| Mensagem erro | Vermelho | `--color-error` |
| Mensagem aviso | Amarelo | `--color-warning` |
| Livro disponível | Verde | `--color-success` |
| Livro reservado | Cinza | `--color-gray-400` |
| Reserva atrasada | Vermelho | `--color-error` |

---

## 3. TIPOGRAFIA

### Fonte Principal

**Family:** `'Inter', 'Segoe UI', 'Roboto', sans-serif`

**Instalação:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Hierarquia de Textos

```css
/* Headings */
--font-size-h1: 2.5rem;    /* 40px - Títulos principais */
--font-size-h2: 2rem;      /* 32px - Títulos de seção */
--font-size-h3: 1.5rem;    /* 24px - Subtítulos */
--font-size-h4: 1.25rem;   /* 20px - Cards, destaque */
--font-size-h5: 1.125rem;  /* 18px */
--font-size-h6: 1rem;      /* 16px */

/* Body */
--font-size-base:   1rem;      /* 16px - Texto padrão */
--font-size-small:  0.875rem;  /* 14px - Texto secundário */
--font-size-xsmall: 0.75rem;   /* 12px - Labels, hints */

/* Weights */
--font-weight-regular: 400;
--font-weight-medium:  500;
--font-weight-semibold: 600;
--font-weight-bold:    700;

/* Line Heights */
--line-height-tight:  1.25;  /* Títulos */
--line-height-normal: 1.5;   /* Textos */
--line-height-relaxed: 1.75; /* Parágrafos longos */
```

### Aplicação

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| Título de página | h1 (40px) | Bold (700) | "Gerenciar Clientes" |
| Título de card | h3 (24px) | Semibold (600) | "Dados do Cliente" |
| Label de campo | small (14px) | Medium (500) | "Nome completo" |
| Texto de input | base (16px) | Regular (400) | Entrada do usuário |
| Texto secundário | small (14px) | Regular (400) | Descrições, hints |
| Botões | base (16px) | Medium (500) | "Salvar", "Cancelar" |

---

## 4. ESPAÇAMENTO

### Sistema de Espaçamento (8px base)

```css
--spacing-1:  0.25rem;  /* 4px  - Micro espaçamentos */
--spacing-2:  0.5rem;   /* 8px  - Pequeno */
--spacing-3:  0.75rem;  /* 12px */
--spacing-4:  1rem;     /* 16px - Base */
--spacing-5:  1.25rem;  /* 20px */
--spacing-6:  1.5rem;   /* 24px - Médio */
--spacing-8:  2rem;     /* 32px - Grande */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px - Extra grande */
--spacing-16: 4rem;     /* 64px - Seções */
```

### Aplicação

| Elemento | Espaçamento | Variável |
|----------|-------------|----------|
| Padding de botão | 12px 24px | `--spacing-3 --spacing-6` |
| Padding de card | 24px | `--spacing-6` |
| Margin entre campos | 16px | `--spacing-4` |
| Margin entre seções | 32px | `--spacing-8` |
| Gap em grids | 16px-24px | `--spacing-4` a `--spacing-6` |
| Padding de inputs | 12px 16px | `--spacing-3 --spacing-4` |

---

## 5. BORDAS E SOMBRAS

### Border Radius

```css
--radius-sm:   4px;   /* Inputs, badges */
--radius-md:   8px;   /* Botões, cards */
--radius-lg:   12px;  /* Modals, containers */
--radius-full: 9999px; /* Pills, avatars */
```

### Box Shadow

```css
/* Elevações */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Aplicação

| Elemento | Shadow | Radius |
|----------|--------|--------|
| Card | `--shadow-md` | `--radius-md` |
| Botão | `--shadow-sm` | `--radius-md` |
| Input | Nenhuma | `--radius-sm` |
| Input focus | `--shadow-sm` | `--radius-sm` |
| Modal | `--shadow-xl` | `--radius-lg` |
| Dropdown | `--shadow-lg` | `--radius-md` |

---

## 6. SISTEMA DE ÍCONES

### Biblioteca Recomendada

**Angular:** Lucide Angular ou PrimeIcons

**Instalação Lucide Angular:**
```bash
npm install lucide-angular
```

**Configuração:**
```typescript
// app.module.ts
import { LucideAngularModule, Book, User, Calendar, CheckCircle, XCircle, AlertCircle, Search, Plus, Edit, Trash2, ChevronRight } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({ Book, User, Calendar, CheckCircle, XCircle, AlertCircle, Search, Plus, Edit, Trash2, ChevronRight })
  ]
})
```

### Ícones do Sistema

**Entidades:**
- **Clientes:** `User`
- **Livros:** `Book`
- **Reservas:** `Calendar`

**Ações:**
- **Adicionar:** `Plus`
- **Editar:** `Edit`
- **Excluir:** `Trash2`
- **Buscar:** `Search`
- **Salvar:** `CheckCircle`
- **Cancelar:** `XCircle`
- **Visualizar:** `Eye`
- **Voltar:** `ArrowLeft`

**Status:**
- **Sucesso:** `CheckCircle` (verde)
- **Erro:** `XCircle` (vermelho)
- **Aviso:** `AlertCircle` (amarelo)
- **Informação:** `Info` (azul)
- **Disponível:** `Check` (verde)
- **Reservado:** `Lock` (cinza)
- **Atrasado:** `AlertTriangle` (vermelho)

**Navegação:**
- **Menu:** `Menu`
- **Próximo:** `ChevronRight`
- **Anterior:** `ChevronLeft`
- **Expandir:** `ChevronDown`
- **Fechar:** `X`

### Tamanhos de Ícones

```css
--icon-xs:  12px;  /* Inline com texto pequeno */
--icon-sm:  16px;  /* Inline com texto normal */
--icon-md:  20px;  /* Botões, badges */
--icon-lg:  24px;  /* Destaque, headers */
--icon-xl:  32px;  /* Estados vazios, ilustrações */
```

### Cores de Ícones

```css
/* Por contexto */
--icon-primary:   var(--color-primary-500);
--icon-secondary: var(--color-gray-500);
--icon-success:   var(--color-success);
--icon-error:     var(--color-error);
--icon-warning:   var(--color-warning);
--icon-disabled:  var(--color-gray-300);
```

### Uso nos Componentes

```html
<!-- Botão com ícone -->
<button class="btn-primary">
  <lucide-icon name="plus" [size]="16"></lucide-icon>
  <span>Novo Cliente</span>
</button>

<!-- Badge de status -->
<span class="badge badge-success">
  <lucide-icon name="check-circle" [size]="12"></lucide-icon>
  Disponível
</span>

<!-- Lista com ícones -->
<ul class="menu">
  <li>
    <lucide-icon name="user" [size]="20"></lucide-icon>
    Clientes
  </li>
  <li>
    <lucide-icon name="book" [size]="20"></lucide-icon>
    Livros
  </li>
</ul>
```

### Regras de Uso

**SEMPRE:**
- Usar ícones de biblioteca (Lucide, PrimeIcons)
- Manter consistência (mesmo ícone para mesma ação)
- Alinhar verticalmente com texto
- Usar cores do styleguide

**NUNCA:**
- Usar emojis (🚫 ❌ 📚 etc)
- Misturar bibliotecas diferentes
- Ícones sem significado claro
- Cores aleatórias

### Exemplos Práticos

**Tabela de Livros:**
```html
<td>
  <span class="status-badge" [ngClass]="livro.status">
    <lucide-icon 
      [name]="livro.status === 'disponivel' ? 'check' : 'lock'" 
      [size]="14">
    </lucide-icon>
    {{ livro.status }}
  </span>
</td>
<td class="actions">
  <button class="btn-icon" title="Editar">
    <lucide-icon name="edit" [size]="16"></lucide-icon>
  </button>
  <button class="btn-icon btn-danger" title="Excluir">
    <lucide-icon name="trash-2" [size]="16"></lucide-icon>
  </button>
</td>
```

**Mensagem de Feedback:**
```html
<div class="alert alert-success">
  <lucide-icon name="check-circle" [size]="20"></lucide-icon>
  <span>Cliente cadastrado com sucesso!</span>
</div>
```

**Estado Vazio:**
```html
<div class="empty-state">
  <lucide-icon name="book" [size]="48" [strokeWidth]="1"></lucide-icon>
  <p>Nenhum livro cadastrado ainda</p>
  <button class="btn-primary">
    <lucide-icon name="plus" [size]="16"></lucide-icon>
    Adicionar Livro
  </button>
</div>
```

---

## 7. COMPONENTES

### Botões

**Variantes:**

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary-500);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-primary-700);
}

/* Secondary Button */
.btn-secondary {
  background: var(--color-white);
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
}

.btn-secondary:hover {
  background: var(--color-primary-50);
}

/* Danger Button */
.btn-danger {
  background: var(--color-error);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
}

.btn-danger:hover {
  background: var(--color-error-dark);
}
```

**Tamanhos:**
- Small: padding `8px 16px`, font `14px`
- Medium (padrão): padding `12px 24px`, font `16px`
- Large: padding `16px 32px`, font `18px`

### Inputs

```css
.input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  color: var(--color-gray-700);
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-sm);
}

.input::placeholder {
  color: var(--color-gray-400);
}

.input.error {
  border-color: var(--color-error);
}
```

### Cards

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
}

.card-header {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-4);
}

.card-body {
  color: var(--color-gray-600);
}
```

### Badges/Tags

```css
.badge {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xsmall);
  font-weight: var(--font-weight-medium);
}

.badge-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.badge-error {
  background: var(--color-error-light);
  color: var(--color-error-dark);
}

.badge-warning {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}
```

### Tabelas

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  padding: var(--spacing-4);
  background: var(--color-gray-100);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  border-bottom: 2px solid var(--color-gray-300);
}

.table td {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-gray-200);
  color: var(--color-gray-600);
}

.table tr:hover {
  background: var(--color-gray-50);
}
```

---

## 7. ESTADOS VISUAIS

### Estados de Livro

| Status | Badge | Ícone | Uso |
|--------|-------|-------|-----|
| Disponível | Verde `badge-success` | `Check` | Pode ser reservado |
| Reservado | Cinza `badge-gray` | `Lock` | Já está emprestado |

### Estados de Reserva

| Status | Badge | Cor | Ícone |
|--------|-------|-----|-------|
| Ativa | Azul `badge-info` | Info | `Calendar` |
| Atrasada | Vermelho `badge-error` | Error | `AlertTriangle` |
| Concluída | Verde `badge-success` | Success | `CheckCircle` |

### Feedback de Ações

| Tipo | Cor de fundo | Ícone | Uso |
|------|--------------|-------|-----|
| Sucesso | Verde claro | `CheckCircle` | "Cliente cadastrado!" |
| Erro | Vermelho claro | `XCircle` | "CPF já existe" |
| Aviso | Amarelo claro | `AlertCircle` | "Reserva próxima do vencimento" |
| Info | Azul claro | `Info` | "Processando..." |

---

## 8. ACESSIBILIDADE

### Contraste de Cores

Todas as combinações atendem **WCAG 2.1 AA**:
- Texto normal: Contraste mínimo 4.5:1
- Texto grande (18px+): Contraste mínimo 3:1
- Elementos interativos: Contraste mínimo 3:1

### Estados de Foco

```css
/* Todos elementos interativos */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Tamanhos Mínimos

- Botões: Mínimo 44x44px (touch target)
- Links: Padding mínimo de 8px
- Inputs: Altura mínima 40px

---

## 9. RESPONSIVIDADE

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile grande */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop pequeno */
--breakpoint-xl: 1280px;  /* Desktop grande */
```

### Ajustes por Tamanho

| Tela | Layout | Ajustes |
|------|--------|---------|
| Mobile (<640px) | Stack vertical | Cards 100% largura, fonte 14px base |
| Tablet (640-1024px) | 2 colunas | Cards 50% largura, sidebar colapsável |
| Desktop (>1024px) | 3-4 colunas | Layout completo, sidebar fixa |

---

## 10. IMPLEMENTAÇÃO

### Arquivo CSS de Variáveis

Criar `src/styles/variables.css`:

```css
:root {
  /* Cores */
  --color-primary-500: #2196F3;
  --color-primary-700: #1976D2;
  --color-success: #4CAF50;
  --color-error: #F44336;
  --color-gray-700: #616161;
  /* ... demais variáveis */
  
  /* Tipografia */
  --font-size-base: 1rem;
  --font-weight-medium: 500;
  /* ... */
  
  /* Espaçamento */
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  /* ... */
}
```

### Uso no Angular

```scss
// Em qualquer componente
.meu-botao {
  background: var(--color-primary-500);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
}
```

---

## 11. EXEMPLOS PRÁTICOS

### Formulário de Cliente

```html
<div class="card">
  <h2 class="card-header">Cadastrar Cliente</h2>
  <form class="card-body">
    <div class="form-group">
      <label>Nome completo</label>
      <input type="text" class="input" placeholder="Digite o nome">
    </div>
    
    <div class="form-group">
      <label>CPF</label>
      <input type="text" class="input" placeholder="000.000.000-00">
      <span class="error-message">CPF inválido</span>
    </div>
    
    <div class="form-actions">
      <button class="btn-secondary">Cancelar</button>
      <button class="btn-primary">Salvar</button>
    </div>
  </form>
</div>
```

### Lista de Livros

```html
<table class="table">
  <thead>
    <tr>
      <th>Título</th>
      <th>Autor</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Clean Code</td>
      <td>Robert Martin</td>
      <td><span class="badge badge-success">Disponível</span></td>
      <td>
        <button class="btn-primary btn-sm">Reservar</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 12. CHECKLIST DE CONSISTÊNCIA

Antes de finalizar, verificar:

- [ ] Todas as cores vêm das variáveis CSS
- [ ] Espaçamentos seguem o sistema de 8px
- [ ] Fontes usam a hierarquia definida
- [ ] Botões têm altura mínima de 44px
- [ ] Contraste de texto atende WCAG AA
- [ ] Estados de hover/focus estão implementados
- [ ] Layout é responsivo nos breakpoints
- [ ] Mensagens de erro/sucesso usam cores e ícones corretos
- [ ] Badges de status seguem o padrão
- [ ] Ícones são do Lucide/PrimeIcons (nunca emojis)

---

**Versão:** 1.0  
**Última atualização:** Janeiro 2026