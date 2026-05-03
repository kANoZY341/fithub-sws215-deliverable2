import { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { api } from '../../lib/api';
import type { Branch, Trainer } from '../../types';
import { getTrainerBranchName } from '../../lib/branchDisplay';

export function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState({ name: '', specialty: '', bio: '', languages: '', slots: '', branchId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [trainerRes, branchRes] = await Promise.all([api.get('/trainers'), api.get('/branches')]);
    setTrainers(trainerRes.data);
    setBranches(branchRes.data);
  };

  useEffect(() => { load().catch(() => setMessage('Failed to load trainers')); }, []);

  const resetForm = () => {
    setForm({ name: '', specialty: '', bio: '', languages: '', slots: '', branchId: '' });
    setEditingId(null);
  };

  const getBranchId = (trainer: Trainer) => {
    if (trainer.branchId && typeof trainer.branchId === 'object') return trainer.branchId._id;
    if (typeof trainer.branchId === 'string') return trainer.branchId;
    return branches.find((branch) => branch.name === trainer.branchName)?._id || '';
  };

  const submitTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.bio || !form.branchId) return setMessage('Required fields missing');

    const payload = {
      name: form.name,
      specialty: form.specialty,
      bio: form.bio,
      languages: form.languages ? form.languages.split(',').map((s) => s.trim()).filter(Boolean) : [],
      availableSlots: form.slots ? form.slots.split(',').map((s) => s.trim()).filter(Boolean) : [],
      branchId: form.branchId
    };

    try {
      if (editingId) {
        await api.put(`/trainers/${editingId}`, payload);
        setMessage('Trainer updated');
      } else {
        await api.post('/trainers', payload);
        setMessage('Trainer created');
      }
      resetForm();
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/trainers/${id}`);
      setMessage('Trainer deleted');
      if (editingId === id) resetForm();
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Delete failed');
    }
  };

  const edit = (trainer: Trainer) => {
    setEditingId(trainer._id);
    setForm({
      name: trainer.name,
      specialty: trainer.specialty,
      bio: trainer.bio,
      languages: trainer.languages.join(', '),
      slots: trainer.availableSlots.join(', '),
      branchId: getBranchId(trainer)
    });
    setMessage('');
  };

  return (
    <Page title="Admin Manage Trainers">
      <form className="bg-white shadow rounded-xl p-4 grid md:grid-cols-2 gap-2 mb-4" onSubmit={submitTrainer}>
        <input className="border rounded px-2 py-1" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-2 py-1" placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        <select className="md:col-span-2 border rounded px-2 py-2" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
          <option value="">Select trainer branch</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>{branch.name}</option>
          ))}
        </select>
        <input className="md:col-span-2 border rounded px-2 py-1" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <input className="md:col-span-2 border rounded px-2 py-1" placeholder="Languages csv e.g. Arabic,English,Hindi" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
        <input className="md:col-span-2 border rounded px-2 py-1" placeholder="Slots csv e.g. Mon 18:00,Tue 19:00" value={form.slots} onChange={(e) => setForm({ ...form, slots: e.target.value })} />
        <button className="bg-brand-600 text-white rounded px-3 py-2">{editingId ? 'Update Trainer' : 'Add Trainer'}</button>
        {editingId && <button type="button" className="rounded border border-slate-300 px-3 py-2" onClick={resetForm}>Cancel Edit</button>}
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <div className="space-y-3">
        {trainers.map((t) => (
          <div key={t._id} className="bg-white rounded-xl shadow p-4 flex justify-between gap-4">
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-slate-600">{t.specialty}</p>
              <p className="text-xs font-medium text-brand-700">Branch: {getTrainerBranchName(t) || 'Branch not set'}</p>
              <p className="text-xs text-slate-500">Languages: {t.languages?.join(', ') || 'English'}</p>
              <p className="text-xs text-slate-500">Slots: {t.availableSlots?.join(', ') || 'No slots yet'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => edit(t)} className="text-brand-700 text-sm">Edit</button>
              <button onClick={() => remove(t._id)} className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
