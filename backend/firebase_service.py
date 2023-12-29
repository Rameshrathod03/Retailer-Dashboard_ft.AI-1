# firebase_service.py
import firebase_admin
from firebase_admin import credentials, firestore

def get_firebase_db():
    if not firebase_admin._apps:
        cred = credentials.Certificate('./firebase_config.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()
