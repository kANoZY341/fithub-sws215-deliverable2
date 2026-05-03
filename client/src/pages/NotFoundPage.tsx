import { Link } from 'react-router-dom';
import { Page } from '../components/Page';

export function NotFoundPage() {
  return (
    <Page title="Page Not Found">
      <p className="mb-3">The page you requested does not exist.</p>
      <Link className="text-brand-600" to="/">Back to Home</Link>
    </Page>
  );
}
