# Dockerfile

FROM node:14.13.0-alpine

WORKDIR /var/www

# copy over the source code
COPY ./embedded . 
# install the dependencies
RUN npm install 

EXPOSE 3000

# Build the app
RUN npm run build

CMD [ "npm", "start" ] # run the app in production