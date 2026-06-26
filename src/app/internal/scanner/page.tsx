'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';

type ScanResult = {
  url: string;
  status: string;
  pms: string;
};

export default function ProspectScanner() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!urls.trim()) return;

    setIsScanning(true);
    setError(null);
    setResults([]);

    const urlList = urls.split('\n').filter(u => u.trim() !== '');

    try {
      const res = await fetch('/api/scan-pms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setResults(data.results);
      } else {
        setError(data.message || 'Failed to scan URLs');
      }
    } catch (e) {
      setError('A network error occurred while scanning.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8 font-sans text-stone-900">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-sm shadow-sm border border-stone-200">
        <header className="mb-8 border-b border-stone-200 pb-4">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Internal Prospect Scanner</h1>
          <p className="text-stone-500 text-sm">Batch analyze clinic URLs for Boulevard or Mangomint booking widgets to build the outreach pipeline.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <label className="block text-sm font-medium text-stone-900">
              Target URLs (One per line)
            </label>
            <textarea
              className="w-full h-64 p-3 bg-stone-50 border border-stone-200 rounded-sm font-mono text-sm focus:outline-none focus:border-stone-400 focus:ring-0"
              placeholder={`skinly.com\nyoutherapy.com\nsmoothsynergy.com`}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isScanning}
            />
            <button
              onClick={handleScan}
              disabled={isScanning || !urls.trim()}
              className="w-full bg-stone-900 text-white font-mono text-sm uppercase tracking-widest px-4 py-3 rounded-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {isScanning ? 'Scanning...' : 'Run Diagnostic Scan'}
            </button>
            
            {error && (
              <div className="text-red-600 text-sm mt-4 bg-red-50 p-3 rounded-sm border border-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-medium text-stone-900 mb-4">Scan Results</h2>
            
            {results.length > 0 ? (
              <div className="overflow-x-auto border border-stone-200 rounded-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">URL</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Detected PMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="px-4 py-3 font-medium text-stone-900 truncate max-w-[200px]" title={r.url}>
                          <a href={r.url.startsWith('http') ? r.url : `https://${r.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {r.url}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            r.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {r.pms === 'Boulevard' || r.pms === 'Mangomint' ? (
                            <span className="font-mono bg-stone-900 text-white px-2 py-0.5 rounded-sm text-xs">
                              {r.pms}
                            </span>
                          ) : r.pms === 'Unknown' ? (
                            <span className="text-stone-400 italic">Unknown / Other</span>
                          ) : (
                            <span className="text-red-500 text-xs truncate max-w-[150px] block" title={r.pms}>{r.pms}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-stone-200 flex items-center justify-center text-stone-400 text-sm rounded-sm">
                {isScanning ? 'Scanning network...' : 'No results to display. Enter URLs and run scan.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
