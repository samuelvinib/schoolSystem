# Teste SchoolSystem

>
>
> # Projeto Backend - Sistema de Gestão Escolar
>
> ### Descrição: Com o encerramento da pandemia, as escolas e universidades necessitarão de um controle eficiente na alocação de salas para professores e alunos. Para atender a essa demanda, desenvolvi uma API em Node.js utilizando o framework AdonisJS (https://adonisjs.com).
>
>
> ## Tecnologias utilizadas no projeto:
>  - `Back-end` : AdonisJs
>  - `Banco de dados` : Mysql
>  - `Infraestrutura/Contêineres` : Docker
>
>#

# Instalação do projeto

> - Este projeto foi construido em imagens Docker, é necessário ter o Docker instalado em sua máquina previamente.

 ## Passo 1
   Após clonar o projeto em sua máquina navegue até o diretório raiz do projeto:
```bash
  cd schoolsystem
```

 ## Passo 2
   Execute o seguinte comando para buildar o projeto:
```bash
  docker compose up -d --build
```

 ## Passo 3
   Após o build aguarde alguns segundos para que o docker possa fazer as migrations e seeders para popular o banco de dados.

<br>


 ## Pronto!
   Seu projeto estará rodando no seguinte endereço:
```bash
  http://localhost:3333/
```

#
<br>
 
 ## Uso do Swagger
 <h3 align="center">Após iniciar o projeto, você pode explorar e interagir com a API usando a interface do Swagger. <a href="http://localhost:3333/docs">Acesse aqui</a> para obter mais detalhes sobre as rotas disponíveis.</h3>

<br>

## Arquivo Insomnia_routes.json

>
> ### Na raiz do projeto, você encontrará um arquivo chamado "Insomnia_routes.json". Para importar as rotas no Insomnia, siga as seguintes etapas:
> - Abra o Insomnia.
> - Vá para File -> Import Data -> From File.
> - Selecione o arquivo "Insomnia_routes.json" e importe.
> <h3 align="center">Agora você terá todas as rotas disponíveis no Insomnia para facilitar o teste e a interação com a API.</h3>
>
>#

## Acessos

> - logar como professor: <br>
> email: professor1@example.com <br>
> password: senha123

#

> - logar como estudante: <br>
> email: student2@example.com <br>
> password: senha456
#