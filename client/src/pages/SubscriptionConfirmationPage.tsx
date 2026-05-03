import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Page } from '../components/Page';
import { clearCheckoutDraft, readCheckoutDraft } from '../lib/flowStorage';
import { formatAED } from '../lib/uaeFormat';

export function SubscriptionConfirmationPage() {
  const navigate = useNavigate();
  const draft = readCheckoutDraft();
  const paymentRef = useMemo(
    () => `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
    []
  );

  useEffect(() => {
    if (!draft) navigate('/plans');
    return () => clearCheckoutDraft();
  }, [draft, navigate]);

  if (!draft) return null;

  return (
    <Page title="Subscription Activated">
      <div className="max-w-2xl bg-white rounded-xl shadow p-5 space-y-3">
        <p className="text-emerald-700 font-semibold">Payment successful and membership is now active.</p>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p><span className="font-medium">Payment Ref:</span> {paymentRef}</p>
          {draft.membershipId && <p><span className="font-medium">MongoDB ID:</span> {draft.membershipId}</p>}
          <p><span className="font-medium">Plan:</span> {draft.planName}</p>
          <p><span className="font-medium">Amount:</span> {formatAED(draft.amount)}</p>
          <p><span className="font-medium">Duration:</span> {draft.durationDays} days</p>
          <p><span className="font-medium">Member:</span> {draft.fullName}</p>
          <p><span className="font-medium">Card:</span> **** **** **** {draft.cardLast4}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link to="/dashboard" className="rounded bg-brand-600 text-white px-4 py-2 text-sm">Go to Dashboard</Link>
          <Link to="/plans" className="rounded border border-slate-300 px-4 py-2 text-sm">View Other Plans</Link>
        </div>
      </div>
    </Page>
  );
}
