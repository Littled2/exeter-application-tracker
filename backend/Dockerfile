FROM alpine:latest
ARG PB_VERSION=0.28.3

RUN apk add --no-cache unzip ca-certificates \
  && wget -O /tmp/pb.zip \
     https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
  && unzip /tmp/pb.zip -d /pb \
  && chmod +x /pb/pocketbase

VOLUME /pb/pb_data
EXPOSE 8080
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]