import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, LogOut, Loader2, Trash2, Edit, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
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
      // The API returns an array directly based on your console logs
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg transition">
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
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition uppercase tracking-tight">
                          {course.courseName}
                        </h3>
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
                          ID: {course.id.slice(-5)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex gap-3 border-t border-slate-50 pt-4">
                      <button 
                        onClick={() => setEditingCourse(course)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed">
                  No courses found. Click "Add New Course" to get started!
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- MODALS --- */}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Course</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input 
                  type="text" required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newCourse.courseName}
                  onChange={(e) => setNewCourse({...newCourse, courseName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  required
                  className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Create Course</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Course</h3>
              <button onClick={() => setEditingCourse(null)}><X /></button>
            </div>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input 
                  type="text" required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={editingCourse.courseName}
                  onChange={(e) => setEditingCourse({...editingCourse, courseName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  required
                  className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Update Course</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;