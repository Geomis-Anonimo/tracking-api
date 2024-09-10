# API de Rastreio de Cartões - `Tracking_api`

A API tem como objetivo fazer a conexão com os serviços das empresas parceiras, e foi desenvolvida como uma solução de integração entre essas empresas. Esse serviço utiliza a tecnologia de Web Services em REST, com protocolo HTTP.

## Rotas da primeira empresa

### Solicitação de Token

- **Método**: `POST`
- **Endpoint**: `http://localhost:3000/auth/login`

#### Body:

```json
{
  "username": "usuario.exemplo",
  "password": "senha.exemplo"
}
```
No campo Body, as informações de “username” e “password” deveriam ser solicitadas aos responsáveis pela API. Para desenvolvimento, pode ser adicionado também em um .env e atualizado para validar essas credencias no código.

#### Header:
```curl
"Content-Type": "application/json"
```

#### Dados cURL:
```curl
curl --request POST \
  --url http://localhost:3000/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "usuario.exemplo",
    "password": "senha.exemplo"
  }'
```
#### Exemplo de resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndzLmJyYXNpbGNhcmQiLCJpYXQiOjE3MjIzNDkxNTgsImV4cCI6MTcyMjM1Mjc1OH0.OSZHEyZ1yJyZRjTun9Zv-zNxjXl6BjwiFREMVz99Lhc"
}
```

### Solicitação de informações de rastreio:
Aqui seriam as informações de rastreio que seriam trazidas da API de rastreio.
- **Método**: `POST`
- **Endpoint**: `http://localhost:3000/tracking`

### Body:
```curl
{
  "numEncCli": " ["<NUMERO_AR>", "<OUTRO_NUMERO_AR>", "< OUTRO_NUMERO_AR >"]"
}
```

### Header:
```json
"Content-Type": "application/json"
"Authorization": "Bearer <TOKEN_GERADO_NO_ENDPOINT_DE_SOLICITAÇÃO_DE_TOKEN>"
```
#### Dados cURL:
```curl
curl --request POST \
  --url http://localhost:3000/tracking \
  --header 'Authorization: Bearer <TOKEN_GERADO_NO_ENDPOINT_DE_SOLICITAÇÃO_DE_TOKEN>'\
  --header 'Content-Type: application/json' \
  --data '{
  "numEncCli": ["<numero_AR>",  "<outro_numero_AR>",  "<outro_numero_AR>",  ]
}'
```

## Rotas da segunda empresa, API publica dos correios

### Solicitação de Token
- **Método**: `POST`
- **Endpoint**: `http://localhost:3000/auth/login`

### Body:
```json
{
  "username": "usuário.exemplo",
  "password": "senha.exemplo "
}
```
No campo Body, as informações de “username” e “password” deveriam ser solicitadas aos responsáveis pela API.

### Header:
```curl
"Content-Type": "application/json"
```

#### Dados cURL:
```curl
curl --request POST \
  --http://localhost:3000/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
  "username": "usuário.exemplo",
  "password": "senha.exemplo"
}'
```
#### Exemplo de Resposta:
```json
{
	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndzLmJyYXNpbGNhcmQiLCJpYXQiOjE3MjIzNDkxNTgsImV4cCI6MTcyMjM1Mjc1OH0.OSZHEyZ1yJyZRjTun9Zv-zNxjXl6BjwiFREMVz99Lhc"
}
```

### Solicitação de informações de rastreio:
Aqui seriam as informações de rastreio que seriam trazidas da segunda API de rastreio.
- **Método**: `POST`
- **Endpoint**: `http://localhost:3000/tracking-correios`

#### Body:
```curl
{
  "numEncCli": " ["<NUMERO_AR>", "<OUTRO_NUMERO_AR>", "< OUTRO_NUMERO_AR >"]"
}
```

#### Header:
```curl
"Content-Type": "application/json"
"Authorization": "Bearer <TOKEN_GERADO_NO_ENDPOINT_DE_SOLICITAÇÃO_DE_TOKEN>"
```

#### Dados cURL:
```curl
curl --request POST \
  --url http://localhost:3000/tracking-correios \
  --header 'Authorization: Bearer <TOKEN_GERADO_NO_ENDPOINT_DE_SOLICITAÇÃO_DE_TOKEN>'\
  --header 'Content-Type: application/json' \
  --data '{
  "numEncCli": ["<numero_AR>",  "<outro_numero_AR>",  "<outro_numero_AR>",  ]
}'
```
