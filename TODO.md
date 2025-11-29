# TODO: Remove 'times' field and rename to 'time', change 'poojaTimes' to 'poojaTime'

- [x] Update Pooja interface in types/index.ts: remove times?: string[], keep time?: string
- [x] Update poojaSchema in mongodb.ts: remove times field, keep time field, change poojaTimes to poojaTime in userSchema
- [x] Update temple/[id]/page.tsx: remove times?: string from Pooja interface, update getAvailableTimes to use time instead of times
- [x] Update register-temple/page.tsx: change times to time in poojaSchema and form fields
- [x] Update PoojasPageContent.tsx: remove times?: string from Pooja interface
- [x] Update api/temples/route.ts: change pooja.times to pooja.time
- [x] Update any other references found in search
