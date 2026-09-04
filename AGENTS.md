# AGENTS.md — GestãoHVU

> Documento de diretrizes arquiteturais, padrões de código e regras de trabalho.
> Destinado a agentes de IA e desenvolvedores que atuam neste repositório.
> **Leia este arquivo antes de qualquer alteração.**

---

## 1. Visão Geral do Projeto

**GestãoHVU** é um sistema web de gestão de consultas e atendimentos clínicos veterinários do **HVU (Hospital Veterinário Universitário) — UFAPE**, desenvolvido pelo **LMTS** em projeto de extensão.

O sistema atende 5 perfis de acesso:

| Perfil (role no Keycloak) | Responsabilidades |
|---|---|
| `tutor` | Cadastra seus animais e acompanha agendamentos/consultas |
| `medico` | Realiza e registra consultas e fichas clínicas |
| `secretario` | Gerencia agendamentos, vagas e fluxo de atendimento |
| `patologista` | Cadastra animais LAPA, laudos e análises laboratoriais |
| `admin_lapa` | Administra usuários e dados do laboratório LAPA |

### ⚠️ Contexto de produção (leia antes de qualquer mudança)

O GestãoHVU **está em produção** e possui um **banco de dados populado e em funcionamento**. Por isso:

- **Toda mudança de schema passa por uma NOVA migration Flyway** (`V{n+1}__descricao.sql`); nunca editar migrations já aplicadas.
- Migrations devem ser **compatíveis com os dados existentes** (usar `ADD COLUMN IF NOT EXISTS`, defaults e backfill quando necessário; nunca assumir tabela vazia).
- `ddl-auto` permanece **`validate`**; nunca `create`/`update`.
- Seeders (`common.seeders`) são **apenas para desenvolvimento local**; nunca ativá-los em produção.
- Testes de integração usam banco descartável (Testcontainers); **nunca** apontam para o banco de produção.

---

## 2. Stack Tecnológica (versões verificadas no repositório)

### Backend (`/back`)
| Tecnologia | Versão / Observação |
|---|---|
| Java | **21** (pom.xml e `.tool-versions`) |
| Spring Boot | **3.5.3** (parent `spring-boot-starter-parent`) |
| Build | Maven (wrapper `./mvnw` incluso) |
| Persistência | Spring Data JPA + Hibernate 6.6 (`ddl-auto: validate`) |
| Banco | PostgreSQL 16 (via Docker Compose) |
| Migrações | Flyway **11.7.2** (`flyway-core` + `flyway-database-postgresql`, baseline V1, `classpath:db/migration`) |
| Segurança | Spring Security OAuth2 Resource Server + Keycloak (realm `lmts`) |
| Keycloak Admin | `keycloak-admin-client` 26.0.5 |
| Mapeamento | ModelMapper 3.2.4 + mappers manuais (`mapper/`) |
| Validação | `spring-boot-starter-validation` (Jakarta Validation) |
| Documentação | springdoc-openapi 2.8.17 (`/api-doc/docs`, `/api-doc/swagger.html`) |
| Utilidades | Lombok, JavaFaker (seeders) |
| Testes | JUnit 5.12 + Spring Boot Test + Testcontainers 1.21.2 (PostgreSQL) + Mockito (unitários) |

### Frontend (`/front`)
| Tecnologia | Versão / Observação |
|---|---|
| Framework | **Next.js 13.5.6** usando **Pages Router** (`pages/`) |
| React | 18.2.0 (JavaScript, sem TypeScript) |
| HTTP | axios (instâncias em `common/`) |
| UI | Bootstrap 5 + react-bootstrap + reactstrap + CSS Modules + Tailwind |
| Feedback | react-toastify |
| Calendário | react-big-calendar, react-calendar, react-datepicker |
| PDF | @react-pdf/renderer, jsPDF, html2canvas |
| Desenho (fichas) | react-konva / konva |
| Ícones | FontAwesome |
| Import alias | `@/*` → `./src/*` (`jsconfig.json`) |

### Infraestrutura
| Componente | Detalhe |
|---|---|
| Orquestração | `docker-compose.yaml` (serviços: `backend`, `backend-db`, `keycloak`, `keycloak-db`, `frontend`) |
| Backend | imagem `hvu-backend`, porta **8081** |
| Frontend | imagem `react-image`, porta **3000** |
| Keycloak | `quay.io/keycloak/keycloak`, porta **8080**, importa `realm-export-dev.json` |
| backend-db | PostgreSQL 16, porta host **5433** → container 5432, db `hvu` |
| keycloak-db | PostgreSQL 16, porta host **5434** → container 5432, db `keycloak` |
| Volumes | `pg-data`, `keycloak-pg-data`, `hvu-uploads` |

---

## 3. Estrutura de Diretórios

```
/
├── docker-compose.yaml
├── realm-export-dev.json        # Import de realm do Keycloak (dev)
├── realm-export.json
├── README.md
├── AGENTS.md                    # este arquivo
├── back/                        # API Spring Boot
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/br/edu/ufape/hvu/
│       │   ├── SpringApiCrudApplication.java
│       │   ├── auth/            # ResourceServerConfig, KeycloakJwtAuthenticationConverter
│       │   ├── config/          # GlobalExceptionHandler, ModelMapper, SpringApplicationContext
│       │   ├── controller/      # REST controllers + dto/{request,response,auth}
│       │   ├── exception/       # exceções customizadas + types/{auth,global}
│       │   ├── facade/          # Facade (orquestração + regras de negócio)
│       │   ├── mapper/          # mappers manuais (AnimalMapper, ConsultaMapper)
│       │   ├── model/           # entidades JPA + enums
│       │   ├── repository/      # Spring Data JPA + seeders/
│       │   └── service/         # XxxServiceInterface + XxxService
│       └── resources/
│           ├── application.yml  # ⚠ gitignored — config local
│           └── db/migration/    # Flyway V1..V32
└── front/                       # Next.js
    ├── package.json
    ├── Dockerfile
    ├── common/                  # http-common-back.js, http-common-key.js, logout, postLogin, postRegister
    ├── services/                # {entidade}Service.js (axios)
    ├── pages/                   # Pages Router: pages/{feature}/index.js
    ├── public/
    └── src/
        ├── app/                 # layout.js + globals.css (resíduo do create-next-app; usar pages/)
        ├── components/          # {Componente}/index.js + index.module.css
        ├── hooks/               # use{Entidade}List.js
        └── styles/              # styles.css, global.js
```

---

## 4. Arquitetura e Fluxo de Requisição

### Backend — fluxo obrigatório

```
HTTP → Controller → Facade → ServiceInterface → Service → Repository → PostgreSQL
                      ↑
                 KeycloakService (roles/usuários)
```

1. **Controller** (`@RestController`, `@RequestMapping("/api/v1/")`): camada fina. Extrai o `idSession` do JWT, chama a `Facade` e converte entidades em DTOs de resposta.
2. **Facade**: camada de orquestração. Concentra **regras de negócio e autorização fina** (verificação de dono do recurso, comparação de `userId` com `idSession`, papéis). Métodos de escrita são `@Transactional`.
3. **Service**: `XxxServiceInterface` + `XxxService`. Acesso a repositório, CRUD básico e queries específicas. Lança exceções de domínio quando não encontra recurso.
4. **Repository**: interfaces Spring Data JPA (`JpaRepository<Entity, Long>`), `@Query` JPQL ou native quando necessário.

### Frontend — fluxo obrigatório

```
Page (pages/{feature}/index.js)
  → monta layout (Header/SubHeader/Footer + Componente)
    → Componente (src/components/{Nome}/index.js)
      → services/{entidade}Service.js (axios via common/http-common-back)
        → API Spring Boot
```

---

## 5. Regras e Padrões — Backend

### 5.1 Controllers
- Classe em `controller/`, anotada com `@RestController`, `@RequestMapping("/api/v1/")` e `@RequiredArgsConstructor`.
- **Sempre** injetar a `Facade` (nunca repository/service diretamente).
- **Sempre** obter o usuário da sessão assim:
  ```java
  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  Jwt principal = (Jwt) authentication.getPrincipal();
  String idSession = principal.getSubject();
  ```
  e passar `idSession` para a Facade (ela decide se o usuário pode executar a operação).
- **Sempre** proteger endpoints com `@PreAuthorize`:
  ```java
  @PreAuthorize("hasRole('TUTOR')")
  @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR', 'PATOLOGISTA')")
  ```
  (as roles usam o prefixo `ROLE_` adicionado pelo `KeycloakJwtAuthenticationConverter`; por isso o nome em maiúsculas).
- Usar `@Valid` no `@RequestBody` para acionar validações dos DTOs.
- Endpoints públicos devem ser registrados no `permitAll` do `ResourceServerConfig`.
- Preferir retornar **DTOs de resposta** (não entidades cruas) em código novo.

### 5.2 Facade
- A classe `facade/Facade.java` é a **única porta de entrada** para regras de negócio a partir dos controllers.
- Métodos de escrita (`save`, `update`, `delete`, fluxos como `reagendar`, `cancelar`) anotados com `@Transactional`.
- Toda verificação de propriedade/posse segue o padrão:
  ```java
  if (!recurso.getUserId().equals(idSession) && !keycloakService.hasRoleSecretario(idSession)) {
      throw new ForbiddenOperationException("...");
  }
  ```
- Usar `keycloakService.hasRoleXxx(idSession)` para verificações de papel em runtime.
- `modelMapper.typeMap(...).addMappings(mapper -> mapper.skip(Xxx::setId))` para updates parciais; relacionamentos (`@ManyToOne`) devem ser resolvidos manualmente via `findXxxById` antes do map.
- ⚠ A Facade atual é grande (god class). **Não quebrar o padrão**: novos fluxos entram na Facade. Se um novo domínio justificar, discuta a extração antes de criar novo orquestrador.

### 5.3 Services
- Criar **sempre** par `XxxServiceInterface` + `XxxService` (`@Service @RequiredArgsConstructor`).
- Expor no mínimo: `save`, `findById`, `update`, `delete`, `getAll`.
- Entidade não encontrada:
  ```java
  return repository.findById(id).orElseThrow(() -> new IdNotFoundException(id, "Animal"));
  ```
  ou `ResourceNotFoundException("Animal", "id", id)`.
- Nada de regra de negócio em service; regras ficam na Facade. Service = persistência + consulta.

### 5.4 Repositories
- Interface em `repository/`, `@Repository`, estende `JpaRepository<Entidade, Long>`.
- Preferir queries derivadas (`findByEspecie`, `findByOrigemAnimal`) e `@Query` JPQL.
- Native query só quando necessário (ex.: `DISTINCT ON` do PostgreSQL em `VagaRepository`).
- Lock pessimista já existe em `VagaRepository.findByIdWithLock` — usar em fluxos de concorrência (ocupação de vaga).

### 5.5 Entidades (`model/`)
- Lombok: `@Getter @Setter @NoArgsConstructor @AllArgsConstructor`.
- `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` com `@EqualsAndHashCode.Include` no `id`.
- `@ToString.Exclude` em relacionamentos para evitar recursão/LazyInitialization.
- Enums **sempre** `@Enumerated(EnumType.STRING)`.
- Herança de `Usuario` usa `@Inheritance(strategy = InheritanceType.JOINED)` (subclasses: `Tutor`, `Medico`, `Secretario`, `Patologista`, `AdminLapa`).
- Sem lógica de negócio em entidade.

### 5.6 DTOs
- Pacotes:
  - `controller/dto/request/` — entrada
  - `controller/dto/response/` — saída
  - `controller/dto/auth/` — tokens
- Requests com validação Jakarta (`@NotBlank`, `@NotNull`, `@AssertTrue`) e mensagens em português.
- DTOs que representam entidades podem expor `convertToEntity()` usando o `ModelMapper` via `SpringApplicationContext.getBean("modelMapper")` (padrão de `TutorRequest`/`UsuarioRequest`).
- DTOs com construtores a partir da entidade (`new AnimalResponse(entity)`) também são usados; manter consistência com o endpoint vizinho.
- Mappers manuais (`mapper/AnimalMapper`, `mapper/ConsultaMapper`) são `@Component` e usam `Builder` nos responses.

### 5.7 Exceções e tratamento de erro
- Hierarquia existente:
  - `exception/types/BusinessException.java` → regras de negócio (400)
  - `exception/types/NotFoundException.java`, `ResourceNotFoundException.java`, `IdNotFoundException.java` → 404
  - `exception/types/auth/ForbiddenOperationException.java` → 403
  - `exception/types/auth/KeycloakAuthenticationException.java` → 401
  - `DuplicateAccountException.java` → 409
  - `GlobalExceptionHandler` mapeia tudo para `ErrorResponse { error, message, stackTrace, timestamp }`.
- **Regras para código novo:**
  - Use as exceções da hierarquia acima; evite `RuntimeException` genérica para regra de negócio.
  - Não deixe stack trace vazar em produção (`server.error.include-*: never` no `application.yml`).
  - Se criar exceção nova, adicione handler no `GlobalExceptionHandler`.

### 5.8 Segurança e Keycloak
- Realm: `lmts`. Roles de realm: `tutor`, `medico`, `secretario`, `patologista`, `admin_lapa`.
- `KeycloakJwtAuthenticationConverter` extrai roles de `realm_access` e adiciona prefixo `ROLE_`.
- `ResourceServerConfig`:
  - CSRF desabilitado, CORS liberado para `common.front` (lista separada por vírgula).
  - `permitAll` atual: `/security/**`, `/api-doc/**`, `/api/v1/tutor`, `/api/v1/auth/login`, `/api/v1/auth/forgot-password`, `/api/v1/aviso/habilitados`.
  - Qualquer endpoint novo **deve** ser autenticado e autorizado por `@PreAuthorize`.
- `KeycloakService` centraliza login, criação, atualização, exclusão de usuários e checagens de role.
- ⚠ **Não reproduza credenciais hardcoded** (`clientSecret`, `admin/admin`). Ao tocar nessa área, mova para variáveis de ambiente.
- **Nunca commite secrets.**

### 5.9 Flyway — regras imutáveis
- Migrações em `back/src/main/resources/db/migration/`, nomenclatura: `V{n}__descricao_em_snake_case.sql`.
- **NUNCA editar/apagar migrações já aplicadas.** `V1__baseline.sql` é intocável.
- Toda mudança de schema (coluna, tabela, constraint, índice, enum) **deve** vir por nova migração numerada sequencialmente (atual: V32).
- O `application.yml` usa `ddl-auto: validate`; o Hibernate **não cria** schema — Flyway é a única fonte de verdade do DDL.
- SQL em snake_case, compatível com PostgreSQL 16.

### 5.10 Seeders
- Em `repository/seeders/`, orquestrados por `DatabaseSeeder` (`@PostConstruct`).
- Habilitados pela propriedade `common.seeders` (atual: `true`).
- Usam JavaFaker. Se criar seeder novo, registre no `DatabaseSeeder` e respeite a ordem de dependências (usuários antes de agendamentos, etc.).

### 5.11 Configuração e perfis
- `application.yml` (perfil default) aponta para banco local e Keycloak em `localhost`.
- Perfil `docker` ativado por `SPRING_PROFILES_ACTIVE: docker` no compose; datasource `backend-db`, Keycloak `http://keycloak:8080`.
- Propriedades customizadas:
  - `common.front` / `common.back` / `common.docker`
  - `app.files.upload-fotos.path|max-size|allowed-types`
- ⚠ `application.yml` está listado no `.gitignore` — cada dev mantém o seu localmente. Não presuma que alterações nele serão commitadas.

---

## 6. Regras e Padrões — Frontend

### 6.1 Pages (Pages Router)
- **Toda página fica em `pages/{feature}/index.js`** (ex.: `pages/agendarConsulta/index.js`, `pages/createAnimal/index.js`).
- A página é um componente de composição: monta `Header`/`SubHeader` + componente principal + `Footer`, com `className` do layout global (`divPai`, `flexStyle`).
- Rotas dinâmicas/por id seguem `pages/{feature}/[id].js` quando aplicável.
- **Não usar** a pasta `src/app/` (App Router) para páginas novas; é resíduo do `create-next-app`.

### 6.2 Components
- Um componente = uma pasta em `src/components/{Nome}/` com:
  - `index.js` — componente React (named exports aceitos, ex.: `Header01`, `Header02` em `Header/index.js`)
  - `index.module.css` — CSS Modules (`import styles from "./index.module.css"`)
- Importações relativas dentro de `src/` podem usar alias `@/` (ex.: `@/components/SubHeader`, `@/styles/styles.css`).
- Componentes de ficha clínica ficam em `src/components/Fichas/{TipoFicha}/` e podem ter subcomponentes por etapa (StepForm).
- PDFs: componentes `*PDF.js` usam `@react-pdf/renderer` ou jsPDF/html2canvas.

### 6.3 Services (camada HTTP)
- Arquivos em `services/{entidade}Service.js` com **named exports**:
  ```js
  export async function createAnimal(animalData) { ... }
  export async function getAllAnimal(origem = "HVU") { ... }
  export async function updateAnimal(animalId, animalData) { ... }
  export async function deleteAnimal(animalId) { ... }
  ```
- **Sempre** importar a instância axios de `common/http-common-back` (`baseURL: http://localhost:8081/api/v1`).
- O interceptor já injeta `Authorization: Bearer <token>` lido de `localStorage.getItem("token")`.
- Keycloak (login/refresh/etc.) usa `common/http-common-key` (`baseURL: http://localhost:8080/`).
- Manter `try/catch` e propagar o erro (`throw error`) — os componentes/hooks tratam.

### 6.4 Hooks
- Hooks de listagem em `src/hooks/use{Entidade}List.js` seguem o padrão `useState` + `useEffect` chamando o service e retornando `{ dados, error }`.
- Não usar React Query em código novo sem combinar antes (a dependência existe, mas o padrão vigente é o hook simples).

### 6.5 Estilos
- CSS Modules para componentes (`index.module.css`).
- Estilos globais em `src/styles/styles.css` (classes como `divPai`, `flexStyle`).
- Bootstrap via classes `btn`, `btn-outline-success`, etc., combinado com react-bootstrap/reactstrap.
- Tailwind está configurado, mas o projeto é predominantemente CSS Modules + Bootstrap. **Siga o padrão do arquivo vizinho.**

### 6.6 Autenticação no front
- Token JWT em `localStorage` (`"token"`).
- `common/logout.js` centraliza logout.
- Menus/redirecionamentos por papel usam `currentUser.roles.includes("secretario" | "medico" | "tutor")` (ver `Header03`).
- Fluxo de senha: `forgotPasswordService`, `postLogin`, `postRegister`.

---

## 7. Docker e Ambiente Local

### Subir tudo
```bash
docker compose up -d --build
```

### URLs
| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8081 |
| Keycloak | http://localhost:8080 |
| Swagger UI | http://localhost:8081/api-doc/swagger.html |
| API docs | http://localhost:8081/api-doc/docs |

### Rodar sem Docker
```bash
# Backend
cd back && ./mvnw spring-boot:run

# Frontend
cd front && npm install && npm run dev
```

### Observações
- O compose do frontend monta `./front/src:/app/src` (hot reload do código de componentes).
- Volume `hvu-uploads` é usado para upload de fotos (path docker: `/app/uploads/fotos/`).
- Datas: backend define `TimeZone` `America/Fortaleza`; banco com `TZ: America/Sao_Paulo`.
- `.tool-versions`: `java temurin-17.0.19+10` (usar Java 17).

---

## 8. Git e Fluxo de Trabalho

- **Conventional Commits em português**: `tipo(escopo): descrição curta`
  - Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`.
  - Exemplo:
    ```
    feat(animal): adicionar cadastro de animal por patologista

    - Implementado endpoint POST /animais/patologista
    - Adicionada validação de origem LAPA
    - Criado AnimalByPatologistaRequest DTO

    Related to #42
    ```
- Trabalhar em branch dedicada/fork; alterações via **Pull Request** com no mínimo **1 revisor**.
- Referencie issues (`Closes #id` / `Related to #id`).
- Nomes de branch: `feat/<descricao>` / `fix/<descricao>` (GitFlow).
- **Nunca** commitar: secrets, `application.yml`, artefatos de build (`target/`, `.next/`), `node_modules/`.

---

## 9. Regras para Sessões de Pair Programming (o que o agente DEVE seguir)

1. **Ler e respeitar este arquivo** antes de propor código.
2. **Seguir os padrões existentes**; não introduzir nova arquitetura, novo framework ou novo padrão sem pedir autorização explícita.
3. **Não reescrever módulos inteiros**; preferir mudanças mínimas e incrementais sobre o padrão vigente.
4. **Backend novo = checklist completo**: model → repository → service interface/impl → Facade → controller (+ DTOs) → migration Flyway (se houver schema) → `@PreAuthorize`.
5. **Nunca editar migrações Flyway existentes**; sempre criar `V{n+1}__...sql`.
6. **Nunca** reduzir a segurança de um endpoint existente nem remover `@PreAuthorize`.
7. **Manter compatibilidade**: Java 17, Spring Boot 3.1.x, Node 20, Next.js 13 Pages Router.
8. **Não alterar `pom.xml`/`package.json`** sem necessidade e sem avisar.
9. **Código e comentários em português (PT-BR)**; mensagens de validação e de erro em português.
10. **Não commitar secrets**; se encontrar credencial hardcoded, sinalizar (ex.: `KeycloakService.clientSecret`).
11. **Ao alterar API**, atualizar também o service correspondente em `front/services/`.
12. **Validar antes de entregar**:
    - Backend compila: `cd back && ./mvnw -q compile`
    - Frontend compila: `cd front && npm run build` (ou `npm run lint`)
    - Se possível, subir com `docker compose up -d --build`.
13. **Mudanças no schema do banco SEMPRE via Flyway**, nunca via `ddl-auto`.
14. **Em endpoints novos**: rota sob `/api/v1/`, DTOs em `controller/dto`, permissão por `@PreAuthorize`, regra de posse na Facade.
15. **Não criar páginas novas em `src/app/`** (App Router); usar `pages/`.
16. Ao corrigir bug, primeiro reproduzir/entender o fluxo; explicar causa raiz antes de codar.

---

## 10. Checklist — Nova Funcionalidade de Ponta a Ponta

### Backend
- [ ] Entidade (ou alteração) em `model/` com enums `STRING` e Lombok
- [ ] Migration Flyway `V{n+1}__descricao.sql` (se houver schema novo/alterado)
- [ ] Repository em `repository/`
- [ ] Service interface + implementação em `service/`
- [ ] Regras de negócio/autorização na `Facade` (com `@Transactional` onde houver escrita)
- [ ] DTOs `request`/`response` com validação Jakarta
- [ ] Controller em `controller/` com `@PreAuthorize` e extração do `idSession`
- [ ] Endpoint público? Registrar no `permitAll`
- [ ] Exceções usando a hierarquia existente; handler no `GlobalExceptionHandler` se criar exceção nova

### Frontend
- [ ] Funções no `services/{entidade}Service.js` usando `common/http-common-back`
- [ ] Componente em `src/components/{Nome}/index.js` + `index.module.css`
- [ ] Página em `pages/{feature}/index.js` compondo Header/SubHeader/Footer
- [ ] Hook `use{Nome}List.js` se for listagem
- [ ] Feedback com react-toastify e tratamento de erro

### Geral
- [ ] `./mvnw -q compile` OK
- [ ] `npm run build` OK
- [ ] Commit seguindo Conventional Commits com referência à issue

---

## 11. Dívidas Técnicas Conhecidas (não reproduzir)

1. **`KeycloakService`** tem `clientSecret` e credenciais admin hardcoded → mover para env vars.
2. **`Facade.java`** é uma god class com 2000+ linhas → para manutenção futura, considerar dividir por domínio (combinar antes).
3. **`application.yml`** é gitignored e aponta para banco local `banco` no perfil default → documentar/fornecer `.env.example` ou config de exemplo.
4. **Frontend híbrido**: `src/app/` (App Router) coexiste com `pages/` (Pages Router) → padronizar em Pages Router.
5. **README** indica Java 21+, mas `pom.xml`/`.tool-versions` usam Java 17 → seguir o pom.
6. Tratamento de erro inclui `stackTrace` no corpo da resposta → revisar para produção.
7. Controllers retornam entidades em alguns endpoints (`getAnimalsByOrigemAnimal`) → padronizar para DTOs de resposta.

---

## 12. Referências Rápidas

- **Base package backend**: `br.edu.ufape.hvu`
- **Base path da API**: `/api/v1/`
- **Roles**: `tutor`, `medico`, `secretario`, `patologista`, `admin_lapa` — no `@PreAuthorize`, maiúsculas com prefixo implícito `ROLE_`
- **Migration atual**: V32 (`back/src/main/resources/db/migration/`)
- **Collection Postman**: `docs/api/postman/HVU.postman_collection_v2.json`
- **Realm Keycloak dev**: `realm-export-dev.json`
- **Swagger**: `/api-doc/swagger.html` (UI) e `/api-doc/docs` (JSON)
