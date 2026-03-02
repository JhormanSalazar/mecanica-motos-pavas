# ---- Frontend Dockerfile ----

# === Etapa 1: Build ===
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# La variable se inyecta en build-time (CRA la embebe en el bundle JS)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY public ./public
COPY src ./src

RUN npm run build

# === Etapa 2: Servir con nginx ===
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
