from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from pymongo import MongoClient
import os
import jwt

app = Flask(__name__)
CORS(app)

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET', 'your_secret_key')

def authenticate_token(f):    
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        token = auth_header.split(" ")[1] if auth_header else None
        
        if not token:
            return make_response('', 401)

        try:
            user = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
            request.user = user
        except jwt.ExpiredSignatureError:
            return make_response('', 401)
        except jwt.InvalidTokenError:
            return make_response('', 401)

        return f(*args, **kwargs)
    return decorated_function

@app.route('/protected', methods=['GET'])
@authenticate_token
def protected_route():
    response = jsonify({'message': 'This is a protected route.', 'user': request.user})
    response.headers.add('Access-Control-Allow-Origin', '*')  # Set CORS headers
    return response

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_database('Fast-Note-Database') 

if __name__ == "__main__":  # Corrected the __name__ check
    app.run(debug=True, port=8000)
