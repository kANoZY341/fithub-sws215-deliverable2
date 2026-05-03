import { useEffect, useState } from 'react';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Branch, Membership } from '../types';
import { formatAED, formatDateDubai } from '../lib/uaeFormat';
import { useToast } from '../context/ToastContext';
import { readAccountProfile, saveAccountProfile } from '../lib/accountProfile';

export function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const accountProfile = readAccountProfile();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [preferredBranch, setPreferredBranch] = useState('');
  const [phone, setPhone] = useState(accountProfile?.phone || user?.phone || '');
  const { pushToast } = useToast();

  useEffect(() => {
    api.get('/memberships/my')
      .then((res) => setMemberships(res.data))
      .catch(() => setMemberships([]));
    api.get('/branches').then((res) => setBranches(res.data)).catch(() => setBranches([]));
  }, []);

  useEffect(() => {
    setPreferredBranch(user?.preferredBranch || '');
  }, [user?.preferredBranch]);
  useEffect(() => {
    setPhone(accountProfile?.phone || user?.phone || '');
  }, [accountProfile?.phone, user?.email, user?.phone]);

  const saveBranchPreference = async () => {
    try {
      await api.patch('/users/me', { preferredBranch });
      await refreshMe();
      pushToast('Preferred branch updated', 'success');
    } catch (err: any) {
      pushToast(err?.response?.data?.message || 'Failed to update branch', 'error');
    }
  };

  const savePhone = async () => {
    if (!phone.trim()) {
      pushToast('Phone number is required', 'error');
      return;
    }
    try {
      await api.patch('/users/me', { phone: phone.trim() });
      if (accountProfile) {
        saveAccountProfile({ ...accountProfile, phone: phone.trim() });
      }
      await refreshMe();
      pushToast('Phone number saved', 'success');
    } catch (err: any) {
      pushToast(err?.response?.data?.message || 'Failed to save phone number', 'error');
    }
  };

  return (
    <Page title="Profile & Settings">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="font-semibold mb-2">Account</h2>
          <p>First Name: {accountProfile?.firstName || user?.firstName || '-'}</p>
          <p>Last Name: {accountProfile?.lastName || user?.lastName || '-'}</p>
          <p>Full Name: {accountProfile?.fullName || user?.fullName || user?.name || '-'}</p>
          <p>Email: {accountProfile?.email || user?.email}</p>
          <p>Role: {user?.role}</p>
          <div className="mt-4 space-y-2">
            <p className="font-medium">Phone Number</p>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
            <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={savePhone}>
              Save Phone
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <p className="font-medium">Preferred UAE Branch</p>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={preferredBranch}
              onChange={(e) => setPreferredBranch(e.target.value)}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
            <button className="rounded bg-brand-600 px-3 py-2 text-white" onClick={saveBranchPreference}>
              Save Branch Preference
            </button>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="font-semibold mb-2">My Memberships</h2>
          {!memberships.length && <p className="text-sm text-slate-500">No memberships yet.</p>}
          <ul className="space-y-2 text-sm">
            {memberships.map((m) => (
              <li key={m._id} className="border rounded p-2">
                <p className="font-medium">{m.planId?.name}</p>
                <p>
                  {formatDateDubai(m.startDate)} - {formatDateDubai(m.endDate)}
                </p>
                <p>{m.planId ? formatAED(m.planId.price) : ''}</p>
                <p className={`capitalize ${m.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>Status: {m.status}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-600">Prices include 5% VAT.</p>
        </div>
      </div>
    </Page>
  );
}
