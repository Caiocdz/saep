# API de produtos na Railway

## Executar localmente

Use Node.js 22 ou superior. Execute `npm ci`, copie `.env.example` para `.env`,
preencha as variaveis e execute `npm start`. O `.env` nao e versionado e nao
sobrescreve variaveis ja definidas no ambiente.

O dominio privado da Railway so resolve dentro da plataforma. Para executar
localmente, use um MySQL local ou os dados de acesso externo do MySQL Railway.
Um tunel local do Workbench nao deve ser usado pelo backend hospedado.

## Configurar a Railway

Backend e MySQL devem estar no mesmo projeto e ambiente. No servico do backend,
configure as variaveis abaixo. O exemplo considera que o servico do banco se
chama `MySQL`; substitua esse prefixo pelo nome exato do seu servico.

```env
DB_HOST=${{MySQL.RAILWAY_PRIVATE_DOMAIN}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
```

`DB_PORT` deve ser a porta interna (normalmente 3306), nunca a porta do proxy
publico ou do tunel SSH. `DB_NAME` precisa corresponder ao banco no qual seu DDL
foi executado: se for diferente de `MYSQLDATABASE`, informe o nome real desse
banco. Nao execute migracoes nem recrie tabelas para este deploy.

`PORT` e fornecida pela Railway automaticamente; pode deixa-la sem configuracao
manual. Para fixar a porta, use `PORT=3000` e mantenha a porta do dominio igual.
Localmente, o padrao e 3000.

Se o repositorio contem a pasta `saep`, configure **Root Directory** como `/saep`.
Se o conteudo dessa pasta ja e a raiz do repositorio, mantenha a raiz padrao.
Use `npm ci` para instalar e `npm start` como comando de inicializacao. Nao
configure comandos de migracao/pre-deploy. Gere um dominio publico em
Settings > Networking > Generate Domain. O healthcheck pode usar `/api/status`.

A inicializacao verifica a conexao MySQL e so abre a porta HTTP quando ela
funciona. `/api/status` verifica o servidor HTTP; `GET /produtos` tambem verifica
uma consulta real ao banco. Erros de inicializacao encerram o processo com
codigo 1, sem registrar credenciais. Na Railway, o codigo exige que `DB_HOST`
termine em `.railway.internal` para garantir uso da rede privada.

## Testar depois do deploy

Substitua `https://SEU-DOMINIO` pelo dominio publico do backend. Testes de leitura:

```sh
curl -i https://SEU-DOMINIO/api/status
curl -i https://SEU-DOMINIO/produtos
```

Espere HTTP 200, respectivamente com `{"mensagem":"API funcionando"}` e um
array JSON (que pode estar vazio). A pagina `/` tambem permite usar o CRUD.

Para testar escrita no Postman/Insomnia, crie um produto descartavel e use
somente o ID devolvido pelo POST. Esses passos alteram dados e devem ser
executados conscientemente por voce, apos o deploy:

| Metodo | Endpoint | Corpo JSON | Resultado esperado |
| --- | --- | --- | --- |
| POST | `/produtos` | `{"nome":"Teste Railway","preco":10.5}` | 201 e `id` |
| GET | `/produtos` | nenhum | 200, incluindo o produto criado |
| PUT | `/produtos/ID_CRIADO` | `{"nome":"Teste atualizado","preco":12.5}` | 200 |
| DELETE | `/produtos/ID_CRIADO` | nenhum | 200, removendo apenas o produto de teste |

Envie `Content-Type: application/json` em POST e PUT. Dados invalidos retornam
400; IDs inexistentes retornam 404 em PUT/DELETE; falhas de banco retornam 500
com mensagem generica. As queries de escrita usam placeholders e aceitam
somente valores escalares validados.

## Estrutura preservada

O servidor Railway usa `server.js`, `app.js`, `db.js` e `routes/*.js`.
Os arquivos `db/*.ts`, `drizzle.config.ts` e `netlify/` pertencem a integracao
separada com Netlify/PostgreSQL e nao sao executados por `npm start`.
Nenhum schema ou registro existente foi alterado nesta configuracao.

Referencias oficiais: [MySQL](https://docs.railway.com/databases/mysql) e
[rede privada](https://docs.railway.com/networking/private-networking).
