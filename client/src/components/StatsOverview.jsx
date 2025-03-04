import React from 'react';
import { Users, BookOpen, BarChart2 } from 'lucide-react';

const StatsOverview = ({ employeeCount, projectCount, averageCompletion }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <Users className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Total Employees</p>
          <p className="text-2xl font-semibold text-gray-900">{employeeCount}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Active Projects</p>
          <p className="text-2xl font-semibold text-gray-900">{projectCount}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <BarChart2 className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Avg. Completion</p>
          <p className="text-2xl font-semibold text-gray-900">{averageCompletion}%</p>
        </div>
      </div>
    </div>
  </div>
);

export default StatsOverview;
