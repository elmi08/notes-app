import jwt
import os
from flask import request

def authenticate_token(req):
    auth_header = req.headers.get("Authorization")
    if not auth_header:
        return None

    token = auth_header.split(" ")[1]
    if not token:
        return None

    try:
        decoded_token = jwt.decode(token, os.getenv("ACCESS_TOKEN_SECRET"))
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

