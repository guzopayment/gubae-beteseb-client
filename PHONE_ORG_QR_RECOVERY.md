# Public Phone + Organization QR Recovery

The public `/submit` page is now a QR recovery/lookup page only.

## Required fields
- Phone number: `09XXXXXXXX`
- Organization: select from the existing organization list

Name and sex are no longer requested on the public page.

## Behavior
1. The client sends the phone + organization to `POST /api/bookings/recover-by-phone-org`.
2. The server searches existing bookings using both values.
3. If no record matches, the popup says:
   `You are not registered, please contact the support team`
4. If one record matches, its original QR is displayed with separate Download and Share buttons.
5. If multiple records match (same phone + organization under different names), every matching original QR is displayed separately, each with its own Download and Share buttons.
6. No new participant can be created from this public page. Existing QR tokens are never changed.
