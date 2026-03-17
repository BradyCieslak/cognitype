# Cognitype API (MVP)

All endpoints except `/v1/api/auth/register` and `/v1/api/auth/login` require authentication via the `auth_token` HTTP-only cookie, which is set automatically on login or register.

---

## 1. Upload Document
**POST /v1/api/documents**

Request (text):
{"title": "My Document", "text": "..."}

Request (file upload):
- Multipart form with file field
- Supported types: .pdf, .txt, .docx

Response:
{"documentId": 1}

---

## 2. Get Document
**GET /v1/api/documents/{id}**

Response:
{"id": 1, "title": "My Document", "text": "...", "createdAt": "..."}

---

## 3. Update Document Title
**PATCH /v1/api/documents/{id}/title**

Request:
{"title": "New Title"}

Response:
{"id": 1, "title": "New Title", "text": "...", "createdAt": "..."}

---

## 4. Start a Typing Session
**POST /v1/api/sessions**

Request:
{
    "documentId": 1,
    "mode": "LENGTH",
    "chunkSize": 200,
    "timeSeconds": null,
    "difficulty": "MODERATE"
}

Response:
{"id": 1, "documentId": 1, "currentChunkIndex": 0, "typedChars": 0, "elapsedMs": 0, "accuracy": 0.0, "completed": false, "createdAt": "...", "completedAt": null}

---

## 5. Get Next Chunk
**GET /v1/api/sessions/{sessionId}/next-chunk**

Response:
{"id": 1, "index": 0, "text": "This is the part of the document the user must type."}

---

## 6. Submit Typing Progress
**POST /v1/api/sessions/{sessionId}/progress**

Request:
{"typedCharsDelta": 150, "elapsedMsDelta": 12000}

Response:
{"id": 1, "documentId": 1, "currentChunkIndex": 0, "typedChars": 150, "elapsedMs": 12000, "accuracy": 0.0, "completed": false, "createdAt": "...", "completedAt": null}

---

## 7. Get Session
**GET /v1/api/sessions/{sessionId}**

Response:
{"id": 1, "documentId": 1, "currentChunkIndex": 0, "typedChars": 150, "elapsedMs": 12000, "accuracy": 0.0, "completed": false, "createdAt": "...", "completedAt": null}

---

## 8. Complete a Session
**POST /v1/api/sessions/{sessionId}/complete**

Request:
{"finalAccuracy": 95.3}

Response:
{"id": 1, "documentId": 1, "currentChunkIndex": 0, "typedChars": 500, "elapsedMs": 60000, "accuracy": 95.3, "completed": true, "createdAt": "...", "completedAt": "..."}

---

## 9. Get Chunks for Document
**GET /v1/api/documents/{documentId}/chunks**

Response:
[
    {"id": 1, "index": 0, "text": "First chunk text..."},
    {"id": 2, "index": 1, "text": "Second chunk text..."}
]

---

## 10. Generate Chunks for Document
**POST /v1/api/documents/{documentId}/chunks?size=200**

Response:
[
    {"id": 1, "index": 0, "text": "First chunk text..."},
    {"id": 2, "index": 1, "text": "Second chunk text..."}
]

---

## 11. Register
**POST /v1/api/auth/register**

Request:
{"email": "user@example.com", "password": "yourpassword"}

Response (sets HTTP-only auth_token cookie):
{"userId": 1, "email": "user@example.com"}

---

## 12. Login
**POST /v1/api/auth/login**

Request:
{"email": "user@example.com", "password": "yourpassword"}

Response (sets HTTP-only auth_token cookie):
{"userId": 1, "email": "user@example.com"}

## 13. Get Current User
**GET /v1/api/auth/profile**

Requires valid auth_token cookie.

Response:
{"userId": 1, "email": "user@example.com"}

Error (not logged in):
401 Unauthorized