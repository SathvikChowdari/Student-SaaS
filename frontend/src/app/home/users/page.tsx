"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editedUsers, setEditedUsers] = useState<{ [key: number]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "" });
  const [showAddDiv, setShowAddDiv] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  // Auto hide after few seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const API_BASE = "http://localhost:8080";

  const roles = ["ADMIN", "USER", "TEACHER"];
  const info=["id","username","role"];

  const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/api/users");
      setUsers(res.data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please log in as an admin.");
      } else {
        setError("Failed to fetch users.");
      }
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const res = await axiosInstance.post("/api/users/create", newUser);
      // alert(res.data.message);
      setMessage(res.data.message);
      setShow(true);
      setNewUser({ username: "", password: "", role: "" });
      fetchUsers();
    } catch (err: any) {
      console.error("Error creating user:", err);
      // alert(err.response?.data || "Error creating user");
      setMessage(err.response?.data || "Error creating user");
      setShow(true);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await axiosInstance.delete(`/api/users/${id}`);
      // alert(res.data.message);
      setMessage(res.data.message);
      setShow(true);
      fetchUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      // alert(err.response?.data || "Error deleting user");
      setMessage(err.response?.data || "Error deleting user");
      setShow(true);
    }
  };

  // ✅ Update a single user
  const updateUser = async (id: number, updatedData: { username: string; role: string }) => {
    try {
      const res = await axiosInstance.put(`/api/users/${id}`, updatedData);
      console.log(res.data.message);
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert(err.response?.data || "Error updating user");
    }
  };

  // ✅ Save all changes
  const saveAllChanges = async () => {
    const updates = Object.entries(editedUsers);
    if (updates.length === 0) {
      // alert("No changes to save.");
      setMessage("No changes to save.");
      setShow(true);
      setIsEditing(false);
      return;
    }

    for (const [id, user] of updates) {
      await updateUser(Number(id), { username: user.username, role: user.role });
    }

    // alert("All changes saved successfully!");
    setMessage("All changes saved successfully!");
    setShow(true);
    setIsEditing(false);
    setEditedUsers({});
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-2">
       

      {/* ===== Animated  Popup ===== */}
      <AnimatePresence>
        {show && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* ✅ Centered Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 z-50
                         -translate-x-1/2 -translate-y-1/2 
                         bg-white text-gray-800 p-6 rounded-2xl shadow-2xl 
                         w-[90%] max-w-[360px]
                         flex flex-col items-center gap-4 overflow-visible"
            >
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <motion.rect
                    x="1"
                    y="1"
                    width="98"
                    height="98"
                    rx="4"
                    ry="4"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    animate={{ strokeDashoffset: [400, 0] }}
                    transition={{
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#04ff64ff" />
                      <stop offset="50%" stopColor="#438bffff" />
                      <stop offset="100%" stopColor="#00ddffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Content */}
              <CheckCircle className="text-green-500 w-12 h-12 z-10" />
              <h2 className="text-xl font-semibold text-center z-10">
                {message}
              </h2>
              

              <motion.button
                onClick={() => setShow(false)}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-2 rounded-full font-semibold z-10"
              >
                OK
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      {/* ===== Header Section ===== */}
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-xl font-bold mb-1">Users Data</h3>
        <div>
          <button
            className="bg-green-500 text-white px-3 py-1 mr-4 rounded hover:bg-green-600"
            onClick={() => {
              if (isEditing) {
                saveAllChanges();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "💾 Save" : "🖉 Edit"}
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => setShowAddDiv(true)}
          >
          ⨁ Add
          </button>
        </div>
      </div>

      {/* ===== Overlay Background ===== */}
      <div
        className={`fixed top-0 left-0 bg-black z-40 h-[100vh] w-[100vw] ${
          showAddDiv ? "block opacity-50" : "hidden"
        }`}
      ></div>

      {/* ===== Add User Popup ===== */}
      <div
        className={`fixed inset-0 top-[20vh] left-[60vh] space-y-5 max-w-md h-[55vh] ${
          showAddDiv ? "block" : "hidden"
        } z-50 w-[70vh] bg-white p-4 shadow-xl rounded-lg`}
      >
        <p className="animate-bounce text-blue-600 w-fit m-auto mb-3">
          Fill the details to add a new user
        </p>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <Select
          value={newUser.role}
          onValueChange={(value) => setNewUser({ ...newUser, role: value })}
        >
          <SelectTrigger className="w-full border p-2 rounded">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-between">
          <button
            onClick={() => {
              createUser();
              setShowAddDiv(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create User
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => {
              setShowAddDiv(false);
              setNewUser({ username: "", password: "", role: "" });
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ===== Users Table ===== */}
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="min-w-full border border-blue-500">
          <thead className="bg-blue-500 text-white sticky top-0">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isEdited = editedUsers[user.id] || user;
              return (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.id}</td>

                  {/* Editable Username */}
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={isEdited.username}
                        onChange={(e) =>
                          setEditedUsers({
                            ...editedUsers,
                            [user.id]: {
                              ...isEdited,
                              username: e.target.value,
                            },
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </td>

                  {/* Editable Role */}
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <select
                        value={isEdited.role}
                        onChange={(e) =>
                          setEditedUsers({
                            ...editedUsers,
                            [user.id]: { ...isEdited, role: e.target.value },
                          })
                        }
                        className="border p-1 rounded w-full"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>

                  {/* Delete Button */}
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={isEditing}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
