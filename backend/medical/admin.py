from django.contrib import admin
from .models import PatientScan, Consultation

@admin.register(PatientScan)
class PatientScanAdmin(admin.ModelAdmin):
    list_display = ['patient', 'scan_type', 'body_part', 'status', 'uploaded_at']
    list_filter = ['scan_type', 'status']
    search_fields = ['patient__username']

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['patient', 'scheduled_date', 'status']