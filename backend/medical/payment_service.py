import requests
import json
import random
from datetime import datetime

class MpesaPaymentService:
    """M-Pesa payment integration for Tanzania"""
    
    def __init__(self):
        # M-Pesa API credentials (get from Vodacom/Tigo/Airtel)
        self.consumer_key = "YOUR_CONSUMER_KEY"
        self.consumer_secret = "YOUR_CONSUMER_SECRET"
        self.passkey = "YOUR_PASSKEY"
        self.shortcode = "174379"
        self.callback_url = "https://yourdomain.com/api/payment/callback/"
        
    def generate_access_token(self):
        """Generate OAuth access token for M-Pesa API"""
        # In production, implement actual M-Pesa API call
        return "mock_access_token_" + str(random.randint(1000, 9999))
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """
        Initiate M-Pesa STK Push payment
        Phone number format: 2547XXXXXXXX (without +)
        """
        # Format phone number (remove leading 0 or +)
        phone_number = str(phone_number).replace('+', '').replace(' ', '')
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        
        # Generate business short code
        business_shortcode = self.shortcode
        
        # Generate password
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = self.passkey + timestamp
        
        # Mock payment request for demo
        checkout_request_id = f"ws_CO_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
        
        # In production, make actual API call:
        """
        payload = {
            "BusinessShortCode": business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": business_shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        
        headers = {
            "Authorization": f"Bearer {self.generate_access_token()}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers
        )
        return response.json()
        """
        
        # Demo response
        return {
            'success': True,
            'checkout_request_id': checkout_request_id,
            'message': 'Payment initiated. Check your phone for M-Pesa prompt.',
            'demo_mode': True
        }
    
    def check_payment_status(self, checkout_request_id):
        """Check status of M-Pesa payment"""
        # In production, implement actual API call
        return {
            'status': 'completed',
            'result_code': 0,
            'result_desc': 'Payment successful'
        }

class PaymentProcessor:
    """Handle all payment methods"""
    
    PAYMENT_METHODS = {
        'mpesa': 'M-Pesa (Tanzania)',
        'airtel_money': 'Airtel Money',
        'tigo_pesa': 'Tigo Pesa',
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer'
    }
    
    CONSULTATION_FEE = 50000  # TZS 50,000
    FOLLOWUP_FEE = 30000      # TZS 30,000
    SCAN_REVIEW_FEE = 25000    # TZS 25,000
    
    def __init__(self):
        self.mpesa = MpesaPaymentService()
    
    def process_payment(self, payment_method, phone_number, amount, reference):
        """Process payment based on selected method"""
        if payment_method == 'mpesa':
            return self.mpesa.stk_push(phone_number, amount, reference, "Dr. Jimmy Consultation")
        elif payment_method == 'airtel_money':
            return {'success': True, 'message': 'Airtel Money payment coming soon'}
        elif payment_method == 'tigo_pesa':
            return {'success': True, 'message': 'Tigo Pesa payment coming soon'}
        else:
            return {'success': False, 'error': 'Payment method not available'}
    
    def get_payment_link(self, amount, purpose):
        """Generate payment link for card/bank transfer"""
        # Generate unique payment reference
        reference = f"DRJIMMY_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(100, 999)}"
        
        # Mock payment link
        payment_link = f"https://pay.drjimmy.com/pay/{reference}"
        
        return {
            'reference': reference,
            'amount': amount,
            'purpose': purpose,
            'payment_link': payment_link,
            'instructions': """
            💳 **Payment Instructions:**
            1. Click the payment link above
            2. Enter your card details or select bank transfer
            3. Complete the payment
            4. You will receive confirmation via email
            """
        }