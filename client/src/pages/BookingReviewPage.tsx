import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Trainer } from '../types';
import { readBookingSelection, saveBookingDraft, saveBookingSelection } from '../lib/flowStorage';
import { useAuth } from '../context/AuthContext';
import { readAccountProfile } from '../lib/accountProfile';
import { getTrainerBranchName } from '../lib/branchDisplay';

export function BookingReviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cachedSelection] = useState(() => readBookingSelection());
  const accountProfile = readAccountProfile();

  const trainerId = searchParams.get('trainerId') || cachedSelection?.trainerId || '';
  const slot = searchParams.get('slot') || cachedSelection?.slot || '';
  const trainerName = searchParams.get('trainerName') || cachedSelection?.trainerName || '';
  const specialty = searchParams.get('specialty') || cachedSelection?.specialty || '';
  const branchName = searchParams.get('branchName') || cachedSelection?.branchName || '';
  const hasSessionContext = Boolean(slot && (trainerId || trainerName || cachedSelection));

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [form, setForm] = useState({
    memberName: accountProfile?.fullName || user?.fullName || user?.name || '',
    phone: accountProfile?.phone || user?.phone || '',
    branch: branchName || user?.preferredBranch || '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trainerId && cachedSelection) {
      setTrainer({
        _id: cachedSelection.trainerId,
        name: cachedSelection.trainerName,
        specialty: cachedSelection.specialty,
        branchName: cachedSelection.branchName || '',
        bio: '',
        languages: [],
        availableSlots: cachedSelection.slot ? [cachedSelection.slot] : []
      });
      return;
    }

    if (trainerName || specialty) {
      setTrainer((prev) => ({
        _id: trainerId || prev?._id || '',
        name: trainerName || prev?.name || 'Selected Trainer',
        specialty: specialty || prev?.specialty || '-',
        branchName: branchName || prev?.branchName || '',
        bio: prev?.bio || '',
        languages: prev?.languages || [],
        availableSlots: slot ? [slot] : prev?.availableSlots || []
      }));
    }

    const loadTrainer = async () => {
      if (!trainerId) return;
      try {
        const { data } = await api.get(`/trainers/${trainerId}`);
        setTrainer(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load selected trainer.');
      }
    };

    loadTrainer();
  }, [branchName, cachedSelection, specialty, slot, trainerId, trainerName]);

  const trainerBranchName = getTrainerBranchName(trainer) || branchName;

  useEffect(() => {
    if (!trainerBranchName) return;
    setForm((prev) => ({ ...prev, branch: trainerBranchName }));
  }, [trainerBranchName]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      memberName: accountProfile?.fullName || user?.fullName || user?.name || prev.memberName,
      phone: accountProfile?.phone || user?.phone || prev.phone,
      branch: trainerBranchName || user?.preferredBranch || prev.branch
    }));
  }, [accountProfile?.fullName, accountProfile?.phone, trainerBranchName, user?.fullName, user?.name, user?.phone, user?.preferredBranch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return setError('Please login before confirming a booking.');
    if (!trainer || !slot) return setError('Please select a trainer slot first.');
    if (!form.memberName || !form.phone || !trainerBranchName) return setError('Name, phone, and trainer branch are required.');

    try {
      const { data } = await api.post('/bookings', { trainerId: trainer._id, slot });
      await api.patch('/users/me', { preferredBranch: trainerBranchName, phone: form.phone });

      saveBookingDraft({
        bookingId: data._id,
        trainerId: trainer._id,
        trainerName: trainer.name,
        slot,
        status: data.status,
        memberName: form.memberName,
        phone: form.phone,
        branch: data.branchName || trainerBranchName,
        notes: form.notes
      });
      saveBookingSelection({
        trainerId: trainer._id,
        trainerName: trainer.name,
        specialty: trainer.specialty,
        branchName: data.branchName || trainerBranchName,
        slot
      });

      navigate('/booking/confirmation');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Booking failed. Please try another slot.');
    }
  };

  if (!hasSessionContext) {
    return (
      <Page title="Booking Review">
        <div className="max-w-xl bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">No session selected</h2>
          <p className="text-sm text-slate-600 mb-4">Please choose a trainer and slot first, then continue to booking review.</p>
          <button onClick={() => navigate('/trainers')} className="rounded bg-brand-600 text-white px-4 py-2 text-sm">
            Back to Trainers
          </button>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Booking Review">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">Session Summary</h2>
          <p className="text-sm"><span className="font-medium">Trainer:</span> {trainer?.name || 'Not selected'}</p>
          <p className="text-sm"><span className="font-medium">Specialty:</span> {trainer?.specialty || '-'}</p>
          <p className="text-sm"><span className="font-medium">Branch:</span> {trainerBranchName || 'Not selected'}</p>
          <p className="text-sm"><span className="font-medium">Slot:</span> {slot || 'Not selected'}</p>
          <p className="text-xs text-slate-500 mt-3">Booking will be saved to MongoDB after confirmation.</p>
          <Link className="inline-block mt-3 text-sm text-brand-700 hover:underline" to="/trainers">
            Choose different trainer
          </Link>
        </section>

        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-5 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Member name"
            value={form.memberName}
            onChange={(e) => setForm({ ...form, memberName: e.target.value })}
          />
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="w-full rounded border border-slate-300 bg-slate-100 px-3 py-2"
            value={trainerBranchName || form.branch}
            readOnly
            aria-label="Session branch"
          />
          <textarea
            rows={3}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Optional notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button className="rounded bg-brand-600 text-white px-4 py-2">Confirm Booking</button>
        </form>
      </div>
    </Page>
  );
}
