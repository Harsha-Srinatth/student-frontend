import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartmentPerformance,
  fetchSectionWiseAttendance,
} from "../../features/Admin/adminDashSlice";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

export default function Analytics() {
  const dispatch = useDispatch();
  const { 
    departmentPerformance, 
    sectionAttendance, 
    performanceLoading, 
    attendanceLoading, 
    error 
  } = useSelector((state) => state.adminDashboard);
  
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    dispatch(fetchDepartmentPerformance());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDepartment) {
      dispatch(fetchSectionWiseAttendance({ department: selectedDepartment, semester: selectedSemester }));
    }
  }, [dispatch, selectedDepartment, selectedSemester]);

  if (performanceLoading && departmentPerformance.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const performanceChartData = departmentPerformance.map((dept) => ({
    name: dept.department,
    performance: dept.performanceScore,
    attendance: dept.avgAttendance,
    certifications: dept.totalCertifications,
    projects: dept.totalProjects,
  }));

  const attendancePieData = sectionAttendance?.sections?.map((section) => ({
    name: `Section ${section.section}`,
    value: section.avgAttendance,
  })) || [];

  const attendanceRangeData = sectionAttendance?.sections?.flatMap((section) =>
    Object.entries(section.attendanceRanges).map(([range, count]) => ({
      section: section.section,
      range,
      count,
    }))
  ) || [];

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Performance</h1>
        <p className="text-gray-600">Department-wise performance and attendance analytics</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Department Performance Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Department Performance Score</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={performanceChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="performance" fill="#8884d8" name="Performance Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Attendance by Department */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Average Attendance by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendance" fill="#82ca9d" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Achievements Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="certifications" fill="#ffc658" name="Certifications" />
              <Bar dataKey="projects" fill="#ff7300" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section-wise Attendance */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Section-wise Attendance Analysis</h2>
        
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departmentPerformance.map((dept) => (
                <option key={dept.department} value={dept.department}>
                  {dept.department}
                </option>
              ))}
            </select>
          </div>
          {selectedDepartment && (
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Semester (Optional)</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          )}
        </div>

        {sectionAttendance && sectionAttendance.sections && sectionAttendance.sections.length > 0 ? (
          <div className="space-y-6">
            {/* Attendance Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Attendance by Section</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Section Details Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Section</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Total Students</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Avg Attendance %</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Excellent (90-100%)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Good (75-89%)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Average (60-74%)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Poor (&lt;60%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionAttendance.sections.map((section, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">{section.section}</td>
                        <td className="border border-gray-300 px-4 py-3">{section.totalStudents}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span className={`font-semibold ${
                            section.avgAttendance >= 90 ? 'text-green-600' :
                            section.avgAttendance >= 75 ? 'text-blue-600' :
                            section.avgAttendance >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {section.avgAttendance}%
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-green-600">{section.attendanceRanges.excellent}</td>
                        <td className="border border-gray-300 px-4 py-3 text-blue-600">{section.attendanceRanges.good}</td>
                        <td className="border border-gray-300 px-4 py-3 text-yellow-600">{section.attendanceRanges.average}</td>
                        <td className="border border-gray-300 px-4 py-3 text-red-600">{section.attendanceRanges.poor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : selectedDepartment ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600">No attendance data available for this department</p>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600">Please select a department to view section-wise attendance</p>
          </div>
        )}
      </div>
    </div>
  );
}

