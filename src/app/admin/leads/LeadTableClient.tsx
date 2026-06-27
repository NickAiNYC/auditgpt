"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id?: string;
  websiteUrl: string;
  email: string;
  businessType: string;
  sourcePage: string;
  submittedAt: string;
  status: string;
  trigger_found?: string;
}

const STATUSES = ["new", "scanning", "baseline_ready", "sent", "followed_up", "call_booked", "converted", "lost"];
const TRIGGERS = ["ai_competitor_displacement", "ai_claim_distortion", "unsupported_claims", "provider_profile_risk", "proof_gap", "reputation_inconsistency", "revenue_leakage", "unclear"];

export function LeadTableClient({ initialLeads, adminKey }: { initialLeads: Lead[], adminKey: string }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleUpdate = async (id: string | undefined, email: string, field: "status" | "trigger_found", value: string) => {
    const targetId = id || email;
    if (!targetId) return;

    setSavingId(targetId);
    
    // Optimistic update
    setLeads(current => current.map(l => 
      (l.id === targetId || l.email === targetId) ? { ...l, [field]: value } : l
    ));

    try {
      await fetch('/api/leads/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          id: targetId,
          [field]: value
        })
      });
    } catch (error) {
      console.error("Failed to update lead", error);
      // Revert in a real app, but for MVP keep it simple
    } finally {
      setSavingId(null);
    }
  };

  const filteredLeads = filterStatus === "all" ? leads : leads.filter(l => l.status === filterStatus);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Badge 
          className={`cursor-pointer ${filterStatus === "all" ? "bg-accent text-accent-foreground" : "bg-white/[0.05] text-muted-foreground hover:bg-white/10"}`}
          onClick={() => setFilterStatus("all")}
        >
          All
        </Badge>
        {STATUSES.map(s => (
          <Badge 
            key={s}
            className={`cursor-pointer ${filterStatus === s ? "bg-accent text-accent-foreground" : "bg-white/[0.05] text-muted-foreground hover:bg-white/10"}`}
            onClick={() => setFilterStatus(s)}
          >
            {s.replace('_', ' ')}
          </Badge>
        ))}
      </div>

      <div className="rounded-md border border-white/10 bg-white/[0.01] overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">URL</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Segment</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Submitted</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Trigger</TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-mono text-sm">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead, idx) => {
                const isSaving = savingId === (lead.id || lead.email);
                return (
                  <TableRow key={lead.id || idx} className={`border-white/10 transition-colors ${isSaving ? 'opacity-50' : 'hover:bg-white/[0.02]'}`}>
                    <TableCell className="font-medium text-sm text-foreground">
                      <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">
                        {lead.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <a href={`mailto:${lead.email}`} className="hover:text-accent">{lead.email}</a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] bg-white/[0.02] border-white/10">{lead.businessType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {new Date(lead.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <select 
                        className="bg-black border border-white/10 text-xs rounded px-2 py-1 text-muted-foreground focus:outline-none focus:border-accent min-w-[140px]"
                        value={lead.trigger_found || "unclear"}
                        onChange={(e) => handleUpdate(lead.id, lead.email, "trigger_found", e.target.value)}
                        disabled={isSaving}
                      >
                        {TRIGGERS.map(t => (
                          <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select 
                        className={`bg-black border text-xs rounded px-2 py-1 focus:outline-none focus:border-accent ${lead.status === 'new' ? 'border-amber-500/50 text-amber-500' : 'border-emerald-500/50 text-emerald-500'}`}
                        value={lead.status}
                        onChange={(e) => handleUpdate(lead.id, lead.email, "status", e.target.value)}
                        disabled={isSaving}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
