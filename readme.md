Getting Started After Cloning the Project
1️⃣ Clone the repository
git clone https://github.com/yourusername/schoolms.git
cd schoolms

2️⃣ Backend Setup (Spring Boot + PostgreSQL)
2a. Install prerequisites

Java 17

Maven

PostgreSQL

2b. Configure environment variables

Copy the example .env file:

# Windows

copy backend/.env.example backend/.env

# Mac/Linux

cp backend/.env.example backend/.env

Fill in your local PostgreSQL credentials:

DB_URL=jdbc:postgresql://localhost:5432/schoolms
DB_USERNAME=postgres
DB_PASSWORD=yourpassword

Note: .env is in .gitignore, so credentials stay private.

2c. Create PostgreSQL database

Open pgAdmin or psql and run:

CREATE DATABASE schoolms;

2d. Build and run backend
cd backend
mvn clean install
mvn spring-boot:run

Backend will:

Connect to PostgreSQL

Create tables (ddl-auto=update)

Seed initial data (e.g., users table)

Default Spring Security password will be shown in the console.

2e. Verify backend

Open browser or Postman:

http://localhost:8080

Test endpoints like /users to confirm the database is seeded.

3️⃣ Frontend Setup (Next.js + Tailwind CSS + ChadCN/UI)
3a. Install prerequisites

Node.js v18+ and npm

3b. Install dependencies
cd ../frontend
npm install

3c. Configure environment (optional)

If backend URL is custom, create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8080

3d. Setup ChadCN/UI (Optional for UI components)
npm install @shadcn/ui lucide-react
npx shadcn-ui init

Creates components/ui/ folder for prebuilt components.

3e. Run frontend dev server
npm run dev

Open browser at http://localhost:3000

Frontend communicates with backend automatically via API.

4️⃣ Team Workflow

Clone repo

Backend:

Copy .env.example → .env

Fill DB credentials

Create database schoolms

Run mvn clean install && mvn spring-boot:run

Frontend:

npm install

npm run dev

(Optional) Setup ChadCN components if UI components are needed

Start building features
