import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList
} from 'recharts';
import { AnalysisResult } from '../types';
import { CHART_COLORS } from '../constants';

interface StatsBoardProps {
  data: AnalysisResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg text-sm">
        <p className="font-bold text-gray-800">{label || payload[0].name}</p>
        <p className="text-blue-600">
          数量: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const StatsBoard: React.FC<StatsBoardProps> = ({ data }) => {
  const { channelBreakdown, totalParticipants } = data;

  // Add colors to breakdown
  const coloredData = useMemo(() => {
    return channelBreakdown.map((item, index) => ({
      ...item,
      fill: CHART_COLORS[index % Object.keys(CHART_COLORS).length],
    }));
  }, [channelBreakdown]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Key Metric Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-1 lg:col-span-2 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">参与总人数</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{totalParticipants}</p>
          <p className="text-sm text-gray-500 mt-1">感谢每一位社区贡献者</p>
        </div>
        <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
          热门渠道排行
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={coloredData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 12, fill: '#4b5563' }}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="count" position="right" style={{ fill: '#6b7280', fontSize: '12px', fontWeight: 600 }} />
              {coloredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-6 bg-green-500 rounded-full mr-3"></span>
          渠道分布占比
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={coloredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="count"
              paddingAngle={2}
            >
              {coloredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsBoard;
