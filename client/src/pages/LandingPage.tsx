import { Link } from 'react-router-dom';
import { Page } from '../components/Page';

const branchHighlights = [
  { name: 'Dubai - Al Barsha', details: 'Flagship club with strength floor, studio classes, and recovery lounge.' },
  { name: 'Sharjah - Al Nahda', details: 'Community-first branch for family schedules and evening training.' },
  { name: 'Abu Dhabi - Al Reem', details: 'Premium waterfront facility with extended weekend coaching hours.' }
];

const benefits = [
  'Flexible memberships with UAE-friendly schedules',
  'Certified multi-lingual trainers',
  'Fast booking and attendance tracking',
  'Single dashboard for members and gym admins'
];

const testimonials = [
  { quote: 'FitHub helped me stay consistent during my Abu Dhabi work travel weeks.', author: 'Lina M., Consultant' },
  { quote: 'The trainer booking flow is quick, and Friday slots are perfect for my routine.', author: 'Sajid R., Engineer' },
  { quote: 'I like that everything from memberships to check-ins is clear in one app.', author: 'Reem A., Marketing Lead' }
];

const faqs = [
  { question: 'Can I switch branches?', answer: 'Yes, set your preferred branch from Profile and our team can coordinate your visits.' },
  { question: 'Do prices include VAT?', answer: 'Yes. All listed prices include 5% VAT.' },
  { question: 'Are Friday and Saturday trainer slots available?', answer: 'Yes, selected trainers have dedicated Fri/Sat availability.' }
];

export function LandingPage() {
  return (
    <Page title="Welcome to FitHub UAE">
      <section className="grid md:grid-cols-2 gap-6 items-center mb-8">
        <div className="space-y-4">
          <p className="text-slate-600">
            Manage memberships, trainer bookings, attendance, and admin operations in one UAE-ready gym platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="px-4 py-2 rounded bg-brand-600 text-white" to="/plans">Explore Plans</Link>
            <Link className="px-4 py-2 rounded border border-slate-300" to="/register">Get Started</Link>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-900 text-white p-8">
          <h2 className="text-2xl font-semibold mb-2">Gym Management Simplified</h2>
          <ul className="space-y-1 text-sm">
            <li>UAE branch-based experience</li>
            <li>Membership activation and trainer booking records</li>
            <li>Attendance streak and performance tracking</li>
            <li>Built-in FAQ chatbot helper</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Branches</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {branchHighlights.map((branch) => (
            <article key={branch.name} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold">{branch.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{branch.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Benefits</h2>
        <div className="bg-white rounded-xl shadow p-4">
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-700 list-disc ml-4">
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-slate-700">"{item.quote}"</p>
              <footer className="mt-2 text-xs text-slate-500">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <article key={faq.question} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="text-sm text-slate-600 mt-1">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
