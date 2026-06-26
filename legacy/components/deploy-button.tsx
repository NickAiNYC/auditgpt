'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GitPullRequest, Loader2 } from 'lucide-react';

interface DeployButtonProps {
  publicId: string;
  disabled?: boolean;
}

export function DeployButton({ publicId, disabled }: DeployButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deploy/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          toast.error('Pro subscription required');
        } else if (data.error?.toLowerCase().includes('github not connected')) {
          // Trigger GitHub OAuth flow
          window.location.href = '/api/integrations/github/connect';
          return;
        } else {
          toast.error(data.error || 'Deploy failed');
        }
        return;
      }

      if (data.alreadyExisted) {
        toast.success(`PR updated: ${data.prUrl}`);
      } else {
        toast.success(`PR created: ${data.prUrl}`);
      }

      window.open(data.prUrl, '_blank');
    } catch (error) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDeploy}
      disabled={disabled || loading}
      variant="outline"
      size="sm"
      className="rounded-sm font-mono uppercase text-xs gap-1.5"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <GitPullRequest className="h-3.5 w-3.5" />
      )}
      {loading ? 'Creating PR...' : 'Deploy fixes'}
    </Button>
  );
}
