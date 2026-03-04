import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Search, User } from 'lucide-react';
import { setHODInfo } from '../../../features/HOD/hodAssignmentSlice';
import api from '../../../services/api';

const Header = () => {
  const dispatch = useDispatch();
  const { hodInfo } = useSelector((state) => state.hodAssignment);

  // Fetch HOD information on mount if not already in store
  useEffect(() => {
    const fetchHODInfo = async () => {
      if (!hodInfo) {
        try {
          const response = await api.get('/hod/info');
          const hodData = response.data?.data?.hod || response.data?.hod;
          if (hodData) {
            dispatch(setHODInfo(hodData));
          }
        } catch (error) {
          console.error('Error fetching HOD info:', error);
        }
      }
    };

    fetchHODInfo();
  }, [dispatch, hodInfo]);
  const hodName = hodInfo?.name || hodInfo?.fullname || 'HOD';
  const hodDepartment = hodInfo?.department?.name || hodInfo?.department || 'Department';
  const hodEmail = hodInfo?.email || '';

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between w-full">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clubs, members..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative h-10 w-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{hodName}</p>
            <p className="text-xs text-gray-600">HOD - {hodDepartment}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-teal-700 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;