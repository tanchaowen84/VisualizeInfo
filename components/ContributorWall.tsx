import React from 'react';
import { SurveyEntry } from '../types';

interface ContributorWallProps {
  entries: SurveyEntry[];
}

const ContributorWall: React.FC<ContributorWallProps> = ({ entries }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
          社区贡献者
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          感谢所有参与本次Web3信息渠道调研的朋友
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="group relative bg-gray-50 hover:bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {entry.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={entry.name}>
                    {entry.name}
                  </p>
                  <p className="text-xs text-gray-400">#{entry.id}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.channels.length > 0 ? (
                  entry.channels.map((channel, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800"
                    >
                      {channel}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-gray-400 italic">暂无具体渠道</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributorWall;
