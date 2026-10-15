# Rajat & Shivani — Ring Ceremony Invitation

Static site: no build step needed. Run it with:

    cd site && python3 server.py 8080      # no-cache server, so refreshes always load the latest files

## Editing the details
All event details are in the `CONFIG` object at the top of `app.js`: names, date/time, the list of events, the QR links, dress code, venue, map link, hotel, RSVP date, email and WhatsApp number.

## Personalised links
Add `?to=Name` to the URL, e.g. `.../?to=Sharma%20Family`. The envelope then says "Dear Sharma Family".

## Replacing images
- `assets/couple.webp`: the arched portrait. Swap in your own photo; a portrait/vertical one works best.
- `assets/seal.webp`: your wax seal, with the background removed.
- `assets/envelope.webp`, `floral-top.webp`, `leaves-corner.webp`: the paper and watercolor artwork.
