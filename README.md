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
  <a href="#"><img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Flyway-Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white" />
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

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* PostgreSQL
* Flyway (migrações de banco de dados)
* Keycloak

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
<!-- 
---

## Configuração do `.env`

Antes de rodar o projeto, você deve criar seu próprio arquivo `.env` na raiz do projeto.

Existe um arquivo de exemplo chamado `.env.example`. Copie-o:

```bash
cp .env.example .env
```

Depois edite o `.env` conforme necessário.

### `.env.example`

```env
# Configurações do banco de dados PostgreSQL
GESTAOHVU_DB_URL=jdbc:postgresql://localhost:5432/gestaohvu
GESTAOHVU_DB_USERNAME=seu-usuario
GESTAOHVU_DB_PASSWORD=sua-senha

# Segredo para JWT
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRATION_MS=86400000

# Perfil do Spring
SPRING_PROFILES_ACTIVE=dev

# Origens permitidas (CORS)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Versão da aplicação
APP_VERSION=dev
``` -->

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

---

## Guia de Contribuição

O projeto segue um fluxo de contribuição organizado, utilizando boas práticas de versionamento e colaboração em equipe.

### Organização da equipe e tarefas

A equipe utiliza o **GitHub Projects (Quadro Scrum)** para organização e acompanhamento do desenvolvimento:

* Funcionalidades, correções e melhorias são registradas como **Issues** no repositório
* Cada issue é adicionada ao quadro e atribuída a um integrante da equipe
* O progresso é acompanhado pelas colunas: *To Do*, *In Progress* e *Done*
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

```
fix(tutor): corrigir payload de tutor anônimo no frontend

- Campo anonimo movido para raiz do request
- Removido useState dentro de handleSubmit

Closes #57
```
