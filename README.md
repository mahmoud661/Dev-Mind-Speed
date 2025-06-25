# Dev Mind Speed

A TypeScript-based math game API built with Express.js and TypeORM, featuring a clean architecture with dependency injection. Players solve randomly generated math problems with increasing difficulty levels and track their performance over time.

## � Features

- **Math Game Engine**: Dynamic question generation with 4 difficulty levels
- **Performance Tracking**: Time-based scoring and detailed game statistics
- **Clean Architecture**: Organized into Domain, Infrastructure, Application, and Presentation layers
- **Dependency Injection**: Using TSyringe for IoC container management
- **Type Safety**: Built with TypeScript for robust type checking
- **Database ORM**: TypeORM integration with MySQL support
- **Input Validation**: Class-validator for request validation and sanitization
- **Code Quality**: ESLint and Prettier for code formatting and linting
- **Hot Reload**: Development server with ts-node-dev
- **Automatic Route Discovery**: Dynamic route registration system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **MySQL** database server
- **Git** (for version control)

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd "Dev Mind Speed"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_NAME=dev_mind_speed
   
   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database:**
   
   Create a MySQL database named `dev_mind_speed` (or your preferred name as specified in `.env`):

   ```sql
   CREATE DATABASE dev_mind_speed;
   ```

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start the production server:**

   ```bash
   npm start
   ```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the TypeScript project |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code using Prettier |
| `npm run format:check` | Check if code is properly formatted |

## 🏗️ Project Structure

```text
src/
├── App/                    # Application layer
│   └── services/           # Business logic services
├── Domain/                 # Domain layer (Core business logic)
│   ├── dtos/               # Data Transfer Objects
│   ├── entities/           # Domain entities (business models)
│   └── interfaces/         # Repository contracts/interfaces
├── Infrastructure/         # Infrastructure layer (External concerns)
│   └── db/                 # Database configuration and repositories
│       ├── repos/          # Repository implementations
│       ├── container.ts    # Dependency injection setup
│       └── init-db.ts      # Database initialization
└── Presentation/           # Presentation layer (HTTP/API)
    ├── controllers/        # HTTP request handlers
    ├── middlewares/        # Express middlewares
    ├── routes/             # API route definitions
    ├── RouteRegistry.ts    # Automatic route discovery
    └── index.ts            # Express app setup
```

## 🏛️ Clean Architecture Layers

This project follows Clean Architecture principles with clear separation of concerns:

### **🎯 Domain Layer** (`src/Domain/`)

The core of the application containing business logic and rules:

- **Entities**: Core business objects (Player, Game, Question, Answer)
- **Interfaces**: Contracts for repositories (dependency inversion)
- **DTOs**: Data structures for API communication

### **📋 Application Layer** (`src/App/`)

Contains application-specific business logic:

- **Services**: Orchestrate domain objects and coordinate business workflows
- Implements use cases and application-specific operations

### **🔧 Infrastructure Layer** (`src/Infrastructure/`)

Handles external concerns and technical details:

- **Database**: TypeORM configuration, repositories, and data persistence
- **Dependency Injection**: TSyringe container setup and registration

### **🌐 Presentation Layer** (`src/Presentation/`)

Manages HTTP communication and user interface:

- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and middleware chains  
- **Middlewares**: Request validation, sanitization, and error handling

## � API Endpoints

The application provides a REST API for the math game with the following endpoints:

### **Health Check**

- **GET** `/health` - Check if the API is running

### **Game Operations**

- **POST** `/api/v1/game/start` - Start a new game
- **POST** `/api/v1/game/:gameId/submit` - Submit an answer to the current question
- **GET** `/api/v1/game/:gameId/end` - End a game and get final results

### **Example Usage**

1. **Start a game:**

   ```bash
   curl -X POST http://localhost:3000/api/v1/game/start \
     -H "Content-Type: application/json" \
     -d '{"name": "John", "difficulty": 2}'
   ```

2. **Submit an answer:**

   ```bash
   curl -X POST http://localhost:3000/api/v1/game/1/submit \
     -H "Content-Type: application/json" \
     -d '{"answer": 42}'
   ```

3. **End a game:**

   ```bash
   curl -X GET http://localhost:3000/api/v1/game/1/end
   ```

## �🗄️ Database

The application uses TypeORM with MySQL. The database schema is automatically synchronized in development mode.

### Entities

- **Player**: Game player information
- **Game**: Game session data
- **Question**: Quiz questions
- **Answer**: Player answers

### Configuration

Database configuration is handled in `src/Infrastructure/db/init-db.ts`. The application will:

- Auto-sync database schema in development
- Use environment variables for connection settings
- Enable logging in development mode

## 🔧 Development

### Code Style

This project uses:

- **ESLint** for linting TypeScript code
- **Prettier** for code formatting
- **TypeScript** strict mode for type safety

### Architecture Patterns

- **Dependency Injection**: Using TSyringe container
- **Repository Pattern**: For data access abstraction
- **Clean Architecture**: Separation of concerns across layers
- **Decorator Pattern**: Using TypeORM decorators and class-validator

## 📦 Dependencies

### Production Dependencies

- **express**: Web application framework
- **typeorm**: TypeScript ORM for database operations
- **mysql2**: MySQL database driver
- **tsyringe**: Dependency injection container
- **class-validator**: Validation using decorators
- **class-transformer**: Object transformation
- **reflect-metadata**: Metadata reflection support
- **dotenv**: Environment variable management

### Development Dependencies

- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with hot reload
- **eslint**: JavaScript/TypeScript linting
- **prettier**: Code formatting
- **@types/***: Type definitions for Node.js and Express

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `` |
| `DB_NAME` | Database name | `dev_mind_speed` |
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
