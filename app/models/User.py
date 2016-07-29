from system.core.model import Model
import re
from flask.ext.bcrypt import Bcrypt

from system.core.model import Model

bcrypt = Bcrypt()

class User(Model):
    def __init__(self):
        super(User, self).__init__()
    
    def register_user(self, user):
        print user
        if 'art' in user:
            print 'art'
        EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9\.\+_-]+@[a-zA-Z0-9\._-]+\.[a-zA-Z]*$')
        errors = []
        print '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
        if not user['name']:
            errors.append('Name cannot be blank')
        if len(user['name']) < 2:
            errors.append("Name must be at least 2 characters long")
        if not user['name'].isalpha():
            errors.append("Name must only contain letters")
        if not user['email']:
            errors.append('Email cannot be blank')
        if not EMAIL_REGEX.match(user['email']):
            errors.append("Invalid Email Address!")
        if not user['password']:
            errors.append('Password cannot be blank')
        if len(user['password']) < 8:
            errors.append("Password must be at least 8 characters.")
        if user['password'] != user['confirm_pw']:
            errors.append("Password and confirmation do not match.")    
        if errors:
            return {"status": False, "errors": errors}
        else:
            password = user['password']
            hashed_pw = self.bcrypt.generate_password_hash(password)
            query = "INSERT INTO users (name, email, password, created_at, updated_at) VALUES (:name, :email, :password, NOW(), NOW())"
            data = {
                'name': user['name'],
                'email': user['email'],
                'password': hashed_pw
            }
            
            self.db.query_db(query, data)
    
            query2 = "SELECT * FROM users ORDER BY id DESC LIMIT 1"
            a_user = self.db.query_db(query2)
            user_id = int(a_user[0]['id'])

            
            if 'art' in user:
                print 'three'
                query3 = "INSERT INTO preferences (category_id, user_id) VALUES (105, :user_id)"
                data3 = {'user_id': user_id}
                self.db.query_db(query3, data3)
                print '3'
            if 'food' in user:
                query4 = "INSERT INTO preferences (category_id, user_id) VALUES (110, :user_id)"
                data4 = {'user_id': user_id}
                self.db.query_db(query4, data4)
                print '4'
            if 'film' in user:
                query5 = "INSERT INTO preferences (category_id, user_id) VALUES (104, :user_id)"
                data5 = {'user_id': user_id}
                self.db.query_db(query5, data5)
                print '5'
            if 'music' in user:
                query6 = "INSERT INTO preferences (category_id, user_id) VALUES (103, :user_id)"
                data6 = {'user_id': user_id}
                self.db.query_db(query6, data6)
                print '6'
            if 'science' in user:
                query7 = "INSERT INTO preferences (category_id, user_id) VALUES (102, :user_id)"
                data7 = {'user_id': user_id}
                self.db.query_db(query3, data3)
                print '7'
            if 'sports' in user:
                query8 = "INSERT INTO preferences (category_id, user_id) VALUES (109, :user_id)"
                data8 = {'user_id': user_id}
                self.db.query_db(query8, data8)
                print '8'
            if 'travel' in user:
                query3 = "INSERT INTO preferences (category_id, user_id) VALUES (108, :user_id)"
                data3 = {'user_id': user_id}
                self.db.query_db(query9, data9)
                print '9'
            return {"status": True, 'user':user_id }



    def login_validation(self, user):
        password = user['password']
        query = "SELECT * FROM users WHERE email = :temp_email"
        data = {'temp_email': user['email']}
        user = self.db.query_db(query, data)
        if not user:
            return False
        else:
            if self.bcrypt.check_password_hash(user[0]['password'], password):
                return user
            else:
                return False