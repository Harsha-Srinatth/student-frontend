import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PIE_CHART_COLORS } from '../utils/chartConfig';
import { FiPieChart } from 'react-icons/fi';
import SectionDetailsTable from './SectionDetailsTable';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-slate-900 mb-1">{data.name}</p>
        <p className="text-sm text-blue-600 font-bold">
          Attendance: {data.value}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SectionAttendanceAnalysis({ sectionAttendance, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading section data...</p>
        </div>
      </div>
    );
  }

  if (!sectionAttendance?.sections || sectionAttendance.sections.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FiPieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No attendance data available</p>
          <p className="text-sm text-gray-500 mt-1">Please select a department to view section-wise attendance</p>
        </div>
      </div>
    );
  }

  const attendancePieData = sectionAttendance.sections.map((section) => ({
    name: section.section || "N/A", // programName is the section (e.g., CSBS, IT-A, CSE-A)
    value: section.avgAttendance || 0,
    section: section.section,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg shadow-md">
          <FiPieChart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Section-wise Attendance Analysis
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Detailed breakdown by section
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Attendance Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Average Attendance by Section
          </h3>
          <div className="w-full" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Details Table */}
        <SectionDetailsTable sections={sectionAttendance.sections} />
      </div>
    </motion.div>
  );
}

