from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson import ObjectId
import jwt
import datetime
from functools import wraps
import bcrypt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://127.0.0.1:27017")

db = client.booksDB              # select the database
books = db.books      # select the collection
users = db.users
blacklist = db.blacklist

app.config['SECRET_KEY'] = 'mysecret'


def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        # token = request.args.get('token')
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify(
                {'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token,
                              app.config['SECRET_KEY'])
        except:
            return jsonify(
                {'message': 'Token is invalid'}), 401

        bl_token = blacklist.find_one({"token": token})
        if bl_token is not None:
            return make_response(jsonify({"message": "Token has been cancelled"}), 401)

        return func(*args, **kwargs)

    return jwt_required_wrapper


def admin_required(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers["x-access-token"]
        data = jwt.decode(token, app.config["SECRET_KEY"])
        if data["admin"]:
            return func(*args, **kwargs)
        else:
            return jsonify({'message': 'Admin access required'}), 401
    return admin_required_wrapper

# Source: https://www.pythonprogramming.in/python-wraps-decorator-with-arguments.html


def review_owner_required_with_args(bid, rid):
    def review_owner_required(func):
        @wraps(func)
        def review_owner_required_wrapper(*args, **kwargs):
            review_owner = books.find_one({"_id": bid, "reviews._id": rid})
            if review_owner:
                token = request.headers["x-access-token"]
                data = jwt.decode(token, app.config["SECRET_KEY"])
                if data["userid"] == review_owner["_id"]:
                    return func(*args, **kwargs)
                else:
                    return jsonify({'message': 'Admin or review owner access required'}), 401
            else:
                return jsonify({'message': 'Incorrect book or review ID'}), 401
        return review_owner_required_wrapper
    return review_owner_required


def sort_results(sort_by):
    sort_by_options = ["author_asc", "author_desc", "title_asc", "title_desc"]

    if sort_by == "title_desc":
        return "title", -1
    elif sort_by == "author_asc":
        return "author", 1
    elif sort_by == "author_desc":
        return "author", -1
    else:  # title_asc
        return "title", 1


# Function to check if the string
# represents a hexadecimal number
# adopted from: https://www.geeksforgeeks.org/check-if-a-string-represents-a-hexadecimal-number-or-not/
def checkHex(s):
    # Iterate over string
    for ch in s:
        # Check if the character
        # is invalid
        if ((ch < '0' or ch > '9') and (ch < 'a' or ch > 'f')):
            return False
    # Check for correct length
    if len(s) != 24:
        return False
    # Print true if all
    # characters are valid
    return True


@app.route("/", methods=["GET"])
def index():
    return make_response("<h1>Books Homepage</h1>", 200)


@app.route("/api/v1.0/books", methods=["GET"])
def show_all_books():
    page_num, page_size = 1, 10     # default pagination
    sort_by_arg = "title_asc"
    if request.args.get('pn'):
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    if request.args.get('sort_by'):
        sort_by_arg = request.args.get('sort_by')
    page_start = (page_size * (page_num - 1))

    arg_name, order = sort_results(sort_by_arg)

    data_to_return = []
    for book in books.find().sort(arg_name, order).skip(page_start).limit(page_size):
        book['_id'] = str(book['_id'])
        for review in book['reviews']:
            review['_id'] = str(review['_id'])
        data_to_return.append(book)
    return make_response(jsonify(data_to_return), 200)


@app.route("/api/v1.0/books/<string:id>", methods=["GET"])
def show_one_book(id):
    if checkHex(str(id)) == False:
        return make_response(jsonify({"error": "Invalid book ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    else:
        data_to_return = []
        book = books.find_one({'_id': ObjectId(id)})
        if book is not None:
            book['_id'] = str(book['_id'])
            for review in book['reviews']:
                review['_id'] = str(review['_id'])
            data_to_return.append(book)
            return make_response(jsonify(data_to_return), 200)
        else:
            return make_response(jsonify({"error": "Invalid book ID"}), 404)


@app.route("/api/v1.0/books", methods=["POST"])
# @jwt_required
def add_book():
    if "title" in request.form and \
        "author" in request.form and \
        "country" in request.form and \
        "imageLink" in request.form and \
        "language" in request.form and \
        "link" in request.form and \
        "pages" in request.form and \
            "year" in request.form:
        new_book = {
            "title": request.form["title"],
            "author": request.form["author"],
            "country": request.form["country"],
            "imageLink": request.form["imageLink"],
            "language": request.form["language"],
            "link": request.form["link"],
            "pages": request.form["pages"],
            "year": request.form["year"],
            "reviews": []
        }
        new_book_id = books.insert_one(new_book)
        new_book_link = \
            "http://localhost:5000/api/v1.0/books/" \
            + str(new_book_id.inserted_id)

        return make_response(jsonify({"url": new_book_link}), 201)
    else:
        return make_response(jsonify({"error": "Missing form data"}), 404)


@app.route("/api/v1.0/books/<string:id>", methods=["PUT"])
# @jwt_required
def edit_book(id):
    if "title" in request.form and \
        "author" in request.form and \
        "country" in request.form and \
        "imageLink" in request.form and \
        "language" in request.form and \
        "link" in request.form and \
        "pages" in request.form and \
            "year" in request.form:
        result = books.update_one(
            {"_id": ObjectId(id)}, {
                "$set": {"title": request.form["title"],
                         "author": request.form["author"],
                         "country": request.form["country"],
                         "imageLink": request.form["imageLink"],
                         "language": request.form["language"],
                         "link": request.form["link"],
                         "pages": request.form["pages"],
                         "year": request.form["year"]
                         }
            })
        if result.matched_count == 1:
            edited_book_link = \
                "http://localhost:5000/api/v1.0/books/" + id
            return make_response(jsonify({"url": edited_book_link}), 200)
        else:
            return make_response(jsonify({"error": "Invalid book ID"}), 404)
    else:
        return make_response(jsonify({"error": "Missing form data"}), 404)


@app.route("/api/v1.0/books/<string:id>", methods=["DELETE"])
# @jwt_required
# @admin_required
def delete_book(id):
    # EXTRA FEATURE: Validation for hex
    if checkHex(str(id)) == False:
        return make_response(jsonify({"error": "Invalid book ID format - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    else:
        result = books.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return make_response(jsonify({}), 204)
        else:
            return make_response(jsonify({"error": "Invalid book ID"}), 404)


@app.route("/api/v1.0/books/<string:id>/reviews", methods=["POST"])
# @jwt_required
def add_new_review(id):
    if checkHex(str(id)) == False:
        return make_response(jsonify({"error": "Invalid book ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    else:
        if "name" in request.form and "comment" in request.form and "stars" in request.form:
            new_review = {
                "_id": ObjectId(),
                # "userid" : "619d186efda80f47925fe808",
                "name": request.form["name"],
                "comment": request.form["comment"],
                "stars": request.form["stars"]
            }
            books.update_one({"_id": ObjectId(id)},
                             {"$push": {"reviews": new_review}})
            new_review_link = \
                "http://localhost:5000/api/v1.0/books/" \
                + id + "/reviews/" + str(new_review['_id'])
            return make_response(jsonify({"url": new_review_link}), 201)
        else:
            return make_response(jsonify({"error": "Missing form data"}), 404)


@app.route("/api/v1.0/books/<string:id>/reviews", methods=["GET"])
def fetch_all_reviews(id):
    if checkHex(str(id)) == False:
        return make_response(jsonify({"error": "Invalid book ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    else:
        data_to_return = []
        book = books.find_one(
            {"_id": ObjectId(id)},
            {"reviews": 1, "_id": 0})
        for review in book["reviews"]:
            review["_id"] = str(review["_id"])
            data_to_return.append(review)
        return make_response(jsonify(data_to_return), 200)


@app.route("/api/v1.0/books/<bid>/reviews/<rid>", methods=["GET"])
def fetch_one_review(bid, rid):
    if checkHex(str(bid)) == False:
        return make_response(jsonify({"error": "Invalid book ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    elif checkHex(str(rid)) == False:
        return make_response(jsonify({"error": "Invalid review. ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    else:
        book = books.find_one( \
            {"reviews._id": ObjectId(rid)}, \
            {"_id": 0, "reviews.$": 1})
        if book is None:
            return make_response(jsonify({"error": "Invalid book ID or review ID"}), 404)

        book['reviews'][0]['_id'] = str(book['reviews'][0]['_id'])

        return make_response(jsonify(book['reviews'][0]), 200)

# EXTRA FEATURE: Checking that all fields are filled out


@app.route("/api/v1.0/books/<bid>/reviews/<rid>", methods=["PUT"])
@jwt_required
def edit_review(bid, rid):
    if checkHex(str(bid)) == False:
        return make_response(jsonify({"error": "Invalid book ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    elif checkHex(str(rid)) == False:
        return make_response(jsonify({"error": "Invalid review. ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    elif "name" in request.form and "comment" in request.form and "stars" in request.form:
        edited_review = {
            "reviews.$.name": request.form["name"],
            "reviews.$.comment": request.form["comment"],
            "reviews.$.stars": request.form['stars']
        }
        books.update_one(
            {"reviews._id": ObjectId(rid)}, \
            {"$set": edited_review})
        edit_review_url = \
            "http://localhost:5000/api/v1.0/books/" + \
            bid + "/reviews/" + rid
        return make_response(jsonify({"url": edit_review_url}), 200)
    else:
        return make_response(jsonify({"error": "Missing form data"}), 404)


@app.route("/api/v1.0/books/<bid>/reviews/<rid>", methods=["DELETE"])
@jwt_required
# @review_owner_required_with_args(bid, rid)
# @admin_required
def delete_review(bid, rid):
    if checkHex(str(bid)) == False:
        return make_response(jsonify({"error": "Invalid book ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    elif checkHex(str(rid)) == False:
        return make_response(jsonify({"error": "Invalid review ID - book ID must be supplied as a 24-character hexadecimal string"}), 404)
    else:
        books.update_one(
            {"_id": ObjectId(bid)},
            {"$pull": {"reviews": \
                       {"_id": ObjectId(rid)}}})
        return make_response(jsonify({}), 204)


@app.route('/api/v1.0/login', methods=['GET'])
def login():
    auth = request.authorization

    if auth:
        user = users.find_one({"userName": auth.username})
        if user is not None:
            if bcrypt.checkpw(bytes(auth.password, "UTF-8"), user["password"]):
                token = jwt.encode(
                    {'user': auth.username, \
                        'admin': user["isAdmin"], \
                        'exp': datetime.datetime.utcnow() + \
                        datetime.timedelta(minutes=30) \
                     }, app.config['SECRET_KEY'])
                return make_response(jsonify({'token': token.decode('UTF-8')}), 200)
            else:
                return make_response(jsonify({"message": "Bad password"}), 401)
        else:
            return make_response(jsonify({"message": "Bad username"}), 401)

    return make_response(jsonify({"message": "Authentication required"}), 401)


@app.route('/api/v1.0/logout', methods=['GET'])
@jwt_required
def logout():
    token = request.headers["x-access-token"]
    blacklist.insert_one({"token": token})
    return make_response(jsonify({"message": "Logout successful"}), 200)


if __name__ == "__main__":
    app.run(debug=True)
