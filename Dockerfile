FROM node:22-alpine AS frontend-builder
WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:25-jdk AS backend-builder
WORKDIR /workspace/backend

COPY backend/mvnw backend/mvnw.cmd backend/pom.xml ./
COPY backend/.mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY backend/src ./src
COPY --from=frontend-builder /workspace/frontend/dist ./src/main/resources/static
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:25-jdk
WORKDIR /app

COPY --from=backend-builder /workspace/backend/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
