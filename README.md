1. cp .env.sample .env
2. docker-compose up --build

App available at localhost:3000
Api docs: localhost:3000/api-docs

When made any change:
1. Inside ./backend/ run "npm run build"  (This will update ./backend/compiled/server.js file)
2. docker-compose up --build
