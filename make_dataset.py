import random, json
from pymongo import MongoClient
from bson import ObjectId
import bcrypt

# client = MongoClient("mongodb://127.0.0.1:27017")
# db = client.booksDB2      # select the database
# users = db.users        # select the collection name
# reviews = db.reviews 
# books = db.books 

def create_database():
    client = MongoClient("mongodb://127.0.0.1:27017")
    db = client.booksDB

    # Create users collection
    users = db.users    
    with open('sample_users.json') as f:
        users_list = json.load(f)

        # Assign admin status
        admins = ["tracyallen", "jakeryan"] # ADD USERNAMES HERE TO MAKE THEM AN ADMIN
        for user in users_list:
            isAdmin = False
            if user["userName"] in admins:
                isAdmin = True

            modified_user = { \
                "firstName": user["firstName"], \
                "lastName": user["lastName"], \
                "userName": user["userName"], \
                "password": b'user["password"]', \
                "email": user["email"], \
                "isAdmin" : isAdmin \
                }

            # Encrypt password
            modified_user["password"] = bcrypt.hashpw(modified_user["password"], bcrypt.gensalt())
            
            users.insert_one(modified_user)
    print("Users loaded")

    # Create reviews collection
    reviews = db.reviews    
    with open('sample_reviews.json') as fin_reviews:
        reviews_list = json.load(fin_reviews)
        fin_users = open("sample_users.json", "r")
        users_list = json.load(fin_users)
        for review in reviews_list["reviews"]:
            stars = random.randint(1, 5)
            name = users_list[random.randint(0, len(users_list)-1)]["userName"]     # Pick a random username
            modified_review = {"name" : name, "stars" : stars, "comment" : review}
            reviews.insert_one(modified_review)
        fin_users.close()
    print("Reviews loaded")

    # Create books collection
    books = db.books    
    with open('sample_books.json') as fin_books:
        fin_reviews = open("reviews.json", "r")
        reviews_list = json.load(fin_reviews)
        books_list = json.load(fin_books)

        for book in books_list:
            no_of_reviews = random.randint(0, 5)
            reviews = []

            i = 0
            while i < no_of_reviews:
                random_review = reviews_list[random.randint(0, len(reviews_list)-1)]
                reviews.append(random_review)
                reviews_list.remove(random_review)
                i += 1

            modified_book = { \
                "author" : book["author"], \
                "country" : book["country"], \
                "imageLink" : book["imageLink"], \
                "language" : book["language"], \
                "link" : book["link"], \
                "pages" : book["pages"], \
                "title" : book["title"], \
                "year" : book["year"], \
                "reviews" : reviews \
            }

            books.insert_one(modified_book)

        fin_reviews.close()
    print("Books loaded")

# Run all functions
create_database()
