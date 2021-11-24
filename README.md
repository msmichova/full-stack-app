# full-stack-app

COM661 Full Stack Strategies and Development Assignment 2021-2022 Coursework

Books data source: https://github.com/benoitvallon/100-best-books/blob/master/books.json
Users data generated from: https://sagersweb.com/projects/peoplelipsum/index.php
Reviews data generated from: https://randommer.io/Text/Review

Stats:

- 100 books
- 50 users
- 2 admins: tracyallen, jakeryan

DONE:

1. Modify users
   - iterate through sample users
   - add entry for admin: true or admin: false
   - append modified entries to NEW FILE called users.json
2. Modify reviews
   - iterate through sample reviews
   - add stars: number between 1 and 5
   - add reviewer: random person from users
   - append modified entries to NEW FILE called reviews.json
3. Modify books to add reviews:
   - For each book
   - create empty reviews array
   - pick a number between 1 and 5 (500 reviews and 100 books available)
   - add review to the array
4. GitHub repo
5. Generate review IDs
6. API routes
7. Fix review IDs on API routes
8. Postman tokens + Testing

TODO: 5. Admin/user privileges - review_owner_required decorator or func? how to pass args? 7. review count? 8. some location data 11. !!!!!!! FIX LOGIN!!!! Login/authentication/protected routes 12. Sort books order alphabetically/ratings/num of reviews? - AGGREGATION-ish in python 14. Further testing for failure codes as appropriate 15. Docs - use markdown syntax 16. ADD DATE TO REVIEWS!!! 17. !!! enable jwt_required on add review, add hardcoded user!!!

- Video submission (5min)
  - Highlight features that are extra compared to labs
  - Sample will be on BB

EXTRA FEATURES:

1. ADDED validation on delete_book(). delete_business() did not validate for correct hex ID with correct length
2. ADDED validation for having all fields filled out for updating a review

ASK:

- Password AUTH!!!
- decorator with args?

Mongo commands:
! first run python make_json.py
then proceed

1. mongoimport --db booksDB --collection reviews --jsonArray reviews.json
2. mongoimport --db booksDB --collection users --jsonArray users.json
3. mongoimport --db booksDB --collection books --jsonArray books.json

mongoexport --db booksDB --collection reviews --out data_reviews.json --jsonArray --pretty
mongoexport --db booksDB --collection users --out data_users.json --jsonArray --pretty
mongoexport --db booksDB --collection books --out data_books.json --jsonArray --pretty
