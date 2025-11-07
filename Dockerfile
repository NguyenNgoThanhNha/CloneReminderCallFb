# Sử dụng Node.js official image
FROM node:18-alpine

# Đặt working directory trong container
WORKDIR /app

# Copy package.json và package-lock.json (nếu có) để tận dụng Docker layer caching
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production && npm cache clean --force

# Tạo user non-root để chạy application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy source code
COPY . .

# Đổi ownership về nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port mà app sẽ chạy
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Command để chạy application
CMD ["node", "server.js"] 