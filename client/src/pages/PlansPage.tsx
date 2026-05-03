import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Membership, Plan } from '../types';
import { formatAED } from '../lib/uaeFormat';
import { useAuth } from '../context/AuthContext';
import { ACTIVE_MEMBERSHIP_MESSAGE, LOGIN_REQUIRED_MEMBERSHIP_MESSAGE, hasActiveMembership } from '../lib/membershipRules';

export function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeMembership, setActiveMembership] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [plansRes, membershipsRes] = await Promise.all([
        api.get('/plans'),
        user ? api.get('/memberships/my') : Promise.resolve({ data: [] as Membership[] })
      ]);
      setPlans(plansRes.data);
      setActiveMembership(hasActiveMembership(membershipsRes.data));
      setMessage('');
    } catch (err: any) {
      setPlans([]);
      setMessage(err?.response?.data?.message || 'Unable to load plans from the backend.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Page title="Membership Plans">
      {message && <p className="mb-4 text-sm">{message}</p>}
      {activeMembership && <p className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{ACTIVE_MEMBERSHIP_MESSAGE}</p>}
      {loading ? <p>Loading plans...</p> : (
        plans.length ? (
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <article key={plan._id} className="bg-white rounded-xl shadow p-4 space-y-2">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="text-2xl font-bold">{formatAED(plan.price)}</p>
                <p className="text-sm text-slate-600">{plan.durationDays} days</p>
                <ul className="text-sm list-disc ml-4">
                  {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to={`/plans/${plan._id}`} state={{ plan }} className="px-3 py-2 rounded border border-slate-300 text-sm">View Details</Link>
                  {activeMembership ? (
                    <button disabled className="px-3 py-2 rounded bg-slate-200 text-slate-500 text-sm cursor-not-allowed">
                      Active Plan Exists
                    </button>
                  ) : !user ? (
                    <Link
                      to="/login"
                      state={{
                        from: `/checkout?planId=${plan._id}`,
                        message: LOGIN_REQUIRED_MEMBERSHIP_MESSAGE
                      }}
                      className="px-3 py-2 rounded bg-brand-600 text-white text-sm"
                    >
                      Checkout
                    </Link>
                  ) : (
                    <Link to={`/checkout?planId=${plan._id}`} className="px-3 py-2 rounded bg-brand-600 text-white text-sm">
                      Checkout
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : <p className="text-sm text-slate-500">No active plans found. Admin can add plans from the dashboard.</p>
      )}
      <p className="mt-4 text-sm text-slate-600">Prices include 5% VAT.</p>
    </Page>
  );
}
