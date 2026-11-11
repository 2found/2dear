# dear-api — build context is this directory (api/). Runs the bundled server.
FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.3.14-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/dist ./dist
USER bun
EXPOSE 8080
CMD ["bun", "run", "dist/index.js"]
