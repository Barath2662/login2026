import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { Loader } from '../components/Loader';

interface IdRecord {
  id: string;
  fullName: string;
  email: string;
  college: string;
  idUploadStatus: 'UPLOADED' | 'MISSING';
  idCardFrontUrl: string | null;
  idCardBackUrl: string | null;
  createdAt: string;
}

export const AdminIdRecordsView = () => {
  const [records, setRecords] = useState<IdRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<IdRecord | null>(null);
  const [frontUrl, setFrontUrl] = useState<string | null>(null);
  const [backUrl, setBackUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/users/');
      setRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch ID records');
    } finally {
      setLoading(false);
    }
  };

  const viewImages = async (record: IdRecord) => {
    setSelectedRecord(record);
    setFrontUrl(null);
    setBackUrl(null);

    try {
      if (record.idCardFrontUrl) {
        setFrontUrl(record.idCardFrontUrl);
      }
      if (record.idCardBackUrl) {
        setBackUrl(record.idCardBackUrl);
      }
    } catch (error) {
      console.error('Failed to parse URLs', error);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader size="large" /></div>;
  if (error) return <div className="text-color-danger p-6 text-center">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest border-b border-border-color pb-4">
        ID Records Database
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          {records.map(record => (
            <div 
              key={record.id}
              onClick={() => viewImages(record)}
              className={`p-4 border rounded-sm cursor-pointer transition-colors ${
                selectedRecord?.id === record.id 
                  ? 'bg-[var(--color-red)]/10 border-[var(--color-red)]' 
                  : 'bg-bg-card border-border-color hover:border-[var(--color-red)]/50'
              }`}
            >
              <h3 className="font-bold text-white text-sm">{record.fullName}</h3>
              <p className="text-xs text-text-muted mt-1 truncate">{record.email}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-text-secondary">{record.college}</span>
                <span className={`text-[10px] font-mono px-2 py-1 rounded-sm ${
                  record.idUploadStatus === 'UPLOADED' 
                    ? 'bg-color-success/20 text-color-success' 
                    : 'bg-color-danger/20 text-color-danger'
                }`}>
                  {record.idUploadStatus}
                </span>
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <p className="text-text-muted text-sm text-center py-8">No records found.</p>
          )}
        </div>

        <div className="md:col-span-2">
          {selectedRecord ? (
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{selectedRecord.fullName}</h2>
                <p className="text-sm text-text-secondary">{selectedRecord.email} • {selectedRecord.college}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-color-red mb-2">FRONT SIDE</h3>
                  {frontUrl ? (
                    <img src={frontUrl} alt="ID Front" className="max-w-full rounded-sm border border-border-color max-h-96 object-contain" />
                  ) : selectedRecord.idCardFrontUrl ? (
                    <div className="h-32 flex items-center justify-center bg-bg-primary border border-border-color border-dashed">
                      <Loader size="small" />
                    </div>
                  ) : (
                    <div className="p-4 bg-color-danger/10 text-color-danger text-sm">No front image uploaded</div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-mono text-color-red mb-2">BACK SIDE</h3>
                  {backUrl ? (
                    <img src={backUrl} alt="ID Back" className="max-w-full rounded-sm border border-border-color max-h-96 object-contain" />
                  ) : selectedRecord.idCardBackUrl ? (
                    <div className="h-32 flex items-center justify-center bg-bg-primary border border-border-color border-dashed">
                      <Loader size="small" />
                    </div>
                  ) : (
                    <div className="p-4 bg-color-danger/10 text-color-danger text-sm">No back image uploaded</div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border border-border-color border-dashed rounded-sm bg-bg-card/50">
              <p className="text-text-muted">Select a record to view ID images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
