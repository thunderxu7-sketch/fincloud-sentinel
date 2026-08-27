FROM node:22.23-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY packages/domain/package.json packages/domain/package.json
COPY services/core-api/package.json services/core-api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci --ignore-scripts \
  --workspace packages/domain \
  --workspace services/core-api \
  --include-workspace-root=false
COPY tsconfig.base.json ./
COPY packages/domain packages/domain
COPY services/core-api services/core-api
RUN npm run build -w packages/domain && npm run build -w services/core-api

FROM node:22.23-alpine AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4000
RUN addgroup -S fincloud && adduser -S fincloud -G fincloud
WORKDIR /app
COPY --from=build /workspace/package.json /workspace/package-lock.json ./
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/domain/package.json ./packages/domain/package.json
COPY --from=build /workspace/packages/domain/dist ./packages/domain/dist
COPY --from=build /workspace/services/core-api/package.json ./services/core-api/package.json
COPY --from=build /workspace/services/core-api/dist ./services/core-api/dist
USER fincloud
EXPOSE 4000
CMD ["node", "services/core-api/dist/index.js"]
