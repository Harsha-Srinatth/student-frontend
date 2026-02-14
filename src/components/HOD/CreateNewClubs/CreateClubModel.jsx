import React, { useState, useEffect } from 'react';
import { X, Search, Upload, Loader2 } from 'lucide-react';
import api from '@/services/api';

const CreateClubModal = ({ isOpen, onClose, onCreateClub }) => {
  const [formData, setFormData] = useState({
    clubName: '',
    description: '',
    amounttojoin: '',
    image: null,
    facultyCoordinator: '',
    studentHead: '',
  });

  const [facultySearch, setFacultySearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [facultyResults, setFacultyResults] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchingFaculty, setSearchingFaculty] = useState(false);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Search faculty by facultyId
  useEffect(() => {
    const searchFaculty = async () => {
      if (facultySearch.trim().length < 2) {
        setFacultyResults([]);
        return;
      }

      setSearchingFaculty(true);
      try {
        const res = await api.get('/hod/clubs/search/faculty', {
          params: { facultyId: facultySearch },
        });
        if (res.data?.ok) {
          setFacultyResults(res.data.faculty || []);
        }
      } catch (error) {
        console.error('Error searching faculty:', error);
        setFacultyResults([]);
      } finally {
        setSearchingFaculty(false);
      }
    };

    const timeoutId = setTimeout(searchFaculty, 300);
    return () => clearTimeout(timeoutId);
  }, [facultySearch]);

  // Search students by studentId
  useEffect(() => {
    const searchStudents = async () => {
      if (studentSearch.trim().length < 2) {
        setStudentResults([]);
        return;
      }

      setSearchingStudent(true);
      try {
        const res = await api.get('/hod/clubs/search/students', {
          params: { studentId: studentSearch },
        });
        if (res.data?.ok) {
          setStudentResults(res.data.students || []);
        }
      } catch (error) {
        console.error('Error searching students:', error);
        setStudentResults([]);
      } finally {
        setSearchingStudent(false);
      }
    };

    const timeoutId = setTimeout(searchStudents, 300);
    return () => clearTimeout(timeoutId);
  }, [studentSearch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clubName || !formData.description || !formData.amounttojoin || !formData.image) {
      alert('Please fill all required fields including club image');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('clubName', formData.clubName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('amounttojoin', formData.amounttojoin);
      formDataToSend.append('image', formData.image);
      if (formData.facultyCoordinator) {
        formDataToSend.append('facultyCoordinator', formData.facultyCoordinator);
      }
      if (formData.studentHead) {
        formDataToSend.append('studentHead', formData.studentHead);
      }

      const res = await api.post('/hod/clubs', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.ok) {
        onCreateClub(res.data.club);
        setFormData({
          clubName: '',
          description: '',
          amounttojoin: '',
          image: null,
          facultyCoordinator: '',
          studentHead: '',
        });
        setImagePreview(null);
        setFacultySearch('');
        setStudentSearch('');
        setFacultyResults([]);
        setStudentResults([]);
        onClose();
      } else {
        alert(res.data?.message || 'Failed to create club');
      }
    } catch (error) {
      console.error('Error creating club:', error);
      alert(error.response?.data?.message || 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Club</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="clubName" className="block text-sm font-medium text-gray-700">Club Name *</label>
            <input
              id="clubName"
              type="text"
              placeholder="Enter club name"
              value={formData.clubName}
              onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              id="description"
              placeholder="Enter club description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amounttojoin" className="block text-sm font-medium text-gray-700">Amount to Join (₹) *</label>
            <input
              id="amounttojoin"
              type="number"
              placeholder="Enter amount"
              min="0"
              value={formData.amounttojoin}
              onChange={(e) => setFormData({ ...formData, amounttojoin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Club Image *</label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="image"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                {formData.image && (
                  <span className="text-sm text-muted-foreground">{formData.image.name}</span>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="facultyCoordinator" className="block text-sm font-medium text-gray-700">Faculty Coordinator</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="facultyCoordinator"
                  type="text"
                  placeholder="Search by Faculty ID..."
                  value={facultySearch}
                  onChange={(e) => {
                    setFacultySearch(e.target.value);
                    if (!e.target.value) {
                      setFormData({ ...formData, facultyCoordinator: '' });
                    }
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchingFaculty && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {facultyResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {facultyResults.map((faculty) => (
                    <button
                      key={faculty.facultyid}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, facultyCoordinator: faculty.facultyid });
                        setFacultySearch(`${faculty.facultyid} - ${faculty.fullname}`);
                        setFacultyResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{faculty.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {faculty.facultyid} • {faculty.designation}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.facultyCoordinator && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {facultyResults.find(f => f.facultyid === formData.facultyCoordinator)?.fullname || formData.facultyCoordinator}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="studentHead" className="block text-sm font-medium text-gray-700">Student Club Head</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="studentHead"
                  type="text"
                  placeholder="Search by Student ID..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    if (!e.target.value) {
                      setFormData({ ...formData, studentHead: '' });
                    }
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchingStudent && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {studentResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {studentResults.map((student) => (
                    <button
                      key={student.studentid}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, studentHead: student.studentid });
                        setStudentSearch(`${student.studentid} - ${student.fullname}`);
                        setStudentResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{student.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.studentid} • {student.programName} • {student.semester}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.studentHead && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {studentResults.find(s => s.studentid === formData.studentHead)?.fullname || formData.studentHead}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Club'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClubModal;
