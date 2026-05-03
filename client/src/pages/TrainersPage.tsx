import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Branch, Trainer } from '../types';
import { useAuth } from '../context/AuthContext';
import { saveBookingSelection } from '../lib/flowStorage';
import { getTrainerBranchName } from '../lib/branchDisplay';

export function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([api.get('/trainers'), api.get('/branches')])
      .then(([trainerRes, branchRes]) => {
        setTrainers(trainerRes.data);
        setBranches(branchRes.data);
      })
      .catch((err: any) => {
        setTrainers([]);
        setMessage(err?.response?.data?.message || 'Unable to load trainers from the backend.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTrainers = useMemo(
    () => selectedBranch
      ? trainers.filter((trainer) => getTrainerBranchName(trainer) === selectedBranch)
      : trainers,
    [selectedBranch, trainers]
  );

  return (
    <Page title="Our Trainers">
      {message && <p className="mb-4 text-sm">{message}</p>}
      {loading ? <p>Loading trainers...</p> : (
        trainers.length ? (
          <>
          <div className="mb-4 bg-white rounded-xl shadow p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Filter by branch</p>
              <p className="text-sm font-medium">{filteredTrainers.length} trainer{filteredTrainers.length === 1 ? '' : 's'} shown</p>
            </div>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 md:w-72"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All branches</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.name}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {filteredTrainers.map((t) => (
              <div key={t._id} className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold">{t.name} <span className="text-sm text-slate-500">({t.specialty})</span></h2>
                <p className="text-sm text-slate-600 mb-2">{t.bio}</p>
                <p className="text-sm font-medium text-brand-700 mb-1">Branch: {getTrainerBranchName(t) || 'Branch not set'}</p>
                <p className="text-xs text-slate-500 mb-2">Languages: {t.languages?.join(', ') || 'English'}</p>
                <div className="mb-2">
                  <Link to={`/trainers/${t._id}`} state={{ trainer: t }} className="text-sm text-brand-700 hover:underline">View Full Profile</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.availableSlots.map((slot) => {
                    const query = new URLSearchParams({
                      trainerId: t._id,
                      trainerName: t.name,
                      specialty: t.specialty,
                      branchName: getTrainerBranchName(t),
                      slot
                    }).toString();

                    return (
                      <Link
                        key={slot}
                        className="px-2 py-1 rounded border border-slate-300 text-sm"
                        to={`/booking/review?${query}`}
                        onClick={() => saveBookingSelection({ trainerId: t._id, trainerName: t.name, specialty: t.specialty, branchName: getTrainerBranchName(t), slot })}
                      >
                        Review {slot}
                      </Link>
                    );
                  })}
                </div>
                {user && !!t.availableSlots.length && (
                  <p className="mt-2 text-xs text-slate-500">Select a slot above to continue through booking review.</p>
                )}
                {!user && <p className="text-sm text-slate-500 mt-2">Login to book a trainer slot.</p>}
              </div>
            ))}
            {!filteredTrainers.length && <p className="text-sm text-slate-500">No trainers found for this branch.</p>}
          </div>
          </>
        ) : <p className="text-sm text-slate-500">No trainers found. Admin can add trainers from the dashboard.</p>
      )}
    </Page>
  );
}
