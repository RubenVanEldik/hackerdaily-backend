FROM hasura/graphql-engine:v2.16.1.cli-migrations-v3

# Copy the volumes
COPY metadata /hasura-metadata
COPY migrations /hasura-migrations

# Set the dynamic environment variables
ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET

# Set the fixed environment variables
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE "visitor"
ENV HASURA_GRAPHQL_METADATA_DIR /hasura-metadata
ENV HASURA_GRAPHQL_MIGRATIONS_DIR /hasura-migrations
ENV HASURA_GRAPHQL_LOG_LEVEL warn
ENV HASURA_GRAPHQL_ENABLE_CONSOLE true
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY false
ENV HASURA_GRAPHQL_ENABLE_ALLOWLIST true

CMD graphql-engine serve
