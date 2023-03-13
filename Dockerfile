FROM node:18.15.0-alpine AS builder
# Add a work directory
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
#COPY APP FILES
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:16.15.0-alpine as PRODUCTION

COPY --from=builder /app/build /app
COPY --from=builder /app/node_modules /app/node_modules
EXPOSE 4000
CMD ["node","app/index.js"]
