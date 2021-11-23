import random, json
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import pickle

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.booksDB2      # select the database
users = db.users        # select the collection name
reviews = db.reviews 
# books = db.books 

# def create_database():
#     client = MongoClient("mongodb://127.0.0.1:27017")
#     db = client.booksDB

#     users = db.users    
#     with open('sample_users.json') as f:
#         for line in f:
#             users.insert_one(json.loads(line))
#     print("Users loaded")

#     reviews = db.reviews    
#     with open('sample_reviews.json') as f:
#         for line in f:
#             reviews.insert_one(json.loads(line))
#     print("Reviews loaded")

#     books = db.books    
#     with open('sample_books.json') as f:
#         for line in f:
#             books.insert_one(json.loads(line))
#     print("Books loaded")

# 1. Modify users
#     - iterate through sample users
#     - add entry for admin: true or admin: false
#     - append modified entries to NEW FILE called users.json
def add_admin_status():
    fin = open("sample_users.json", "rb")
    users_list = json.load(fin)

    admins = ["tracyallen", "jakeryan"] # ADD USERNAMES HERE TO MAKE THEM AN ADMIN
    processed_users = []

    for user in users_list:
        isAdmin = False

        if user["userName"] in admins:     # Check if current user is in admins list
            isAdmin = True

        modified_user = { \
            "firstName": user["firstName"], \
            "lastName": user["lastName"], \
            "userName": user["userName"], \
            "password": user["password"], \
            "email": user["email"], \
            "isAdmin" : isAdmin \
            }

        processed_users.append(modified_user)
        
        user_with_encrypted_pw = { \
            "firstName": user["firstName"], \
            "lastName": user["lastName"], \
            "userName": user["userName"], \
            "password":  b'user["password"]', \
            "email": user["email"], \
            "isAdmin" : isAdmin \
            }

        user_with_encrypted_pw["password"] = bcrypt.hashpw(user_with_encrypted_pw["password"], bcrypt.gensalt())
        users.insert_one(user_with_encrypted_pw)
        # Temporary workaround:
        # processed_users.append(user_with_encrypted_pw)


    fin.close()
    fout = open("users.json", "wb")
    fout.write(json.dumps(processed_users))
    fout.close()

# 2. Modify reviews
#     - iterate through sample reviews
#     - add stars: number between 1 and 5
#     - add reviewer: random person from users
#     - append modified entries to NEW FILE called reviews.json
def modify_reviews():
    fin_reviews = open("sample_reviews.json", "r")
    reviews_list = json.load(fin_reviews)
    fin_users = open("users.json", "rb")
    users_list = json.load(fin_users)

    modified_reviews = []

    # print(reviews_list["reviews"])

    for review in reviews_list["reviews"]:
        stars = random.randint(1, 5)
        name = users_list[random.randint(0, len(users_list)-1)]["userName"]     # Pick a random username
        modified_review = {"_id": str(ObjectId()), "name" : name, "stars" : stars, "comment" : review}
        # TODO: How can I NOT convert ObjectId into string without error?
        modified_reviews.append(modified_review)
        # reviews.insert_one(modified_review)

    fin_reviews.close()
    fin_users.close()
    fout = open("reviews.json", "w")
    fout.write(json.dumps(modified_reviews))
    fout.close()

# 3. Modify books to add reviews:
#     - For each book
#     - create empty reviews array
#     - pick a number between 1 and 5 (500 reviews and 100 books available)
#     - add review to the array
def modify_books():
    fin_reviews = open("reviews.json", "r")
    reviews_list = json.load(fin_reviews)
    fin_books = open("sample_books.json", "r")
    books_list = json.load(fin_books)
    modified_books_list = []

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
            "_id" : str(ObjectId()), \
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

        modified_books_list.append(modified_book)
        # TODO: insert books into books collection manually from mongo shell
        # books.insert_one(modified_book)

    fin_reviews.close()
    fin_books.close()
    fout = open("books.json", "w")
    fout.write(json.dumps(modified_books_list))
    fout.close()


# Run all functions
# create_database()
add_admin_status()
modify_reviews()
modify_books()
