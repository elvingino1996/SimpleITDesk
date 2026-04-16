# SimpleITDesk

A simple employee inventory web app with a React UI and Google Sheets as the live backend.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Data: Google Sheets API v4 (Service Account)

## 1) Google setup

1. Create a Google Cloud project.
2. Enable **Google Sheets API**.
3. Create a **Service Account**.
4. Download a JSON key.
5. Share your Google Sheet with the service account email as **Editor**.
6. Copy your Sheet ID from the sheet URL.

## 2) Prepare the sheet

Create a tab called `Employees` and add this header row in A1:K1:

`empCode, name, team, email, phone, manager, joinDate, lastWorkingDate, status, reason, remarks`

## 3) Run locally

```bash
npm install
cp backend/.env.example backend/.env
```

Put these values in `backend/.env`:

```env
PORT=4000
GOOGLE_SHEETS_ID=YOUR_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_KEY={...single-line-json...}
```

Then run both apps:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API

- `GET /health`
- `GET /employees`
- `POST /employees`

Required fields for `POST /employees`:
- `empCode`
- `name`
- `email`
- `status`

## Deploy

- Deploy `frontend` on Vercel.
- Deploy `backend` on Render/Railway/Fly.
- Set `VITE_API_BASE_URL` in frontend environment to your backend URL.
