from django.db import models
from django.contrib.auth.models import User
import uuid

def get_upload_path(instance, filename):
    """Generate secure path for medical images"""
    import os
    import uuid
    
    # Get file extension
    ext = filename.split('.')[-1]
    # Generate unique filename
    new_filename = f"{uuid.uuid4().hex}.{ext}"
    # Create path: patient_scans/patient_id/filename
    return f"patient_scans/{instance.patient.id}/{new_filename}"

class PatientScan(models.Model):
    SCAN_TYPES = [
        ('xray', 'X-Ray'),
        ('mri', 'MRI'),
        ('ct', 'CT-Scan'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans')
    scan_type = models.CharField(max_length=10, choices=SCAN_TYPES)
    body_part = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    image = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    diagnosis = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.patient.username} - {self.scan_type}"

class Consultation(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    zoom_link = models.URLField(blank=True)
    status = models.CharField(max_length=20, default='scheduled')
    doctor_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.patient.username} - {self.scheduled_date}"

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('mpesa', 'M-Pesa'),
        ('airtel_money', 'Airtel Money'),
        ('tigo_pesa', 'Tigo Pesa'),
        ('card', 'Credit/Debit Card'),
        ('bank', 'Bank Transfer'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=100, unique=True, blank=True)
    checkout_request_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    purpose = models.CharField(max_length=200)
    reference = models.CharField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    payment_data = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.patient.username} - {self.amount} - {self.status}"


class ChatMessage(models.Model):
    room_name = models.CharField(max_length=100)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}: {self.message[:50]}"

class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=300, blank=True)
    featured_image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.CharField(max_length=50, blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text="Comma separated tags")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            import re
            self.slug = re.sub(r'[^\w\s-]', '', self.title).strip().lower()
            self.slug = re.sub(r'[-\s]+', '-', self.slug)
        super().save(*args, **kwargs)

class BlogComment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.author.username} - {self.post.title[:30]}"

class PatientReview(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient.username} - {self.rating} stars"


class ConsultationPayment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHODS = [
        ('mpesa', 'M-Pesa'),
        ('airtel_money', 'Airtel Money'),
        ('tigo_pesa', 'Tigo Pesa'),
        ('card', 'Credit/Debit Card'),
    ]
    
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, related_name='payment')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultation_payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=100, unique=True, blank=True)
    checkout_request_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    phone_number = models.CharField(max_length=15, blank=True)
    reference = models.CharField(max_length=100, unique=True)
    payment_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.patient.username} - {self.amount} - {self.status}"