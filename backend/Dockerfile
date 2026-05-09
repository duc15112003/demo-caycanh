FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x /app/entry.sh

EXPOSE 8080

ENTRYPOINT ["/app/entry.sh"]
