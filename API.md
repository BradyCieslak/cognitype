# Cognitype API (MVP)

## 1. Upload Document
**POST /v1/api/documents**

Uploads text or PDF and stores it.

Request:
- If PDF: multipart upload with file
- If text: JSON `{ "text": "..." }`

Response:
{"documentId": "abc123"}


---

## 2. Start a Typing Session
**POST v1/api/sessions**

Request:
{
    "documentId": "abc123",
    "mode": "length", // or "time"
    "chunkSize": 200, // required if mode = length
    "timeSeconds": 30, // required if mode = time
    "difficulty": "moderate" // affects # of questions
}

Response:
{"sessionId": "xyz789"}


---

## 3. Get Next Chunk
**GET v1/api/sessions/{sessionId}/next-chunk**

Response:
{
    "chunkIndex": 0,
    "text": "This is the part of the document the user must type."
}


---

## 4. Submit Typing Progress
**POST v1/api/sessions/{sessionId}/progress**

Request:
{
    "typedChars": 150,
    "elapsedMs": 12000
}

Response:
{"ok": true}


---

## 5. Get Comprehension Questions
**GET v1/api/sessions/{sessionId}/questions?chunkIndex=0**

Response:
{
    "questionId": "q001",
    "prompt": "What is the main idea?"
}


---

## 6. Submit Answer
**POST v1/api/sessions/{sessionId}/answer**

Request:
{
    "questionId": "q001",
    "answerText": "The author introduces the topic"
}

Response:
{
    "correct": "true",
    "feedback": "Yes, you understood this section."
}


---

## 7. End Session
***POST v1/api/sessions/{sessionId}/complete**

Response:
{"summary": {
    "accuracy": 92,
    "wpm": 64,
    "totalTimeSec": 183
}}