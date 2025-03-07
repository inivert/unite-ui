# Base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build the application
FROM deps AS builder
COPY . .

# Fix case-sensitivity issues before building
RUN find ./components -type f -name "*.vue" -o -name "*.ts" | xargs grep -l "EXamples" | xargs sed -i 's/EXamples/examples/g' || true
RUN find ./components -type f -name "*.vue" -o -name "*.ts" | xargs grep -l "\/UI\/" | xargs sed -i 's/\/UI\//\/ui\//g' || true
RUN find ./components -type f -name "*.vue" -o -name "*.ts" | xargs grep -l "\/Matter\/" | xargs sed -i 's/\/Matter\//\/matter\//g' || true
RUN find ./components -type f -name "*.vue" -o -name "*.ts" | xargs grep -l "\/M-Cards\/" | xargs sed -i 's/\/M-Cards\//\/m-cards\//g' || true
RUN find ./components -type f -name "*.vue" -o -name "*.ts" | xargs grep -l "liquidcard\.vue" | xargs sed -i 's/liquidcard\.vue/LiquidCard\.vue/g' || true

# Build the application
RUN pnpm run build

# Production image
FROM node:20-alpine AS runner
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/public /app/public

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"] 