import { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { api } from '../../lib/api';
import { formatDateDubai } from '../../lib/uaeFormat';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  preferredBranch?: string;
  createdAt?: string;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => {
        setUsers(res.data);
        setMessage('');
      })
      .catch((err: any) => setMessage(err?.response?.data?.message || 'Failed to load users'));
  }, []);

  return (
    <Page title="Admin Users">
      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {!users.length && (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={6}>No users found.</td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-1 text-xs ${user.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">{user.phone || '-'}</td>
                  <td className="p-3">{user.preferredBranch || '-'}</td>
                  <td className="p-3">{user.createdAt ? formatDateDubai(user.createdAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  );
}
