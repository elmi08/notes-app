import os
import jwt, logging

def authenticate_token(req):
    if req is None:
        return None, None
    
    auth_header = req.headers.get("Authorization")
    if not auth_header:
        return None, None

    token = auth_header.split(" ")[1]
    if not token:
        return None, None

    try:
        decoded_token = jwt.decode(token, os.getenv("ACCESS_TOKEN_SECRET"), algorithms=["HS256"])
        user = decoded_token.get('user')
        if user:
            user_id = user.get('id')
            return decoded_token, user_id
        else:
            return None, None
    except jwt.ExpiredSignatureError:
        # Log the error for debugging
        logging.error("JWT token has expired.")
        return None, None
    except jwt.InvalidTokenError:
        # Log the error for debugging
        logging.error("Invalid JWT token.")
        return None, None


