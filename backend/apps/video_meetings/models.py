from django.db import models
from apps.users.models import User

class VideoConsultation(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('missed', 'Missed'),
    )
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_consultations', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_consultations', limit_choices_to={'role': 'doctor'})
    
    scheduled_time = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    
    zoom_meeting_id = models.CharField(max_length=100, blank=True)
    zoom_join_url = models.URLField(blank=True)
    zoom_start_url = models.URLField(blank=True)
    zoom_password = models.CharField(max_length=20, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    symptoms = models.TextField(blank=True)
    doctor_notes = models.TextField(blank=True)
    prescription = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'video_consultations'
        ordering = ['-scheduled_time']
    
    def __str__(self):
        return f"Consultation: {self.patient.get_full_name()} with Dr. {self.doctor.get_full_name()} at {self.scheduled_time}"