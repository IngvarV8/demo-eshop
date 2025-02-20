1. cp .env.sample .env
2. docker-compose up --build

When made any change:
1. Inside ./backend/ run "npm run build"  (This will update ./backend/compiled/server.js file)
2. docker-compose up --build
