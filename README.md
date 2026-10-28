# Healthcare Management Backend

A REST API for the healthcare backend assignment, implemented using **Node.js, Express, Prisma ORM, and PostgreSQL**. This project follows the assignment's required registration/login, patient, doctor, and patient-doctor mapping APIs.

## Features

- User registration and login with hashed passwords (`bcryptjs`).
- JWT bearer-token authentication for protected routes.
- Patient CRUD with record ownership: a user can access and manage only patients they created.
- Doctor CRUD. Authenticated users can browse doctors; only the creator can update or delete a doctor record.
- Patient-doctor assignments, duplicate assignment prevention, and scoped mapping retrieval.
- PostgreSQL relational data model managed by Prisma.
- Zod request validation and centralized error handling.
- Environment-based configuration.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## Setup

1. Open this project directory in a terminal.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database, for example `healthcare_db`.
4. Copy `.env.example` to `.env` and set your own database credentials and JWT secret:

   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthcare_db?schema=public"
   JWT_SECRET="a_long_random_secret_at_least_32_characters"
   PORT=5000
   ```

5. Generate Prisma Client and create the database tables:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. Start the API:

   ```bash
   npm run dev
   ```

   API base URL: `http://localhost:5000`

Health check: `GET http://localhost:5000/api/health/`

## API reference

All JSON request bodies should use `Content-Type: application/json`. Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Login and receive a JWT |

Register body:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "SecurePass123"
}
```

Login body:

```json
{
  "email": "alex@example.com",
  "password": "SecurePass123"
}
```

Use the `data.token` value returned from login as the bearer token for protected APIs.

### Patients

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/patients/` | Create a patient |
| GET | `/api/patients/` | List patients created by current user |
| GET | `/api/patients/:id/` | Get a patient |
| PUT | `/api/patients/:id/` | Replace/update patient fields |
| DELETE | `/api/patients/:id/` | Delete a patient |

Example patient body:

```json
{
  "name": "Jordan Lee",
  "dateOfBirth": "1995-04-20T00:00:00.000Z",
  "gender": "PREFER_NOT_TO_SAY",
  "email": "jordan@example.com",
  "phone": "+91-9876543210",
  "address": "Gurugram, Haryana",
  "notes": "Optional notes"
}
```

Allowed `gender` values: `MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`.

### Doctors

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/doctors/` | Create a doctor |
| GET | `/api/doctors/` | List all doctors |
| GET | `/api/doctors/:id/` | Get doctor details |
| PUT | `/api/doctors/:id/` | Update doctor fields (creator only) |
| DELETE | `/api/doctors/:id/` | Delete doctor (creator only) |

Example doctor body:

```json
{
  "name": "Dr. Taylor Smith",
  "email": "taylor.smith@example.com",
  "phone": "+91-9876543210",
  "specialization": "Cardiology",
  "licenseNumber": "MED-12345",
  "clinicAddress": "Sector 45, Gurugram"
}
```

### Patient-doctor mappings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/mappings/` | Assign a doctor to a patient |
| GET | `/api/mappings/` | List mappings created by current user |
| GET | `/api/mappings/:patientId/` | List doctors assigned to a patient |
| DELETE | `/api/mappings/:id/` | Remove a mapping created by current user |

Create mapping body:

```json
{
  "patientId": "PATIENT_UUID",
  "doctorId": "DOCTOR_UUID"
}
```

## Response and errors

Successful responses use a `success: true` property and include relevant `data`. Validation errors return `400`, missing/invalid JWT returns `401`, missing records return `404`, duplicate email or doctor assignment returns `409`, and unexpected errors return `500`.

## Testing with Postman

Recommended sequence:

1. Register a user.
2. Log in and copy the JWT.
3. Set `Authorization` → `Bearer Token` in Postman for protected requests.
4. Create a patient and copy its ID.
5. Create a doctor and copy its ID.
6. Create a mapping using the patient and doctor IDs.
7. Retrieve patients, doctors, and mappings.
8. Update patient/doctor records and remove the mapping.
9. Delete records and verify the API returns `404` when retrieving them.
10. Try requests without a token and with invalid input to verify access control and validation.

## Notes

- The database stores password hashes, never plain-text passwords.
- Patient records and mapping access are scoped to the authenticated user.
- Doctors are visible to authenticated users to support the assignment's `GET /api/doctors/` requirement.
- This is an educational assignment backend. Do not use it with real patient health data without additional security, privacy, audit, and compliance review.
