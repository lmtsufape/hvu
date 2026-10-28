<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" width="90" alt="Java Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" width="90" alt="Spring Boot Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="90" alt="React Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="90" alt="PostgreSQL Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" width="90" alt="Docker Logo" />
  &nbsp;&nbsp;&nbsp;
</p>

<h1 align="center">GestãoHVU</h1>

<p align="center">
  Sistema de gestão de consultas e atendimentos clínicos veterinários do HVU — UFAPE
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Java-21+-ED8B00?style=for-the-badge&logo=java&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Flyway-Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white" />
  <img src="https://img.shields.io/badge/Testcontainers-Testes%20de%20Integra%C3%A7%C3%A3o-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Git-Conventional%20Commits-F05032?style=for-the-badge&logo=git&logoColor=white" />
</p>

---

## Descrição

O **GestãoHVU** é um sistema web desenvolvido pelo **LMTS (Laboratório Multidisciplinar de Tecnologias Sociais)** da **UFAPE (Universidade Federal do Agreste de Pernambuco)**, no âmbito de um **projeto de extensão** em parceria com o **HVU (Hospital Veterinário Universitário)**.

A plataforma tem como objetivo digitalizar e organizar os processos de gestão de consultas e atendimentos clínicos de animais do HVU, integrando diferentes perfis de usuário em um único sistema: tutores, médicos veterinários, secretários, patologistas e o administrador do LAPA.

Com o sistema, é possível realizar o cadastro e acompanhamento de animais e seus responsáveis, o agendamento e registro de consultas clínicas, o gerenciamento de laudos e análises laboratoriais pelo LAPA, além do controle administrativo de todo o fluxo hospitalar veterinário.

### Perfis de acesso

| Perfil | Descrição |
|--------|-----------|
| **Tutor** | Responsável pelo animal; pode cadastrar seus animais e acompanhar atendimentos |
| **Médico** | Realiza e registra consultas e atendimentos clínicos |
| **Secretário** | Gerencia agendamentos e fluxo de atendimento |
| **Patologista** | Responsável pelas análises do LAPA; cadastra animais e laudos laboratoriais |
| **Administrador LAPA** | Administra o sistema e os usuários do laboratório |

---

## Tecnologias Utilizadas

### Backend

* Java 21
* Spring Boot 3.5
* Spring Web
* Spring Data JPA
* PostgreSQL
* Flyway (migrações de banco de dados)
* Keycloak
* Testcontainers (testes de integração)
* JUnit 5 + Mockito (testes unitários)

### Frontend

* JavaScript
* React
* HTML5
* CSS3

### Ferramentas e práticas

* Git
* GitHub
* Conventional Commits
* Pull Requests com revisão obrigatória
* GitFlow
* Docker
* Docker Compose
* Docker Compose Watch (hot reload em desenvolvimento)

---

## Instalação e Execução

### Pré-requisitos

* Docker
* Docker Compose
* Git

Verifique:

```bash
docker --version
docker compose version
```
---

## Configuração de variáveis de ambiente

As credenciais e configurações sensíveis ficam em **variáveis de ambiente**. Na raiz do projeto existe o arquivo de exemplo `.env.example` (sem valores reais). Crie seu `.env` local:

```bash
cp .env.example .env
```

Edite o `.env` conforme necessário. O `.env` é ignorado pelo Git (`.gitignore`) e **nunca** deve ser versionado.

### Variáveis disponíveis

| Variável | Descrição | Usada por |
|---|---|---|
| `HVU_DB_URL` | JDBC URL do banco do backend | backend (Spring) |
| `HVU_DB_USERNAME` / `HVU_DB_PASSWORD` | Credenciais do banco do backend | backend + `backend-db` |
| `HVU_DB_NAME` | Nome do banco do backend | `backend-db` |
| `KEYCLOAK_DB_NAME` / `KEYCLOAK_DB_USERNAME` / `KEYCLOAK_DB_PASSWORD` | Banco do Keycloak | `keycloak` + `keycloak-db` |
| `KEYCLOAK_ADMIN_USERNAME` / `KEYCLOAK_ADMIN_PASSWORD` | Admin do Keycloak | `keycloak` + backend |
| `KEYCLOAK_REALM` | Realm do Keycloak | backend |
| `KEYCLOAK_CLIENT_ID` / `KEYCLOAK_CLIENT_SECRET` | Cliente `create_user` usado na autenticação/registro | backend + frontend |
| `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` / `NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET` | Variáveis públicas do frontend (lidas no build do Next.js) | frontend |

### Rodando o backend localmente (sem Docker)

Exporte as variáveis antes de subir o Spring:

```bash
export SPRING_DATASOURCE_URL='jdbc:postgresql://localhost:5432/banco?stringtype=unspecified'
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=sua-senha
export KEYCLOAK_CLIENT_SECRET=seu-client-secret
cd back && bash mvnw spring-boot:run
```

> O realm de desenvolvimento (`realm-export-dev.json`) importado pelo Keycloak contém usuários/senhas de exemplo (ex.: `password`) apenas para desenvolvimento local.

---

## Ambiente de Desenvolvimento

No ambiente de desenvolvimento utilizamos **Docker Compose**.

### Subindo a aplicação

Na raiz do projeto:

```bash
docker compose up -d --build
```

Isso irá:

* Construir as imagens
* Subir o backend (Spring Boot)
* Subir o frontend (React)
* Subir o PostgreSQL
* Executar as migrações Flyway automaticamente

### URLs locais

Frontend:
```
http://localhost:3000
```

Backend:
```
http://localhost:8081
```

Keycloak:
```
http://localhost:8080
```

### Hot reload do frontend (opcional, apenas desenvolvimento)

Para desenvolver o frontend com hot reload usando **Docker Compose Watch**:

```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yml up --build --watch
```

O arquivo `docker-compose.dev.yml` é exclusivo para desenvolvimento e **não** é carregado pelo `docker compose up -d --build` padrão.

---

## Testes

Os testes do backend usam **Testcontainers** para integração (sobe um PostgreSQL descartável; requer Docker em execução) e **JUnit 5 + Mockito** para os unitários (sem infraestrutura externa).

```bash
# Todos os testes (integração + unitários)
cd back && bash mvnw test

# Apenas o teste de integração (Flyway + contexto com Testcontainers)
cd back && bash mvnw -Dtest=FlywayIntegrationTest test

# Apenas o teste unitário (JUnit 5 + Mockito)
cd back && bash mvnw -Dtest=AnimalServiceTest test
```

> Se o `mvnw` não tiver permissão de execução, use `bash mvnw` ou `chmod +x mvnw`.

---

## CI/CD (GitHub Actions)

A pipeline está em `.github/workflows/ci-cd.yml` e segue o fluxo:

| Branch | O que acontece |
|---|---|
| `develop` | Roda testes do backend + build do frontend e, se passarem, faz **deploy automático na homologação** |
| `main` | Roda testes do backend + build do frontend e, se passarem, faz **deploy automático na produção** |
| Pull request | Roda apenas as validações (sem deploy) |

### Endpoints

* Homologação: frontend `https://lmtsteste06.ufape.edu.br/` · backend `https://lmtsteste03.ufape.edu.br/api/v1`
* Produção: frontend `https://gestaohvu.ufape.edu.br/` · backend `https://gestaohvuback.ufape.edu.br/api/v1`

### Homologação (servidor `lmtstestes`, sem SSH)

O servidor de testes não aceita SSH. O deploy de `develop` funciona assim:

1. Os jobs `Imagem backend` e `Imagem frontend` constroem as imagens no GitHub e publicam no GHCR
   (`ghcr.io/lmtsufape/hvu-backend:<sha>` e `ghcr.io/lmtsufape/hvu-frontend:homologacao-<sha>`).
2. O job `Deploy homologação` roda no runner self-hosted da organização (label `lmtstestes`) e executa
   `docker compose pull && up -d` com [`deploy/lmtstestes/compose.yml`](deploy/lmtstestes/compose.yml).

Os workflows reutilizáveis ficam em [`lmtsufape/.github`](https://github.com/lmtsufape/.github).
Logs e restart dos containers: Portainer (ver `lmtsufape/infra-lmtstestes`).

**Rollback**: *Actions → CI/CD → Run workflow* na branch `develop`, informando em `image-tag` o SHA
de um commit que já foi implantado.

Configuração no GitHub:

| Nome | Onde | Descrição |
|---|---|---|
| `DEPLOY_ENV_FILE` | Secret do environment `homologacao` | `.env` do deploy (bancos, Keycloak, `KEYCLOAK_PUBLIC_URL`); modelo nas variáveis usadas em `deploy/lmtstestes/compose.yml` |
| `HOMOLOGACAO_NEXT_PUBLIC_API_URL` | Variable do repositório | URL da API usada no build do frontend |
| `HOMOLOGACAO_NEXT_PUBLIC_KEYCLOAK_URL` | Variable do repositório | URL pública do Keycloak usada no build do frontend |
| `HOMOLOGACAO_NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` | Variable do repositório | Client ID do Keycloak usado no build do frontend |
| `HOMOLOGACAO_NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET` | Secret do repositório | Client secret usado no build do frontend |

> As variáveis `NEXT_PUBLIC_*` são embutidas no JavaScript entregue ao navegador durante o build,
> por isso a imagem do frontend é específica de cada ambiente.

### Produção (deploy via SSH)

O servidor de produção deve ter:

* Docker e Docker Compose v2 instalados;
* um clone do repositório no diretório de deploy (ex.: `/home/deploy/hvu`) — a pipeline executa `git pull --ff-only` nesse diretório;
* uma chave SSH autorizada para o usuário de deploy;
* nenhum arquivo rastreado modificado manualmente (a pipeline executa `git checkout -- .` antes do pull).

> O arquivo `.env` do servidor **não** fica versionado: a pipeline o cria durante o deploy a partir do secret `PRODUCAO_ENV_FILE`.

**Produção** (`Environment: producao`):

| Nome | Tipo | Descrição |
|---|---|---|
| `PRODUCAO_SSH_HOST` | Variable | Host SSH do servidor de produção |
| `PRODUCAO_SSH_PORT` | Variable | Porta SSH (padrão 22) |
| `PRODUCAO_SSH_USER` | Variable | Usuário SSH de deploy |
| `PRODUCAO_DEPLOY_PATH` | Variable | Caminho do clone no servidor |
| `PRODUCAO_SSH_KEY` | Secret | Chave privada SSH autorizada no servidor |
| `PRODUCAO_ENV_FILE` | Secret | Conteúdo completo do `.env` de produção |

O `PRODUCAO_ENV_FILE` deve seguir o modelo do [`.env.example`](.env.example) com os valores reais do ambiente (senhas de banco, Keycloak e `NEXT_PUBLIC_KEYCLOAK_*`).

---

## Guia de Contribuição

O projeto segue um fluxo de contribuição organizado, utilizando boas práticas de versionamento e colaboração em equipe.

### Organização da equipe e tarefas

A equipe utiliza o **GitHub Projects (Quadro Scrum)** para organização e acompanhamento do desenvolvimento:

* Funcionalidades, correções e melhorias são registradas como **Issues** no repositório
* Cada issue é adicionada ao quadro e atribuída a um integrante da equipe
* O progresso é acompanhado pelas abas *Current iteration* e *Sprint splanning*
* Commits e Pull Requests referenciam ou encerram as issues relacionadas (`Closes #id` ou `Related to #id`)

### Fluxo de versionamento

* Cada integrante trabalha em um **branch** dedicado ou **fork** do repositório
<!-- * A branch `main` é **protegida**, não permitindo commits diretos -->
* Todas as alterações são realizadas por meio de **Pull Requests**
* Cada Pull Request exige:
  * uso do padrão **Conventional Commits**
  * no mínimo **1 revisor**
  * resolução de todos os comentários antes do merge

### Padrão de commit

```
tipo(escopo): descrição curta
```

Exemplos:

```
feat(animal): adicionar cadastro de animal por patologista

- Implementado endpoint POST /animais/patologista
- Adicionada validação de origem LAPA
- Criado AnimalByPatologistaRequest DTO

Related to #42
```
