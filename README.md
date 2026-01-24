# 📚 BiblioManager - Sistema de Gerenciamento de Biblioteca

![Angular](https://img.shields.io/badge/Angular-21+-DD0031?logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-10+-E0234E?logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Tests](https://img.shields.io/badge/tests-59%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)

Sistema web completo para gestão de bibliotecas com interface moderna e API REST documentada.

**Desenvolvido para:** Desafio Técnico Jr - I9 Partner

---

## ✨ Destaques

Além dos requisitos básicos, o projeto inclui:

- 📊 **Dashboard** com gráficos interativos (ngx-charts)
- 📖 **Documentação Swagger** completa (20 endpoints)
- ✅ **Validação CPF em tempo real** com feedback visual
- 🎨 **Design System** premium com CSS variables
- 🧪 **59 testes unitários** (89.85% cobertura no ReservasService)
- 🔍 **Paginação e filtros** em todas as listagens

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Conta MongoDB Atlas (gratuita)

### 1. Backend

```bash
cd backend
cp .env.example .env  # Configure sua URI do MongoDB
npm install
npm run start:dev
```

✅ Backend rodando em: `http://localhost:3000/api`  
📖 Swagger Docs: `http://localhost:3000/api/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

✅ Frontend rodando em: `http://localhost:4200`

---

## 🧪 Testes

```bash
cd backend
npm test              # Executar testes
npm run test:cov      # Com cobertura
```

**Resultados:** 59 testes passando | 5 suites completas

---

## 📚 Documentação

- **[Requisitos do Desafio](docs/case.md)** - Especificação original
- **[Guia de Desenvolvimento](docs/biblioteca-manager-dev.md)** - Arquitetura e padrões
- **[Styleguide](docs/biblioteca_styleguide.md)** - Design system e componentes

---

## 🛠️ Stack

| Camada    | Tecnologia                          |
| --------- | ----------------------------------- |
| Frontend  | Angular 21+ (Standalone Components) |
| Backend   | NestJS 10+ (Node.js)                |
| Database  | MongoDB Atlas                       |
| Validação | class-validator, Reactive Forms     |
| Charts    | @swimlane/ngx-charts                |
| Docs      | @nestjs/swagger                     |
| Icons     | lucide-angular                      |
| Tests     | Jest                                |

---

## 💰 Regras de Negócio

**Multa por Atraso:** `R$ 10,00 + (R$ 10,00 × 5% × dias)`

| Atraso  | Cálculo               | Total        |
| ------- | --------------------- | ------------ |
| 0 dias  | R$ 10,00              | **R$ 10,00** |
| 3 dias  | 10 + (10 × 0,05 × 3)  | **R$ 11,50** |
| 10 dias | 10 + (10 × 0,05 × 10) | **R$ 15,00** |

**Validações:**

- ✅ CPF único e válido (algoritmo oficial)
- ✅ Livros disponíveis para reserva
- ✅ Identificação automática de atrasos

---

## 📁 Estrutura

```
biblioteca-manager/
├── backend/          # API NestJS + MongoDB
├── frontend/         # Angular SPA
└── docs/             # Documentação técnica
```

---

**Desenvolvido por:** Ivo Fernandes  
**Data:** Janeiro 2026
