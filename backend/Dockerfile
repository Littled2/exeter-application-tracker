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

# Copy in the backend env file
COPY ./.env /pb/.env

RUN --mount=type=secret,id=backend_build_secrets \
    export $(cat /run/secrets/backend_build_secrets | xargs) && \
    /pb/pocketbase superuser upsert "$DEFAULT_SUPERUSER_EMAIL" "$DEFAULT_SUPERUSER_PASSWORD" && \
    /pb/pocketbase set-oauth google "$GOOGLE_OAUTH_CLIENT_ID" "$GOOGLE_OAUTH_CLIENT_SECRET" && \
    /pb/pocketbase load-default-locations && \
    /pb/pocketbase load-default-organisations


EXPOSE 8090

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]