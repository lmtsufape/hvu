# Use uma imagem Alpine Linux como base
FROM openjdk:17-jdk-slim

# Define o diretório de trabalho no contêiner
# WORKDIR /hvu

ARG JAR_FILE=target/*.jar
# Copie o arquivo JAR da sua aplicação para o contêiner
COPY  ${JAR_FILE} app.jar

# Exponha a porta que sua aplicação utiliza (opcional)
EXPOSE 8081

# Comando para executar a aplicação quando o contêiner for iniciado
ENTRYPOINT ["java", "-jar", "app.jar"]
