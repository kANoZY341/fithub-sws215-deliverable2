import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Membership, Plan } from '../types';
import { formatAED } from '../lib/uaeFormat';
import { useAuth } from '../context/AuthContext';
import { ACTIVE_MEMBERSHIP_MESSAGE, LOGIN_REQUIRED_MEMBERSHIP_MESSAGE, hasActiveMembership } from '../lib/membershipRules';

export function PlanDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const statePlan = (location.state as { plan?: Plan } | null)?.plan || null;
  const [plan, setPlan] = useState<Plan | null>(statePlan);
  const [activeMembership, setActiveMembership] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPlan = async () => {
      if (!id) {
        setLoading(false);
        setError('Plan not found.');
        return;
      }
      if (statePlan && statePlan._id === id) {
        setPlan(statePlan);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/plans/${id}`);
        setPlan(data);
        setError('');
      } catch (err: any) {
        setPlan(null);
        setError(err?.response?.data?.message || 'Plan not found.');
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [id, statePlan]);

  useEffect(() => {
    if (!user) {
      setActiveMembership(false);
      return;
    }

    api.get('/memberships/my')
      .then((res) => setActiveMembership(hasActiveMembership(res.data as Membership[])))
      .catch(() => setActiveMembership(false));
  }, [user]);

  if (loading) {
    return <Page title="Plan Details"><p>Loading plan details...</p></Page>;
  }

  if (!plan) {
    return <Page title="Plan Details"><p className="text-red-600">{error || 'Plan not found.'}</p></Page>;
  }

  return (
    <Page title={plan.name}>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="bg-white rounded-xl shadow p-5 md:col-span-2">
          <p className="text-3xl font-bold">{formatAED(plan.price)}</p>
          <p className="text-sm text-slate-600 mt-1">{plan.durationDays} days membership</p>
          <h2 className="text-lg font-semibold mt-4 mb-2">Included Features</h2>
          <ul className="list-disc ml-5 space-y-2 text-sm text-slate-700">
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-4">All prices include 5% VAT.</p>
        </section>

        <section className="bg-white rounded-xl shadow p-5 space-y-2">
          {activeMembership && <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{ACTIVE_MEMBERSHIP_MESSAGE}</p>}
          {activeMembership ? (
            <button disabled className="block w-full cursor-not-allowed rounded bg-slate-200 px-4 py-2 text-center text-slate-500">
              Active Plan Exists
            </button>
          ) : !user ? (
            <Link
              to="/login"
              state={{
                from: `/checkout?planId=${plan._id}`,
                message: LOGIN_REQUIRED_MEMBERSHIP_MESSAGE
              }}
              className="block text-center rounded bg-brand-600 text-white px-4 py-2"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <Link to={`/checkout?planId=${plan._id}`} state={{ plan }} className="block text-center rounded bg-brand-600 text-white px-4 py-2">
              Proceed to Checkout
            </Link>
          )}
          <Link to="/plans" className="block text-center rounded border border-slate-300 px-4 py-2">Back to Plans</Link>
        </section>
      </div>
    </Page>
  );
}
