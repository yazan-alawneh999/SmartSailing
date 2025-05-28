# Stage 1: Build the Angular application
FROM node:20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/smart-sailing/browser /usr/share/nginx/html/browser
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mv /usr/share/nginx/html/browser/index.html /usr/share/nginx/html/index.html
EXPOSE 8081 4200
CMD ["nginx", "-g", "daemon off;"]
