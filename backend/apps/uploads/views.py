from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MedicalScan
from .serializers import MedicalScanSerializer, ScanUploadSerializer

class ScanUploadView(generics.CreateAPIView):
    serializer_class = ScanUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

class ScanListView(generics.ListAPIView):
    serializer_class = MedicalScanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['scan_type', 'body_part', 'status']
    search_fields = ['description']
    ordering_fields = ['uploaded_at', 'taken_date']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_doctor or user.is_staff:
            return MedicalScan.objects.all()
        return MedicalScan.objects.filter(patient=user)

class ScanDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicalScanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_doctor or user.is_staff:
            return MedicalScan.objects.all()
        return MedicalScan.objects.filter(patient=user)