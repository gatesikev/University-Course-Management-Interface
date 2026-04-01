import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, LogOut, Loader2, Trash2, Edit } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 bg-slate-900 text-white flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-2">
          <BookOpen className="text-blue-400" /> UniManage
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg">
            <BookOpen size={20} /> Courses
          </button>
        </nav>
        <button onClick={handleLogout} className="p-4 border-t border-slate-800 flex items-center gap-3 text-slate-400 hover:text-white transition">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800">Course Catalog</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md">
            <Plus size={18} /> Add New Course
          </button>
        </header>

        <main className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Loader2 className="animate-spin mb-2" /> Loading Courses...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{course.title}</h3>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">ID: {course.id}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">{course.description}</p>
                  <div className="flex gap-3 border-t pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                      <Edit size={16} /> Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;