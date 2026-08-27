FROM node:22.23-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/domain/package.json packages/domain/package.json
COPY services/core-api/package.json services/core-api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci --ignore-scripts \
  --workspace packages/domain \
  --workspace apps/web \
  --include-workspace-root=false
COPY packages/domain packages/domain
COPY apps/web apps/web
RUN npm run build -w packages/domain && npm run build -w apps/web

FROM nginx:1.31-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/out /usr/share/nginx/html
EXPOSE 8080
USER nginx
CMD ["nginx", "-g", "daemon off;"]
