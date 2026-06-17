from rest_framework import serializers
from .models import MedicalScan, ScanReport

class MedicalScanSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    scan_type_display = serializers.SerializerMethodField()
    body_part_display = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalScan
        fields = ['id', 'scan_type', 'scan_type_display', 'body_part', 'body_part_display',
                 'description', 'taken_date', 'referring_doctor', 'hospital_name',
                 'status', 'review_notes', 'patient_name', 'image_url', 'uploaded_at']
        read_only_fields = ['id', 'status', 'reviewed_at', 'uploaded_at', 'file_size']
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    
    def get_scan_type_display(self, obj):
        return obj.get_scan_type_display()
    
    def get_body_part_display(self, obj):
        return obj.get_body_part_display()
    
    def get_image_url(self, obj):
        if obj.image_file:
            return obj.image_file.url
        return None

class ScanUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalScan
        fields = ['scan_type', 'body_part', 'description', 'image_file', 
                 'taken_date', 'referring_doctor', 'hospital_name']
    
    def create(self, validated_data):
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)