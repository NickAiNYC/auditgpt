import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/subscription';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function updateBranding(formData: FormData) {
  'use server';
  const userId = await getCurrentUserId();
  if (!userId) return;

  const logoUrl = formData.get('logoUrl') as string;
  const primaryColor = formData.get('primaryColor') as string;

  await db.agency.update({
    where: { userId },
    data: {
      logoUrl: logoUrl || null,
      primaryColor: primaryColor || null,
    }
  });

  revalidatePath('/agency');
}

export default async function AgencyDashboard() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <header className="border-b border-border bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Logo variant="full" height={28} />
            </Link>
            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Agency Trust Partner
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-mono uppercase tracking-widest rounded-sm">
              Agency White-Label
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-foreground mb-6 leading-tight">
            Protect your clients' claims.<br />Prove your value.
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            AuditGPT for Agencies allows you to generate white-labeled Claim Drift Baselines for your prospects and clients. Win deals by showing them where their claims are naked, and retain them by actively governing their public proof.
          </p>

          <div className="bg-neutral-50 border border-border p-8 rounded-sm text-left mb-12">
            <h2 className="font-serif text-2xl mb-4">Agency Trust Partner Program</h2>
            <p className="text-lg mb-6">$999 / month</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80 mb-8">
              <li>Up to 10 client domains under management</li>
              <li>White-label Claim Drift Baselines</li>
              <li>Monthly automated scans for all clients</li>
              <li>Client-ready PDF exports with your logo</li>
              <li>Quarterly Governed Growth Certificates</li>
            </ul>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login?callbackUrl=/agency">Sign in to Apply &rarr;</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Ensure Agency record exists
  let agency = await db.agency.findUnique({
    where: { userId },
    include: {
      clients: {
        include: {
          audits: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  if (!agency) {
    const user = await db.user.findUnique({ where: { id: userId } });
    agency = await db.agency.create({
      data: {
        userId,
        companyName: user?.name || 'My Agency',
      },
      include: {
        clients: {
          include: {
            audits: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans">
      <header className="border-b border-stone-200/50 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-stone-500">
            Agency White-label
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-stone-900">Agency Dashboard</h1>
          <p className="mt-2 text-stone-500">Manage your branding and client reports.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Branding Settings */}
          <div className="border border-stone-200 rounded-xl bg-white p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="text-xl font-serif mb-4">Branding Settings</h2>
            <form action={updateBranding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Logo URL</label>
                <input 
                  type="url" 
                  name="logoUrl"
                  defaultValue={agency.logoUrl || ''}
                  placeholder="https://your-agency.com/logo.png"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <p className="text-xs text-stone-500 mt-1">Must be a direct link to an image.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Primary Color (Hex)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="primaryColor"
                    defaultValue={agency.primaryColor || '#252923'}
                    className="h-9 w-9 rounded border border-stone-300 p-0"
                  />
                  <input 
                    type="text" 
                    name="primaryColorText"
                    defaultValue={agency.primaryColor || '#252923'}
                    placeholder="#HexCode"
                    className="flex-1 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                    onChange={(e) => {
                      const colorInput = e.target.previousElementSibling as HTMLInputElement;
                      if (colorInput) colorInput.value = e.target.value;
                    }}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-stone-900 text-white hover:bg-stone-800">
                  Save Branding
                </Button>
              </div>
            </form>
          </div>

          {/* Client List */}
          <div className="border border-stone-200 rounded-xl bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
              <h2 className="text-xl font-serif">Client Reports</h2>
              <Button asChild variant="outline" size="sm">
                <Link href={`/snapshot?agencyId=${agency.id}`}>+ New Client Audit</Link>
              </Button>
            </div>

            {agency.clients.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <p>No clients audited yet.</p>
                <p className="text-sm mt-1">Run your first white-labeled audit to see it here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agency.clients.map((client) => {
                  const latestAudit = client.audits[0];
                  return (
                    <div key={client.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-lg bg-[#faf9f8]">
                      <div>
                        <p className="font-medium text-stone-900">{client.name}</p>
                        <p className="text-sm text-stone-500">{client.url}</p>
                      </div>
                      {latestAudit ? (
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/audit/${latestAudit.publicId}`}>View Report →</Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-stone-400">No report yet</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
