# Social Postify

## Descrição

O aplicativo web "Social Postify" oferece aos seus usuários a capacidade de criar e agendar posts para várias plataformas de mídia social, incluindo Facebook, Instagram, Twitter e LinkedIn.

Os usuários têm a possibilidade de personalizar os seus posts com imagens, títulos e texto, além de poderem agendar a data e a hora exata para cada publicação. O sistema permite o agendamento de múltiplos posts e oferece uma visão clara das publicações programadas.

Este projeto é desenvolvido utilizando a estrutura Nest.js. A seguir, estão as orientações para a configuração:

Certifique-se de que as seguintes ferramentas estejam instaladas e atualizadas no seu sistema:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Tecnologias usadas

O projeto feito em Nest.js.

O banco usado é o PostgresSQL e é gerenciado pelo Prisma.

Para os testes é utilizado o Jest.

## Instalação

Siga estas etapas para configurar e executar o projeto localmente:

```bash
   git clone https://github.com/tnovaes/social-postify.git
   cd social-postify
```

### 1 - Instalar as dependencias

```bash
  npm install
```

### 2 - Configurar a variavel de ambiente

Crie um arquivo .env na raiz do projeto com a variavel de ambiente necessária. Você pode usar o arquivo .env.example como um modelo.

### 3 - Configurar o banco de dados com o Prisma

Execute as seguintes etapas
```bash
  npx prisma generate
  npx prisma migrate dev
```

### 4 - Execute o projeto em modo desenvolvimento

```bash
  npm run start:dev
```

## 5 - Uso

A porta utilizada padrão do Nest é a porta 3000.

### As rotas disponíveis são:
  - medias
  - posts
  - publications

Para todas as rotas possuímos POST, GET, PUT e DELETE.

Na ausência de campos obrigatórios, retorne o status code 400 Bad Request.

Se não houver nenhum registro compatível, retornar status code 404 Not Found.

Se você tentar deletar algo que faça parte de uma publicação (agendada ou publicada). Neste caso, retornar o status code 403 Forbidden.

### As rotas disponíveis são:
  - POST/nomeDaRota
  - GET/nomeDaRota
  - GET/nomeDaRota/:id
  - PUT/nomeDaRota/:id
  - DELETE/nomeDaRota/:id

### As medias representam as redes sociais nas quais as publicações (publications) serão feitas, por exemplo: Facebook, Instagram, Twitter, LinkedIn, Threads, etc.

Para fazer ou editar uma media o body deve ter o formato:
```bash
  {
	"title": "Instagram",
	"username": "myusername",
  }
```
### Os posts representam os conteúdos que serão postados nas redes sociais (medias) por meio de uma publicação (publication):

Para fazer ou editar um post o body deve ter o formato:
```bash
  {
	"title": "Why you should have a guinea pig?",
	"text": "https://www.guineapigs.com/why-you-should-guinea",
  }
```
### As publicações são os agendamentos dos posts nas redes sociais (medias).

Para fazer ou editar uma publicação o body deve ter o formato:
```bash
  {
	"mediaId": 1,
	"postId": 1,
	"date": "2023-08-21T13:25:17.352Z"
  }
```

## 6 - Testes
Crie um arquivo .env.test de maneira análoga ao .env.example mas crie um banco secundário para testes.

Para executá-los, use o comando 
```bash
  npm run test:e2e
```

## 7 - Para subir o projeto no modo de produção

```bash
  npm run build
```
