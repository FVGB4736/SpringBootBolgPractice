# Spring Boot Blog Practice

A full-stack blog application built with Spring Boot and React/TypeScript.

## 🚀 Features

- **User Authentication**
  - JWT-based authentication
  - Secure password storage
  - Role-based access control

- **Blog Post Management**
  - Create, read, update, and delete blog posts
  - Rich text editing capabilities
  - Post categorization and tagging

- **Frontend**
  - Modern React with TypeScript
  - Responsive design
  - State management with React Query

## 🛠️ Tech Stack

### Backend
- Java 24
- Spring Boot 3.5.4
- Spring Security
- JWT Authentication
- MapStruct 1.6.0
- Lombok 1.18.38
- Maven
- PostgreSQL (via Docker)

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- React Query

## 🚀 Getting Started

### Prerequisites
- Java 24 JDK
- Node.js 18+
- Maven 3.8.4+
- Docker and Docker Compose

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SpringBootBolgPractice
   ```

2. Start the database using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "frontend/Blog Practice Frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📂 Project Structure

```
SpringBootBolgPractice/
├── src/                    # Backend source code
│   ├── main/
│   │   ├── java/com/practice/demo/
│   │   │   ├── config/    # Configuration classes
│   │   │   ├── controllers/ # REST controllers
│   │   │   ├── domain/    # Domain models
│   │   │   ├── dtos/      # Data Transfer Objects
│   │   │   ├── repositories/ # Data access layer
│   │   │   └── security/  # Security configurations
│   │   └── resources/     # Application properties and static resources
│   └── test/              # Test files
├── frontend/              # Frontend React application
│   └── Blog Practice Frontend/
│       ├── public/        # Static files
│       └── src/           # React components and logic
├── docker-compose.yml     # Docker configuration
└── pom.xml               # Maven configuration
```

## 📝 API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when the application is running.

## 🐳 Docker Support

This project uses Docker Compose to manage containerized services, including:

1. **PostgreSQL Database**
   - Uses `postgres:latest` image
   - Default port: 5432
   - Auto-restart: always
   - Environment variables:
     - `POSTGRES_PASSWORD`: Database password (change in production)

2. **Adminer Database Management**
   - Uses `adminer:latest` image
   - Web interface port: 8081
   - Auto-restart: always

### Service Management

```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Database Configuration

Ensure your `application.properties` matches the Docker Compose configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=PASSWORD  # Must match POSTGRES_PASSWORD in docker-compose.yml
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

By FVGB4736
