import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Trainer } from '../types';
import { saveBookingSelection } from '../lib/flowStorage';
import { getTrainerBranchName } from '../lib/branchDisplay';

export function TrainerDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const stateTrainer = (location.state as { trainer?: Trainer } | null)?.trainer || null;
  const [trainer, setTrainer] = useState<Trainer | null>(stateTrainer);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTrainer = async () => {
      if (!id) {
        setLoading(false);
        setError('Trainer not found.');
        return;
      }
      if (stateTrainer && stateTrainer._id === id) {
        setTrainer(stateTrainer);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/trainers/${id}`);
        setTrainer(data);
        setError('');
      } catch (err: any) {
        setTrainer(null);
        setError(err?.response?.data?.message || 'Trainer not found.');
      } finally {
        setLoading(false);
      }
    };

    loadTrainer();
  }, [id, stateTrainer]);

  if (loading) {
    return <Page title="Trainer Profile"><p>Loading trainer details...</p></Page>;
  }

  if (!trainer) {
    return <Page title="Trainer Profile"><p className="text-red-600">{error || 'Trainer not found.'}</p></Page>;
  }

  return (
    <Page title={trainer.name}>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="bg-white rounded-xl shadow p-5 md:col-span-2">
          <p className="text-sm text-slate-500">{trainer.specialty}</p>
          <p className="mt-2 text-sm font-medium text-brand-700">Branch: {getTrainerBranchName(trainer) || 'Branch not set'}</p>
          <p className="mt-3 text-sm text-slate-700">{trainer.bio}</p>
          <p className="mt-3 text-sm text-slate-600">Languages: {trainer.languages.join(', ')}</p>
        </section>
        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-2">Available Slots</h2>
          <div className="space-y-2">
            {trainer.availableSlots.map((slot) => {
              const query = new URLSearchParams({
                trainerId: trainer._id,
                trainerName: trainer.name,
                specialty: trainer.specialty,
                branchName: getTrainerBranchName(trainer),
                slot
              }).toString();

              return (
                <Link
                  key={slot}
                  to={`/booking/review?${query}`}
                  onClick={() =>
                    saveBookingSelection({
                      trainerId: trainer._id,
                      trainerName: trainer.name,
                      specialty: trainer.specialty,
                      branchName: getTrainerBranchName(trainer),
                      slot
                    })
                  }
                  className="block rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Continue with {slot}
                </Link>
              );
            })}
          </div>
          <Link to="/trainers" className="mt-3 inline-block text-sm text-brand-700 hover:underline">Back to Trainers</Link>
        </section>
      </div>
    </Page>
  );
}
