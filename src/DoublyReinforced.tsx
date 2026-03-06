import React, { useState } from 'react';

// IS 456 Reference Tables
const XU_MAX_TABLE: Record<number, number> = { 250: 0.53, 415: 0.48, 500: 0.46 };
const MU_LIMIT_TABLE: Record<number, Record<number, number>> = {
  15: { 250: 2.24, 415: 2.07, 500: 2.00 },
  20: { 250: 2.98, 415: 2.76, 500: 2.66 },
  25: { 250: 3.73, 415: 3.45, 500: 3.33 },
  30: { 250: 4.47, 415: 4.14, 500: 3.99 },
};

export default function DoublyReinforcedTool() {
  const [inputs, setInputs] = useState({
    mu: 75, b: 230, D: 425, fck: 20, fy: 500, cover: 25, dia: 16
  });

  // EXACT EXCEL MATHEMATICS
  const d = inputs.D - inputs.cover - (inputs.dia / 2);
  const dPrime = inputs.cover + (inputs.dia / 2);
  const xuMaxD = XU_MAX_TABLE[inputs.fy];
  const es = 200000;
  const muLimitFactor = MU_LIMIT_TABLE[inputs.fck][inputs.fy];
  const muLimit = muLimitFactor * inputs.b * d * d;
  const muMinusMuLimit = (inputs.mu * 1000000) - muLimit;
  const dMinusDPrime = d - dPrime;
  const xuMaxActual = xuMaxD * d;
  const strainEsc = 0.0035 * ((xuMaxActual - dPrime) / xuMaxActual);
  const fsc = strainEsc * es;
  const asc = muMinusMuLimit / (fsc * dMinusDPrime);
  
  // Ast Calculations
  const ast1 = (0.36 * inputs.fck * inputs.b * xuMaxActual) / (0.87 * inputs.fy);
  const ast2 = (asc * fsc) / (0.87 * inputs.fy);
  const totalAst = ast1 + ast2;

  const handlePrint = () => window.print();

  const Cell = ({ label, value, unit, color }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: color || '#fff', fontSize: '13px' }}>
      <span style={{ fontWeight: 'bold' }}>{label}</span>
      <span style={{ fontFamily: 'monospace' }}>{value} <small>{unit}</small></span>
    </div>
  );

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ backgroundColor: '#92d050', padding: '20px', textAlign: 'center', margin: 0, fontSize: '18px', fontWeight: '900' }}>
        DOUBLY REINFORCED BEAM TOOL
      </h2>

      <div style={{ padding: '15px' }}>
        {/* BLUE: INPUT SECTION */}
        <div style={{ border: '3px solid #0070c0', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#0070c0', color: 'white', padding: '8px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>EDITABLE DATA</div>
          <div style={{ padding: '15px', backgroundColor: '#00b0f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="number" placeholder="Mu (kNm)" value={inputs.mu} onChange={e => setInputs({...inputs, mu: +e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold' }} />
            <input type="number" placeholder="Breadth (b) mm" value={inputs.b} onChange={e => setInputs({...inputs, b: +e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: 'none' }} />
            <input type="number" placeholder="Depth (D) mm" value={inputs.D} onChange={e => setInputs({...inputs, D: +e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: 'none' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={inputs.fck} onChange={e => setInputs({...inputs, fck: +e.target.value})} style={{ padding: '10px', borderRadius: '8px' }}>
                {[15, 20, 25, 30].map(v => <option key={v} value={v}>M{v}</option>)}
              </select>
              <select value={inputs.fy} onChange={e => setInputs({...inputs, fy: +e.target.value})} style={{ padding: '10px', borderRadius: '8px' }}>
                {[250, 415, 500].map(v => <option key={v} value={v}>Fe{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* YELLOW: CALCULATED DATA */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <Cell label="EFFECTIVE DEPTH (d)" value={d.toFixed(0)} unit="mm" color="#ffff00" />
          <Cell label="d'" value={dPrime.toFixed(0)} unit="mm" color="#ffff00" />
          <Cell label="Xu.max / d" value={xuMaxD} unit="" color="#ffff00" />
          <Cell label="Es (STEEL MODULUS)" value={es} unit="N/mm²" color="#ffff00" />
          <Cell label="Mu / bd²" value={muLimitFactor} unit="" color="#ffff00" />
          <Cell label="Mu Limit" value={muLimit.toFixed(0)} unit="N.mm" color="#ffff00" />
          <Cell label="(Mu - Mu Limit)" value={muMinusMuLimit.toFixed(0)} unit="N.mm" color="#ffff00" />
          <Cell label="(d - d')" value={dMinusDPrime.toFixed(0)} unit="mm" color="#ffff00" />
          <Cell label="Xu.max" value={xuMaxActual.toFixed(2)} unit="mm" color="#ffff00" />
          <Cell label="Esc (Strain)" value={strainEsc.toFixed(6)} unit="" color="#ffff00" />
          <Cell label="Fsc (Stress)" value={fsc.toFixed(2)} unit="N/mm²" color="#ffff00" />
          <Cell label="Asc" value={asc.toFixed(2)} unit="mm²" color="#ffff00" />
          <Cell label="Ast 1" value={ast1.toFixed(2)} unit="mm²" color="#ffff00" />
          <Cell label="Ast 2" value={ast2.toFixed(2)} unit="mm²" color="#ffff00" />
          
          {/* GREEN: TOTAL RESULT */}
          <div style={{ backgroundColor: '#92d050', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: '900' }}>TOTAL Ast</span>
            <span style={{ fontSize: '20px', fontWeight: '900' }}>{totalAst.toFixed(2)} mm²</span>
          </div>
        </div>

        <button onClick={handlePrint} style={{ width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          PRINT TO PDF / SAVE REPORT
        </button>
      </div>
    </div>
  );
}
