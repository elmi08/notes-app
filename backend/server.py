from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from bson.json_util import dumps
from models import Note, User
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os, json
import jwt

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("Fast-Note-Database")
users = db['users']
notes_collection = db['notes']

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
            'created_on': datetime.now(timezone.utc)  
        }
        result = users.insert_one(new_user)
        new_user['_id'] = str(result.inserted_id)

        access_token = jwt.encode({
            'user': {
                'fullName': full_name,
                'email': email
            },
            'exp': datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(minutes=30) 
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
    
@app.route('/get-users', methods=['GET'])
def get_users():
    try:
        all_users = list(users.find({}))
        # Convert ObjectId to string for JSON serialization
        for user in all_users:
            user['_id'] = str(user['_id'])
        return jsonify({'error': False, 'users': all_users}), 200
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500


@app.route('/add-note', methods=['POST'])
def add_note():
    try:
        data = request.json
        title = data.get('title')
        content = data.get('content')
        tags = data.get('tags', [])
        user_id = data.get('user_id')
        isPinned = data.get('ispinned', False)

        if not title:
            return jsonify({'error': True, 'message': 'Title is required'}), 400
        if not content:
            return jsonify({'error': True, 'message': 'Content is required'}), 400

        note = {
            'title': title,
            'content': content,
            'tags': tags,
            'user_id': user_id,
            'created_on': datetime.utcnow(),
            'isPinned': isPinned
        }
        notes_collection.insert_one(note)
        return jsonify({'error': False, 'message': 'Note added successfully'}), 200
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/edit-note/<note_id>', methods=['PUT'])
def edit_note(note_id):
    try:
        data = request.json
        title = data.get('title')
        content = data.get('content')
        tags = data.get('tags', [])
        user_id = data.get('user_id')
        isPinned = data.get('ispinned', False)

        if not title and not content and not tags and not user_id and not isPinned:
            return jsonify({'error': True, 'message': 'No data provided for update'}), 400

        note = notes_collection.find_one({'_id': ObjectId(note_id)})
        if not note:
            return jsonify({'error': True, 'message': 'Note not found'}), 404

        updated_data = {}
        if title:
            updated_data['title'] = title
        if content:
            updated_data['content'] = content
        if tags:
            updated_data['tags'] = tags
        if user_id:
            updated_data['user_id'] = user_id
        if isPinned is not None:
            updated_data['isPinned'] = isPinned

        notes_collection.update_one({'_id': ObjectId(note_id)}, {'$set': updated_data})
        return jsonify({'error': False, 'message': 'Note updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500
    
@app.route('/get-notes', methods=['GET'])
def get_notes():
    try:
        all_notes = list(notes_collection.find({}))
        # Convert ObjectId to string for JSON serialization
        serialized_notes = dumps(all_notes)
        # Convert JSON string to Python dictionary
        notes_dict = json.loads(serialized_notes)
        return jsonify({'error': False, 'notes': notes_dict}), 200
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500
    
@app.route('/delete-note/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        note = notes_collection.find_one({'_id': ObjectId(note_id)})
        if not note:
            return jsonify({'error': True, 'message': 'Note not found'}), 404

        result = notes_collection.delete_one({'_id': ObjectId(note_id)})
        
        if result.deleted_count == 1:
            return jsonify({'error': False, 'message': 'Note deleted successfully'}), 200
        else:
            return jsonify({'error': True, 'message': 'Failed to delete note'}), 500
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500
    
@app.route('/update-note-pinned/<note_id>', methods=['PUT'])
def update_pinned(note_id):
    try:
        data = request.json
        is_pinned = data.get('isPinned')

        note = notes_collection.find_one({'_id': ObjectId(note_id)})
        if not note:
            return jsonify({'error': True, 'message': 'Note not found'}), 404

        result = notes_collection.update_one(
            {'_id': ObjectId(note_id)},
            {'$set': {'isPinned': is_pinned}}
        )

        if result.modified_count == 1:
            return jsonify({'error': False, 'message': 'isPinned value updated successfully'}), 200
        else:
            return jsonify({'error': True, 'message': 'Failed to update isPinned value'}), 500
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500
    
if __name__ == "__main__": 
    app.run(debug=True, port=8000)
