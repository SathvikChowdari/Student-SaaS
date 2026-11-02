"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, BookOpen, UserCheck, Calendar, CheckCircle } from 'lucide-react';
import axiosClient from '@/api/axioscleint';
import { AnimatePresence, motion } from 'framer-motion';

interface Subject {
  id: number;
  name: string;
  classEntity?: { id: number; standard: string; section: string; } | null;
}

interface Teacher {
  id: number;
  fullName: string;
}

interface ClassEntity {
  id: number;
  standard: string;
  section: string;
}

interface AcademicYear {
  id: number;
  name: string;
  isActive: boolean;
}

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    teacherId: '',
    academicYearId: ''
  });

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [subRes, classRes, teacherRes, yearRes] = await Promise.all([
        axiosClient.get("/subjects"),
        axiosClient.get("/classes"),
        axiosClient.get("/teachers"),
        axiosClient.get("/academic-years")
      ]);
      setSubjects(subRes.data);
      setClasses(classRes.data);
      setTeachers(teacherRes.data);
      setAcademicYears(yearRes.data);
    } catch (error) {
      setMessage("Failed to load data.");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: Subject) => {
    const activeYear = academicYears.find(y => y.isActive);
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        classId: item.classEntity?.id.toString() || '',
        teacherId: '', 
        academicYearId: activeYear?.id.toString() || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', 
        classId: '', 
        teacherId: '', 
        academicYearId: activeYear?.id.toString() || '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update only Name and Teacher
        await axiosClient.put(`/subjects/${editingId}`, { 
          name: formData.name.trim(), 
          teacherId: parseInt(formData.teacherId, 10)
        });
        setMessage("Subject and Teacher updated!");
      } else {
        // Full Creation
        const subjectResponse = await axiosClient.post("/subjects/create", {
          name: formData.name.trim(),
          classId: parseInt(formData.classId, 10)
        });
        setMessage("Subject created");
      }
      setShowMessage(true);
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Action failed");
      setShowMessage(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await axiosClient.delete(`/subjects/${id}`);
      setMessage('Subject deleted!');
      setShowMessage(true);
      fetchInitialData();
    } catch (error) {
      setMessage("Delete failed");
      setShowMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence>
          {showMessage && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                <CheckCircle className="text-green-500 w-12 h-12" />
                <h2 className="text-lg font-semibold">{message}</h2>
                <button onClick={() => setShowMessage(false)} className="bg-indigo-600 text-white px-6 py-2 rounded-full">OK</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Subject Management</h1>
          <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2">
            <Plus size={18} /> New Assignment
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{sub.name}</td>
                  <td className="px-6 py-4 text-slate-600">{sub.classEntity ? `${sub.classEntity.standard} - ${sub.classEntity.section}` : 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(sub)} className="p-2 text-indigo-600"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(sub.id)} className="p-2 text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white flex justify-between">
              <h2 className="font-bold">{editingId ? 'Edit Subject & Teacher' : 'New Assignment'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Subject Name</label>
                  <input required className="w-full border p-2 rounded-lg mt-1" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Class</label>
                  <select disabled={!!editingId} required className="w-full border p-2 rounded-lg mt-1 bg-slate-50" value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})}>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.standard}-{c.section}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-indigo-600 uppercase">Assign Teacher</label>
                  <select required className="w-full border p-2 rounded-lg mt-1" value={formData.teacherId} onChange={(e) => setFormData({...formData, teacherId: e.target.value})}>
                    <option value="">Select Teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Academic Year</label>
                  <select disabled={!!editingId} required className="w-full border p-2 rounded-lg mt-1 bg-slate-50" value={formData.academicYearId} onChange={(e) => setFormData({...formData, academicYearId: e.target.value})}>
                    {academicYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">
                {editingId ? 'Update Assignment' : 'Create & Assign'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;