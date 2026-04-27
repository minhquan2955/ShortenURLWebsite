# 🔗 ShortenURL — URL Shortener & QR Code Generator

A fast, modern URL shortening service built with **Node.js**, **Express 5**, **PostgreSQL**, and **Redis**. Shorten long URLs into compact links and optionally generate QR codes — all through a clean web interface or REST API.

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7+-DC382D?logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **URL Shortening** — Convert any long URL into a short, shareable link.
- **QR Code Generation** — Optionally generate a QR code for the original URL.
- **Redis Caching** — Frequently accessed URLs are cached in Redis for ultra-fast redirects.
- **Rate Limiting** — Protect the API from abuse with per-IP rate limiting (backed by Redis).
- **Access Counter** — Track how many times each shortened URL has been visited.
- **Modern Frontend** — A clean, responsive web UI to shorten links without touching the API directly.

---

## 🏗️ Architecture

```
Client (Browser / Postman)
        │
        ▼
   Express Server (port 8000)
        │
        ├── POST /shorten ──► Create short URL + optional QR code
        │       │
        │       ├── Rate Limiter (Redis-backed)
        │       └── Save to PostgreSQL (via Prisma)
        │
        └── GET /:shortCode ──► Redirect to original URL
                │
                ├── 1. Check Redis Cache (fast path)
                │       └── Hit? → redirect immediately
                │
                └── 2. Query PostgreSQL (slow path)
                        └── Found? → cache in Redis → redirect
```

---

## 🛠️ Tech Stack

| Layer          | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| **Runtime**    | Node.js (ES Modules)                                             |
| **Framework**  | Express 5                                                        |
| **Database**   | PostgreSQL                                                       |
| **ORM**        | Prisma 7 (with `@prisma/adapter-pg`)                             |
| **Cache**      | Redis 5+                                                         |
| **Rate Limit** | `express-rate-limit` + `rate-limit-redis`                        |
| **QR Code**    | `qrcode` (generates base64 Data URL)                             |
| **Frontend**   | Vanilla HTML / CSS / JavaScript                                  |

---

## 📁 Project Structure

```
ShortenURLWebsite/
├── Controller/
│   └── urlController.js      # Business logic (shorten, redirect, caching)
├── Router/
│   └── route.js               # API routes & rate limiter config
├── public/
│   ├── index.html             # Frontend UI
│   ├── style.css              # Styling
│   └── script.js              # Client-side logic (fetch API calls)
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Auto-generated migration files
├── generated/
│   └── prisma/                # Auto-generated Prisma Client
├── server.js                  # Express app entry point
├── prisma.config.ts           # Prisma CLI configuration
├── .env                       # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22 or higher
- **PostgreSQL** installed and running
- **Redis** server ([local install](https://redis.io/docs/getting-started/), [Upstash](https://upstash.com/), or [Redis Cloud](https://redis.com/try-free/))

### 1. Clone the Repository

```bash
git clone https://github.com/minhquan2955/ShortenURLWebsite.git
cd ShortenURLWebsite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
PORT=8000
REDIS_PORT=6379
REDIS_URL="redis://localhost:6379"
```

> Replace `<user>`, `<password>`, and `<database>` with your PostgreSQL credentials.

### 4. Set Up the Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### 5. Start the Server

```bash
npm run dev
```

The server will start at **http://localhost:8000** with auto-reload enabled via `--watch`.

---

## 📡 API Reference

### Shorten a URL

```http
POST /shorten
Content-Type: application/json
```

**Request Body:**

```json
{
  "originalURL": "https://example.com/very-long-url",
  "generateQR": true
}
```

| Field         | Type      | Required | Description                          |
| ------------- | --------- | -------- | ------------------------------------ |
| `originalURL` | `string`  | ✅ Yes    | The long URL to shorten              |
| `generateQR`  | `boolean` | ❌ No     | Set to `true` to generate a QR code  |

**Response (`201 Created`):**

```json
{
  "shortUrl": "http://localhost:8000/aBcDeF",
  "qrCode": "data:image/png;base64,..."
}
```

> The `qrCode` field is only included when `generateQR` is `true`.

---

### Redirect to Original URL

```http
GET /:shortCode
```

**Response:** `301 Moved Permanently` → Redirects to the original URL.

If the short code is not found, returns `404 Not Found`.

---

### Rate Limiting

The `POST /shorten` endpoint is rate-limited to **20 requests per 10 minutes** per IP address. When exceeded, the API returns:

```json
{
  "error": "Too many short URLs created! Please try again later."
}
```

Rate limit state is stored in **Redis** and persists across server restarts.

---

## 🗄️ Database Schema

```prisma
model Url {
  id            String   @id @default(uuid()) @db.Uuid
  originalURL   String
  shortCode     String   @unique
  accessCounter Int      @default(0)
  createdAt     DateTime @default(now())
}
```

---

## ⚡ Caching Strategy

| Scenario              | Flow                                                              |
| --------------------- | ----------------------------------------------------------------- |
| **Cache Hit**         | Redis → redirect immediately (fire-and-forget DB counter update)  |
| **Cache Miss**        | PostgreSQL → store in Redis (TTL: 3 hours) → redirect             |
| **Not Found**         | Return `404`                                                      |

Redis keys follow the pattern `cache:url:<shortCode>` with a **3-hour TTL** (`10800` seconds).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**MinhQuan** — [GitHub](https://github.com/minhquan2955)
