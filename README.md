start app:

- npm install
- copy .env.sample to .env
- npm run start

start docker:

    prod:
    - docker-compose -f docker-compose.prod.yml up -d

    dev:
    - docker-compose -f docker-compose.dev.yml up

migration:

    create migration:
    - migration:create

    generate migration
    - migration:generate

    run migration
    - migration:run

    revert migration
    - migration:revert
