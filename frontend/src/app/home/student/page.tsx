"use client";
import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axioscleint";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "/students";

interface Student {
  id?: number;
  name: string;
  rollNo: string;
  dateOfBirth: string;
  admissionDate: string;
  guardianName: string;
  contactNo: string;
  address: string;
  classId?: number | null;
}

interface ClassEntity {
  id: number;
  standard: string;
  section: string;
}

function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState: Student = {
    name: "",
    rollNo: "",
    dateOfBirth: "",
    admissionDate: "",
    guardianName: "",
    contactNo: "",
    address: "",
    classId: null,
  };

  const [formData, setFormData] = useState<Student>(initialFormState);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(API_BASE_URL);
      setStudents(res.data);
    } catch (err) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axiosClient.get("/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student: Student) => {
    setIsEditing(true);
    setCurrentId(student.id || null);
    setFormData(student);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    try {
      await axiosClient.delete(`${API_BASE_URL}/${id}`);
      fetchStudents();
    } catch {
      setError("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (isEditing && currentId) {
        await axiosClient.put(`${API_BASE_URL}/${currentId}`, formData);
      } else {
        await axiosClient.post(API_BASE_URL, formData);
      }
      closeModal();
      fetchStudents();
    } catch (err: any) {
      setError("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData(initialFormState);
  };

  // Helper to get Class Name from ID
  const getClassName = (id?: number | null) => {
    const cls = classes.find(c => c.id === id);
    return cls ? `${cls.standard} - ${cls.section}` : "N/A";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <button onClick={() => setShowModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl flex gap-2 transition-colors shadow-sm">
          <Plus size={20} /> Add Student
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex gap-2 items-center">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Roll</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Class</th>
                <th className="p-4 font-semibold">Guardian</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">DOB</th>
                <th className="p-4 font-semibold">Admission</th>
                <th className="p-4 font-semibold">Address</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-sky-500" /></td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-500">No students found</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <td className="p-4 font-medium">{s.rollNo}</td>
                    <td className="p-4">{s.name}</td>
                    <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {getClassName(s.classId)}
                        </span>
                    </td>
                    <td className="p-4">{s.guardianName}</td>
                    <td className="p-4">{s.contactNo}</td>
                    <td className="p-4 whitespace-nowrap">{s.dateOfBirth}</td>
                    <td className="p-4 whitespace-nowrap">{s.admissionDate}</td>
                    <td className="p-4 max-w-xs truncate">{s.address}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(s)} className="text-gray-400 hover:text-sky-600 transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(s.id!)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <div onClick={closeModal} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed bg-white p-6 rounded-2xl w-[95%] max-w-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-h-[90vh] shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl text-gray-800">{isEditing ? "Update" : "Add New"} Student</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Roll Number</label>
                    <input name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>
                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Assigned Class</label>
                    <select name="classId" value={formData.classId || ''} onChange={(e) => setFormData({...formData, classId: e.target.value ? Number(e.target.value) : null})} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none">
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.standard} - {cls.section}
                        </option>
                      ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Admission Date</label>
                    <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Guardian Name</label>
                    <input name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                    <input name="contactNo" value={formData.contactNo} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Residential Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none" rows={2} />
                </div>
                
                <button disabled={submitting} className="md:col-span-2 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-xl font-bold disabled:bg-gray-400 transition-colors shadow-md mt-2">
                  {submitting ? "Saving changes..." : isEditing ? "Update Student" : "Register Student"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentPage;