# NAMO Hotel & Travel — Production Backend API

A production-ready Node.js, TypeScript, and Express backend for the NAMO Hotel & Travel website.

## 🚀 Key Features

* **Enquiry Management**: Ingests, validates, and stores customer travel & hotel enquiries.
* **Lead Curation Engine**: Deterministic classification engine scoring lead priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), booking intent, and spam detection.
* **WhatsApp Cloud API Integration**: Automated notification dispatch to hotel managers using official Meta WhatsApp Business Cloud API.
* **Resilient Architecture**: Save-first pattern ensures customer enquiries are safely stored in MongoDB Atlas before attempting external WhatsApp dispatch.
* **Security Standards**: Helmet HTTP headers, strict CORS configuration, Zod request validation, rate limiting, and safe non-leaking error responses.
* **Structured Logging**: Winston-powered logging with environment-tailored log levels and secret masking.
* **Graceful Lifecycle Management**: Clean connection handling and process termination (`SIGINT`/`SIGTERM`).

---

## 📁 Repository & Project Architecture

```
namo-hotel/
├── Frontend/           # React + Vite frontend
└── backend/            # Production Express + TypeScript Backend
    ├── src/
    │   ├── config/             # Environment & Database config
    │   ├── controllers/        # Request controllers
    │   ├── middleware/         # Error, rate-limiting & Zod validation
    │   ├── models/             # Mongoose Enquiry schema
    │   ├── routes/             # Versioned API routes (/api/v1)
    │   ├── services/           # Core business logic
    │   │   ├── lead/           # Lead curation & classification
    │   │   └── whatsapp/       # WhatsApp Cloud API & message formatters
    │   ├── types/              # TypeScript type definitions
    │   ├── utils/              # Winston logger & API response helpers
    │   ├── validators/         # Zod schemas
    │   └── server.ts           # App setup & server entrypoint
    ├── tests/                  # Integration & unit test suite
    ├── .env.example            # Environment template
    ├── package.json            # Scripts & dependencies
    ├── tsconfig.json           # TypeScript configuration
    └── README.md               # API documentation
```

---

## 🛠️ Prerequisites

* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **MongoDB**: MongoDB Atlas URI or local MongoDB instance (`mongodb://localhost:27017`)

---

## ⚙️ Installation & Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/namo_hotel_db
   FRONTEND_URL=http://localhost:5173

   # WhatsApp Business Cloud API (Meta for Developers)
   WHATSAPP_ACCESS_TOKEN=your_meta_system_user_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
   WHATSAPP_API_VERSION=v18.0
   MANAGER_WHATSAPP_NUMBER=919876543210
   ```

---

## 📜 Available NPM Scripts

* `npm run dev`: Start local development server with auto-reload (`tsx watch`).
* `npm run build`: Compile TypeScript into `dist/`.
* `npm run start`: Run production build from `dist/server.js`.
* `npm run test`: Run automated Vitest test suite.
* `npm run lint`: Run TypeScript type checking (`tsc --noEmit`).

---

## 📡 API Reference & Endpoints

All API endpoints are versioned under `/api/v1`.

### 1. Health Check

* **URL**: `/api/v1/health`
* **Method**: `GET`
* **Description**: Returns backend operational status, database connectivity, and WhatsApp configuration status.

#### Example Request:
```bash
curl -X GET http://localhost:5000/api/v1/health
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "NAMO Hotel API is running",
  "data": {
    "service": "namo-hotel-backend",
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2026-08-08T12:00:00.000Z",
    "database": {
      "connected": true,
      "state": "connected"
    },
    "integrations": {
      "whatsappConfigured": true
    }
  }
}
```

---

### 2. Submit Website Enquiry

* **URL**: `/api/v1/enquiries`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Rate Limit**: Max 10 requests per 15 minutes per IP.

#### Request Body Schema:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Full Name (2-100 characters) |
| `phone` | string | Yes | Phone / WhatsApp number (8-20 chars) |
| `email` | string | Yes | Valid email address |
| `destination` | string | No | Target travel destination (e.g. Jaisalmer) |
| `hotel` | string | No | Specific hotel or resort name |
| `checkIn` | string | No | Desired check-in date |
| `checkOut` | string | No | Desired check-out date |
| `guests` | number | No | Number of guests (default: 1) |
| `interests` | string[] | No | Array of interests e.g. `["Safari", "Stay"]` |
| `message` | string | Yes | Enquiry message / travel details (5-2000 chars) |
| `source` | string | No | Lead source tag (default: `"website"`) |
| `page` | string | No | Path page of form submission |

#### Example Request:
```bash
curl -X POST http://localhost:5000/api/v1/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "phone": "+919876543210",
    "email": "rahul@example.com",
    "destination": "Jaisalmer",
    "hotel": "Namo Desert Resort",
    "checkIn": "2026-10-15",
    "checkOut": "2026-10-18",
    "guests": 4,
    "interests": ["Accommodation", "Desert Safari"],
    "message": "Looking for luxury stay rate and desert safari availability."
  }'
```

#### Example Success Response (201 Created):
```json
{
  "success": true,
  "message": "Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.",
  "data": {
    "id": "66b4d32a1e8a9f0012a9b3c4",
    "leadStatus": "NEW",
    "whatsappStatus": "sent",
    "createdAt": "2026-08-08T12:00:00.000Z"
  }
}
```

#### Example Validation Error Response (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

---

## 📲 Meta WhatsApp Business Cloud API Integration

1. Go to [Meta for Developers](https://developers.facebook.com/) and register a WhatsApp Business App.
2. Under **WhatsApp -> API Setup**, copy the **Permanent System User Access Token** and **Phone Number ID**.
3. Set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `MANAGER_WHATSAPP_NUMBER` in `backend/.env`.
4. If WhatsApp credentials are omitted, the server operates safely in `not_configured` mode without dropping saved customer enquiries.

---

## 🛡️ Security & Reliability

* **Save-First Pattern**: Customer data is persisted in MongoDB Atlas before making external WhatsApp API HTTP calls. If WhatsApp API experiences downtime, the customer enquiry is NOT lost.
* **Input Sanitization & Validation**: Zod rejects dangerous payloads before execution.
* **Rate Limiting**: `express-rate-limit` prevents brute-force / spam submission attacks.
* **CORS Security**: Restricts cross-origin requests to configured frontend domains.
