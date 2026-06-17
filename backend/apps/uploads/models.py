import os
import uuid
from django.db import models
from django.utils import timezone
from apps.users.models import User

def get_upload_path(instance, filename):
    """Generate secure path for medical images"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return f"medical_scans/{instance.patient.user.id}/{instance.scan_type}/{timezone.now().date()}/{filename}"

class MedicalScan(models.Model):
    SCAN_TYPES = (
        ('xray', 'X-Ray'),
        ('mri', 'MRI'),
        ('ct', 'CT-Scan'),
        ('ultrasound', 'Ultrasound'),
        ('other', 'Other'),
    )
    
    BODY_PARTS = (
        ('spine_cervical', 'Cervical Spine'),
        ('spine_thoracic', 'Thoracic Spine'),
        ('spine_lumbar', 'Lumbar Spine'),
        ('spine_sacral', 'Sacral Spine'),
        ('knee', 'Knee'),
        ('hip', 'Hip'),
        ('shoulder', 'Shoulder'),
        ('elbow', 'Elbow'),
        ('wrist', 'Wrist'),
        ('ankle', 'Ankle'),
        ('foot', 'Foot'),
        ('hand', 'Hand'),
        ('pelvis', 'Pelvis'),
        ('skull', 'Skull'),
        ('chest', 'Chest'),
        ('abdomen', 'Abdomen'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('needs_redoing', 'Needs Redoing'),
        ('archived', 'Archived'),
    )
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans', limit_choices_to={'role': 'patient'})
    scan_type = models.CharField(max_length=20, choices=SCAN_TYPES)
    body_part = models.CharField(max_length=50, choices=BODY_PARTS)
    image_file = models.FileField(upload_to=get_upload_path)
    description = models.TextField(blank=True, help_text="Patient's description of symptoms/area")
    
    # Medical metadata
    taken_date = models.DateField(null=True, blank=True, help_text="Date when scan was taken")
    referring_doctor = models.CharField(max_length=200, blank=True)
    hospital_name = models.CharField(max_length=200, blank=True)
    
    # Review status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_scans', limit_choices_to={'role__in': ['doctor', 'admin']})
    review_notes = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    # Encryption & security
    encryption_key = models.CharField(max_length=255, blank=True)
    file_hash = models.CharField(max_length=64, blank=True)
    file_size = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, default='image/jpeg')
    
    # Audit trail
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_ip = models.GenericIPAddressField(null=True, blank=True)
    last_accessed = models.DateTimeField(null=True, blank=True)
    access_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'medical_scans'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['patient', 'status']),
            models.Index(fields=['scan_type', 'body_part']),
            models.Index(fields=['-uploaded_at']),
        ]
    
    def __str__(self):
        return f"{self.get_scan_type_display()} - {self.patient.get_full_name()} - {self.uploaded_at.date()}"
    
    def save(self, *args, **kwargs):
        if self.image_file:
            self.file_size = self.image_file.size
            self.mime_type = self.image_file.file.content_type
        super().save(*args, **kwargs)

class ScanReport(models.Model):
    scan = models.OneToOneField(MedicalScan, on_delete=models.CASCADE, related_name='report')
    findings = models.TextField()
    impression = models.TextField()
    recommendations = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'scan_reports'
    
    def __str__(self):
        return f"Report for {self.scan}"