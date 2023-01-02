FROM hasura/graphql-engine:latest.cli-migrations-v2

# Copy the volumes
# COPY migrations /hasura-migrations
# COPY metadata /hasura-metadata

# Set the dynamic environment variables
ENV HASURA_GRAPHQL_SERVER_PORT $PORT
ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET

# Set the fixed environment variables
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE "anonymous"
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY false
ENV HASURA_GRAPHQL_ENABLE_ALLOWLIST true

CMD graphql-engine serve
