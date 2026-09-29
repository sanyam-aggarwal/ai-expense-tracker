# Spendwise authentication

This project now has a React sign-in screen and an Express/MongoDB authentication API. A person can create or access one account using either a mobile OTP or Google.

## Run it locally

1. Copy `server/.env.example` to `server/.env`, keep your existing `MONGO_URI`, and set a long, unique `JWT_SECRET`.
2. Copy `client/.env.example` to `client/.env`. Google sign-in is optional during initial local development.
3. In one terminal: `cd server && npm run dev`.
4. In another: `cd client && npm run dev`.
5. Open the Vite URL, normally `http://localhost:5173`.

For local development an OTP is returned in the API response and displayed in the UI. This is deliberate and only happens when `NODE_ENV` is not `production`. Never deploy with development mode enabled.

## Authentication flow

**Phone:** the browser posts an E.164 number (for India, `+91` followed by the number) to `POST /api/auth/phone/request-otp`. The server creates a random six-digit code, stores it in the temporary OTP collection, and expires it in five minutes. `POST /api/auth/phone/verify-otp` checks it, creates or finds the user, deletes the code, and returns a seven-day JWT.

**Google:** Google Identity Services issues an ID credential in the browser. The browser sends it to `POST /api/auth/google`; the server verifies its signature and intended audience using Google's official library before creating/finding the user and issuing the same JWT. The backend never trusts an email sent directly by the browser.

`GET /api/auth/me` accepts `Authorization: Bearer <JWT>` and returns the current user. Store the token in the client and attach it to later protected expense requests.

## Database collections

- `users`: one record per person. `phone`, `email`, and Google subject (`googleId`) are unique when present, allowing either or both sign-in methods to be linked to a user.
- `otps`: an ephemeral verification challenge. MongoDB's TTL index automatically removes it at expiry; successful verification deletes it immediately.

## Production resources you must create

1. **Google Cloud OAuth client:** In Google Cloud Console, configure OAuth consent screen, create a *Web application* client, and add your deployed site plus `http://localhost:5173` to Authorized JavaScript origins. Put the same client ID in both `server/.env` (`GOOGLE_CLIENT_ID`) and `client/.env` (`VITE_GOOGLE_CLIENT_ID`).
2. **SMS provider:** Create a Twilio account, buy/verify a sending number, and set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` in `server/.env`. Set `NODE_ENV=production`; only then does the server send actual SMS.
3. **Deployment secrets:** use a managed secret store for `JWT_SECRET`, Twilio credentials, Mongo URI, and Google client ID. Never commit `.env` files. Use HTTPS for the API and frontend.

## Safety and performance controls

OTP codes expire in five minutes, are single-use, are stored in plaintext at your request, have five verification attempts, and cannot be resent for 60 seconds. The auth endpoints and API have IP-based rate limits. MongoDB indexes the lookups and TTL cleanup. For a multi-instance production deployment, replace the default rate-limit memory store with Redis and move JWTs to secure, `HttpOnly`, `SameSite` cookies to reduce token exposure from XSS.
