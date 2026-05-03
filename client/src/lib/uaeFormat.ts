const DUBAI_TIME_ZONE = 'Asia/Dubai';
const DUBAI_LOCALE = 'en-GB';

export const formatAED = (amount: number) => `AED ${amount.toLocaleString(DUBAI_LOCALE)}`;

export const formatDateDubai = (value: string | Date) =>
  new Intl.DateTimeFormat(DUBAI_LOCALE, {
    timeZone: DUBAI_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value));

export const formatDateTimeDubai = (value: string | Date) =>
  new Intl.DateTimeFormat(DUBAI_LOCALE, {
    timeZone: DUBAI_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(value));

export const getDubaiDateKey = (value: string | Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: DUBAI_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
    .format(new Date(value))
    .split('/')
    .reverse()
    .join('-');

export const getDaysRemaining = (endDate: string | Date) => {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
};
