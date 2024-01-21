# Etapa 1: Construir a aplicação
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN npm install

# Etapa 2: Criar imagem final
FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 3333
CMD ["npm", "start"]
