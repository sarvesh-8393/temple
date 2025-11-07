# TODO List

## Map Markers Implementation
- [x] Verify temple markers display on map using lat/lng from database
- [x] Create nearby temples API route for location-based filtering
- [ ] Test map markers with sample data
- [ ] Enhance markers with Google Places API integration (optional)

## Database & API
- [x] Ensure Temple schema includes lat, lng, placeId fields
- [x] Seed database with temples having geographical coordinates
- [x] Implement GET /api/temples endpoint
- [x] Implement POST /api/temples endpoint for temple registration

## Frontend Components
- [x] TempleMap component renders markers for temples
- [x] Home page integrates map with temple markers
- [ ] Add loading states for map initialization
- [ ] Add error handling for failed location requests

## User Experience
- [ ] Implement user location detection and nearby temple suggestions
- [ ] Add map controls for zoom, pan, and location reset
- [ ] Optimize marker clustering for dense areas
