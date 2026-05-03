import { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { api } from '../../lib/api';
import type { Plan } from '../../types';
import { formatAED } from '../../lib/uaeFormat';

export function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({ name: '', price: '', durationDays: '', features: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/plans');
    setPlans(data);
  };

  useEffect(() => { load().catch(() => setMessage('Failed to load plans')); }, []);

  const resetForm = () => {
    setForm({ name: '', price: '', durationDays: '', features: '' });
    setEditingId(null);
  };

  const submitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.durationDays) return setMessage('Required fields missing');

    const payload = {
      name: form.name,
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      features: form.features ? form.features.split(',').map((v) => v.trim()).filter(Boolean) : []
    };

    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, payload);
        setMessage('Plan updated');
      } else {
        await api.post('/plans', payload);
        setMessage('Plan created');
      }
      resetForm();
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/plans/${id}`);
      setMessage('Plan deleted');
      if (editingId === id) resetForm();
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Delete failed');
    }
  };

  const edit = (plan: Plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name,
      price: String(plan.price),
      durationDays: String(plan.durationDays),
      features: plan.features.join(', ')
    });
    setMessage('');
  };

  return (
    <Page title="Admin Manage Plans">
      <form className="bg-white shadow rounded-xl p-4 grid md:grid-cols-4 gap-2 mb-4" onSubmit={submitPlan}>
        <input className="border rounded px-2 py-1" placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-2 py-1" placeholder="Price (AED)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border rounded px-2 py-1" placeholder="Duration days" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
        <input className="border rounded px-2 py-1" placeholder="Features csv" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <button className="md:col-span-3 bg-brand-600 text-white rounded px-3 py-2">{editingId ? 'Update Plan' : 'Add Plan'}</button>
        {editingId && <button type="button" className="rounded border border-slate-300 px-3 py-2" onClick={resetForm}>Cancel Edit</button>}
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Price</th><th className="p-3 text-left">Duration</th><th className="p-3 text-left">Actions</th></tr></thead>
          <tbody>{plans.map((p) => <tr key={p._id} className="border-t"><td className="p-3">{p.name}</td><td className="p-3">{formatAED(p.price)}</td><td className="p-3">{p.durationDays} days</td><td className="p-3"><button className="mr-3 text-brand-700" onClick={() => edit(p)}>Edit</button><button className="text-red-600" onClick={() => remove(p._id)}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </Page>
  );
}
