# HTTP Examples

## GET /api/health
```bash
curl http://localhost:4000/api/health
```

## POST /api/auth/signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"REPLACE_PASSWORD"}'
```

## POST /api/auth/verify-email
```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"REPLACE_TOKEN"}'
```

## POST /api/auth/login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"REPLACE_PASSWORD"}'
```

## POST /api/auth/2fa/setup
```bash
curl -X POST http://localhost:4000/api/auth/2fa/setup \
  -H "Authorization: Bearer REPLACE_TOKEN"
```

## POST /api/auth/2fa/enable
```bash
curl -X POST http://localhost:4000/api/auth/2fa/enable \
  -H "Authorization: Bearer REPLACE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"123456","secret":"REPLACE_SECRET"}'
```

## POST /api/auth/2fa/verify
```bash
curl -X POST http://localhost:4000/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"tempToken":"REPLACE_TOKEN","code":"123456"}'
```

## POST /api/auth/password/forgot
```bash
curl -X POST http://localhost:4000/api/auth/password/forgot \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

## POST /api/auth/password/reset
```bash
curl -X POST http://localhost:4000/api/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{"token":"REPLACE_TOKEN","newPassword":"REPLACE_PASSWORD"}'
```

## POST /api/auth/refresh
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Cookie: REPLACE_COOKIE"
```

## POST /api/auth/logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer REPLACE_TOKEN" \
  -H "Cookie: REPLACE_COOKIE"
```

## GET /api/auth/me
```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer REPLACE_TOKEN"
```

