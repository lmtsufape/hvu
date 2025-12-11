# Use uma imagem Maven como base
FROM maven:3.8.4-openjdk-17-slim AS build

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copie todo o código-fonte para o contêiner
COPY . .

# Execute o comando mvn clean install
RUN mvn clean install -DskipTests

# Use uma imagem OpenJDK como base para a imagem final
#FROM openjdk:17-jdk-slim # A imagem em questão ( 17-jdk-slim  ) foi oficialmente depreciada: https://hub.docker.com/layers/library/openjdk/17.0.1-jdk-slim/images/sha256-565d3643a78a657ca03e85c110af9579a07e833d6bcc14f475249c521b5c5d74
#Imagem atualizada:
FROM eclipse-temurin:17-jdk

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo JAR da sua aplicação da imagem de compilação para a imagem final
COPY --from=build /app/target/*.jar app.jar

# Exponha a porta que sua aplicação utiliza (opcional)
EXPOSE 8081

# Comando para executar a aplicação quando o contêiner for iniciado
ENTRYPOINT ["java", "-jar", "app.jar"]
