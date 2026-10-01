FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG APP_RELEASE=1.0.0
ENV APP_RELEASE=$APP_RELEASE
ENV DATABASE_URL=file:./dev.db
ENV SESSION_SECRET=change-this-before-a-real-deployment
ENV COUNSELLOR_EMAIL=counsellor@local.test
ENV COUNSELLOR_PASSWORD=ChangeMe123

RUN npx prisma generate \
  && npx prisma migrate deploy \
  && npm run build \
  && chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
