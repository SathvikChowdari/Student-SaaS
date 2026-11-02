"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, Trash2, X, Loader2, Clock } from 'lucide-react';
import axios from 'axios';

const AcademicYearPage = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/academic-years");
      setYears(res.data || []);
    } catch (error) {
      console.error("Failed to fetch years:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await axiosInstance.patch(`/api/academic-years/${id}/activate`);
      fetchYears(); // Refresh list to show new active status
    } catch (error: any) {
      alert(error.response?.data || "Failed to activate year");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/academic-years/create", {
        ...formData,
        isActive: false // Default to false, let admin activate manually
      });
      setIsModalOpen(false);
      setFormData({ name: '', startDate: '', endDate: '' });
      fetchYears();
    } catch (error: any) {
      alert(error.response?.data || "Failed to create academic year");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This may affect all linked data.")) return;
    try {
      await axiosInstance.delete(`/api/academic-years/${id}`);
      fetchYears();
    } catch (error: any) {
      alert(error.response?.data || "Cannot delete active year");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Academic Sessions</h1>
            <p className="text-slate-500 text-sm mt-1">Define and control the active school calendar year.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> Add New Year
          </button>
        </div>

        {/* Grid View for Years */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {years.map((year: any) => (
              <div 
                key={year.id} 
                className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
                  year.active ? 'border-amber-500 shadow-lg shadow-amber-100' : 'border-slate-100 opacity-80'
                }`}
              >
                {year.active && (
                  <span className="absolute -top-3 left-6 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Current Active
                  </span>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Calendar size={24} />
                  </div>
                  {!year.active && (
                    <button 
                      onClick={() => handleDelete(year.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">{year.name}</h3>
                
                <div className="space-y-2 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>Starts: <b>{year.startDate}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>Ends: <b>{year.endDate}</b></span>
                  </div>
                </div>

                <div className="mt-6">
                  {year.active ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 size={18} /> System Active
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleActivate(year.id)}
                      className="w-full py-2 border-2 border-amber-100 text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-500 hover:text-white transition-all"
                    >
                      Set as Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-amber-500 px-6 py-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-lg">Create Academic Year</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year Label</label>
                <input
                  required
                  placeholder="e.g. 2025-2026"
                  className="w-full border-2 border-slate-50 rounded-lg px-4 py-2.5 text-sm focus:border-amber-400 outline-none mt-1"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date</label>
                  <input
                    required
                    type="date"
                    className="w-full border-2 border-slate-50 rounded-lg px-4 py-2 text-sm focus:border-amber-400 outline-none mt-1"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End Date</label>
                  <input
                    required
                    type="date"
                    className="w-full border-2 border-slate-50 rounded-lg px-4 py-2 text-sm focus:border-amber-400 outline-none mt-1"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all active:scale-95"
              >
               Create Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYearPage;