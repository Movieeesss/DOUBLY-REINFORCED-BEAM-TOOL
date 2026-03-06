import React, { useState } from 'react';

// IS 456 Reference Tables
const XU_MAX_TABLE: Record<number, number> = { 250: 0.53, 415: 0.48, 500: 0.46 };
const MU_LIMIT_TABLE: Record<number, Record<number, number>> = {
  15: { 250: 2.24, 415: 2.07, 500: 2.00 },
  20: { 250: 2.98, 415: 2.76, 500: 2.66 },
  25: { 250: 3.73, 415: 3.45, 500: 3.33 },
  30: { 250: 4.47, 415: 4.14, 500: 3.99 },
};

export default function DoublyReinforcedMobile() {
  const [inputs, setInputs] = useState({
    mu: 75, b: 230, D: 425, fck: 20, fy: 500, cover: 25, dia: 16
  });

  // 1. DIMENSIONS
  const d = inputs.D - inputs.cover - (inputs.dia / 2);
  const dPrime = inputs.cover + (inputs.dia / 2);
  
  // 2. LIMITING MOMENT
  const xuMax = XU_MAX_TABLE[inputs.fy] * d;
  const muLimit = MU_LIMIT_TABLE[inputs.fck][inputs.fy] * inputs.b * d * d;
  const muActual = inputs.mu * 1e6; // kNm to N.mm conversion
  const muSurplus = muActual - muLimit;

  // 3. STRESS & STRAIN
  const strainEsc = 0.0035 * ((xuMax - dPrime) / xuMax);
  const fsc = strainEsc * 200000; // Es = 2x10^5 N/mm2
  
  // 4. STEEL AREAS
  const asc = muSurplus / (fsc * (d - dPrime));
  const ast1 = (0.36 * inputs.fck * inputs.b * xuMax) / (0.87 * inputs.fy);
  const ast2 = (asc * fsc) / (0.87 * inputs.fy);
  const totalAst = ast1 + ast2;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 pb-10">
      <header className="bg-green-700 text-white p-4 shadow-lg sticky top-0 z-20 text-center">
        <h1 className="text-lg font-black tracking-widest uppercase">Uniq Designs</h1>
        <p className="text-[9px] font-bold opacity-75">DOUBLY REINFORCED BEAM CALCULATOR</p>
      </header>

      <div className="p-4 space-y-4">
        {/* INPUTS SECTION */}
        <div className="bg-white rounded-2xl border-l-8 border-blue-500 shadow-md overflow-hidden p-4 space-y-3">
            <div className="flex flex-col">
              <label className="text-[10px] text-blue-900 font-bold mb-1 uppercase">Moment (Mu) kNm</label>
              <input type="number" value={inputs.mu} onChange={e => setInputs({...inputs, mu: +e.target.value})} className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl p-3 text-xl font-black text-blue-900 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-[10px] text-blue-900 font-bold mb-1 uppercase">Breadth (b)</label>
                <input type="number" value={inputs.b} onChange={e => setInputs({...inputs, b: +e.target.value})} className="bg-blue-50 border-2 border-blue-100 rounded-xl p-3 font-bold text-center" />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-blue-900 font-bold mb-1 uppercase">Depth (D)</label>
                <input type="number" value={inputs.D} onChange={e => setInputs({...inputs, D: +e.target.value})} className="bg-blue-50 border-2 border-blue-100 rounded-xl p-3 font-bold text-center" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-[10px] text-blue-900 font-bold mb-1 uppercase">Grade fck</label>
                <select value={inputs.fck} onChange={e => setInputs({...inputs, fck: +e.target.value})} className="bg-blue-100 border-2 border-blue-200 rounded-xl p-3 font-black text-center">
                  {[15, 20, 25, 30].map(v => <option key={v} value={v}>M{v}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] text-blue-900 font-bold mb-1 uppercase">Steel fy</label>
                <select value={inputs.fy} onChange={e => setInputs({...inputs, fy: +e.target.value})} className="bg-blue-100 border-2 border-blue-200 rounded-xl p-3 font-black text-center">
                  {[250, 415, 500].map(v => <option key={v} value={v}>Fe{v}</option>)}
                </select>
              </div>
            </div>
        </div>

        {/* CALCULATIONS SECTION */}
        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4 space-y-2 text-sm shadow-sm">
          <div className="flex justify-between border-b border-yellow-200 pb-1">
            <span className="text-yellow-800 font-bold">Eff. Depth (d)</span>
            <span className="font-mono font-black">{d.toFixed(1)} mm</span>
          </div>
          <div className="flex justify-between border-b border-yellow-200 pb-1">
            <span className="text-yellow-800 font-bold">Surplus Moment</span>
            <span className="font-mono font-black">{(muSurplus/1e6).toFixed(2)} kNm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-800 font-bold">Comp. Steel (Asc)</span>
            <span className="font-mono font-black text-red-600">{muSurplus > 0 ? asc.toFixed(2) : "0.00"} mm²</span>
          </div>
        </div>

        {/* FINAL TOTAL SECTION */}
        <div className="bg-green-600 rounded-3xl p-8 shadow-xl text-center text-white ring-8 ring-green-100/50">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Total Tension Steel (Ast)</p>
          {muSurplus > 0 ? (
            <>
              <div className="text-6xl font-black">{totalAst.toFixed(0)}</div>
              <div className="text-sm mt-1 font-bold">mm² REQUIRED</div>
            </>
          ) : (
            <div className="text-xl font-black py-4">Singly Reinforced Only</div>
          )}
        </div>
      </div>
    </div>
  );
}
