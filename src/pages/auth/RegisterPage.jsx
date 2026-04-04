import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { requestPermission } from '../../../firebase.js';

import AuthLayout from './AuthLayout';
import Input from './components/Input';
import Select from './components/Select';
import CollegeSearchSelect from './components/CollegeSearchSelect';
import FacultySearchSelect from './components/FacultySearchSelect';

const roles = [
  { id: 'student', label: 'Student' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'hod', label: 'HOD' },
];

const capitalize = (s) => s ? s.replace(/\b\w/g, char => char.toUpperCase()) : '';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [activeRole, setActiveRole] = useState('student');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);

  const [formData, setFormData] = useState({
    identifier: '', fullname: '', username: '', email: '', mobile: '', password: '', confirmPassword: '',
    collegeId: '', department: '', section: '', dateofjoin: '', subjects: ''
  });

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeMetaLoading, setCollegeMetaLoading] = useState(false);
  const collegeFetchSeq = useRef(0);

  useEffect(() => {
    const getFCM = async () => {
      try {
        const token = await requestPermission();
        if (token) setFcmToken(token);
      } catch (err) { }
    };
    getFCM();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'fullname') value = capitalize(value);
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'department' && activeRole === 'student') {
       setFormData(prev => ({ ...prev, section: '' }));
    }
  };

  const handleCollegeSelect = async (college) => {
    if (!college) {
      collegeFetchSeq.current += 1;
      setCollegeMetaLoading(false);
      setSelectedCollege(null);
      setSelectedMentor(null);
      setFormData((prev) => ({ ...prev, collegeId: '', department: '', section: '' }));
      return;
    }

    const seq = ++collegeFetchSeq.current;
    setCollegeMetaLoading(true);
    setSelectedMentor(null);
    setFormData((prev) => ({
      ...prev,
      collegeId: college.collegeId,
      department: '',
      section: '',
    }));
    setSelectedCollege({ ...college, Departments: [], Sections: [] });

    try {
      const { data } = await api.get(`/college/${encodeURIComponent(college.collegeId)}`);
      if (seq !== collegeFetchSeq.current) return;

      const full = data?.data;
      if (!full) {
        addToast('Could not load college details.', 'error');
        setSelectedCollege(null);
        setSelectedMentor(null);
        setFormData((prev) => ({ ...prev, collegeId: '', department: '', section: '' }));
        return;
      }

      const departments = Array.isArray(full.Departments) ? full.Departments.filter(Boolean) : [];
      const sections = Array.isArray(full.Sections) ? full.Sections.filter(Boolean) : [];

      setSelectedCollege({
        collegeId: full.collegeId,
        collegeName: full.collegeName ?? college.collegeName,
        collegeCity: full.collegeCity,
        collegeState: full.collegeState,
        Departments: departments,
        Sections: sections,
      });
    } catch (err) {
      if (seq !== collegeFetchSeq.current) return;
      addToast(err.response?.data?.message || 'Could not load departments for this college.', 'error');
      setSelectedCollege(null);
      setSelectedMentor(null);
      setFormData((prev) => ({ ...prev, collegeId: '', department: '', section: '' }));
    } finally {
      if (seq === collegeFetchSeq.current) setCollegeMetaLoading(false);
    }
  };

  const getIdentifierLabel = () => {
    return activeRole === 'student' ? 'Student ID' : 
           activeRole === 'faculty' ? 'Faculty ID' : 'HOD ID';
  };

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.identifier || !formData.fullname || !formData.username || !formData.email || !formData.mobile || !formData.password) {
      addToast('Please fill all required personal details.', 'error');
      return false;
    }
    if (formData.mobile.length !== 10) {
      addToast('Mobile number must be 10 digits.', 'error');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      addToast('Invalid email address.', 'error');
      return false;
    }
    if (formData.password.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return false;
    }
    if (activeRole === 'hod' && formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    if (!formData.collegeId) { addToast('College is required.', 'error'); return; }
    
    if (activeRole === 'student') {
       if (!formData.department || !formData.section || !formData.dateofjoin) {
          addToast('Please fill all academic details.', 'error'); return;
       }
    } else if (activeRole === 'faculty') {
       if (!formData.department || !formData.dateofjoin || !formData.subjects) {
          addToast('Please fill all professional details.', 'error'); return;
       }
    } else if (activeRole === 'hod') {
       if (!formData.department) {
          addToast('Department is required.', 'error'); return;
       }
    }

    setLoading(true);
    try {
      let endpoint = '';
      let payload = {
         fullname: formData.fullname.trim(),
         username: formData.username.trim(),
         email: formData.email.trim(),
         password: formData.password
      };

      if (fcmToken) payload.fcmToken = fcmToken;

      if (activeRole === 'student') {
         endpoint = '/register/student';
         payload.studentid = formData.identifier.trim();
         payload.mobileno = formData.mobile;
         payload.institutionId = formData.collegeId;
         payload.dept = formData.department;
         payload.section = formData.section.trim();
         payload.facultyid = selectedMentor?.facultyid ?? '';
         payload.dateofjoin = formData.dateofjoin;
      } 
      else if (activeRole === 'faculty') {
         endpoint = '/register/faculty';
         payload.facultyid = formData.identifier.trim();
         payload.mobile = formData.mobile;
         payload.collegeId = formData.collegeId;
         payload.dept = formData.department;
         payload.dateofjoin = formData.dateofjoin;
         payload.subjects = formData.subjects.split(',').map(s => s.trim()).filter(Boolean);
      }
      else if (activeRole === 'hod') {
         endpoint = '/register/hod';
         payload.hodId = formData.identifier.trim();
         payload.mobile = formData.mobile;
         payload.collegeId = formData.collegeId;
         payload.department = formData.department;
      }

      await api.post(endpoint, payload);
      addToast('Registration successful! Welcome aboard.', 'success');
      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getDepartments = () => {
    const d = selectedCollege?.Departments;
    return Array.isArray(d) ? d.filter(Boolean) : [];
  };

  const getSections = () => {
    const s = selectedCollege?.Sections;
    return Array.isArray(s) ? s.filter(Boolean) : [];
  };

  const deptOptionsReady = selectedCollege && !collegeMetaLoading && getDepartments().length > 0;

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the communication engine in two simple steps"
      maxWidth="max-w-xl"
    >
      {step === 1 && (
        <div className="flex p-1 mb-6 bg-slate-100/80 rounded-lg w-full max-w-sm mx-auto">
          {roles.map((role) => {
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  if (role.id !== 'student') setSelectedMentor(null);
                  setFormData((prev) => ({
                    ...prev,
                    identifier: '',
                    ...(role.id !== 'student' ? { section: '' } : {}),
                  }));
                }}
                className={`relative flex-1 py-1.5 rounded-md transition-all text-[13.5px] font-semibold ${
                  isActive ? 'text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                type="button"
              >
                {isActive && (
                  <motion.div layoutId="activeRoleTabReg" className="absolute inset-0 bg-white rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]" transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }} />
                )}
                <span className="relative z-10">{role.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8 max-w-sm mx-auto">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
      </div>

      <form onSubmit={handleSubmit}>
         <AnimatePresence mode="wait">
           {step === 1 ? (
             <motion.div key="step1" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} transition={{ duration: 0.2 }}>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <Input label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="John Doe" autoComplete="name" required />
                   <Input label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" autoComplete="username" required />
                   <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" autoComplete="email" required />
                   <Input label="Mobile Number" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10 digits" required />
                   <Input label={getIdentifierLabel()} name="identifier" value={formData.identifier} onChange={handleChange} placeholder="Required" required className="sm:col-span-2" />
                   <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 chars" autoComplete="new-password" required />
                   
                   {activeRole === 'hod' ? (
                      <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
                   ) : (
                      <div className="hidden sm:block"></div>
                   )}
                </div>

             </motion.div>
           ) : (
             <motion.div key="step2" initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} transition={{ duration: 0.2 }} className="space-y-4">
               
               <CollegeSearchSelect 
                  value={selectedCollege} 
                  onChange={handleCollegeSelect} 
                  error={!formData.collegeId && step === 2}
               />

               {collegeMetaLoading && (
                 <p className="text-[13px] text-slate-500 flex items-center gap-2">
                   <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                   Loading departments and sections for this college…
                 </p>
               )}

               {selectedCollege && !collegeMetaLoading && getDepartments().length === 0 && (
                 <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                   This college has no departments configured yet. Please contact your administrator.
                 </p>
               )}

               {activeRole === 'student' && selectedCollege && !collegeMetaLoading && getDepartments().length > 0 && getSections().length === 0 && (
                 <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                   This college has no sections configured yet. Please contact your administrator.
                 </p>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select 
                     label="Department" 
                     name="department" 
                     value={formData.department} 
                     onChange={handleChange} 
                     disabled={!deptOptionsReady}
                     className={activeRole === 'student' ? '' : 'sm:col-span-2'}
                     options={[
                        { label: collegeMetaLoading ? 'Loading…' : !selectedCollege ? 'Select a college first' : getDepartments().length === 0 ? 'No departments' : 'Select Department', value: '', disabled: true },
                        ...getDepartments().map(d => ({ label: d, value: d }))
                     ]}
                     required
                  />
                  {activeRole === 'student' && (
                     <Select
                        label="Section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        disabled={!formData.department || collegeMetaLoading || getSections().length === 0}
                        options={[
                           { label: !getSections().length ? 'No sections' : 'Select Section', value: '', disabled: true },
                           ...getSections().map(s => ({ label: s, value: s }))
                        ]}
                        required
                     />
                  )}
               </div>

               {(activeRole === 'student' || activeRole === 'faculty') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Input label="Date of Joining" type="date" name="dateofjoin" value={formData.dateofjoin} onChange={handleChange} required />
                     {activeRole === 'student' && (
                       <FacultySearchSelect
                         collegeId={formData.collegeId}
                         disabled={!formData.collegeId || collegeMetaLoading}
                         value={selectedMentor}
                         onChange={setSelectedMentor}
                       />
                     )}
                  </div>
               )}

               {activeRole === 'faculty' && (
                  <Input label="Subjects Taught" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g. Math, Physics (comma separated)" required />
               )}

             </motion.div>
           )}
         </AnimatePresence>

        <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
          {step === 2 ? (
            <button type="button" onClick={() => setStep(1)} className="text-[14.5px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              Back
            </button>
          ) : <div></div>}
          
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-[14.5px] transition-all ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 1 ? 'Continue' : 'Complete Sign Up'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-slate-100">
        <p className="text-slate-500 text-[13.5px]">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
