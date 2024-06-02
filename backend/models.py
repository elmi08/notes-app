from mongoengine import Document, StringField, DateTimeField, BooleanField, ListField
import datetime

class User(Document):
    fullName = StringField(required=True)
    email = StringField(required=True)
    password = StringField(required=True)
    created_on = DateTimeField(default=datetime.datetime.now)

class Note(Document):
    title = StringField(required=True)
    content = StringField(required=True)
    tags = ListField(StringField(), default=[])
    isPinned = BooleanField(default=False)
    userId = StringField(required=True)
    created_on = DateTimeField(default=datetime.datetime.now)
