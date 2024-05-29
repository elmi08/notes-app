from mongoengine import Document, StringField, DateTimeField
import datetime

class Schema(Document):
    fullName = StringField(required=True)
    email = StringField(required=True)
    password = StringField(required=True)
    created_on = DateTimeField(default=datetime.datetime.now)

User = Schema
