# Duplicate QR recovery

When the participant submits the same registered name + phone, the server returns HTTP 409 with the existing booking details and the original QR image. The page displays the QR in a dedicated recovery dialog with Download QR and Share QR actions.

The frontend does not create or alter the QR token.
