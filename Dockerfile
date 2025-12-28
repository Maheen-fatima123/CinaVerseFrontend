# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Support monorepo structure
COPY cinaverse/package*.json ./

RUN npm install

COPY cinaverse/ .

RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
