# myapp/tasks.py
from celery import shared_task
from django.utils import timezone
from firebase_admin import credentials, auth, db, firestore
import os
import openai
from openai import OpenAI

client = OpenAI()

cred = credentials.Certificate(os.path.join(settings.BASE_DIR, 'api/firebase.json'))
firebase_admin.initialize_app(cred)

@shared_task
def create_marketing_messages():
    # Example content
    content = "Your daily inspirational message!"

    # Creating a new Marketing object
    new_message = Marketing(
        content=content, 
        status=False, 
        scheduled_time=timezone.now() + timezone.timedelta(days=1)  # Schedule for the next day
    )
    new_message.save()

    return f"Created new marketing message with ID: {new_message.id}"
