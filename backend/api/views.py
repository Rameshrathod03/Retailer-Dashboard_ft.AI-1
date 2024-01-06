from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import firebase_admin
from firebase_admin import credentials, auth, db, firestore
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

class MarketingInsights(APIView):
    def post(self, request):
        return Response({'message': 'Marketing insights'})