import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <div className="stat-card ">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-heading mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-teal-700' : 'text-red-700'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
          <Icon className="h-6 w-6 text-teal-700" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
