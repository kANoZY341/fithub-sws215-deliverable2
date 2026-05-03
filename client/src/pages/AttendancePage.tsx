import { useEffect, useState } from 'react';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { AttendanceRecord } from '../types';
import { formatDateTimeDubai } from '../lib/uaeFormat';
import { useToast } from '../context/ToastContext';

export function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const { pushToast } = useToast();

  const load = async () => {
    const { data } = await api.get('/attendance/my');
    setRecords(data);
  };

  useEffect(() => {
    load().catch(() => setMessage('Failed to load attendance'));
  }, []);

  const checkIn = async () => {
    try {
      await api.post('/attendance/checkin', { note });
      setNote('');
      setMessage('Check-in recorded successfully.');
      pushToast('Check-in recorded', 'success');
      await load();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Check-in failed';
      setMessage(errorMessage);
      pushToast(errorMessage, 'error');
    }
  };

  return (
    <Page title="Attendance">
      <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Optional note" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="px-3 py-2 rounded bg-brand-600 text-white" onClick={checkIn}>Check-in</button>
        {message && <p className="text-sm">{message}</p>}
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr><th className="p-3 text-left">Checked In At</th><th className="p-3 text-left">Method</th><th className="p-3 text-left">Note</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{formatDateTimeDubai(r.checkedInAt)}</td>
                <td className="p-3">{r.method}</td>
                <td className="p-3">{r.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
