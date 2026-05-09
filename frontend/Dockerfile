FROM node:20-bookworm-slim

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3000
ENV CHOKIDAR_USEPOLLING=true

COPY package*.json ./
COPY . .

RUN chmod +x /app/run.sh

EXPOSE 3000

CMD ["./run.sh"]
