import { redirect } from 'next/navigation';

// /polsia → /compare
// The takedown page has been elevated into a multi-competitor comparison.
// Old links redirect here so they don't break.
export default function PolsiaRedirect() {
  redirect('/compare');
}
