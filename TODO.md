# TODO: Integrate Frontend with Backend for Assigning Households to CHV

- [x] Add GET /chvs route in backend/routes/supervisor.js
- [x] Add listCHVs function in backend/controllers/supervisorController.js to fetch CHVs from Supabase
- [x] Update frontend/js/supervisor.js to fetch CHVs, households, assignments from APIs instead of mock data
- [x] Update frontend/supervisor/assign-chv.html to load data on page load and handle form submission via API
- [x] Test the assignment functionality by running the server and checking the UI
