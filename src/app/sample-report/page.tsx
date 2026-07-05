'use client';

import React from 'react';
import { auraMockData, ClaimStatus, RiskLevel } from '@/lib/mock-report-data';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle2, Info, XCircle, ChevronRight, Activity, ShieldAlert, Bot, SearchX } from 'lucide-react';

export default function SampleReportDashboard() {
  const data = auraMockData;

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moderate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'Supported': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Weakly Supported': return <Info className="w-4 h-4 text-amber-600" />;
      case 'Overstated': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'Unsupported': return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="hover:opacity-70 transition-opacity">
              <Logo variant="full" height={24} />
            </a>
            <div className="hidden md:flex items-center gap-3 border-l border-stone-200 pl-6">
              <Badge variant="outline" className="bg-stone-100 text-stone-600 font-mono text-xs uppercase tracking-wider">
                Sample Report
              </Badge>
              <span className="font-medium text-stone-900">{data.clinicName}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Claim Support Score</span>
              <div className="flex items-center gap-2">
                <Progress value={data.overallGovernanceScore} className="w-24 h-2 bg-stone-200" indicatorColor="bg-amber-500" />
                <span className="font-mono text-sm font-bold text-amber-600">{data.overallGovernanceScore}/100</span>
              </div>
            </div>
            <a href="/auditgpt" className="bg-stone-900 text-stone-50 font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm hover:bg-stone-800 transition-colors shadow-sm whitespace-nowrap">
              Run Free Snapshot
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-2" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Claim Intelligence Audit: {data.clinicName}
          </h1>
          <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">
            Generated: {data.generatedAt} {'//'} Vertical: {data.industry}
          </p>
        </div>

        {/* Verdict stamp + illustrative-sample banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-sm bg-amber-50 border border-amber-200 shrink-0">
              <span className="text-2xl font-bold text-amber-600 leading-none">C</span>
              <span className="text-[10px] font-mono text-amber-700 mt-0.5">{data.overallGovernanceScore}/100</span>
            </div>
            <div>
              <div className="text-sm font-medium text-stone-900">Claim support: review recommended</div>
              <div className="text-xs text-stone-500 mt-0.5">Two high-priority claims need visible proof before they carry weight.</div>
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 bg-stone-100 border border-stone-200 rounded-sm px-3 py-2 text-center sm:text-right">
            Fictional demonstration. Not a real client audit. · Northwind AI is fictional · figures illustrative
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4 bg-stone-200/50 p-1 rounded-sm mb-8">
            <TabsTrigger value="summary" className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm">Summary</TabsTrigger>
            <TabsTrigger value="claims" className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm">Claims</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm">AI Answer Reality</TabsTrigger>
            <TabsTrigger value="leakage" className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm">Claim Drift</TabsTrigger>
          </TabsList>

          {/* TAB 1: EXECUTIVE SUMMARY */}
          <TabsContent value="summary" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-sm shadow-sm border-stone-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase text-stone-500 tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> High-Priority Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-stone-900">{data.executiveSummary.criticalRisks}</div>
                  <p className="text-sm text-stone-500 mt-1">Overstated or unsupported claims</p>
                </CardContent>
              </Card>

              <Card className="rounded-sm shadow-sm border-stone-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase text-stone-500 tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" /> Buyer-Trust Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-stone-900">{data.executiveSummary.demandLeakageEst}</div>
                  <p className="text-sm text-stone-500 mt-1">Buyers discount unprovable claims</p>
                </CardContent>
              </Card>

              <Card className="rounded-sm shadow-sm border-stone-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase text-stone-500 tracking-widest flex items-center gap-2">
                    <Bot className="w-4 h-4 text-stone-400" /> AI Citation Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-stone-900">{data.executiveSummary.aiVisibilityScore}<span className="text-xl text-stone-400">/100</span></div>
                  <Progress value={data.executiveSummary.aiVisibilityScore} className="w-full h-1 mt-2 bg-stone-100" indicatorColor="bg-stone-800" />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-stone-900 text-stone-50 border-none rounded-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  Key Diagnostic Takeaway
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-300 leading-relaxed text-lg">
                  "{data.executiveSummary.keyTakeaway}"
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Simplified Risk Heatmap */}
               <Card className="rounded-sm border-stone-200 shadow-sm">
                 <CardHeader>
                   <CardTitle className="text-sm font-medium">Risk Heatmap Distribution</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1"><span>High Priority</span><span className="text-orange-600 font-bold">3 Claims</span></div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 w-1/2 h-full"></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1"><span>Moderate</span><span className="text-amber-600 font-bold">1 Claim</span></div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 w-1/6 h-full"></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1"><span>Low / Supported</span><span className="text-green-600 font-bold">2 Claims</span></div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden"><div className="bg-green-500 w-1/3 h-full"></div></div>
                      </div>
                    </div>
                 </CardContent>
               </Card>
               <Card className="rounded-sm border-stone-200 shadow-sm">
                 <CardHeader>
                   <CardTitle className="text-sm font-medium">Proof Density</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <ul className="space-y-3">
                     <li className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                       <span className="text-stone-600">Benchmarks / sources linked</span>
                       <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{data.proofDensity.clinicalCitations}</Badge>
                     </li>
                     <li className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                       <span className="text-stone-600">Named case studies</span>
                       <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{data.proofDensity.providerBios}</Badge>
                     </li>
                     <li className="flex justify-between items-center text-sm">
                       <span className="text-stone-600">Verifiable customer proof</span>
                       <Badge variant="outline" className="bg-stone-100 text-stone-700 border-stone-200">{data.proofDensity.beforeAfterVerified}</Badge>
                     </li>
                   </ul>
                 </CardContent>
               </Card>
            </div>
          </TabsContent>

          {/* TAB 2: CLAIM INVENTORY */}
          <TabsContent value="claims" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="rounded-sm border-stone-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-stone-100">
                <CardTitle className="text-lg">Claim Inventory & Remediation</CardTitle>
                <CardDescription>Click a row to view evidence gaps and safer framing alternatives.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {data.claimInventory.map((claim) => (
                    <AccordionItem value={claim.id} key={claim.id} className="border-b border-stone-100 last:border-0 bg-white">
                      <AccordionTrigger className="px-6 py-4 hover:bg-stone-50/50 hover:no-underline data-[state=open]:bg-stone-50/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-4 text-left">
                          <div className="flex-1">
                            <span className="font-mono text-xs text-stone-400 mr-3">{claim.id}</span>
                            <span className="text-sm font-medium text-stone-900">{claim.originalClaim}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600">
                              {getStatusIcon(claim.status)} {claim.status}
                            </div>
                            <Badge variant="outline" className={`w-20 justify-center text-[10px] uppercase font-mono tracking-wider ${getRiskColor(claim.riskLevel)}`}>
                              {claim.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2 bg-stone-50/50 border-t border-stone-100/50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-mono uppercase tracking-widest text-red-800 mb-2 flex items-center gap-2">
                                <XCircle className="w-3 h-3" /> Evidence Gap
                              </h4>
                              <p className="text-sm text-stone-700 bg-white p-4 border border-stone-200 rounded-sm leading-relaxed">
                                {claim.evidenceGap}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">Compliance Note</h4>
                              <p className="text-xs text-stone-500 leading-relaxed italic border-l-2 border-stone-300 pl-3">
                                {claim.riskNote}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-800 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3" /> Safer Framing Alternative
                            </h4>
                            <div className="bg-emerald-50/50 p-4 border border-emerald-200 rounded-sm h-[calc(100%-24px)]">
                              <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                                "{claim.saferFraming}"
                              </p>
                              <div className="mt-4 pt-4 border-t border-emerald-200/50 text-xs text-emerald-800/70">
                                This framing replaces an absolute claim with something specific and provable — easier for a buyer to trust, and for an AI engine to cite.
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: AI ANSWER REALITY */}
          <TabsContent value="ai" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-6">
                <h2 className="text-xl font-medium">AI Engine Simulation</h2>
                <p className="text-sm text-stone-500">How LLMs interpret your brand based strictly on currently indexable evidence.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {data.aiVisibility.map((ai, i) => (
                 <Card key={i} className="rounded-sm border-stone-200 shadow-sm flex flex-col">
                   <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
                     <div className="flex justify-between items-start">
                       <CardTitle className="text-base font-medium flex items-center gap-2">
                         <Bot className="w-4 h-4 text-stone-400" /> {ai.engine}
                       </CardTitle>
                       <div className="text-right">
                         <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">Citation Likelihood</div>
                         <div className="flex items-center justify-end gap-2">
                           <span className={`text-sm font-bold ${ai.citationLikelihood < 30 ? 'text-red-600' : 'text-amber-600'}`}>{ai.citationLikelihood}%</span>
                         </div>
                       </div>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-6 flex-1 flex flex-col">
                     <div className="bg-stone-900 text-stone-100 p-4 rounded-sm font-mono text-sm leading-relaxed mb-6 relative">
                        <div className="absolute top-2 left-2 flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="mt-4 opacity-90">{ai.simulatedDescription}</div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-red-600 mb-2">Entity Gaps (Missing)</h5>
                          <ul className="text-xs text-stone-600 space-y-1">
                            {ai.entityGaps.map((gap, j) => <li key={j} className="flex items-start gap-1"><SearchX className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />{gap}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-red-600 mb-2">Index Weaknesses</h5>
                          <ul className="text-xs text-stone-600 space-y-1">
                            {ai.weaknesses.map((w, j) => <li key={j} className="flex items-start gap-1"><AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />{w}</li>)}
                          </ul>
                        </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </TabsContent>

          {/* TAB 4: CLAIM DRIFT */}
          <TabsContent value="leakage" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="rounded-sm border-stone-200 shadow-sm">
                <CardHeader className="bg-stone-50/50 border-b border-stone-100">
                  <CardTitle>Claim Drift Analysis</CardTitle>
                  <CardDescription>{data.demandLeakage.summary}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-stone-100">
                        <TableHead className="font-mono text-xs uppercase tracking-widest text-stone-500">Funnel Area</TableHead>
                        <TableHead className="font-mono text-xs uppercase tracking-widest text-stone-500">Observed Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.demandLeakage.issues.map((issue, idx) => (
                        <TableRow key={idx} className="border-stone-100 hover:bg-stone-50/50">
                          <TableCell className="font-medium text-sm">{issue.area}</TableCell>
                          <TableCell className="text-sm text-stone-600">{issue.impact}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-8 p-6 bg-stone-900 rounded-sm text-center">
                     <h3 className="text-stone-100 font-medium text-lg mb-2">See where buyers lose trust</h3>
                     <p className="text-stone-400 text-sm mb-6 max-w-xl mx-auto">
                       The same gaps that make a claim hard to verify are the gaps that make a buyer hesitate. Run a free snapshot on your own page to see which claims hold up.
                     </p>
                     <a href="/auditgpt" className="inline-block bg-white text-stone-900 font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-stone-100 transition-colors shadow-sm">
                        Get a Free Snapshot
                     </a>
                  </div>
                </CardContent>
             </Card>
          </TabsContent>

        </Tabs>
      </main>

      {/* Footer Ladder */}
      <footer className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <div className="border-t border-stone-200 pt-12 pb-8">
           <h3 className="text-2xl font-serif mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
             "AuditGPT reviews public claims before trust becomes a problem."
           </h3>
           <p className="text-stone-500 text-sm mb-8">
             This sample report is just step one. Better claims require visible support.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-stone-400">
             <span className="text-stone-900 border-b border-stone-900 pb-1">1. Snapshot</span>
             <ChevronRight className="w-4 h-4 hidden sm:block opacity-30" />
             <span>2. Review</span>
             <ChevronRight className="w-4 h-4 hidden sm:block opacity-30" />
             <span>3. Evidence</span>
             <ChevronRight className="w-4 h-4 hidden sm:block opacity-30" />
             <span>4. Rewrites</span>
           </div>

           <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="/auditgpt" className="inline-block bg-stone-900 text-stone-50 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors shadow-md">
                Run Your Own Free Snapshot
             </a>
             <a href="https://scrutexity.com/claim-intelligence" className="inline-block border border-stone-300 text-stone-700 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-100 transition-colors">
               Push claims to Contento for governed rewrites →
             </a>
           </div>

           <p className="mt-12 text-xs text-stone-400 max-w-2xl mx-auto leading-relaxed">
             Fictional demonstration. Not a real client audit. AuditGPT reviews public website claims against visible evidence and suggests safer rewrites. It does not provide legal, medical, regulatory, or clinical advice, and does not guarantee compliance, rankings, AI answer changes, or revenue outcomes.
           </p>
        </div>
      </footer>

    </div>
  );
}
