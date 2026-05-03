import { Link } from 'react-router-dom';
import { Page } from '../components/Page';

const values = [
  'Member-first digital gym experience',
  'Clear pricing and transparent plan terms',
  'Trainer quality and safety standards',
  'Reliable scheduling for UAE working routines'
];

export function AboutPage() {
  return (
    <Page title="About FitHub UAE">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-white rounded-xl shadow p-5 space-y-3">
          <h2 className="text-xl font-semibold">Who We Are</h2>
          <p className="text-sm text-slate-700">
            FitHub UAE is a gym management platform for modern fitness operations across Dubai, Abu Dhabi, and Sharjah.
            We combine memberships, trainer scheduling, attendance, and member support in one streamlined interface.
          </p>
          <p className="text-sm text-slate-700">
            This project demonstrates a complete frontend flow for discovery, booking, and subscription checkout.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-3">Our Values</h2>
          <ul className="list-disc ml-5 space-y-2 text-sm text-slate-700">
            {values.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 bg-gradient-to-r from-brand-600 to-brand-900 text-white rounded-xl p-5">
        <h2 className="text-xl font-semibold">Ready to Start?</h2>
        <p className="text-sm mt-1">Explore plans, review trainer profiles, and complete your booking in minutes.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/plans" className="rounded bg-white text-brand-900 px-3 py-2 text-sm font-medium">Explore Plans</Link>
          <Link to="/trainers" className="rounded border border-white px-3 py-2 text-sm">Meet Trainers</Link>
        </div>
      </section>
    </Page>
  );
}
