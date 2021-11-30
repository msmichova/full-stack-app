import bcrypt

user = {
    "name" : "tracy",
    "password" : "secret"
}

print("USER: ", user)

modified_user = {
    "name" : user["name"],
    "password": bytes(user['password'], "UTF-8")
}

print("MOD USER: ", modified_user)


new_password = bcrypt.hashpw(modified_user["password"], bcrypt.gensalt())

print("NEW PASSWORD: ", new_password)

if bcrypt.checkpw(bytes("secret", "UTF-8"), new_password):
    print("test passed!")
else:
    print("test failed!")

# just a string pwd

another_user = {
    "name" : user["name"],
    "password": b"unicorn"
}

another_new_password = bcrypt.hashpw(another_user["password"], bcrypt.gensalt())

print("ANOTHER USER: ", another_user)

if bcrypt.checkpw(bytes("unicorn", "UTF-8"), another_new_password):
    print("test passed!")
else:
    print("test failed!")