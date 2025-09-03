FROM alpine:latest

ARG PB_VERSION=0.28.3

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy the local pb_migrations dir into the image
COPY ./pb_migrations /pb/pb_migrations

# Copy the local pb_hooks dir into the image
COPY ./pb_hooks /pb/pb_hooks

COPY ./.env /pb/.env


# Copy entrypoint
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]