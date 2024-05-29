from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os, json
from bson import json_util
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("Fast-Note-Database")
users = db['users']

# Secret key for JWT
app.config['SECRET_KEY'] = os.getenv('ACCESS_TOKEN_SECRET')



@app.route("/")
def hello():
    return jsonify({"data": "hello"})

@app.route('/create-account', methods=['POST'])
def create_account():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': True, 'message': 'Invalid JSON format'}), 400

        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')

        if not full_name:
            return jsonify({'error': True, 'message': 'Full Name is required'}), 400
        if not email:
            return jsonify({'error': True, 'message': 'Email is required'}), 400
        if not password:
            return jsonify({'error': True, 'message': 'Password is required'}), 400

        is_user = users.find_one({'email': email})
        if is_user:
            return jsonify({'error': True, 'message': 'User already exists'}), 400

        hashed_password = generate_password_hash(password)
        new_user = {
            'fullName': full_name,
            'email': email,
            'password': hashed_password,
            'created_on': datetime.now(timezone.utc)  # Use timezone-aware datetime
        }
        result = users.insert_one(new_user)
        new_user['_id'] = str(result.inserted_id)

        access_token = jwt.encode({
            'user': {
                'fullName': full_name,
                'email': email
            },
            'exp': datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(minutes=30)  # Ensure timezone-aware
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'error': False,
            'user': new_user,
            'accessToken': access_token,
            'message': 'Registration Successful'
        }), 201

    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': True, 'message': 'Invalid JSON format'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email:
            return jsonify({'error': True, 'message': 'Email is required'}), 400
        if not password:
            return jsonify({'error': True, 'message': 'Password is required'}), 400

        user = users.find_one({'email': email})
        if not user:
            return jsonify({'error': True, 'message': 'User not found'}), 404

        if check_password_hash(user['password'], password):
            access_token = jwt.encode({
                'user': {
                    'fullName': user['fullName'],
                    'email': email
                },
                'exp': datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(minutes=30)
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({
                'error': False,
                'message': 'Login Successful',
                'email': email,
                'accessToken': access_token
            }), 200
        else:
            return jsonify({'error': True, 'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500

if __name__ == "__main__": 
    app.run(debug=True, port=8000)
