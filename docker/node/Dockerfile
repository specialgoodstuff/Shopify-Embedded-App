# Dockerfile

FROM node:14.13.0-alpine

WORKDIR /var/www

# install the dependencies
RUN apk update && \ 
  apk upgrade && \ 
  apk add bash && \
  npm install 

# copy over the source code
COPY ./embedded .  

EXPOSE 3000

# Build the app
# RUN npm run build

CMD [ "npm", "dev" ] # run the app in production