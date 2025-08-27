FROM node:22-slim

# Set workdir
WORKDIR /app

# Install deps
COPY frontend/package*.json ./
RUN npm install

# Copy source
COPY frontend .

# Expose Vite dev port
EXPOSE 5173

# Run Vite dev server (hot reload, good for demo)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
