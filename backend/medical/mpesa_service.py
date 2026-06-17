import requests
import base64
import json
from datetime import datetime
import random
from django.conf import settings

class MpesaService:
    """Real M-Pesa API Integration for Tanzania"""
    
    def __init__(self):
        # M-Pesa API Credentials
        self.consumer_key = "YOUR_CONSUMER_KEY"  # Get from Vodacom/Tigo/Airtel
        self.consumer_secret = "YOUR_CONSUMER_SECRET"
        self.shortcode = "174379"  # Business shortcode
        self.passkey = "YOUR_PASSKEY"  # From M-Pesa portal
        self.callback_url = "https://yourdomain.com/api/payment/callback/"
        
        # Environment: sandbox or production
        self.base_url = "https://sandbox.safaricom.co.ke"  # For testing
        # self.base_url = "https://api.safaricom.co.ke"  # For production
    
    def get_access_token(self):
        """Generate OAuth access token"""
        try:
            auth_string = base64.b64encode(
                f"{self.consumer_key}:{self.consumer_secret}".encode()
            ).decode()
            
            headers = {
                "Authorization": f"Basic {auth_string}"
            }
            
            response = requests.get(
                f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json().get('access_token')
            return None
        except Exception as e:
            print(f"Token error: {e}")
            return None
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc="Payment"):
        """
        Initiate STK Push payment
        phone_number: Format 2547XXXXXXXX (without +)
        amount: Amount in TZS
        """
        try:
            # Format phone number
            phone = str(phone_number).replace('+', '').replace(' ', '')
            if phone.startswith('0'):
                phone = '254' + phone[1:]
            
            # Generate password
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password_str = f"{self.shortcode}{self.passkey}{timestamp}"
            password = base64.b64encode(password_str.encode()).decode()
            
            access_token = self.get_access_token()
            if not access_token:
                return {'success': False, 'error': 'Failed to get access token'}
            
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "BusinessShortCode": self.shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": str(amount),
                "PartyA": phone,
                "PartyB": self.shortcode,
                "PhoneNumber": phone,
                "CallBackURL": self.callback_url,
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc
            }
            
            response = requests.post(
                f"{self.base_url}/mpesa/stkpush/v1/processrequest",
                json=payload,
                headers=headers
            )
            
            result = response.json()
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'checkout_request_id': result.get('CheckoutRequestID'),
                    'message': 'Payment initiated. Check your phone for M-Pesa prompt.',
                    'response_code': result.get('ResponseCode')
                }
            else:
                return {
                    'success': False,
                    'error': result.get('errorMessage', 'Payment failed'),
                    'response_code': result.get('ResponseCode')
                }
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def check_payment_status(self, checkout_request_id):
        """Check payment status"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password_str = f"{self.shortcode}{self.passkey}{timestamp}"
            password = base64.b64encode(password_str.encode()).decode()
            
            access_token = self.get_access_token()
            if not access_token:
                return {'success': False, 'error': 'Failed to get access token'}
            
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "BusinessShortCode": self.shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "CheckoutRequestID": checkout_request_id
            }
            
            response = requests.post(
                f"{self.base_url}/mpesa/stkpushquery/v1/query",
                json=payload,
                headers=headers
            )
            
            result = response.json()
            
            if result.get('ResponseCode') == '0':
                return {
                    'success': True,
                    'status': 'completed',
                    'message': result.get('ResultDesc', 'Payment completed')
                }
            else:
                return {
                    'success': False,
                    'status': 'pending',
                    'message': result.get('ResultDesc', 'Payment pending')
                }
                
        except Exception as e:
            return {'success': False, 'error': str(e)}