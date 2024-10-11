FROM node:20.11.1 as builder

WORKDIR /milnii

# RUN apt-get update
# RUN apt-get install -y apt-utils ffmpeg imagemagick ghostscript 
# RUN rm -rf /var/lib/apt/lists/*

# COPY policy.xml /etc/ImageMagick-6/

# ENV MAGICK_CONFIGURE_PATH=/etc/ImageMagick-6/

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]