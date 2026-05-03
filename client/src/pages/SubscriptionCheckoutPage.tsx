import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Membership, Plan } from '../types';
import { formatAED } from '../lib/uaeFormat';
import { saveCheckoutDraft } from '../lib/flowStorage';
import { useAuth } from '../context/AuthContext';
import { readAccountProfile } from '../lib/accountProfile';
import { ACTIVE_MEMBERSHIP_MESSAGE, LOGIN_REQUIRED_MEMBERSHIP_MESSAGE, hasActiveMembership } from '../lib/membershipRules';

export function SubscriptionCheckoutPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const planId = searchParams.get('planId') || '';
  const statePlan = (location.state as { plan?: Plan } | null)?.plan || null;
  const { user, loading: authLoading } = useAuth();
  const accountProfile = readAccountProfile();

  const [plan, setPlan] = useState<Plan | null>(statePlan);
  const [form, setForm] = useState({
    fullName: accountProfile?.fullName || user?.fullName || user?.name || '',
    email: accountProfile?.email || user?.email || '',
    phone: accountProfile?.phone || user?.phone || '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [activeMembership, setActiveMembership] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', {
        replace: true,
        state: {
          from: `${location.pathname}${location.search}`,
          message: LOGIN_REQUIRED_MEMBERSHIP_MESSAGE
        }
      });
    }
  }, [authLoading, location.pathname, location.search, navigate, user]);

  useEffect(() => {
    const loadPlan = async () => {
      if (!planId) return;
      if (statePlan && statePlan._id === planId) {
        setPlan(statePlan);
        return;
      }

      try {
        const { data } = await api.get(`/plans/${planId}`);
        setPlan(data);
      } catch (err: any) {
        setPlan(null);
        setError(err?.response?.data?.message || 'Unable to load selected plan.');
      }
    };
    loadPlan();
  }, [planId, statePlan]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: accountProfile?.fullName || user?.fullName || user?.name || prev.fullName,
      email: accountProfile?.email || user?.email || prev.email,
      phone: accountProfile?.phone || user?.phone || prev.phone
    }));
  }, [accountProfile?.email, accountProfile?.fullName, accountProfile?.phone, user?.email, user?.fullName, user?.name, user?.phone]);

  useEffect(() => {
    if (!user) {
      setActiveMembership(false);
      return;
    }

    api.get('/memberships/my')
      .then((res) => {
        const hasActive = hasActiveMembership(res.data as Membership[]);
        setActiveMembership(hasActive);
        if (hasActive) {
          setError(ACTIVE_MEMBERSHIP_MESSAGE);
        }
      })
      .catch(() => setActiveMembership(false));
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digits = form.cardNumber.replace(/\s/g, '');
    if (!plan) return setError('Please choose a plan first.');
    if (activeMembership) return setError(ACTIVE_MEMBERSHIP_MESSAGE);
    if (!form.fullName || !form.email || !form.phone || !form.cardNumber || !form.expiry || !form.cvv) {
      return setError('All fields are required.');
    }
    if (!emailRegex.test(form.email)) return setError('Invalid email address.');
    if (!/^\d{16}$/.test(digits)) return setError('Card number must be 16 digits.');
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return setError('Expiry must be MM/YY.');
    if (!/^\d{3,4}$/.test(form.cvv)) return setError('CVV must be 3 or 4 digits.');
    if (!user) return setError(LOGIN_REQUIRED_MEMBERSHIP_MESSAGE);

    try {
      const { data } = await api.post('/memberships/subscribe', { planId: plan._id });
      await api.patch('/users/me', { phone: form.phone });

      saveCheckoutDraft({
        membershipId: data._id,
        planId: plan._id,
        planName: plan.name,
        amount: plan.price,
        durationDays: plan.durationDays,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        cardLast4: digits.slice(-4)
      });

      navigate('/checkout/success');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Membership activation failed.');
    }
  };

  return (
    authLoading || !user ? (
      <Page title="Login Required">
        <p className="text-sm text-slate-600">Redirecting to login...</p>
      </Page>
    ) :
    <Page title="Subscription Checkout">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {plan ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Plan:</span> {plan.name}</p>
              <p><span className="font-medium">Duration:</span> {plan.durationDays} days</p>
              <p><span className="font-medium">Total:</span> {formatAED(plan.price)}</p>
              <p className="text-xs text-slate-500">Includes UAE VAT.</p>
            </div>
          ) : (
            <p className="text-sm">Plan not selected. Choose a plan first.</p>
          )}
          <Link to="/plans" className="inline-block mt-3 text-sm text-brand-700 hover:underline">Back to plans</Link>
        </section>

        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-5 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {activeMembership && <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{ACTIVE_MEMBERSHIP_MESSAGE}</p>}
          <input disabled={activeMembership} className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-100" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input disabled={activeMembership} className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-100" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input disabled={activeMembership} className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-100" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input disabled={activeMembership} className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-100" placeholder="Card number (16 digits)" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input disabled={activeMembership} className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-100" placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            <input disabled={activeMembership} className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-100" placeholder="CVV" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} />
          </div>
          <button disabled={activeMembership} className="rounded bg-brand-600 text-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600">
            {activeMembership ? 'Active Plan Exists' : 'Pay & Activate'}
          </button>
        </form>
      </div>
    </Page>
  );
}
