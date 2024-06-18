from flask import Flask, jsonify, request, g
from bson.errors import InvalidId
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from bson.json_util import dumps
from utilities import authenticate_token
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os
import jwt, logging

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("Fast-Note-Database")
users = db['users']
notes_collection = db['notes']

app.config['SECRET_KEY'] = os.getenv('ACCESS_TOKEN_SECRET')

logging.basicConfig(level=logging.INFO)

@app.before_request
def authenticate_request():
    g.user = authenticate_token(request)

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

        # Generate access token with user ID included in payload
        access_token = jwt.encode({
            'user': {
                'id': str(result.inserted_id),  # Include user ID in token payload
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
            # Generate access token with user ID included in payload
            access_token = jwt.encode({
                'user': {
                    'id': str(user['_id']),  # Include user ID in token payload
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
    
@app.route('/get-user', methods=['GET'])
def get_user():
    try:
        decoded_token, user_id = authenticate_token(request)
        if not user_id:
            return jsonify({'error': True, 'message': 'User ID not found in token'}), 401

        user_id = decoded_token.get('user', {}).get('id')
        if not user_id:
            return jsonify({'error': True, 'message': 'User ID not found in token'}), 400

        user = users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': True, 'message': 'User not found'}), 404

        user_data = {
            'id': str(user['_id']),
            'fullName': user.get('fullName'),
            'email': user.get('email'),
        }

        return jsonify({'error': False, 'user': user_data}), 200

    except Exception as e:
        logging.error(f'Error retrieving user: {e}')
        return jsonify({'error': True, 'message': 'Internal server error'}), 500

@app.route('/add-note', methods=['POST'])
def add_note():
    try:
        decoded_token, user_id = authenticate_token(request)
        if not user_id:
            return jsonify({'error': True, 'message': 'User ID not found in token'}), 401

        # Get the note data from the request JSON
        data = request.json
        title = data.get('title')
        content = data.get('content')
        tags = data.get('tags', [])
        isPinned = data.get('isPinned', False)

        if not title:
            return jsonify({'error': True, 'message': 'Title is required'}), 400
        if not content:
            return jsonify({'error': True, 'message': 'Content is required'}), 400

        # Create the note with the associated user ID
        note = {
            'title': title,
            'content': content,
            'tags': tags,
            'user_id': user_id,  # Associate the user ID with the note
            'created_on': datetime.utcnow(),
            'isPinned': isPinned
        }

        # Insert the note into the database
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
    
@app.route('/get-notes', methods=['GET'])
def get_notes():
    try:
        decoded_token, user_id = authenticate_token(request)
        if not user_id:
            return jsonify({'error': True, 'message': 'User ID not found in token'}), 401

        user_notes = list(notes_collection.find({'user_id': user_id}))

        for note in user_notes:
            note['_id'] = str(note['_id'])
            note['user_id'] = str(note['user_id'])

        return jsonify({'error': False, 'notes': user_notes}), 200

    except Exception as e:
        logging.error(f'Error retrieving notes: {e}')
        return jsonify({'error': True, 'message': 'Internal server error'}), 500

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

@app.route('/search-notes', methods=['GET'])
def search_notes():
    try:
        decoded_token, user_id = authenticate_token(request)
        if not user_id:
            return jsonify({'error': True, 'message': 'User ID not found in token'}), 401

        if isinstance(decoded_token, str):
            # If the decoded token is a string, it's likely an error message
            return jsonify({'error': True, 'message': decoded_token}), 401

        user_id = decoded_token.get('user', {}).get('id')
        if not user_id:
            return jsonify({'error': True, 'message': 'User ID not found in token'}), 401

        query = request.args.get('query')  # Get the search query from query parameters

        if not query:
            return jsonify({'error': True, 'message': 'Search query is required'}), 400

        # Perform a case-insensitive search on title and content fields
        matching_notes = list(notes_collection.find({
            'user_id': user_id,  # Filter notes by user ID
            '$or': [
                {'title': {'$regex': query, '$options': 'i'}},
                {'content': {'$regex': query, '$options': 'i'}}
            ]
        }))

        for note in matching_notes:
            note['_id'] = str(note['_id'])
            note['user_id'] = str(note['user_id'])

        return jsonify({
            'error': False,
            'notes': matching_notes,
            'message': 'Notes matching the search query retrieved successfully'
        }), 200

    except Exception as e:
        logging.error(f'Error searching notes: {e}')
        return jsonify({'error': True, 'message': 'Internal server error'}), 500

if __name__ == "__main__": 
    app.run(host='0.0.0.0', port=8000)