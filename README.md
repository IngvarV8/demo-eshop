## Backend Setup

1. Copy the sample environment config:
    ```bash
    cp .env.sample .env
    ```

2. Build and run the backend:
    ```bash
    docker-compose up --build
    ```

## Frontend Setup

1. Navigate to the `frontend/` folder:
    ```bash
    cd frontend/
    ```

2. Run the development server:
    ```bash
    npm run dev
    ```

## Accessing the app

- **App**: [localhost:3000](http://localhost:3000)
- **API Documentation**: [localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Adminer**: [localhost:8080](http://localhost:8080)
- **Frontend**: [localhost:5173](http://localhost:5173)

## Rebuilding Backend After Code Changes

1. Inside the `./backend/` directory run:
    ```bash
    npm run build
    ```

2. Rebuild containers:
    ```bash
    docker-compose up --build
    ```
