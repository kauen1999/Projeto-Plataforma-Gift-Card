# Banco de Dados: Urbano

## Visão Geral
**Nome do Banco:** `urbano`
**Tipo:** PostgreSQL 15+
**Codificação:** UTF8

---

## Tipos ENUM

| Nome | Valores Permitidos |
|------|--------------------|
| `user_role` | 'user', 'admin' |
| `gift_card_status` | 'desativado', 'ativo', 'bloqueado', 'cancelado' |
| `transaction_type_enum` | 'uso', 'recarga', 'transferencia' |
| `wallet_transaction_type` | 'entrada', 'saida', 'saque', 'investimento' |
| `fee_operation_type` | 'transferencia', 'saque' |

---

## Estrutura das Tabelas

### users
**Descrição:** Usuários da plataforma.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | Identificador único |
| name | TEXT | NOT NULL | Nome completo |
| email | TEXT | NOT NULL, UNIQUE | Email único |
| password_hash | TEXT | NOT NULL | Hash da senha |
| role | user_role | NOT NULL, DEFAULT 'user' | Papel do usuário |
| created_at | TIMESTAMP | DEFAULT now() | Data de criação |
| updated_at | TIMESTAMP | Atualiza via trigger | Data de atualização |

### wallets
**Descrição:** Carteiras virtuais dos usuários.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da wallet |
| user_id | INTEGER | UNIQUE, FK users(id) | Dono da carteira |
| balance | DECIMAL(12,2) | DEFAULT 0, CHECK (>=0) | Saldo atual |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | Atualiza via trigger | |

### companies
**Descrição:** Empresas parceiras.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da empresa |
| name | TEXT | NOT NULL | Nome da empresa |
| is_active | BOOLEAN | DEFAULT TRUE | Empresa ativa? |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | Atualiza via trigger | |

### offers
**Descrição:** Ofertas criadas pelas empresas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da oferta |
| company_id | INTEGER | FK companies(id) | Empresa criadora |
| title | TEXT | NOT NULL | Título da oferta |
| description | TEXT |  | Descrição opcional |
| value | DECIMAL(12,2) | NOT NULL, CHECK (>0) | Valor do gift card |
| discount_percentage | DECIMAL(5,2) | CHECK (>=0) | Desconto percentual |
| is_deleted | BOOLEAN | DEFAULT FALSE | Ativa ou removida |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | Atualiza via trigger | |

### gift_cards
**Descrição:** Cartões presentes virtuais.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID do gift card |
| number | TEXT | UNIQUE NOT NULL | Número do cartão |
| cvv | TEXT | NOT NULL | CVV |
| expiration_date | DATE | NOT NULL | Validade |
| balance | DECIMAL(12,2) | CHECK (>=0) | Saldo atual |
| initial_balance | DECIMAL(12,2) | CHECK (>0) | Valor inicial |
| is_active | BOOLEAN | DEFAULT FALSE | Cartão ativo? |
| code | UUID | UNIQUE NOT NULL | Código do cartão |
| created_by | INTEGER | FK users(id) | Criador |
| assigned_to | INTEGER | FK users(id) | Destinatário |
| offer_id | INTEGER | FK offers(id) | Oferta relacionada |
| status | gift_card_status | DEFAULT 'desativado' | Status atual |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | Atualiza via trigger | |

### gift_card_logs
**Descrição:** Histórico de ações em gift cards.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID do log |
| gift_card_id | INTEGER | FK gift_cards(id) | Cartão associado |
| action | TEXT | NOT NULL | Ação executada |
| made_by | TEXT | NOT NULL | Feito por |
| created_at | TIMESTAMP | DEFAULT now() | |

### gift_card_transactions
**Descrição:** Movimentações financeiras de gift cards.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da transação |
| gift_card_id | INTEGER | FK gift_cards(id) | Cartão envolvido |
| user_id | INTEGER | FK users(id) | Usuário associado |
| transaction_type | transaction_type_enum | NOT NULL | Tipo de transação |
| amount | DECIMAL(12,2) | CHECK (>0) | Valor |
| fee | DECIMAL(12,2) | DEFAULT 0, CHECK (>=0) | Taxa |
| created_at | TIMESTAMP | DEFAULT now() | |

### investment_options
**Descrição:** Opções de investimento do saldo.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da opção |
| name | TEXT | NOT NULL | Nome da opção |
| description | TEXT | | Descrição |
| minimum_value | DECIMAL(12,2) | CHECK (>0) | Valor mínimo |
| created_at | TIMESTAMP | DEFAULT now() | |

### wallet_transactions
**Descrição:** Movimentações de carteiras.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da transação |
| user_id | INTEGER | FK users(id) | Dono da carteira |
| type | wallet_transaction_type | NOT NULL | Tipo |
| amount | DECIMAL(12,2) | CHECK (>0) | Valor |
| fee | DECIMAL(12,2) | DEFAULT 0, CHECK (>=0) | Taxa |
| created_at | TIMESTAMP | DEFAULT now() | |

### fees
**Descrição:** Tabela de taxas administrativas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|--------------|-------------|
| id | SERIAL | PK | ID da taxa |
| operation_type | fee_operation_type | NOT NULL | Tipo de operação |
| percentage | DECIMAL(5,2) | CHECK (>=0) | Percentual |
| created_at | TIMESTAMP | DEFAULT now() | |

---

# Observações
- Todos os campos `updated_at` são automáticos via triggers.
- Integridade garantida com FK, PK e CHECKs.
- Senhas são armazenadas em `password_hash` (nunca texto puro).

