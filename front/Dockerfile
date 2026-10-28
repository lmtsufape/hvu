# Estágio de construção
FROM node:20-alpine AS build
WORKDIR /app
# Variáveis NEXT_PUBLIC_* são embutidas no bundle durante o build (uma imagem por ambiente)
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=create_user
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=$NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Estágio de produção
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]

# Magno aqui, pros curiosos isso aqui deixa a imagem mais leve
