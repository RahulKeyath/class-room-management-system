FROM node:22-alpine

WORKDIR /app

# Copy package configuration
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the Vite port
EXPOSE 3000

# Run Vite dev server accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
