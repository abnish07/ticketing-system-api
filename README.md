# Ticketing System Auth Service

A Node.js authentication service built with Express and Sequelize.

## Requirements

- Node.js >= 22
- PostgreSQL database

## Setup

1. Copy the example environment file and fill required secrets:
   ```bash
   cp .env.example .env
   ```
   Set `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET`, `ENCRYPTION_KEY` (base64-encoded 32 bytes) and SMTP settings.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run database migrations:
   ```bash
   npx sequelize db:migrate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /api/health` – health check.
- `POST /api/auth/signup` – register a new user.
- `POST /api/auth/verify-email` – verify an email token.
- `POST /api/auth/login` – log in and receive tokens.
- `POST /api/auth/2fa/setup` – generate a TOTP secret (auth required).
- `POST /api/auth/2fa/enable` – enable two-factor auth (auth required).
- `POST /api/auth/2fa/verify` – verify a TOTP code after login.
- `POST /api/auth/password/forgot` – request a password reset email.
- `POST /api/auth/password/reset` – reset the password with a token.
- `POST /api/auth/refresh` – rotate the refresh token.
- `POST /api/auth/logout` – revoke session and clear cookies.
- `GET /api/auth/me` – fetch the authenticated user.

## Security

Authentication uses `httpOnly` cookies with `SameSite=Lax` and the `Secure` flag enabled in production.

