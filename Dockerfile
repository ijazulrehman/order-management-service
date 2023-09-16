FROM node:18.17.1-alpine As build-stage

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND yarn.lock are copied
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

COPY . .

RUN yarn run build

FROM node:18.17.1-alpine as production-stage

# Copy necessary files
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/dist ./dist

EXPOSE 3030

CMD ["yarn", "run", "start:prod"]
