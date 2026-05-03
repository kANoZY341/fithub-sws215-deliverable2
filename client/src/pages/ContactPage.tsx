import { useState } from 'react';
import { Page } from '../components/Page';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name || !form.email || !form.phone || !form.branch || !form.message) {
      setError('Please complete all fields.');
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.message.trim().length < 10) {
      setError('Message should be at least 10 characters.');
      return;
    }

    setSuccess('Your enquiry has been submitted. FitHub UAE team will contact you shortly.');
    setForm({ name: '', email: '', phone: '', branch: '', message: '' });
  };

  return (
    <Page title="Contact FitHub UAE">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-white rounded-xl shadow p-5 space-y-2 text-sm">
          <h2 className="text-xl font-semibold">Support Channels</h2>
          <p>Email: support@fithub-uae.com</p>
          <p>Phone: +971 4 555 0101</p>
          <p>Working Hours: Mon-Sat, 7:00 AM to 10:00 PM</p>
          <p className="text-slate-600">Messages are validated on this page for the academic project workflow.</p>
        </section>

        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-5 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <select
            className="w-full rounded border border-slate-300 px-3 py-2"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option value="">Select branch</option>
            <option value="Dubai - Al Barsha">Dubai - Al Barsha</option>
            <option value="Sharjah - Al Nahda">Sharjah - Al Nahda</option>
            <option value="Abu Dhabi - Al Reem">Abu Dhabi - Al Reem</option>
          </select>
          <textarea
            rows={4}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button className="rounded bg-brand-600 text-white px-4 py-2">Send Message</button>
        </form>
      </div>
    </Page>
  );
}
