FROM alpine:latest

ARG PB_VERSION=0.28.3

RUN echo "Value of superuser email: $DEFAULT_SUPERUSER_EMAIL"

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
COPY ./pb_migrations /pb/pb_migrations

# uncomment to copy the local pb_hooks dir into the image
COPY ./pb_hooks /pb/pb_hooks

COPY ../.env /.env

EXPOSE 8080

RUN /pb/pocketbase superuser upsert "$DEFAULT_SUPERUSER_EMAIL" "$DEFAULT_SUPERUSER_PASSWORD"

RUN /pb/pocketbase set-oauth google $GOOGLE_OAUTH_CLIENT_ID $GOOGLE_OAUTH_CLIENT_SECRET

# start PocketBase
CMD [ "/pb/pocketbase", "serve", "--http=0.0.0.0:8080" ]