import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, LogOut, Loader2, Trash2, Edit, X, Info } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null); // State for Get Course by ID
  const [newCourse, setNewCourse] = useState({ courseName: '', description: '', courseCode: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // GET COURSE BY ID
  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      setViewingCourse(response.data);
    } catch (error) {
      toast.error("Could not fetch course details.");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/courses', newCourse);
      toast.success("Course created successfully!");
      setIsModalOpen(false);
      setNewCourse({ courseName: '', description: '', courseCode: '' });
      fetchCourses();
    } catch (error) {
      toast.error("Failed to create course");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/courses/${editingCourse.id}`, editingCourse);
      toast.success("Course updated successfully!");
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      toast.error("Failed to update course");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/api/courses/${id}`);
        toast.success("Course deleted!");
        fetchCourses();
      } catch (error) {
        toast.error("Could not delete the course.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Course Catalog</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
          >
            <Plus size={18} /> Add New Course
          </button>
        </header>

        <main className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Loader2 className="animate-spin mb-2" /> 
              <span>Loading Courses...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-800 uppercase tracking-tight">
                        {course.courseName}
                      </h3>
                      <button onClick={() => handleViewDetails(course.id)} className="text-slate-400 hover:text-blue-600">
                        <Info size={20} />
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 border-t border-slate-50 pt-4">
                    <button onClick={() => setEditingCourse(course)} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL (Get by ID) */}
      {viewingCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Course Details</h3>
              <button onClick={() => setViewingCourse(null)}><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Course Name</label>
                <p className="text-lg font-semibold text-slate-800">{viewingCourse.courseName}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Full Description</label>
                <p className="text-slate-600 leading-relaxed">{viewingCourse.description}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Unique Resource ID</label>
                <p className="text-xs font-mono bg-slate-100 p-2 rounded mt-1">{viewingCourse.id}</p>
              </div>
              <button onClick={() => setViewingCourse(null)} className="w-full mt-4 bg-slate-800 text-white py-2 rounded-lg font-bold">Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL & EDIT MODAL (Keep previous logic) */}
      {/* ... (Same as before) ... */}
    </div>
  );
};

export default Dashboard;