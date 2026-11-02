"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import axios from 'axios'; // Import axios

interface ClassEntity {
  id: number;
  standard: string;
  section: string;
  classTeacher?: {
    id: number;
    fullName: string;
  } | null;
}

const API_BASE_URL = "http://localhost:8080/api/classes";

const ClassesPage = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    standard: '',
    section: '',
    teacherId: '' 
  });

  // Create axios instance just like in Users page to handle credentials/tokens
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      // Use axiosInstance instead of fetch to avoid 403
      const response = await axiosInstance.get("/api/classes");
      setClasses(response.data);
    } catch (error: any) {
      console.error("Failed to fetch classes:", error);
      alert(error.response?.data?.message || "Forbidden: Check Admin permissions");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: ClassEntity) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        standard: item.standard,
        section: item.section,
        teacherId: item.classTeacher?.id.toString() || ''
      });
    } else {
      setEditingId(null);
      setFormData({ standard: '', section: '', teacherId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/classes/${editingId}` : `/api/classes/create`;
    const payload = {
      standard: formData.standard,
      section: formData.section,
      teacherId: formData.teacherId ? parseInt(formData.teacherId) : null
    };

    try {
      if (editingId) {
        await axiosInstance.put(url, payload);
      } else {
        await axiosInstance.post(url, payload);
      }
      setIsModalOpen(false);
      fetchClasses(); 
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(error.response?.data || "Error saving class");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await axiosInstance.delete(`/api/classes/${id}`);
      setClasses(classes.filter(c => c.id !== id));
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Class Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage school standards and sections.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> New Class
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sky-50/50 text-sky-900 border-b border-slate-200 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Standard</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4">Teacher Name</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin inline-block text-sky-500 mr-2" />
                      Loading classes...
                    </td>
                  </tr>
                ) : classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-sky-50/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{cls.standard}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{cls.section}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cls.classTeacher?.fullName || <span className="text-slate-300 italic text-xs">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(cls)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(cls.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-sky-500 px-6 py-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-lg">{editingId ? 'Update Class' : 'Create New Class'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Standard</label>
                <input
                  required
                  className="w-full border-2 border-slate-50 rounded-lg px-4 py-2 text-sm focus:border-sky-400 focus:outline-none mt-1"
                  value={formData.standard}
                  onChange={(e) => setFormData({...formData, standard: e.target.value})}
                  placeholder="e.g. 10th Grade"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section</label>
                  <input
                    required
                    className="w-full border-2 border-slate-50 rounded-lg px-4 py-2 text-sm focus:border-sky-400 focus:outline-none mt-1"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    placeholder="e.g. A"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teacher ID</label>
                  <input
                    type="number"
                    className="w-full border-2 border-slate-50 rounded-lg px-4 py-2 text-sm focus:border-sky-400 focus:outline-none mt-1"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                    placeholder="Optional ID"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 shadow-lg shadow-sky-100 mt-4"
              >
                {editingId ? 'Save Changes' : 'Confirm & Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;