# EcoTrack - Full-Stack Carbon Footprint Calculator

EcoTrack is a premium, fully featured, and deployment-ready web application designed to help individuals calculate, track, and trim down their personal yearly carbon footprint.

Users enter lifestyle parameters (car commute, aviation flights, home utilities, dietary habits, shopping) and receive instant CO₂ scores, national metric comparisons, Recharts trends, and custom reduction strategies.

---

## Key Features

1. **Multi-Step Carbon Footprint Wizard**: A beautiful 4-step form gathering Transport, Energy, Diet, and Shopping data.
2. **Interactive Dashboard Analytics**: Interactive Recharts bar trend charts and CategoryBar percentage share graphs.
3. **Global Benchmarks**: Metric comparisons comparing user emissions against World average (4,000 kg) and India average (1,700 kg).
4. **Actionable Reduction Strategies**: Personalized reduction tips selected dynamically matching the user's highest emitting category.
5. **Secure Authentication**: Credentials registration with active password strength indicators, JWT session cookie transfers, and Remember Me persistence.
6. **Robust settings overrides**: Instant light/dark theme shifts, units metric conversions (kg vs tonnes), and notification switches.

---

## Project Structure Overview

```
/ecotrack
  /client          - React + Vite + Tailwind CSS
  /server          - Node.js + Express.js + Mongoose
  docker-compose.yml - Persistent docker cluster setup
```

---

## Technical Prerequisites

To run this application locally, ensure you have:
- **Node.js**: version `18.x` or higher
- **MongoDB**: version `6.x` or higher (running locally or a remote MongoDB Atlas URI)
- **Docker** and **Docker Compose** (for containerized deployments)

---

## Local Development Installation

### 1. Database Setup
Ensure MongoDB is running on `mongodb://localhost:27017/ecotrack`.

### 2. Configure Environment Variables
Create a `.env` file in `/server`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Quickstart Server & Client
From the root `/ecotrack` workspace directory, run:
```bash
# Install all workspace dependencies
npm run install-all

# Boot up client and server concurrently
npm run dev
```

The React frontend launches on `http://localhost:5173`. The Node Express backend starts on `http://localhost:5000`.

---

## Docker Containerized Deployment

Run the complete, persistent database and network-connected stack using a single command:

```bash
docker-compose up --build
```

- **React Client**: `http://localhost` (Port 80)
- **Express Backend API**: `http://localhost:5000` (Port 5000)
- **MongoDB Database**: `mongodb://localhost:27017` (Port 27017, persistent volume)

---

## API Endpoints Reference Table

| Method | Endpoint | Description | Access |
|---|---|---|---|
| **POST** | `/api/auth/register` | Registers a new user with default preferences. | Public |
| **POST** | `/api/auth/login` | Validates credentials and writes JWT httpOnly cookies. | Public |
| **POST** | `/api/auth/logout` | Clears credentials tokens and terminates sessions. | Public |
| **POST** | `/api/auth/refresh` | Silently rotates access tokens. | Public |
| **POST** | `/api/carbon/calculate` | Calculates carbon values without saving database logs. | Protected |
| **POST** | `/api/carbon/save` | Computes and saves footprints permanently to database. | Protected |
| **GET** | `/api/carbon/history` | Fetches paginated history records for user. | Protected |
| **GET** | `/api/carbon/history/:id` | Loads detailed input parameters and metrics for single entry. | Protected |
| **DELETE** | `/api/carbon/:id` | Deletes a footprint record from history. | Protected |
| **GET** | `/api/user/profile` | Loads user account profile details. | Protected |
| **PUT** | `/api/user/profile` | Updates account name, email, or credentials password. | Protected |
| **PUT** | `/api/user/settings` | Updates application theme, units, and notification preferences. | Protected |
| **DELETE** | `/api/user/account` | Permanently deletes account and cascades to delete all carbon logs. | Protected |

---

## Sustainable Carbon Grading Scale

Emissions are calculated in **kilograms of CO₂ equivalents per year (kg CO₂/yr)**:

- **A** (`< 1,500`): **Excellent** - Highly sustainable lifestyle, below 2-tonne targets.
- **B** (`1,500 – 2,500`): **Eco-Friendly** - Keep up the solid sustainability!
- **C** (`2,500 – 4,000`): **Moderate** - Average impact, some reduction actions recommended.
- **D** (`4,000 – 6,000`): **High Intensity** - Heavy travel or utilities footprint.
- **E** (`6,000 – 10,000`): **Heavy Footprint** - Critical impact, recommend dietary & transport changes.
- **F** (`> 10,000`): **Critical** - Severe environmental footprint. Action highly recommended.

---

## Contributing Guide

1. Fork the repository.
2. Create a clean feature branch: `git checkout -b feature/eco-improvement`.
3. Commit your changes: `git commit -m 'Added green energy metrics'`.
4. Push to the branch: `git push origin feature/eco-improvement`.
5. Open a Pull Request!

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
