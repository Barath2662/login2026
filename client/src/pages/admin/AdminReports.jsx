import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { FileOutput, Download, AlertTriangle } from 'lucide-react';

const AdminReports = () => {
  const reports = [
    { title: 'Global Master Roster', desc: 'Complete CSV dump of all registered operatives and their profiles.', count: '1,420 Records' },
    { title: 'Event Registration Matrix', desc: 'Mapping of all operatives to their secured operation slots.', count: '3,842 Records' },
    { title: 'Financial Ledger', desc: 'All processed and refunded ₹100 participation fees.', count: '1,420 Records' },
    { title: 'Physical Entry Log', desc: 'Complete audit trail of all physical check-ins at the venue.', count: '1,390 Records' },
    { title: 'Squad Formations', desc: 'List of all teams, their sizes, and their designated leaders.', count: '310 Records' },
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
        {reports.map((report, i) => (
          <div key={i} className="bg-bg-card border border-border-color rounded-sm p-6 hover:border-color-silver transition-colors flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <FileOutput size={24} className="text-color-silver" />
              <h3 className="text-lg font-bold text-white leading-tight">{report.title}</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6 flex-1">{report.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-mono text-text-muted">{report.count}</span>
              <Button size="sm" className="bg-color-silver text-black hover:bg-white text-xs h-8 px-3 border-none flex items-center gap-2">
                <Download size={14} /> EXPORT
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
