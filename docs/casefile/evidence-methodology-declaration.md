# Declaration of Records Custodian — Scrutexity CaseFile

**[COUNSEL-READY DRAFT — attach to Expedited CaseFiles only after counsel review of the
Records Integrity Methodology v0.9.2, which this Declaration incorporates by reference.]**

---

I, **[Name]**, declare as follows:

**1. Role.** I am the founder and records custodian of Scrutexity, operator of an automated
system that observes, records, and preserves publicly accessible marketing statements and
publicly obtainable AI-system outputs concerning commercial websites (the "System"). I make
this Declaration based on personal knowledge of the System's design and operation, and on
records made and kept in the ordinary course of Scrutexity's regularly conducted activity.

**2. What the System records.** On a scheduled, automated basis, the System (a) retrieves the
publicly accessible content of specified web pages using standard HTTP requests, identifying
itself in its User-Agent header; (b) computes a SHA-256 digest of the exact bytes received and
preserves those bytes unaltered in content-addressed storage, such that the stored object's
name is derived from its own digest; (c) extracts discrete marketing statements ("claims")
from the retrieved content by deterministic parsing, recording each claim's text, normalized
form, and digest; and (d) submits standardized queries to publicly available AI answer
services via their published interfaces and preserves the responses received, together with
the query text, its digest, and the service and model identifiers as exposed by the provider.
Where a provider does not expose a model identifier, the record states so explicitly rather
than supplying one.

**3. Chain of custody and tamper evidence.** Each recorded lifecycle event (a claim first
being observed, changing, or no longer appearing) is assigned a sequential position in a
per-claim chain and a digest computed over the event's canonical contents, including the
digest of the prior event's state. Event batches are sealed into an append-only hash chain
whose current head digest is published at a public endpoint (the "CRT digest"). Because each
digest incorporates its predecessors, any alteration, insertion, or deletion of a recorded
event after sealing produces digests that fail recomputation. Records are made at or near the
time of the observed events by the automated System, without manual editing; capture failures
are themselves recorded as failure events rather than omitted or approximated.

**4. What this record attests to — and what it does not.** A CaseFile attests only that: the
identified pages, when retrieved on the recorded dates from the recorded URLs (including any
post-redirect resolved URL), consisted of the preserved bytes; that the quoted statements
appeared in, changed within, or ceased to appear in that content on the recorded dates; and
that the identified AI services returned the preserved responses to the recorded queries on
the recorded dates. **A CaseFile does not attest to, and Scrutexity expresses no opinion on:**
the truth or falsity of any recorded statement; whether any statement complied with any law,
regulation, or standard; the completeness of coverage outside the recorded observations; or
the intent of any party. The absence of recorded evidence supporting a statement is reported
as an observation about visibility, not as a finding of falsity or wrongdoing.

**5. Independent verification.** Any third party may verify a CaseFile without Scrutexity's
cooperation, as follows: (a) canonicalize the CaseFile JSON per Methodology §3 (sorted keys,
UTF-8) and confirm its SHA-256 equals the `bundle_sha256` stated in the accompanying manifest;
(b) for any preserved snapshot, compute SHA-256 over the produced bytes and confirm it equals
the recorded `page_snapshot_hash`; (c) recompute any event digest from the event's recorded
fields per Methodology §3 and confirm equality with the recorded `event_digest`, including
its linkage to the prior event's state digest; and (d) confirm the bundle's included event
digests are consistent with the public CRT digest published at the endpoint stated in the
bundle's integrity section, whose historical heads are publicly archived. Verification
software implementing steps (a)–(d) is published under an open-source license.

**6. Retention and access.** Preserved bytes and records are retained in durable storage and
are not modified after sealing. Access credentials to production storage are held server-side
only. Copies produced for this matter are true duplicates of the sealed records.

I declare under penalty of perjury that the foregoing is true and correct to the best of my
knowledge.

Executed on ____________ at ____________.

____________________________
[Name], Records Custodian, Scrutexity

---

*Bundle reference: casefile_id `____________` · bundle_sha256 `____________` · CRT head at
issuance `____________` · Methodology version `____________`*
