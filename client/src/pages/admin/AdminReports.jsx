import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { FileOutput, Download, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { useState } from 'react';

const AdminReports = () => {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (key, apiMethod, filename) => {
    try {
      setDownloading(key);
      const res = await apiMethod();
      // Handle blob response
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download report.');
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    { 
      key: 'registrations', 
      title: 'Overall Registration Details', 
      desc: 'Complete CSV dump of all event registrations for all users.', 
      count: 'System Records', 
      apiCall: api.exports.getRegistrations, 
      filename: 'all_registrations.csv' 
    },
    { 
      key: 'attendance', 
      title: 'Overall Event Attendance', 
      desc: 'Complete audit trail of all attendance records for participants in their registered events.', 
      count: 'System Records', 
      apiCall: api.exports.getAttendance, 
      filename: 'attendance.csv' 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
          System <span className="text-color-silver">Reports</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm">
          Generate and download master database CSV dumps.
        </p>
      </div>

      <div className="mb-6 p-4 bg-color-silver/10 border border-color-silver/30 rounded-sm flex gap-3 items-start">
        <AlertTriangle className="text-color-silver mt-1" size={20} />
        <div>
          <div className="text-color-silver font-bold font-mono uppercase tracking-wider mb-1">Level 5 Clearance Required</div>
          <div className="text-sm text-text-secondary">These exports contain raw, unencrypted PII (Personally Identifiable Information). Ensure secure handling of downloaded CSV files.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.key} className="bg-bg-card border border-border-color rounded-sm p-6 hover:border-color-silver transition-colors flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <FileOutput size={24} className="text-color-silver" />
              <h3 className="text-lg font-bold text-white leading-tight">{report.title}</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6 flex-1">{report.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-mono text-text-muted">{report.count}</span>
              <Button 
                size="sm" 
                onClick={() => handleDownload(report.key, report.apiCall, report.filename)}
                disabled={downloading === report.key}
                className="bg-color-silver text-black hover:bg-white text-xs h-8 px-3 border-none flex items-center gap-2"
              >
                {downloading === report.key ? 'DOWNLOADING...' : <><Download size={14} /> EXPORT</>}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
