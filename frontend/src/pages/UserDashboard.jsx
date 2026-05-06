import React, { useContext, useEffect, useState } from "react";

import { api } from "../api/client";
import { AuthContext } from "../contexts/AuthContext.jsx";
import DiseaseChatbot from "../components/DiseaseChatbot.jsx";
import DiseaseMap from "../components/DiseaseMap.jsx";

export default function UserDashboard() {
  const { account } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [recentRecords, setRecentRecords] = useState([]);
  const [chatFinished, setChatFinished] = useState(false);

  const [mapData, setMapData] = useState([]);
  const [diseaseFilter, setDiseaseFilter] = useState("");
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const dashRes = await api.get("/api/user/dashboard");
        setRecentRecords(dashRes.data.recentRecords || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      }
    }
    load();
    
    async function loadMap() {
      setMapLoading(true);
      try {
        const res = await api.get("/api/analytics/disease-map");
        setMapData(res.data || []);
      } catch (err) {
        console.error("Map load failed", err);
      } finally {
        setMapLoading(false);
      }
    }
    loadMap();
  }, []);

  useEffect(() => {
    // Automatically set the disease filter to the user's latest historical condition
    if (recentRecords.length > 0 && diseaseFilter === "") {
      const latest = recentRecords[0].predictedLabel;
      if (["Eczema", "Scabies", "Tinea-Corporis", "ch-Chickenpox-Varicela", "skin-cancer"].includes(latest)) {
        setDiseaseFilter(latest);
      }
    }
  }, [recentRecords]);

  async function onDetect(e) {
    e.preventDefault();
    if (!file) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/api/detect", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data);
      setChatFinished(false);
      
      // Automatically update the map to show the newly detected disease
      if (res.data && res.data.predictedLabel) {
        const newLabel = res.data.predictedLabel;
        if (["Eczema", "Scabies", "Tinea-Corporis", "ch-Chickenpox-Varicela", "skin-cancer"].includes(newLabel)) {
          setDiseaseFilter(newLabel);
        }
      }

      // refresh history
      const dash = await api.get("/api/user/dashboard");
      setRecentRecords(dash.data.recentRecords || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const predictedLabel = result?.predictedLabel || null;

  const targetDiseases = ["Eczema", "Scabies", "Tinea-Corporis", "ch-Chickenpox-Varicela", "skin-cancer"];
  const validMapData = mapData.filter(d => targetDiseases.includes(d.disease));
  const filteredMapData = diseaseFilter ? validMapData.filter(d => d.disease === diseaseFilter) : [];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">User Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back, {account?.name || account?.email}</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          User Portal
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Upload Section */}
          <div className="glass-card p-6 border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Analysis</h3>
              {loading && <div className="text-sm font-medium text-blue-600 animate-pulse flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...</div>}
            </div>

            {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 animate-pulse">{error}</div>}

            <form onSubmit={onDetect}>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  disabled={loading}
                />
                <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 group-hover:bg-blue-50/50 group-hover:border-blue-300'}`}>
                  {file ? (
                    <div className="flex flex-col items-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-xs text-blue-500 mt-1">Ready to analyze</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-gray-900">Drag and drop an image, or click to browse</span>
                      <span className="text-xs text-gray-500 mt-1">Supports JPG, PNG</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  disabled={!file || loading} 
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                >
                  {loading ? "Processing..." : "Run Analysis"}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {result && (
            <div className="animate-fade-in-up">
              <div className="glass-card p-6 border-indigo-100 overflow-hidden relative">
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100/50">
                    <div className="text-sm font-medium text-indigo-800 uppercase tracking-wider mb-1">Detected Condition</div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-2">{result.predictedLabel}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-indigo-200 rounded-full overflow-hidden flex-1">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, Math.max(0, parseFloat(result.confidence) * 100))}%` }}></div>
                      </div>
                      <div className="text-sm font-bold text-indigo-700 w-12">{result.confidence}</div>
                    </div>
                  </div>

                  <div className="flex-[2] space-y-4">
                    {result.disease ? (
                      <>
                        <div className="bg-white/80 rounded-xl p-4 border border-gray-100">
                          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            Description
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{result.disease.description}</p>
                        </div>
                        
                        {result.disease.symptoms?.length > 0 && (
                          <div className="bg-white/80 rounded-xl p-4 border border-gray-100">
                            <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                              Common Symptoms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {result.disease.symptoms.map((sym, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                                  {sym}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 p-6 text-center">
                        <p className="text-sm text-gray-500">No additional details available in the database for this condition.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          

          
          {!result && !loading && (
             <div className="glass-card p-6 border-dashed border-2 flex flex-col items-center justify-center text-center py-12">
               <div className="h-16 w-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h3 className="text-lg font-medium text-gray-900">Awaiting Analysis</h3>
               <p className="text-sm text-gray-500 max-w-sm mt-2">Upload a skin photo above to receive a detailed AI-powered prediction and consult the chatbot.</p>
             </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Chatbot area */}
          {result && (
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <DiseaseChatbot diseaseLabel={predictedLabel} onChatFinished={() => setChatFinished(true)} />
            </div>
          )}

          {/* History Section */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              Recent Activity
              <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">{recentRecords.length}</span>
            </h3>
            
            {recentRecords.length ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {recentRecords.map((r) => (
                  <div key={r.id} className="group rounded-xl border border-gray-100 bg-white p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-default">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{r.predictedLabel}</div>
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {r.confidence}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium mb-2">{new Date(r.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                    {r.disease?.description && (
                      <div className="text-xs text-gray-600 line-clamp-2 mt-2 pt-2 border-t border-gray-50">{r.disease.description}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-gray-500">No recent analyses found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 border-indigo-100 relative mt-8 animate-fade-in-up" autoFocus style={{ animationDelay: '0.4s' }}>
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sri Lanka Disease Map
            </h3>
            <p className="text-sm text-gray-500 mt-1">Real-time localized detection heatmap.</p>
          </div>
          
          <select 
            className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer min-w-[200px]"
            value={diseaseFilter}
            onChange={(e) => setDiseaseFilter(e.target.value)}
          >
            <option value="" disabled>Select a Disease</option>
            {targetDiseases.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        
        <div className="relative z-10 w-full overflow-hidden shadow-inner border border-gray-100 rounded-2xl bg-white mb-4">
          {mapLoading ? (
            <div className="animate-pulse bg-gray-50 h-[500px] w-full flex flex-col items-center justify-center text-gray-400">
              <svg className="animate-spin h-8 w-8 text-indigo-300 mb-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Loading Maps...
            </div>
          ) : (
            <DiseaseMap data={filteredMapData} />
          )}
        </div>
        
      </div>

    </div>
  );
}

