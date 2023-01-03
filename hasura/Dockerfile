FROM hasura/graphql-engine:latest.cli-migrations-v2

# Copy the volumes
COPY hasura/metadata /hasura-metadata
COPY hasura/migrations /hasura-migrations

# Set the dynamic environment variables
ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET

# Set the fixed environment variables
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE "anonymous"
ENV HASURA_GRAPHQL_ENABLE_CONSOLE false
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY false
ENV HASURA_GRAPHQL_ENABLE_ALLOWLIST true

CMD graphql-engine serve
