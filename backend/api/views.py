from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import firebase_admin
from firebase_admin import credentials, auth, db, firestore, storage
import os
import openai
from openai import OpenAI
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers
from .decorators import vary_on_get_param
from django.http import JsonResponse
import json
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from firebase_admin import auth
import random

# openai.api_key = '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'
client = OpenAI()

cred = credentials.Certificate(os.path.join(settings.BASE_DIR, 'api/firebase.json'))
firebase_admin.initialize_app(cred)

class AccessTokenView(APIView):
    def post(self, request):
        access_token = request.data.get('accessToken')

        try:
            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(access_token)
            uid = decoded_token['uid']

            # Proceed with the verified UID
            # ... (additional logic here)

            return Response({'message': 'Access token verified', 'uid': uid})
        except ValueError:
            # Token was invalid
            return Response({'error': 'Invalid token'}, status=400)
        except auth.InvalidIdTokenError:
            # Token was invalid
            return Response({'error': 'Invalid token'}, status=400)
        except auth.ExpiredIdTokenError:
            # Token was expired
            return Response({'error': 'Token expired'}, status=400)
        except Exception as e:
            # Some other error
            return Response({'error': str(e)}, status=500)

class CustomerProfile(APIView):
    @method_decorator(cache_page(60 * 5))
    @method_decorator(vary_on_get_param("purchasedata"))
    def get(self, request):
        access_token = request.query_params.get('accessToken')
        uid = request.query_params.get('uid')
        phone = request.query_params.get('phone')
        purchasedata = request.query_params.get('purchasedata')

        try:
            # Verify Firebase ID token
            decoded_token = auth.verify_id_token(access_token)
            if decoded_token['uid'] != uid:
                return Response({'error': 'UID mismatch'}, status=400)

            # Access Firestore
            db = firestore.client()

            # Query Firestore for customer data
            customers_ref = db.collection(f'Retailers/{uid}/customers')
            customer_doc = None
            query_snapshot = customers_ref.stream()
            for doc in query_snapshot:
                customer_data = doc.to_dict()
                if customer_data.get('phone') == phone:
                    customer_doc = doc
                    break

            if not customer_doc:
                return Response({'error': 'Customer not found'}, status=404)

            # Get purchases subcollection
            purchases = []
            purchases_ref = customer_doc.reference.collection('purchases')
            for purchase_doc in purchases_ref.stream():
                purchases.append(purchase_doc.to_dict())

            # Combine customer data and purchases
            customer_profile = {
                'customer_info': customer_doc.to_dict(),
                'purchases': purchases
            }

            prompt = (
                f"Analyze the provided customer profile data {customer_profile} and transaction history. "
                "Based on the following aspects: 1. Consistency in Category Preference, "
                "2. Seasonal Purchasing Trends, 3. Volume and Frequency Correlation, "
                "4. Loyalty Indicators, 5. Price Sensitivity Analysis, 6. Cross-Selling Opportunities, "
                "7. Predictive Purchase Modeling, identify the four most significant insights. "
                "Present the insights in an array format, with each insight as a concise, direct statement. "
                "Choose 4 significant and unique ones among all the generated insights."
                "This is the data of the person buing the mentioned goods near a retailer in india and generate the insights for the same."
                "For example, format the response strictly like: ['The customer has purchased 5 items from the XYZ category in the last 3 months', '...']. "
                "Ensure the insights are unique and directly correlated to the patterns evident in the data, including predictive insights where applicable."
            )

            print(prompt)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": prompt}]
            )

            content_raw = response.choices[0].message.content

            print("Raw: " + content_raw)

            # Remove newline characters and other unnecessary formatting
            content_clean = content_raw.replace('\n', '').replace('\r', '')

            print("Clean: " + content_clean)

            # Return the cleaned and parsed content
            return JsonResponse({"content": content_clean})

        except auth.InvalidIdTokenError:
            return Response({'error': 'Invalid access token'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class GenerateContent(APIView):
    def get(self, request):
        access_token = request.query_params.get('accessToken')
        uid = request.query_params.get('uid')
        phone = request.query_params.get('phone')

        try:
            # Verify Firebase ID token
            decoded_token = auth.verify_id_token(access_token)
            if decoded_token['uid'] != uid:
                return Response({'error': 'UID mismatch'}, status=400)

            # Access Firestore
            db = firestore.client()

            # Query Firestore for customer data
            customers_ref = db.collection(f'Retailers/{uid}/customers')
            customer_doc = None
            query_snapshot = customers_ref.stream()
            for doc in query_snapshot:
                customer_data = doc.to_dict()
                if customer_data.get('phone') == phone:
                    customer_doc = doc
                    break

            if not customer_doc:
                return Response({'error': 'Customer not found'}, status=404)

            # Get purchases subcollection
            purchases = []
            purchases_ref = customer_doc.reference.collection('purchases')
            for purchase_doc in purchases_ref.stream():
                purchases.append(purchase_doc.to_dict())

            # Combine customer data and purchases
            customer_profile = {
                'customer_info': customer_doc.to_dict(),
                'purchases': purchases
            }

            prompt = (
                f"Analyze the provided customer profile data {customer_profile} and transaction history. "
                "Marketing Messages:"
                "Your Favorites Are Back in Stock! (Send on restock, project date based on purchase frequency)"
                "Early Bird Gets the Deal! (Send one month before the projected seasonal peak purchase date)"
                "Volume Discounts Just for You (Send during projected high-volume purchase periods)"
                "Tech Trends Update (Send when new tech products launch, based on past tech purchase dates)"
                "A Token of Our Appreciation (Send on the anniversary of the first recorded purchase)"
                "Just for You: Exclusive Preview (Send a few days before projected major sales events)"
                "Discover More in Your World (Send when cross-selling potential is identified, project date based on related category purchases)"
                "It's Time for Your Next Favorite (Send based on predictive modeling of next purchase date)"
                "This is the data of the person buing the mentioned goods near a retailer in india and generate the insights for the same."
                "Generate a marketing message for the customer based on the provided data. Keep it attractive."
                "Just give me the message which can be directly sent to the customer. Build the message based omn his/her recent purchases and trends. Keep it appealing by going specific. Keep it short within 3 to 4 lines and simple. Dont use any placeholders and varibles as this output will be directly sent to the customer. Include any emojies if you want."
            )

            print(prompt)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": prompt}]
            )

            content_raw = response.choices[0].message.content

            print("Raw: " + content_raw)

            # Remove newline characters and other unnecessary formatting
            content_clean = content_raw.replace('\n', '').replace('\r', '')

            print("Clean: " + content_clean)

            marketing_ref = db.collection(f'Retailers/{uid}/marketing').document(phone)

            # Try to fetch the existing marketing data
            try:
                marketing_doc = marketing_ref.get()
                if marketing_doc.exists:
                    marketing_data = marketing_doc.to_dict().get('Marketing', {})
                else:
                    marketing_data = {}
            except Exception as e:
                print(f"Error fetching marketing data: {e}")
                return False

            # Calculate the next key based on the length of the existing data
            next_key = str(len(marketing_data))

            # Create the new marketing entry
            new_entry = {
                'Content': content_clean,
                'Status': False,
                'id': random.randint(1, 100000000)
            }

            # Update the marketing data with the new entry
            marketing_data[next_key] = new_entry

            # Update the Firestore document
            try:
                marketing_ref.update({'Marketing': marketing_data})
                return True
            except Exception as e:
                print(f"Error updating marketing data: {e}")
                return False

        except auth.InvalidIdTokenError:
            return Response({'error': 'Invalid access token'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class MarketAnalysis(APIView):
    @method_decorator(cache_page(60 * 5))
    @method_decorator(vary_on_get_param("uid"))
    def get(self, request):
        access_token = request.query_params.get('accessToken')
        uid = request.query_params.get('uid')
        
        try:
            # Verify Firebase ID token
            decoded_token = auth.verify_id_token(access_token)
            if decoded_token['uid'] != uid:
                return Response({'error': 'UID mismatch'}, status=400)

            # Access Firestore
            db = firestore.client()

            retailer_ref = db.collection('Retailers').document(uid)
            retailer_doc = retailer_ref.get()
            if retailer_doc.exists:
                retailer_data = retailer_doc.to_dict()
                profile_info = retailer_data.get('profileInfo', {})

            # Query Firestore for customers data under a specific retailer
            customers_ref = db.collection(f'Retailers/{uid}/customers')
            query_snapshot = customers_ref.stream()

            all_customers_data = []

            for doc in query_snapshot:
                customer_data = doc.to_dict()
                customer_id = doc.id

                # Get purchases subcollection for each customer
                purchases = []
                purchases_ref = doc.reference.collection('purchases')
                for purchase_doc in purchases_ref.stream():
                    purchases.append(purchase_doc.to_dict())

                # Combine customer data and purchases
                customer_profile = {
                    'customer_info': customer_data,
                    'purchases': purchases
                }
                all_customers_data.append(customer_profile)

            items_ref = db.collection(f'Retailers/{uid}/items')
            items_data = [doc.to_dict() for doc in items_ref.stream()]

            categories_ref = db.collection(f'Retailers/{uid}/categories')
            categories_data = [doc.to_dict() for doc in categories_ref.stream()]

            user_retailer_info = {
                'retailer_info': profile_info,
                'customer_data': all_customers_data,
                'items_data': items_data,
                'categories_data':categories_data,
            }

            # Get all retailers
            retailers_ref = db.collection('Retailers')
            retailers = [retailer.to_dict() for retailer in retailers_ref.stream()]

            all_retailers_data = []

            for retailer in retailers:
                uid = retailer.get('uid')  # Assuming each retailer has a unique 'uid'

                # Get retailer profile info
                retailer_ref = db.collection('Retailers').document(uid)
                retailer_doc = retailer_ref.get()
                profile_info = retailer_doc.to_dict().get('profileInfo', {}) if retailer_doc.exists else {}

                # Get customers data for the retailer
                customers_ref = db.collection(f'Retailers/{uid}/customers')
                customers_data = [doc.to_dict() for doc in customers_ref.stream()]

                # Get items data for the retailer
                items_ref = db.collection(f'Retailers/{uid}/items')
                items_data = [doc.to_dict() for doc in items_ref.stream()]

                # Get categories data for the retailer
                categories_ref = db.collection(f'Retailers/{uid}/categories')
                categories_data = [doc.to_dict() for doc in categories_ref.stream()]

                # Combine all data
                retailer_info = {
                    'retailer_info': profile_info,
                    'customer_data': customers_data,
                    'items_data': items_data,
                    'categories_data': categories_data,
                }

                all_retailers_data.append(retailer_info)

            prompt = (
                f"Retailer Data: {user_retailer_info} this is the details of the retailer and the customers and the items and the categories. It also includes the sales. Now analyse this data and give me the trends in the sales, analysis on categories. All Retailers Data: {all_retailers_data} this is the details of all the retailers and the customers and the items and the categories. all retailers data contains data of the all retailers in a specified region."
                "The output given by you will strictly be point wise. Dont use itemid use only id name"
                "All the three sections mentioned below are required in the output. and they should be clearly mentioned"
                "First part of the output will be the trends the user sees in the sales of the items and the categories of his stock"
                "Example of it will be, the item_name is trending with over 50% sales in the last 3 months, the category is the most revenue generating category in the last 3 months. "
                "Second part of the output will be the things he lack and the things he can improve in his business on basis of the other retailers data."
                "Exmple of it will be, the item_name is doing good with ther retailers, you can try to stock it. the item_name is popular in the region, decrease the price of the item_name to increase the sales from your shop."
                "Third part of the output will be the the restock recommendations based on all the retailers data."
                "Example of it will be the item_name is trending in the region, you can try to stock it. the item_name is popular in the region, increase the items in category_name to attreact more customers, the item_name is not selling decrease it in your next restock and some thing like these lines"
                "Stricltly dont reveal any exact number of data, as it can be confidential. You can use percentages and all to analyse them"
                "Give ouput point wise and keep it short and simple."
            )

            print(prompt)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": prompt}]
            )

            return Response({'data':response.choices[0].message.content })

        except auth.InvalidIdTokenError:
            return Response({'error': 'Invalid access token'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class Marketing(APIView):
    def send_marketing_email(self, email, content):
        try:
            send_mail(
                subject='Exciting News Just For You!',
                message=content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    def post(self, request):
        # Extract the data from request body
        data = request.data
        phone_number = data.get('phoneNumber')
        marketing_id = data.get('id')
        uid = data.get('uid')  # Assuming uid is sent in the request
        email = data.get('email')
        token = data.get('accessToken')

        if not all([phone_number, marketing_id, uid]):
            return Response({"error": "Missing data in request"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the ID token and extract the UID
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Fetch the specific document from Firestore
            firestore_db = firestore.client()

            # Fetch the specific document from Firestore
            doc_ref = firestore_db.collection(f'Retailers/{uid}/marketing').document(phone_number)
            doc = doc_ref.get()
            if doc.exists:
                marketing_map = doc.to_dict().get('Marketing', {})

                # Iterate through the marketing entries
                for key, marketing_entry in marketing_map.items():
                    # Check if the status is False
                    if not marketing_entry.get('Status', True):
                        content = marketing_entry.get('Content', '')
                        item_id = marketing_entry.get('id', None)
                        
                        # Logic for sending email or processing the marketing item
                        if email and content:
                            if self.send_marketing_email(email, content):
                                # Update the status of the marketing entry in Firestore
                                marketing_map[key]['Status'] = True
                                doc_ref.update({'Marketing': marketing_map})

                                return Response({'message': 'Marketing email sent successfully'})
                            else:
                                return Response({'error': 'Failed to send marketing email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                        else:
                            return Response({'error': 'Invalid marketing data'}, status=status.HTTP_400_BAD_REQUEST)

                # If no marketing entry with False status is found
                return Response({'error': 'No pending marketing item found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        