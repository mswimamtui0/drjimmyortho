from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User

class PatientProfile(models.Model):
    BLOOD_TYPES = (
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPES, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    insurance_provider = models.CharField(max_length=100, blank=True)
    insurance_number = models.CharField(max_length=50, blank=True)
    
    class Meta:
        db_table = 'patient_profiles'
    
    def __str__(self):
        return f"Profile for {self.user.get_full_name()}"

class MedicalCondition(models.Model):
    CONDITION_TYPES = (
        ('chronic', 'Chronic Disease'),
        ('surgical', 'Surgical History'),
        ('trauma', 'Trauma/Injury'),
        ('congenital', 'Congenital Condition'),
    )
    
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='conditions')
    condition_type = models.CharField(max_length=20, choices=CONDITION_TYPES)
    name = models.CharField(max_length=200)
    diagnosis_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_conditions'
    
    def __str__(self):
        return f"{self.name} - {self.patient.user.get_full_name()}"