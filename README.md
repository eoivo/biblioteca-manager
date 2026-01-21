# 📚 Sistema de Gerenciamento de Biblioteca

Sistema web para gestão de bibliotecas desenvolvido como desafio técnico.

## 🛠️ Tecnologias

- **Frontend:** Angular 21+ (TypeScript)
- **Backend:** Node.js + NestJS
- **Banco de Dados:** MongoDB Atlas
- **Testes:** Jest

## 📂 Estrutura do Projeto

```
biblioteca-manager/
├── backend/          # API NestJS
├── frontend/         # Aplicação Angular
└── docs/             # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm 9+
- Conta MongoDB Atlas (gratuita)

### Backend

```bash
cd backend

# Configurar variáveis de ambiente
# Edite o arquivo .env com sua URI do MongoDB Atlas
cp .env.example .env

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev
```

O backend estará disponível em: `http://localhost:3000/api`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
ng serve
# ou
npm start
```

O frontend estará disponível em: `http://localhost:4200`

## ⚙️ Funcionalidades

### Clientes
- CRUD completo
- Validação de CPF (formato e unicidade)

### Livros
- CRUD completo
- Controle de disponibilidade

### Reservas
- Reserva de livros por clientes
- Listagem de reservas
- Identificação de atrasos
- Cálculo automático de multas

## 💰 Regra de Multa

```
Multa = R$ 10,00 (fixo) + (R$ 10,00 × 5% × dias de atraso)
```

**Exemplos:**
- 0 dias de atraso: R$ 10,00
- 3 dias de atraso: R$ 11,50
- 10 dias de atraso: R$ 15,00

## 🧪 Testes

```bash
# Backend
cd backend
npm test
npm run test:cov  # Com cobertura

# Frontend
cd frontend
ng test
```

## 📝 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.
