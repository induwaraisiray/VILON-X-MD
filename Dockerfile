FROM node:lts-buster
RUN npm install -g pm2
RUN git clone https://github.com/induwaraisiray/VILON-X-MD
WORKDIR /VILON-X-MD
RUN npm install || yarn install
COPY . .
EXPOSE 9090
CMD ["npm", "start"]"]
