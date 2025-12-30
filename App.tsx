import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { INITIAL_RAW_DATA } from './constants';
import { processSurveyData } from './geminiService';
import { AnalysisResult, SurveyEntry, ChannelStats } from './types';
import StatsBoard from './components/StatsBoard';
import ContributorWall from './components/ContributorWall';

const App = () => {
  const [rawData, setRawData] = useState(INITIAL_RAW_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to aggregate data after parsing
  const aggregateData = (entries: SurveyEntry[]): AnalysisResult => {
    const counts: Record<string, number> = {};
    
    entries.forEach(entry => {
      entry.channels.forEach(channel => {
        counts[channel] = (counts[channel] || 0) + 1;
      });
    });

    const channelBreakdown: ChannelStats[] = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalParticipants: entries.length,
      channelBreakdown,
      entries
    };
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const parsedEntries = await processSurveyData(rawData);
      const aggregated = aggregateData(parsedEntries);
      setResult(aggregated);
    } catch (err) {
      setError("分析数据失败，请检查网络或API Key配置。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze on mount for the demo experience
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">W3</span>
             </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Web3 调研 <span className="text-gray-400 font-normal">可视化看板</span></h1>
          </div>
          <div>
            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                    ${isAnalyzing 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
                `}
            >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    分析中...
                  </span>
                ) : '刷新分析'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Input Section */}
        <div className="mb-8">
            <details className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">原始调研数据</h2>
                        <p className="text-sm text-gray-500 mt-1">编辑下方文本可实时更新可视化结果。</p>
                    </div>
                    <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                </summary>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <textarea
                        value={rawData}
                        onChange={(e) => setRawData(e.target.value)}
                        className="w-full h-64 p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-mono text-xs leading-relaxed resize-y"
                        placeholder="在此粘贴编号列表..."
                    />
                     <div className="mt-4 flex justify-end">
                         <button 
                            onClick={handleAnalyze}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                         >
                            重新分析
                         </button>
                     </div>
                </div>
            </details>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
             <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
             </div>
             <div className="ml-3">
               <h3 className="text-sm font-medium text-red-800">分析出错</h3>
               <div className="mt-2 text-sm text-red-700">
                 <p>{error}</p>
               </div>
             </div>
          </div>
        )}

        {isAnalyzing && !result && (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-bounce mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                         <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">数据处理中...</h3>
                <p className="text-gray-500 max-w-sm text-center mt-2">Gemini 正在分析原始文本以分类 Web3 渠道。</p>
             </div>
        )}

        {result && (
            <div className="animate-fade-in-up">
                <StatsBoard data={result} />
                <ContributorWall entries={result.entries} />
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
