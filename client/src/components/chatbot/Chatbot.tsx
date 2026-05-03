import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ChatMessage = { sender: 'bot' | 'user'; text: string };

const faqReplies: Record<string, string> = {
  plans: 'We offer Starter and Pro memberships with different durations and features. Open Plans to compare and subscribe.',
  checkin: 'Open Attendance page and click Check-in. This creates an attendance record for your account.',
  booking: 'Open Trainers page, pick a trainer and an available slot, then confirm the booking from the review page.',
  refund: 'Refunds are handled by admin review. Contact front desk/admin from your profile for assistance.'
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hi, I am FitHub Assistant. Ask me about plans, check-in, booking, or refund policy.' }
  ]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickLinks = useMemo(
    () => [
      { label: 'Go to Plans', path: '/plans' },
      { label: 'Go to Trainers', path: '/trainers' },
      { label: 'Go to Dashboard', path: '/dashboard' }
    ],
    []
  );

  const getReply = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes('plan')) return faqReplies.plans;
    if (q.includes('check') || q.includes('attendance')) return faqReplies.checkin;
    if (q.includes('book') || q.includes('trainer')) return faqReplies.booking;
    if (q.includes('refund')) return faqReplies.refund;
    if (!user && (q.includes('account') || q.includes('my booking') || q.includes('my membership'))) {
      return 'Please login or register first so I can guide you to account-specific pages.';
    }
    return 'I can help with plans, check-in, booking, refund policy, and quick navigation.';
  };

  const onAsk = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const reply = getReply(text);

    setMessages((prev) => [...prev, { sender: 'user', text }, { sender: 'bot', text: reply }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-2 left-2 md:left-auto md:right-4 z-[60] flex flex-col items-end gap-2 pointer-events-none">
      {open && (
        <div className="pointer-events-auto w-full md:w-[22rem] max-w-[22rem] bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden">
          <div className="bg-brand-600 text-white px-4 py-2 text-sm font-semibold flex items-center justify-between">
            <span>FitHub Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-xs rounded bg-white/20 px-2 py-1 hover:bg-white/30"
              aria-label="Close chat"
            >
              Close
            </button>
          </div>
          <div className="h-64 md:h-72 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm p-2 rounded ${m.sender === 'bot' ? 'bg-white' : 'bg-brand-50 text-brand-900'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-slate-200 space-y-2">
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && onAsk()}
              />
              <button onClick={onAsk} className="px-3 py-1 rounded bg-brand-600 text-white text-sm">Send</button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto bg-brand-600 text-white rounded-full px-4 py-3 shadow-lg hover:bg-brand-500"
      >
        {open ? 'Hide Chat' : 'Chat'}
      </button>
    </div>
  );
}
