import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ReportDownload({ scan }) {
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    setLoading(true);
    
    // Create a temporary div with report content
    const reportDiv = document.createElement('div');
    reportDiv.style.padding = '40px';
    reportDiv.style.fontFamily = 'Arial, sans-serif';
    reportDiv.style.backgroundColor = 'white';
    reportDiv.style.maxWidth = '800px';
    reportDiv.style.margin = '0 auto';
    reportDiv.innerHTML = `
      <div style="text-align: center; border-bottom: 3px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #1976d2; font-size: 24px; margin: 0;">Dr. Jimmy Orthopedic & Spine Center</h1>
        <p style="color: #666; margin: 5px 0;">International Orthopedic & Spine Surgeon</p>
        <p style="color: #888; font-size: 12px;">www.drjimmy.com | info@drjimmy.com | +255 712 345 678</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h2 style="color: #333; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">📋 Medical Report</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
          <div><strong>Patient Name:</strong> ${scan.patient_name || 'Patient'}</div>
          <div><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Scan Type:</strong> ${scan.scan_type}</div>
          <div><strong>Body Part:</strong> ${scan.body_part}</div>
          <div><strong>Uploaded:</strong> ${scan.uploaded_at}</div>
          <div><strong>Status:</strong> ${scan.status}</div>
        </div>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #1976d2;">
        <h3 style="color: #1976d2; margin: 0 0 10px 0;">📋 Diagnosis</h3>
        <p style="margin: 0; line-height: 1.6; color: #333;">${scan.diagnosis || 'Pending review...'}</p>
      </div>
      
      <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
        <h3 style="color: #2e7d32; margin: 0 0 10px 0;">💊 Recommendations</h3>
        <p style="margin: 0; line-height: 1.6; color: #333;">${scan.recommendations || 'No recommendations yet'}</p>
      </div>
      
      ${scan.description ? `
      <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff9800;">
        <h3 style="color: #e65100; margin: 0 0 10px 0;">📝 Patient Description</h3>
        <p style="margin: 0; line-height: 1.6; color: #333;">${scan.description}</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        <p>This report is for informational purposes only. Always consult your doctor.</p>
        <p>© ${new Date().getFullYear()} Dr. Jimmy Orthopedic & Spine Center</p>
        <p style="margin-top: 5px;">Generated on: ${new Date().toLocaleString()}</p>
      </div>
    `;
    
    document.body.appendChild(reportDiv);

    try {
      const canvas = await html2canvas(reportDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`DrJimmy_Report_${scan.scan_type}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating report. Please try again.');
    } finally {
      document.body.removeChild(reportDiv);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={downloadReport}
      disabled={loading}
      style={{
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {loading ? '⏳ Generating...' : '📄 Download Report'}
    </button>
  );
}

export default ReportDownload;