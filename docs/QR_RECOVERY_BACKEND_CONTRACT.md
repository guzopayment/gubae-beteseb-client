# Existing Participant QR Recovery — Backend Contract

The participant frontend now handles duplicate registration (`HTTP 409`) in two ways:

1. If the 409 response includes the existing booking/participant object or its ID, the frontend uses the existing `/api/qr/:bookingId` renderer and preserves the original QR token.
2. If the 409 response only contains a message, the frontend calls:

`POST /api/bookings/recover-qr`

with the exact submitted registration identity:

```json
{
  "name": "...",
  "organization": "...",
  "phone": "...",
  "sex": "..."
}
```

## Required response

Preferred response:

```json
{
  "booking": {
    "_id": "...",
    "name": "...",
    "organization": "..."
  },
  "qrDataUrl": "data:image/png;base64,..."
}
```

Alternatively the endpoint may return the existing booking ID and the frontend will call the existing QR endpoint:

```json
{
  "booking": {
    "_id": "...",
    "name": "...",
    "organization": "..."
  }
}
```

## Security requirements

- Match the exact registration identity (at minimum name + organization + phone; sex can also be matched).
- Never create a new participant from this endpoint.
- Never generate a new QR token for an existing participant.
- Return the participant's existing QR token/image only.
- Do not expose unrelated participant records or allow broad searching.
- Prefer returning `qrDataUrl` directly so the browser does not need a protected admin endpoint.

The frontend deliberately does **not** generate a replacement QR token. This preserves scanner compatibility with the token already stored in the database.
