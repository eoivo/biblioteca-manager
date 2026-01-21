# 📚 DOCUMENTAÇÃO DE DESENVOLVIMENTO - Sistema de Gerenciamento de Biblioteca

---

## 1. INTRODUÇÃO

### 1.1 Propósito do Documento
Esta documentação técnica tem como objetivo orientar o desenvolvimento do Sistema de Gerenciamento de Biblioteca, definindo arquitetura, padrões de código, convenções e processo de desenvolvimento a ser seguido.

### 1.2 Escopo do Projeto
Sistema administrativo web para gestão de bibliotecas, permitindo controle de clientes, acervo de livros e reservas, com aplicação de regras de negócio para multas e disponibilidade.

### 1.3 Público-Alvo
- Desenvolvedores do projeto
- Revisores técnicos
- Equipe de QA

### 1.4 Stack Tecnológica
- **Frontend:** Angular 2+ (TypeScript)
- **Backend:** Node.js com NestJS Framework
- **Banco de Dados:** MongoDB Atlas
- **Versionamento:** Git
- **Testes:** Jest (unitários)

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Visão Geral
O sistema segue arquitetura cliente-servidor com separação clara entre camadas:

```
┌─────────────────┐
│   Frontend      │  Angular SPA
│   (Angular)     │  Camada de Apresentação
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │  NestJS API
│   (NestJS)      │  Camada de Negócio
└────────┬────────┘
         │ Mongoose ODM
         │
┌────────▼────────┐
│   Database      │  MongoDB Atlas
│   (MongoDB)     │  Camada de Dados
└─────────────────┘
```

### 2.2 Padrões Arquiteturais

#### Backend (NestJS)
- **Padrão:** MVC + Repository Pattern
- **Estrutura por Módulos:** Cada entidade (Clientes, Livros, Reservas) é um módulo independente
- **Separação de Responsabilidades:**
  - **Controllers:** Recebem requisições HTTP, delegam para Services
  - **Services:** Contêm lógica de negócio
  - **Schemas:** Definem estrutura dos documentos MongoDB
  - **DTOs:** Validam e transformam dados de entrada/saída
  - **Validators:** Regras de validação customizadas

#### Frontend (Angular)
- **Padrão:** Component-Based Architecture + Services
- **Estrutura Modular:** Organização por features (Clientes, Livros, Reservas)
- **Separação de Responsabilidades:**
  - **Components:** Gerenciam UI e interação do usuário
  - **Services:** Comunicação HTTP com backend
  - **Models:** Interfaces TypeScript para tipagem
  - **Validators:** Validações de formulário
  - **Pipes:** Transformação de dados para exibição

### 2.3 Fluxo de Dados

**Exemplo: Criação de Reserva**
```
1. Usuário preenche formulário → Component Angular
2. Component chama Service → ReservaService.criar()
3. Service faz HTTP POST → Backend /api/reservas
4. Controller recebe → ReservasController.create()
5. Controller delega → ReservasService.create()
6. Service aplica regras de negócio → Validações
7. Service persiste → MongoDB via Mongoose
8. Resposta retorna pela cadeia inversa
9. Component atualiza UI com resultado
```

---

## 3. CONVENÇÕES E PADRÕES DE CÓDIGO

### 3.1 Nomenclatura

#### Geral
- **Idioma:** Português para nomes de negócio, Inglês para termos técnicos
- **Case Styles:**
  - Arquivos: `kebab-case` (ex: `cliente.service.ts`)
  - Classes: `PascalCase` (ex: `ClienteService`)
  - Variáveis/Funções: `camelCase` (ex: `calcularMulta()`)
  - Constantes: `UPPER_SNAKE_CASE` (ex: `VALOR_MULTA_FIXA`)

#### Backend (NestJS)
```
Módulos:       clientes.module.ts
Controllers:   clientes.controller.ts
Services:      clientes.service.ts
DTOs:          create-cliente.dto.ts, update-cliente.dto.ts
Schemas:       cliente.schema.ts
Testes:        clientes.service.spec.ts
```

#### Frontend (Angular)
```
Componentes:   cliente-form.component.ts
Services:      cliente.service.ts
Models:        cliente.model.ts
Modules:       clientes.module.ts
Validators:    cpf.validator.ts
Pipes:         cpf.pipe.ts
```

### 3.2 Estrutura de Commits Git

**Formato:** `tipo(escopo): descrição`

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `refactor`: Refatoração de código
- `test`: Adição/modificação de testes
- `style`: Formatação, ponto e vírgula faltando, etc
- `chore`: Tarefas de build, configurações

**Exemplos:**
```
feat(clientes): adiciona validação de CPF duplicado
fix(reservas): corrige cálculo de multa para atrasos
test(livros): adiciona testes unitários do CRUD
docs(readme): atualiza instruções de instalação
refactor(clientes): extrai validador de CPF para classe separada
```

### 3.3 Padrões de Código

#### Comentários
- Usar comentários para explicar **POR QUE**, não **O QUE**
- Documentar regras de negócio complexas
- Evitar comentários óbvios

**Bom:**
```typescript
// RN004: Multa = valor fixo + 5% ao dia
// Exemplo: R$ 10,00 fixo + (10 * 0.05 * 3 dias) = R$ 11,50
calcularMulta(diasAtraso: number): number {
  return VALOR_FIXO + (VALOR_FIXO * 0.05 * diasAtraso);
}
```

**Ruim:**
```typescript
// Calcula a multa
calcularMulta(diasAtraso: number): number {
  // Retorna o valor
  return VALOR_FIXO + (VALOR_FIXO * 0.05 * diasAtraso);
}
```

#### Tratamento de Erros

**Backend:**
- Usar exceções HTTP do NestJS (`HttpException`, `BadRequestException`, etc)
- Retornar mensagens claras e descritivas
- Logar erros internos

**Frontend:**
- Capturar erros HTTP no Service
- Exibir mensagens amigáveis ao usuário
- Usar interceptors para tratamento global

#### Validações
- **Validar no Backend sempre** (segurança)
- **Validar no Frontend também** (UX - feedback imediato)
- Usar DTOs com class-validator no backend
- Usar Reactive Forms com validators no frontend

---

## 4. REGRAS DE NEGÓCIO DOCUMENTADAS

### RN001: Validação de CPF
**Descrição:** CPF deve ser válido conforme algoritmo oficial brasileiro  
**Critérios:**
- Exatamente 11 dígitos numéricos
- Não pode ter todos dígitos iguais (ex: 111.111.111-11)
- Deve passar na validação dos dígitos verificadores

**Aplicação:**
- Backend: Validação obrigatória em criar/atualizar cliente
- Frontend: Validação em tempo real no formulário

**Testes:**
- CPF válido deve ser aceito
- CPF com dígitos repetidos deve ser rejeitado
- CPF com dígito verificador inválido deve ser rejeitado

---

### RN002: Unicidade de CPF
**Descrição:** Não podem existir dois clientes com mesmo CPF  
**Critérios:**
- Verificação antes de criar novo cliente
- Verificação antes de atualizar CPF de cliente existente
- Ignorar próprio registro ao atualizar

**Aplicação:**
- Backend: Query no banco antes de persistir
- Retornar erro HTTP 409 (Conflict) se duplicado

**Testes:**
- Criar cliente com CPF novo deve funcionar
- Criar cliente com CPF existente deve falhar
- Atualizar cliente mantendo mesmo CPF deve funcionar
- Atualizar cliente para CPF de outro deve falhar

---

### RN003: Disponibilidade de Livro
**Descrição:** Apenas livros disponíveis podem ser reservados  
**Critérios:**
- Livro tem campo `status: 'disponivel' | 'reservado'`
- Ao criar reserva, verificar se livro está disponível
- Atualizar status do livro para 'reservado' ao criar reserva
- Atualizar status do livro para 'disponivel' ao concluir devolução

**Aplicação:**
- Backend: Transação ao criar reserva (verificar + atualizar status)
- Frontend: Desabilitar botão "Reservar" em livros reservados

**Testes:**
- Reservar livro disponível deve funcionar
- Reservar livro já reservado deve falhar
- Concluir devolução deve liberar livro

---

### RN004: Cálculo de Multa por Atraso
**Descrição:** Multa é calculada com valor fixo + acréscimo percentual por dia  
**Fórmula:**
```
MultaTotal = ValorFixo + (ValorFixo × 0,05 × DiasAtraso)
```

**Parâmetros:**
- `ValorFixo`: R$ 10,00 (constante)
- `DiasAtraso`: Diferença entre data atual e data prevista de devolução
- `Percentual`: 5% (0,05)

**Exemplos:**
```
Caso 1: 0 dias de atraso
Multa = 10 + (10 × 0,05 × 0) = R$ 10,00

Caso 2: 3 dias de atraso
Multa = 10 + (10 × 0,05 × 3) = R$ 11,50

Caso 3: 10 dias de atraso
Multa = 10 + (10 × 0,05 × 10) = R$ 15,00
```

**Aplicação:**
- Calcular automaticamente ao consultar reserva
- Exibir valor formatado em reais (R$)

**Testes:**
- Multa com 0 dias = R$ 10,00
- Multa com 3 dias = R$ 11,50
- Multa com 10 dias = R$ 15,00

---

### RN005: Identificação de Reserva em Atraso
**Descrição:** Reserva está atrasada quando data atual ultrapassa data prevista de devolução  
**Critérios:**
```
DataAtual > DataPrevistaDevolucao → Reserva ATRASADA
DiasAtraso = DataAtual - DataPrevistaDevolucao
```

**Aplicação:**
- Calcular dinamicamente ao consultar reservas
- Atualizar campo `status` para 'atrasada'
- Endpoint específico para listar apenas atrasadas

**Testes:**
- Reserva dentro do prazo não deve ser atrasada
- Reserva vencida há 1 dia deve ser atrasada
- Reserva vencida há 30 dias deve ser atrasada

---

## 5. ESTRUTURA DE DADOS

### 5.1 Entidades e Relacionamentos

```
┌──────────────┐          ┌──────────────┐
│   Cliente    │          │    Livro     │
├──────────────┤          ├──────────────┤
│ _id          │          │ _id          │
│ nome         │          │ titulo       │
│ cpf (unique) │          │ autor        │
│ email        │          │ isbn         │
│ telefone     │          │ status       │
│ endereco     │          │ ...          │
└──────┬───────┘          └──────┬───────┘
       │                         │
       │    ┌─────────────┐     │
       └───▶│  Reserva    │◀────┘
            ├─────────────┤
            │ _id         │
            │ clienteId   │ (ref)
            │ livroId     │ (ref)
            │ dataReserva │
            │ dataPrevista│
            │ status      │
            │ multa       │
            └─────────────┘
```

### 5.2 Dicionário de Dados

#### Collection: clientes
| Campo | Tipo | Obrigatório | Validação | Descrição |
|-------|------|-------------|-----------|-----------|
| _id | ObjectId | Auto | - | Identificador único |
| nome | String | Sim | min:3, max:100 | Nome completo do cliente |
| cpf | String | Sim | length:11, unique, cpfValido | CPF sem pontuação |
| email | String | Sim | format:email | Email do cliente |
| telefone | String | Sim | min:10, max:11 | Telefone sem formatação |
| endereco | Object | Não | - | Dados de endereço |
| endereco.rua | String | Não | - | Nome da rua |
| endereco.numero | String | Não | - | Número |
| endereco.cidade | String | Não | - | Cidade |
| endereco.estado | String | Não | length:2 | Sigla UF |
| endereco.cep | String | Não | length:8 | CEP sem pontuação |
| createdAt | Date | Auto | - | Data de criação |
| updatedAt | Date | Auto | - | Data de atualização |

#### Collection: livros
| Campo | Tipo | Obrigatório | Validação | Descrição |
|-------|------|-------------|-----------|-----------|
| _id | ObjectId | Auto | - | Identificador único |
| titulo | String | Sim | min:1, max:200 | Título do livro |
| autor | String | Sim | - | Nome do autor |
| isbn | String | Não | unique | ISBN (se houver) |
| editora | String | Não | - | Nome da editora |
| anoPublicacao | Number | Não | min:1000, max:2100 | Ano de publicação |
| categoria | String | Não | - | Gênero/categoria |
| status | Enum | Sim | 'disponivel', 'reservado' | Status atual |
| createdAt | Date | Auto | - | Data de criação |
| updatedAt | Date | Auto | - | Data de atualização |

#### Collection: reservas
| Campo | Tipo | Obrigatório | Validação | Descrição |
|-------|------|-------------|-----------|-----------|
| _id | ObjectId | Auto | - | Identificador único |
| clienteId | ObjectId | Sim | ref:'Cliente' | Referência ao cliente |
| livroId | ObjectId | Sim | ref:'Livro' | Referência ao livro |
| dataReserva | Date | Auto | - | Data da reserva |
| dataPrevistaDevolucao | Date | Sim | > dataReserva | Data prevista retorno |
| dataDevolucao | Date | Não | - | Data real de devolução |
| status | Enum | Sim | 'ativa', 'concluida', 'atrasada' | Status da reserva |
| multa.valorFixo | Number | Auto | default:10 | Valor base da multa |
| multa.diasAtraso | Number | Auto | min:0 | Dias em atraso |
| multa.valorTotal | Number | Auto | - | Multa total calculada |
| createdAt | Date | Auto | - | Data de criação |
| updatedAt | Date | Auto | - | Data de atualização |

---

## 6. API REST - ESPECIFICAÇÃO DE ENDPOINTS

### 6.1 Padrões Gerais

**Base URL:** `http://localhost:3000/api`

**Formato de Resposta:**
- Sucesso: Status 200/201 + JSON com dados
- Erro: Status 4xx/5xx + JSON com mensagem de erro

**Headers Padrão:**
```
Content-Type: application/json
```

**Formato de Erro:**
```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "error": "Bad Request"
}
```

### 6.2 Endpoints por Módulo

#### Módulo: Clientes

| Método | Endpoint | Descrição | Request Body | Response |
|--------|----------|-----------|--------------|----------|
| POST | `/clientes` | Criar cliente | CreateClienteDto | Cliente criado + 201 |
| GET | `/clientes` | Listar todos | - | Array de clientes + 200 |
| GET | `/clientes/:id` | Buscar por ID | - | Cliente + 200 |
| PUT | `/clientes/:id` | Atualizar | UpdateClienteDto | Cliente atualizado + 200 |
| DELETE | `/clientes/:id` | Deletar | - | 204 No Content |
| GET | `/clientes/cpf/:cpf` | Buscar por CPF | - | Cliente + 200 |

**Validações Específicas:**
- POST/PUT: Validar CPF (formato + unicidade)
- DELETE: Verificar se cliente tem reservas ativas

---

#### Módulo: Livros

| Método | Endpoint | Descrição | Request Body | Response |
|--------|----------|-----------|--------------|----------|
| POST | `/livros` | Criar livro | CreateLivroDto | Livro criado + 201 |
| GET | `/livros` | Listar todos | - | Array de livros + 200 |
| GET | `/livros/:id` | Buscar por ID | - | Livro + 200 |
| PUT | `/livros/:id` | Atualizar | UpdateLivroDto | Livro atualizado + 200 |
| DELETE | `/livros/:id` | Deletar | - | 204 No Content |
| GET | `/livros/disponiveis` | Apenas disponíveis | - | Array filtrado + 200 |

**Validações Específicas:**
- DELETE: Verificar se livro tem reservas ativas
- Status inicial sempre 'disponivel'

---

#### Módulo: Reservas

| Método | Endpoint | Descrição | Request Body | Response |
|--------|----------|-----------|--------------|----------|
| POST | `/reservas` | Criar reserva | CreateReservaDto | Reserva criada + 201 |
| GET | `/reservas` | Listar todas | - | Array de reservas + 200 |
| GET | `/reservas/:id` | Buscar por ID | - | Reserva + 200 |
| PUT | `/reservas/:id` | Atualizar | UpdateReservaDto | Reserva atualizada + 200 |
| DELETE | `/reservas/:id` | Deletar | - | 204 No Content |
| GET | `/reservas/atrasadas` | Apenas atrasadas | - | Array filtrado + 200 |
| GET | `/reservas/cliente/:id` | Por cliente | - | Array filtrado + 200 |
| PUT | `/reservas/:id/devolver` | Concluir devolução | - | Reserva concluída + 200 |

**Validações Específicas:**
- POST: Verificar se livro está disponível (RN003)
- POST: Atualizar status do livro para 'reservado'
- PUT /devolver: Atualizar status do livro para 'disponivel'
- GET: Calcular multa dinamicamente (RN004)

---

## 7. ESTRATÉGIA DE TESTES

### 7.1 Pirâmide de Testes

Para este projeto (escopo júnior):
```
       ┌─────────┐
       │   E2E   │  ← Não obrigatório
       └─────────┘
      ┌───────────┐
      │Integration│  ← Não obrigatório
      └───────────┘
    ┌──────────────┐
    │  Unit Tests  │  ← OBRIGATÓRIO (foco aqui)
    └──────────────┘
```

### 7.2 Testes Unitários Obrigatórios

**Escopo:** Testar regras de negócio principais nos Services

#### ClientesService
```
√ Deve validar formato de CPF corretamente
√ Deve rejeitar CPF com todos dígitos iguais
√ Deve rejeitar CPF com dígito verificador inválido
√ Deve impedir cadastro de CPF duplicado
√ Deve criar cliente com dados válidos
√ Deve atualizar cliente sem alterar CPF
```

#### LivrosService
```
√ Deve criar livro com status 'disponivel' por padrão
√ Deve listar apenas livros disponíveis quando filtrado
√ Deve impedir exclusão de livro com reserva ativa
```

#### ReservasService
```
√ Deve criar reserva e atualizar status do livro
√ Deve impedir reserva de livro já reservado
√ Deve calcular multa = R$ 10,00 para 0 dias de atraso
√ Deve calcular multa = R$ 11,50 para 3 dias de atraso
√ Deve calcular multa = R$ 15,00 para 10 dias de atraso
√ Deve identificar reserva como atrasada corretamente
√ Deve concluir devolução e liberar livro
```

### 7.3 Configuração de Testes

**Framework:** Jest (já incluído no NestJS)

**Estrutura de Arquivo de Teste:**
```typescript
describe('NomeDoService', () => {
  // Setup
  beforeEach(() => {
    // Preparar ambiente de teste
  });

  // Teardown
  afterEach(() => {
    // Limpar após teste
  });

  // Testes agrupados por funcionalidade
  describe('metodoEspecifico', () => {
    it('deve fazer X quando Y', () => {
      // Arrange (preparar)
      // Act (executar)
      // Assert (verificar)
    });
  });
});
```

**Comando para rodar:**
```bash
npm test                 # Roda todos os testes
npm test -- --coverage   # Com cobertura de código
npm test -- --watch      # Modo watch
```

### 7.4 Mocks e Fixtures

**Usar mocks para:**
- Banco de dados (não fazer chamadas reais)
- Serviços externos
- Dependências entre módulos

**Dados de Teste (Fixtures):**
- CPFs válidos para teste: `12345678909`, `98765432100`
- CPFs inválidos: `11111111111`, `12345678900`
- Datas fixas para cálculo de multa

---

## 8. PROCESSO DE DESENVOLVIMENTO

### 8.1 Fluxo de Trabalho Git

```
1. Criar branch feature
   git checkout -b feat/nome-da-feature

2. Desenvolver funcionalidade
   - Escrever código
   - Escrever testes
   - Commitar incrementalmente

3. Testar localmente
   npm test
   npm run start:dev

4. Push para repositório
   git push origin feat/nome-da-feature

5. (Opcional) Pull Request
   Criar PR para main/master
```

### 8.2 Definition of Done (DoD)

Uma funcionalidade está pronta quando:
- ✅ Código implementado e funcionando
- ✅ Testes unitários escritos e passando
- ✅ Validações de entrada implementadas
- ✅ Tratamento de erros adequado
- ✅ Código revisado (auto-revisão mínimo)
- ✅ Documentação atualizada (se necessário)
- ✅ Commit com mensagem descritiva

### 8.3 Ordem de Implementação Sugerida

**Fase 1: Setup e Infraestrutura (Dia 1)**
1. Inicializar projeto Backend (NestJS)
2. Configurar conexão MongoDB Atlas
3. Inicializar projeto Frontend (Angular)
4. Configurar variáveis de ambiente
5. Setup de testes

**Fase 2: Módulo Clientes (Dia 1-2)**
1. Backend: Schema + DTO + Service + Controller
2. Backend: Validador de CPF
3. Backend: Testes unitários
4. Frontend: Service + Model
5. Frontend: Componente de listagem
6. Frontend: Componente de formulário
7. Integração Frontend-Backend

**Fase 3: Módulo Livros (Dia 2)**
1. Backend: Schema + DTO + Service + Controller
2. Backend: Testes unitários
3. Frontend: Service + Model
4. Frontend: Componente de listagem
5. Frontend: Componente de formulário
6. Integração Frontend-Backend

**Fase 4: Módulo Reservas (Dia 3)**
1. Backend: Schema + DTO + Service + Controller
2. Backend: Lógica de cálculo de multa
3. Backend: Lógica de identificação de atraso
4. Backend: Testes unitários (regras principais)
5. Frontend: Service + Model
6. Frontend: Componente de reserva
7. Frontend: Listagem de reservas
8. Integração Frontend-Backend

**Fase 5: Refinamentos (Dia 4-5)**
1. Validações frontend
2. Mensagens de erro/sucesso
3. Loading states
4. Ajustes visuais
5. Testes end-to-end manuais
6. README completo
7. Preparação da apresentação

---

## 9. AMBIENTE DE DESENVOLVIMENTO

### 9.1 Requisitos de Sistema

**Software Necessário:**
- Node.js v18+ (LTS)
- npm v9+
- Angular CLI v17+
- Git v2.30+
- Editor de código (VS Code recomendado)
- MongoDB Compass (opcional, para visualizar dados)

### 9.2 Configuração de Variáveis de Ambiente

**Backend (.env)**
```
# Database
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/biblioteca

# Server
PORT=3000
NODE_ENV=development

# Business Rules
MULTA_VALOR_FIXO=10.00
MULTA_PERCENTUAL_DIA=0.05
```

**Frontend (environment.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### 9.3 Comandos de Desenvolvimento

**Backend:**
```bash
# Instalação
npm install

# Desenvolvimento
npm run start:dev

# Testes
npm test
npm run test:watch
npm run test:cov

# Build
npm run build
```

**Frontend:**
```bash
# Instalação
npm install

# Desenvolvimento
ng serve
# ou
npm start

# Testes
ng test

# Build
ng build
```

---

## 10. CRITÉRIOS DE QUALIDADE

### 10.1 Code Review Checklist

**Funcionalidade:**
- [ ] Código atende aos requisitos
- [ ] Todas validações implementadas
- [ ] Regras de negócio aplicadas corretamente
- [ ] Casos de erro tratados

**Testes:**
- [ ] Testes unitários cobrem regras principais
- [ ] Todos testes passando
- [ ] Casos de borda testados

**Código:**
- [ ] Nomenclatura consistente
- [ ] Sem código duplicado
- [ ] Funções pequenas e focadas
- [ ] Comentários onde necessário

**Segurança:**
- [ ] Validações no backend
- [ ] Dados sensíveis não expostos
- [ ] Sanitização de inputs

**Performance:**
- [ ] Queries otimizadas
- [ ] Sem N+1 queries
- [ ] Loading states implementados

### 10.2 Métricas de Qualidade

**Cobertura de Testes:**
- Mínimo aceitável: 60% das regras de negócio
- Ideal: 80%+

**Complexidade:**
- Evitar funções com complexidade ciclomática > 10
- Extrair lógica complexa para funções auxiliares

**Tamanho:**
- Funções: máximo 50 linhas
- Arquivos: máximo 300 linhas
- Se ultrapassar, refatorar

---

## 11. ENTREGA E APRESENTAÇÃO

### 11.1 Checklist de Entrega

**Repositório:**
- [ ] Código versionado no Git
- [ ] Commits descritivos e organizados
- [ ] README.md completo
- [ ] .env.example incluído
- [ ] .gitignore configurado
- [ ] Repositório público ou link compartilhado

**Documentação:**
- [ ] README com instruções de instalação
- [ ] README com instruções para rodar
- [ ] README com descrição das funcionalidades
- [ ] Comentários em regras de negócio complexas

**Código:**
- [ ] Todas funcionalidades implementadas
- [ ] Testes unitários presentes
- [ ] Código sem erros de lint
- [ ] Build sem warnings

**Ambiente:**
- [ ] Backend rodando localmente
- [ ] Frontend rodando localmente
- [ ] MongoDB Atlas conectado
- [ ] Dados de exemplo populados

### 11.2 Estrutura da Apresentação (5-10 min)

**1. Introdução (1 min)**
- Visão geral do sistema
- Stack utilizada

**2. Demonstração Backend (2-3 min)**
- Mostrar endpoints funcionando
- Demonstrar validações (ex: CPF duplicado)
- Mostrar testes unitários passando

**3. Demonstração Frontend (3-4 min)**
- CRUD de Clientes
- CRUD de Livros
- Criar Reserva
- Visualizar Multa em atraso

**4. Destaques Técnicos (1-2 min)**
- Regras de negócio implementadas
- Padrões utilizados
- Diferenciais (se houver)

**5. Perguntas (2 min)**
- Estar preparado para explicar decisões

### 11.3 Preparação Pré-Apresentação

**30 minutos antes:**
- [ ] Reiniciar computador
- [ ] Subir backend
- [ ] Subir frontend
- [ ] Testar todos fluxos principais
- [ ] Popular dados de exemplo
- [ ] Preparar terminal com comandos prontos
- [ ] Fechar abas/programas desnecessários
- [ ] Testar conexão com MongoDB Atlas

**Plano B:**
- [ ] Ter vídeo gravado de backup
- [ ] Screenshots das funcionalidades
- [ ] Postman com requests salvas

---

## 12. ANEXOS

### 12.1 Recursos Úteis

**Documentações Oficiais:**
- NestJS: https://docs.nestjs.com
- Angular: https://angular.io/docs
- MongoDB: https://docs.mongodb.com
- Jest: https://jestjs.io/docs

**Validação de CPF:**
- Algoritmo: https://www.macoratti.net/alg_cpf.htm

**Boas Práticas:**
- Clean Code (Robert Martin)
- SOLID Principles
- RESTful API Design

### 12.2 Glossário

| Termo | Definição |
|-------|-----------|
| DTO | Data Transfer Object - Objeto para validar/transferir dados |
| ODM | Object Document Mapper - Abstração para MongoDB (Mongoose) |
| CRUD | Create, Read, Update, Delete |
| Schema | Estrutura de dados do Mongoose |
| Service | Camada de lógica de negócio |
| Controller | Camada de controle de requisições HTTP |
| Component | Unidade básica de UI no Angular |
| Pipe | Transformador de dados no Angular |
| Validator | Função de validação de dados |
| Mock | Objeto simulado para testes |

---

## CONTROLE DE VERSÃO DO DOCUMENTO

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 21/01/2026 | Equipe Desenvolvimento | Versão inicial |

---

**FIM DO DOCUMENTO**