import React, { useState } from 'react';

// IS 456 Reference Tables
const XU_MAX_TABLE: Record<number, number> = { 250: 0.53, 415: 0.48, 500: 0.46 };
const MU_LIMIT_TABLE: Record<number, Record<number, number>> = {
  15: { 250: 2.24, 415: 2.07, 500: 2.00 },
  20: { 250: 2.98, 415: 2.76, 500: 2.66 },
  25: { 250: 3.73, 415: 3.45, 500: 3.33 },
  30: { 250: 4.47, 415: 4.14, 500: 3.99 },
};

export default function DoublyReinforced() {
  const [inputs, setInputs] = useState({
    mu: 75, b: 230, D: 425, fck: 20, fy: 500, cover: 25, dia: 16
  });

  // 1. Dimensions
  const d = inputs.D - inputs.cover - (inputs.dia / 2);
  const dPrime = inputs.cover + (inputs.dia / 2);
  
  // 2. Limiting Values
  const xuMax = XU_MAX_TABLE[inputs.fy] * d;
  const muLimit = MU_LIMIT_TABLE[inputs.fck][inputs.fy] * inputs.b * d * d;
  const muActual = inputs.mu * 1e6; // kNm to N.mm
  const muSurplus = muActual - muLimit;

  // 3. Stress/Strain (Es = 2e5)
  const strainEsc = 0.0035 * ((xuMax - dPrime) / xuMax);
  const fsc = Math.min(strainEsc * 200000, 0.87 * inputs.fy);
  
  // 4. Area of Steel
  const asc = muSurplus / (fsc * (d - dPrime));
  const ast1 = (0.36 * inputs.fck * inputs.b * xuMax) / (0.87 * inputs.fy);
  const ast2 = (asc * fsc) / (0.87 * inputs.fy);
  const totalAst = ast1 + ast2;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 pb-10 font-sans">
      <header className="bg-green-700 text-white p-5 shadow-lg sticky top-0 z-20 text-center">
        <h1 className="text-xl font-black tracking-tighter uppercase">Uniq Designs</h1>
        <p className="text-[10px] font-bold opacity-70">BEAM CALCULATOR V2.0</p>
      </header>

      <div className="p-4 space-y-4">
        {/* INPUTS - BLUE */}
        <div className="bg-white rounded-2xl border-t-8 border-blue-600 shadow-xl p-5 space-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] text-blue-800 font-bold uppercase mb-1">Moment (Mu) kNm</label>
            <input type="number" value={inputs.mu} onChange={e => setInputs({...inputs, mu: Number(e.target.value)})} className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl p-4 text-2xl font-black text-blue-900 focus:border-blue-500 outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] text-blue-800 font-bold mb-1 uppercase text-center">Width (b)</label>
              <input type="number" value={inputs.b} onChange={e => setInputs({...inputs, b: Number(e.target.value)})} className="bg-blue-50 border-2 border-blue-100 rounded-xl p-3 font-bold text-center" />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-blue-800 font-bold mb-1 uppercase text-center">Depth (D)</label>
              <input type="number" value={inputs.D} onChange={e => setInputs({...inputs, D: Number(e.target.value)})} className="bg-blue-50 border-2 border-blue-100 rounded-xl p-3 font-bold text-center" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] text-blue-800 font-bold mb-1 uppercase text-center">Concrete</label>
              <select value={inputs.fck} onChange={e => setInputs({...inputs, fck: Number(e.target.value)})} className="bg-blue-100 border-2 border-blue-200 rounded-xl p-3 font-black text-center">
                {[15, 20, 25, 30].map(v => <option key={v} value={v}>M{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-blue-800 font-bold mb-1 uppercase text-center">Steel</label>
              <select value={inputs.fy} onChange={e => setInputs({...inputs, fy: Number(e.target.value)})} className="bg-blue-100 border-2 border-blue-200 rounded-xl p-3 font-black text-center">
                {[250, 415, 500].map(v => <option key={v} value={v}>Fe{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS - YELLOW */}
        <div className="bg-yellow-400/20 rounded-2xl border border-yellow-300 p-4 space-y-2 text-sm">
          <div className="flex justify-between border-b border-yellow-200 pb-1">
            <span className="text-yellow-900 opacity-70 italic font-medium">Effective Depth (d)</span>
            <span className="font-mono font-black">{d.toFixed(1)} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-900 opacity-70 italic font-medium">Comp. Steel (Asc)</span>
            <span className="font-mono font-black text-red-600">{muSurplus > 0 ? asc.toFixed(2) : "0.00"} mm²</span>
          </div>
        </div>

        {/* FINAL - GREEN */}
        <div className="bg-green-700 rounded-3xl p-10 shadow-2xl text-center text-white ring-8 ring-green-100/30">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Required Tension Steel (Ast)</p>
          {muSurplus > 0 ? (
            <>
              <div className="text-7xl font-black drop-shadow-lg leading-none">{totalAst.toFixed(0)}</div>
              <div className="text-xs mt-3 font-black tracking-widest">SQUARE MILLIMETERS</div>
            </>
          ) : (
            <div className="text-xl font-black py-6 bg-green-800 rounded-xl animate-pulse">Singly Reinforced Only</div>
          )}
        </div>
      </div>
    </div>
  );
}
