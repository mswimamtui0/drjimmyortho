from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os
from datetime import datetime
import uuid

class PrescriptionGenerator:
    """Generate PDF prescriptions for patients"""
    
    @staticmethod
    def generate_prescription(patient, diagnosis, recommendations, medications):
        """
        Generate a prescription PDF
        
        Args:
            patient: User object
            diagnosis: Diagnosis text
            recommendations: Treatment recommendations
            medications: List of medications with dosage
        """
        try:
            # Create filename
            filename = f"prescription_{patient.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
            filepath = os.path.join('media', 'prescriptions', filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Create PDF
            doc = SimpleDocTemplate(filepath, pagesize=letter)
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor('#1976d2'),
                alignment=TA_CENTER,
                spaceAfter=30
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=16,
                textColor=colors.HexColor('#333333'),
                spaceAfter=10
            )
            
            body_style = ParagraphStyle(
                'CustomBody',
                parent=styles['Normal'],
                fontSize=12,
                textColor=colors.HexColor('#555555'),
                spaceAfter=10
            )
            
            # Content
            content = []
            
            # Header
            content.append(Paragraph("🏥 Dr. Jimmy Orthopedic Center", title_style))
            content.append(Paragraph("INTERNATIONAL ORTHOPEDIC & SPINE SURGEON", heading_style))
            content.append(Paragraph("Dar es Salaam, Tanzania | Phone: +255 712 345 678", body_style))
            content.append(Spacer(1, 0.3*inch))
            
            # Patient Info
            content.append(Paragraph(f"<b>Patient Name:</b> {patient.get_full_name() or patient.username}", body_style))
            content.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", body_style))
            content.append(Paragraph(f"<b>Patient ID:</b> {patient.id}", body_style))
            content.append(Spacer(1, 0.3*inch))
            
            # Diagnosis
            content.append(Paragraph("<b>DIAGNOSIS</b>", heading_style))
            content.append(Paragraph(diagnosis, body_style))
            content.append(Spacer(1, 0.2*inch))
            
            # Recommendations
            content.append(Paragraph("<b>RECOMMENDATIONS</b>", heading_style))
            content.append(Paragraph(recommendations, body_style))
            content.append(Spacer(1, 0.2*inch))
            
            # Medications
            if medications:
                content.append(Paragraph("<b>PRESCRIPTION</b>", heading_style))
                
                # Create medication table
                med_data = [['Medication', 'Dosage', 'Frequency', 'Duration']]
                for med in medications:
                    med_data.append([
                        med.get('name', ''),
                        med.get('dosage', ''),
                        med.get('frequency', ''),
                        med.get('duration', '')
                    ])
                
                med_table = Table(med_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 1.5*inch])
                med_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1976d2')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                content.append(med_table)
                content.append(Spacer(1, 0.2*inch))
            
            # Footer
            content.append(Spacer(1, 0.5*inch))
            content.append(Paragraph("_"*50, body_style))
            content.append(Paragraph("<b>Doctor's Signature:</b> ______________________", body_style))
            content.append(Paragraph("Dr. Jimmy", body_style))
            content.append(Paragraph("License No: DMP-2024-0001", body_style))
            content.append(Spacer(1, 0.2*inch))
            content.append(Paragraph("<i>This prescription is valid for 30 days from the date of issue.</i>", body_style))
            
            # Build PDF
            doc.build(content)
            
            return filepath
            
        except Exception as e:
            print(f"Prescription generation error: {str(e)}")
            return None