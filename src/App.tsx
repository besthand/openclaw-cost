/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { Settings, Calculator, Zap, DollarSign } from 'lucide-react';

const MAC_MINI_MODELS = [
  { id: 'm4-10c-16-256', name: 'M4 (10核CPU) 16GB / 256GB', price: 19900 },
  { id: 'm4-10c-24-512', name: 'M4 (10核CPU) 24GB / 512GB', price: 26900 },
  { id: 'm4-10c-32-256', name: 'M4 (10核CPU) 32GB / 256GB', price: 33900 },
  { id: 'm4-10c-32-512', name: 'M4 (10核CPU) 32GB / 512GB', price: 40900 },
  { id: 'm4pro-14c-24-512', name: 'M4 Pro (14核CPU) 24GB / 512GB', price: 46900 },
  { id: 'm4pro-14c-48-512', name: 'M4 Pro (14核CPU) 48GB / 512GB', price: 60900 },
  { id: 'm4pro-14c-64-512', name: 'M4 Pro (14核CPU) 64GB / 512GB', price: 74900 },
  
];

const API_PRICING = [
  { id: 'google/gemini-3.1-pro-preview', name: 'Google: Gemini 3.1 Pro Preview', input: 2.00, output: 12.00, color: '#34A853' },
  { id: 'google/gemini-3-pro-image-preview', name: 'Google: Nano Banana Pro (Gemini 3 Pro Image Preview)', input: 2.00, output: 12.00, color: '#34A853' },
  { id: 'google/gemini-3-pro-preview', name: 'Google: Gemini 3 Pro Preview', input: 2.00, output: 12.00, color: '#34A853' },
  { id: 'google/gemini-3-flash-preview', name: 'Google: Gemini 3 Flash Preview', input: 0.50, output: 3.00, color: '#34A853' },
  { id: 'google/gemini-2.5-flash-lite-preview-09-2025', name: 'Google: Gemini 2.5 Flash Lite Preview 09-2025', input: 0.10, output: 0.40, color: '#34A853' },
  { id: 'google/gemini-2.5-flash-lite', name: 'Google: Gemini 2.5 Flash Lite', input: 0.10, output: 0.20, color: '#34A853' },
  { id: 'google/gemini-2.5-flash', name: 'Google: Gemini 2.5 Flash', input: 0.30, output: 2.50, color: '#34A853' },
  { id: 'google/gemini-2.5-pro', name: 'Google: Gemini 2.5 Pro', input: 1.25, output: 5.00, color: '#34A853' },
  { id: 'anthropic/claude-opus-4.6', name: 'Anthropic: Claude Opus 4.6', input: 15.00, output: 75.00, color: '#F97316' },
  { id: 'anthropic/claude-opus-4', name: 'Anthropic: Claude Opus 4', input: 15.00, output: 75.00, color: '#F97316' },
  { id: 'anthropic/claude-sonnet-4', name: 'Anthropic: Claude Sonnet 4', input: 3.00, output: 15.00, color: '#F97316' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Anthropic: Claude 3.7 Sonnet', input: 1.10, output: 4.40, color: '#F97316' },
  { id: 'deepseek/deepseek-v3.2-exp', name: 'DeepSeek: DeepSeek V3.2 Exp', input: 0.27, output: 0.41, color: '#2563EB' },
  { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek: DeepSeek V3.2', input: 0.21, output: 0.79, color: '#2563EB' },
  { id: 'deepseek/deepseek-v3.1-terminus', name: 'DeepSeek: DeepSeek V3.1 Terminus', input: 0.21, output: 0.79, color: '#2563EB' },
  { id: 'deepseek/deepseek-chat-v3.1', name: 'DeepSeek: DeepSeek V3.1', input: 0.15, output: 0.75, color: '#2563EB' },
  { id: 'deepseek/deepseek-r1-distill-qwen-32b', name: 'DeepSeek: R1 Distill Qwen 32B', input: 0.29, output: 0.29, color: '#2563EB' },
  { id: 'deepseek/deepseek-r1-distill-llama-70b', name: 'DeepSeek: R1 Distill Llama 70B', input: 0.70, output: 0.80, color: '#2563EB' },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek: R1', input: 0.70, output: 2.50, color: '#2563EB' },
  { id: 'deepseek/deepseek-v3.1', name: 'DeepSeek: DeepSeek V3.1 (from api listing)', input: 0.21, output: 0.79, color: '#2563EB' },
  { id: 'moonshotai/kimi-k2.5', name: 'MoonshotAI: Kimi K2.5', input: 0.21, output: 0.83, color: '#EC4899' },
  { id: 'moonshotai/kimi-k2-thinking', name: 'MoonshotAI: Kimi K2 Thinking', input: 0.00, output: 0.00, color: '#EC4899' },
  { id: 'moonshotai/kimi-k2-0905', name: 'MoonshotAI: Kimi K2 0905', input: 0.40, output: 2.00, color: '#EC4899' },
  { id: 'moonshotai/kimi-k2-0905:exacto', name: 'MoonshotAI: Kimi K2 0905 (exacto)', input: 0.60, output: 2.50, color: '#EC4899' },
  { id: 'moonshotai/kimi-k2', name: 'MoonshotAI: Kimi K2 0711', input: 0.50, output: 2.40, color: '#EC4899' }

];

const VPS_COST_USD = 10;
const EXCHANGE_RATE = 32;

export default function App() {
  const [selectedModelId, setSelectedModelId] = useState(MAC_MINI_MODELS[0].id);
  const [tokensPerMonth, setTokensPerMonth] = useState(60); // in 10k (萬)
  const [inputRatio, setInputRatio] = useState(75); // percentage

  const selectedModel = MAC_MINI_MODELS.find((m) => m.id === selectedModelId)!;

  const costs = useMemo(() => {
    const tokensInMillions = tokensPerMonth / 100;
    const inputRatioDec = inputRatio / 100;
    const outputRatioDec = 1 - inputRatioDec;
    const vpsMonthlyTWD = VPS_COST_USD * EXCHANGE_RATE;

    const apiCosts = API_PRICING.map((api) => {
      const blendedCostPerM = api.input * inputRatioDec + api.output * outputRatioDec;
      const apiMonthlyUSD = tokensInMillions * blendedCostPerM;
      const apiMonthlyTWD = apiMonthlyUSD * EXCHANGE_RATE;
      const totalMonthlyTWD = apiMonthlyTWD + vpsMonthlyTWD;
      
      return {
        ...api,
        apiMonthlyTWD,
        vpsMonthlyTWD,
        monthlyTWD: totalMonthlyTWD,
        breakEvenMonths: selectedModel.price / totalMonthlyTWD,
      };
    });

    return apiCosts;
  }, [tokensPerMonth, inputRatio, selectedModel.price]);

  const chartData = costs.map((c) => ({
    name: c.name,
    apiCost: Math.round(c.apiMonthlyTWD),
    vpsCost: Math.round(c.vpsMonthlyTWD),
    totalCost: Math.round(c.monthlyTWD),
    color: c.color,
  }));

  return (
    <div className="min-h-screen bg-[#141414] text-[#E4E3E0] font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-[#333] pb-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
            OpenClaw 建置成本分析
          </h1>
          <p className="text-[#8E9299] text-lg">
            比較 Mac Mini 自行部署與雲端 API、VPS 的長期投資效益
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#333] shadow-lg">
              <div className="flex items-center gap-2 mb-6 text-white">
                <Settings className="w-5 h-5 text-[#F27D26]" />
                <h2 className="text-xl font-semibold">參數設定</h2>
              </div>

              {/* Mac Mini Model */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-[#8E9299] uppercase tracking-wider">
                  Mac Mini 規格 (台灣售價)
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26] transition-all"
                >
                  {MAC_MINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - NT$ {m.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Token Usage Slider */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end">
                  <label className="block text-sm font-medium text-[#8E9299] uppercase tracking-wider">
                    每月 Token 使用量
                  </label>
                  <span className="text-2xl font-mono text-white">
                    {tokensPerMonth} <span className="text-sm text-[#8E9299]">萬</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={tokensPerMonth}
                  onChange={(e) => setTokensPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-[#444] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
                />
                <div className="flex justify-between text-xs text-[#666] font-mono">
                  <span>10萬</span>
                  <span>300萬</span>
                </div>
              </div>

              {/* Input/Output Ratio */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="block text-sm font-medium text-[#8E9299] uppercase tracking-wider">
                    Input / Output 比例
                  </label>
                  <span className="text-lg font-mono text-white">
                    {inputRatio}% / {100 - inputRatio}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={inputRatio}
                  onChange={(e) => setInputRatio(Number(e.target.value))}
                  className="w-full h-2 bg-[#444] rounded-lg appearance-none cursor-pointer accent-[#4285F4]"
                />
                <div className="flex justify-between text-xs text-[#666] font-mono">
                  <span>多數輸出</span>
                  <span>多數輸入</span>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#333]">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                計算基準
              </h3>
              <ul className="space-y-2 text-sm text-[#AAA] font-mono">
                <li>匯率: 1 USD = {EXCHANGE_RATE} TWD</li>
                <li>VPS 成本: $10 / 月 (NT$ 320)</li>
                <li>Mac Mini 電費: 暫不計入</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 space-y-8">
            {/* Chart */}
            <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#333] shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#34A853]" />
                每月花費比較 (NT$)
              </h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#8E9299" tick={{ fill: '#8E9299', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#8E9299" tick={{ fill: '#8E9299', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      cursor={{ fill: '#2A2A2A' }}
                      contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number, name: string) => {
                        return [`NT$ ${value.toLocaleString()}`, name];
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="apiCost" name="API 費用" stackId="a" radius={[0, 0, 4, 4]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="vpsCost" name="VPS (OpenClaw)" stackId="a" fill="#333333" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Break-even Cards */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F2B026]" />
                Mac Mini 回本時間分析
              </h2>
              <p className="text-[#8E9299] mb-6">
                購買 <strong className="text-white">{selectedModel.name} (NT$ {selectedModel.price.toLocaleString()})</strong>，在每月使用 {tokensPerMonth} 萬 Token 的情況下，需要多久才能打平其他方案的開銷：
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {costs.map((c) => (
                  <div key={c.id} className="bg-[#1C1C1C] border border-[#333] rounded-xl p-5 hover:border-[#555] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-white" style={{ color: c.color }}>{c.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-[#8E9299]">總每月花費</div>
                        <div className="font-mono text-lg text-white">NT$ {Math.round(c.monthlyTWD).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4 text-xs text-[#8E9299] flex justify-between">
                      <span>API 費用: NT$ {Math.round(c.apiMonthlyTWD).toLocaleString()}</span>
                      <span>VPS (OpenClaw): NT$ {Math.round(c.vpsMonthlyTWD).toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-[#333]">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-[#8E9299]">回本時間</span>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-white">
                            {c.breakEvenMonths === Infinity || isNaN(c.breakEvenMonths) 
                              ? '∞' 
                              : c.breakEvenMonths > 120 
                                ? '> 10 年' 
                                : c.breakEvenMonths.toFixed(1)}
                          </span>
                          <span className="text-sm text-[#8E9299] ml-1">個月</span>
                        </div>
                      </div>
                      {c.breakEvenMonths < 120 && c.breakEvenMonths !== Infinity && (
                        <div className="mt-2 text-xs text-[#666] text-right">
                          約 {(c.breakEvenMonths / 12).toFixed(1)} 年
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
