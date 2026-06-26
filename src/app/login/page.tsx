'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/logo';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isVerify = params.get('verify') === '1';
  const oauthError = params.get('error');

  // If already logged in, send home
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setError(null);
    const res = await signIn('email', {
      email: email.trim(),
      redirect: false,
      callbackUrl: '/',
    });
    setSending(false);
    if (res?.error) {
      setError('Could not send magic link. Check that email server env vars are configured.');
    } else if (res?.ok) {
      setSent(true);
    } else {
      setError('Sign-in failed. Try again.');
    }
  };

  return (
    <>
      {!isVerify && !sent && (
        <>
          <form onSubmit={submit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoFocus
              required
              className="input-polsia !text-base !rounded-sm !border-black"
              style={{ height: 'auto' }}
            />
            <button
              type="submit"
              disabled={!email.trim() || sending}
              className="btn-polsia"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" /> SENDING...
                </>
              ) : (
                <>SEND MAGIC LINK</>
              )}
            </button>
            {(error || oauthError) && (
              <p className="text-sm text-red-600 text-center">
                {error || 'Sign-in provider is not configured for this environment.'}
              </p>
            )}
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            OAuth buttons appear automatically when Google or GitHub credentials are configured.
          </p>
        </>
      )}

      {(isVerify || sent) && (
        <div className="card-polsia p-6 text-center">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-green-600" />
          <p className="text-sm text-foreground/85 mb-2">
            Magic link sent to <strong>{email || 'your email'}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            If you don&apos;t see it in 30 seconds, check your spam folder.
          </p>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <a href="/" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to main
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 border border-black rounded-sm mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-3xl mb-2">
              Sign in to AuditGPT
            </h1>
            <p className="text-sm text-muted-foreground">
              Magic link only — no passwords. Enter your email and we will send a sign-in link.
            </p>
          </div>

          <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-8">Loading...</div>}>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing in you agree to receive occasional product emails. No spam.
          </p>
        </div>
      </main>
    </div>
  );
}
