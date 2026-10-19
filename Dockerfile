# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 – builder
#   Uses the official Node 20 Alpine image to install dependencies and
#   produce the optimised Vite production bundle in Frontend/dist/.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifest files first so Docker can cache the layer when only source
# code changes (dependencies unchanged → this layer is reused).
COPY Frontend/package.json Frontend/package-lock.json ./

# ci installs exact locked versions – reproducible and faster than npm install.
RUN npm ci --include=dev

# Copy the rest of the source, then build.
COPY Frontend/ ./

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 – runner
#   Tiny nginx:alpine image. Copies only the compiled static assets from the
#   builder stage – no Node, no source code, no devDependencies in the image.
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove the default nginx welcome page.
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from the builder stage.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config so react-router deep-links work (SPA fallback).
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# nginx starts in the foreground so Docker can track the process.
CMD ["nginx", "-g", "daemon off;"]
