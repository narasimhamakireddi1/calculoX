'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AffiliateBanner } from '@/components/ui/AffiliateBanner';
import { evaluate, computeRegression, computeStats, matrixDet, matrixMul, matrixAdd, matrixTranspose, matrixInverse } from '@/lib/calculators/scientific';
import type { AngleUnit, EngineMode } from '@/lib/calculators/scientific';

interface HistoryItem {
  expr: string;
  result: string;
}

interface StatDataPoint {
  x: number;
  y: number;
}

export default function ScientificCalculatorPage() {
  const [engine, setEngine] = useState<EngineMode>('STANDARD');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [input, setInput] = useState('');
  const [liveResult, setLiveResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [isShift, setIsShift] = useState(false);
  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixSize, setMatrixSize] = useState<{ r: number; c: number }>({ r: 2, c: 2 });
  const [matrixModalOpen, setMatrixModalOpen] = useState<'A' | 'B' | null>(null);
  const [matrixLastOp, setMatrixLastOp] = useState<string>('');
  const [matrixLastResult, setMatrixLastResult] = useState<number[][] | null>(null);
  const [statData, setStatData] = useState<StatDataPoint[]>([{ x: 0, y: 0 }]);
  const [statModalOpen, setStatModalOpen] = useState(false);

  // Memoized calculation context
  const calcContext = useMemo(
    () => ({
      angleUnit,
      memory,
      ans,
      matrixA,
      matrixB,
      statX: statData.map(d => d.x),
      statY: statData.map(d => d.y),
    }),
    [angleUnit, memory, ans, matrixA, matrixB, statData]
  );

  // Live evaluation
  useEffect(() => {
    if (!input) {
      setLiveResult('');
      return;
    }

    const result = evaluate(input, calcContext);
    if (!result.error && result.display) {
      setLiveResult(result.display);
    } else {
      setLiveResult('');
    }
  }, [input, calcContext]);

  const handleKey = useCallback((key: string) => {
    if (key === 'AC') {
      setInput('');
      setLiveResult('');
    } else if (key === 'DEL') {
      setInput(prev => prev.slice(0, -1));
    } else if (key === 'SHIFT') {
      setIsShift(prev => !prev);
    } else if (key === 'MODE') {
      const modes: EngineMode[] = ['STANDARD', 'COMPLEX', 'MATRIX', 'STATISTICAL'];
      const idx = modes.indexOf(engine);
      setEngine(modes[(idx + 1) % modes.length]);
    } else if (key === 'DEG/RAD') {
      setAngleUnit(prev => prev === 'DEG' ? 'RAD' : 'DEG');
      setIsShift(false);
    } else if (key === 'M+') {
      if (liveResult) {
        const val = parseFloat(liveResult);
        if (!isNaN(val)) {
          setMemory(prev => prev + val);
          setIsShift(false);
        }
      }
    } else if (key === 'M-') {
      if (liveResult) {
        const val = parseFloat(liveResult);
        if (!isNaN(val)) {
          setMemory(prev => prev - val);
          setIsShift(false);
        }
      }
    } else if (key === 'MC') {
      setMemory(0);
      setIsShift(false);
    } else if (key === 'MR') {
      setInput(prev => prev + memory);
      setIsShift(false);
    } else if (key === 'Ans') {
      setInput(prev => prev + 'Ans');
    } else if (key === 'M') {
      setInput(prev => prev + 'M');
    } else if (key === '=') {
      if (input && liveResult) {
        setHistory(prev => [...prev.slice(-9), { expr: input, result: liveResult }]);
        setAns(parseFloat(liveResult));
        setInput('');
        setIsShift(false);
      }
    } else if (key === 'Mat A') {
      setMatrixModalOpen('A');
    } else if (key === 'Mat B') {
      setMatrixModalOpen('B');
    } else if (key === 'Stat') {
      setStatModalOpen(true);
    } else if (key === 'det') {
      const det = matrixDet(matrixA);
      setMatrixLastOp('det(A)');
      setLiveResult(det.toFixed(6));
      setAns(det);
    } else if (key === 'inv') {
      try {
        const inv = matrixInverse(matrixA);
        setMatrixLastOp('inv(A)');
        setMatrixLastResult(inv);
        setLiveResult('Inverse computed');
      } catch (e) {
        setLiveResult('Error: Singular matrix');
      }
    } else if (key === 'T') {
      const trans = matrixTranspose(matrixA);
      setMatrixLastOp('T(A)');
      setMatrixLastResult(trans);
      setLiveResult('Transpose computed');
    } else if (key === 'A+B') {
      try {
        const sum = matrixAdd(matrixA, matrixB);
        setMatrixLastOp('A+B');
        setMatrixLastResult(sum);
        setLiveResult('Addition computed');
      } catch (e) {
        setLiveResult('Error: Size mismatch');
      }
    } else if (key === 'A×B') {
      try {
        const prod = matrixMul(matrixA, matrixB);
        setMatrixLastOp('A×B');
        setMatrixLastResult(prod);
        setLiveResult('Multiplication computed');
      } catch (e) {
        setLiveResult('Error: Size mismatch');
      }
    } else {
      // Regular input (function, operator, number, parenthesis, etc.)
      let toAppend = key;

      if (isShift && ['sin', 'cos', 'tan', 'log', 'ln'].includes(key)) {
        const shiftMap: Record<string, string> = {
          'sin': 'asin', 'cos': 'acos', 'tan': 'atan',
          'log': '10^', 'ln': 'exp',
        };
        toAppend = shiftMap[key] || key;
        setIsShift(false);
      }

      if (key === 'π') toAppend = 'π';
      if (key === 'e') toAppend = 'e';

      setInput(prev => prev + toAppend + (FUNCTIONS.has(toAppend) ? '(' : ''));
    }
  }, [input, liveResult, isShift, memory, ans, engine, angleUnit, matrixA, matrixB]);

  // Physical keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleKey('=');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKey('DEL');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleKey('AC');
      } else if (/^[0-9.]$/.test(e.key)) {
        setInput(prev => prev + e.key);
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        handleKey('^');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleKey(e.key);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  return (
    <div className="space-y-8 py-8">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">🔬 Scientific Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Casio ClassWiz-style · Standard · Complex · Matrix · Statistics
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main calculator card */}
        <div className="card space-y-4">
          {/* Dual Display */}
          <DisplayPanel
            input={input}
            result={liveResult}
            engine={engine}
            angleUnit={angleUnit}
            isShift={isShift}
            memory={memory}
          />

          {/* Button Grid - 8 rows */}
          <ButtonGrid
            isShift={isShift}
            engine={engine}
            memory={memory}
            onKey={handleKey}
          />
        </div>

        {/* History Panel */}
        {history.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">📋 History</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {[...history].reverse().map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.expr}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{item.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matrix Result Display */}
        {engine === 'MATRIX' && matrixLastResult && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">{matrixLastOp} Result</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{matrixLastResult.map(row => '[' + row.map(v => v.toFixed(4)).join(', ') + ']').join('\n')}</pre>
            </div>
          </div>
        )}

        {/* Statistics Result Display */}
        {engine === 'STATISTICAL' && statData.length > 1 && (
          <StatResultCard statData={statData} />
        )}

        {/* Matrix Input Modal */}
        {matrixModalOpen && (
          <MatrixInputModal
            onClose={() => setMatrixModalOpen(null)}
            onSet={(mat) => {
              if (matrixModalOpen === 'A') setMatrixA(mat);
              else setMatrixB(mat);
              setMatrixModalOpen(null);
            }}
            size={matrixSize}
            onSizeChange={setMatrixSize}
          />
        )}

        {/* Stat Input Modal */}
        {statModalOpen && (
          <StatInputModal
            data={statData}
            onClose={() => setStatModalOpen(false)}
            onUpdate={setStatData}
          />
        )}
      </div>

      {/* Affiliate Banner */}
      <AffiliateBanner
        icon="📬"
        headline="Advanced Scientific Computing"
        subtext="Use calculox for precise mathematical calculations with professional accuracy"
        note="Perfect for engineers, scientists, and students"
        gradient="from-indigo-500 to-purple-600"
        links={[
          { label: 'Learn More →', href: '#', primary: true },
        ]}
      />

      {/* FAQ */}
      <div className="max-w-3xl mx-auto card">
        <h3 className="text-2xl font-bold mb-6">â" Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-gray-100 group-open:text-blue-600">
              How do I use DEG vs RAD mode?
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
              Click the DEG/RAD button to toggle. DEG (degrees) is the default. When using trigonometric functions like sin, cos, tan, the input is interpreted in the current angle mode. For example, sin(45) in DEG mode returns 0.7071, while in RAD mode it returns 0.8509.
            </p>
          </details>

          <details className="group cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-gray-100 group-open:text-blue-600">
              What does SHIFT do?
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
              SHIFT toggles between primary and secondary functions. When SHIFT is active, sin becomes asin (arcsine), cos becomes acos, tan becomes atan, log becomes 10^, and ln becomes e^. Press SHIFT to activate/deactivate.
            </p>
          </details>

          <details className="group cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-gray-100 group-open:text-blue-600">
              How do I use Matrix mode?
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
              Switch to MATRIX engine via the MODE button. Click "Mat A" or "Mat B" to enter matrix values (2×2 or 3×3). Then use operations: det(A), inv(A), T(A), A+B, A×B to compute results.
            </p>
          </details>

          <details className="group cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-gray-100 group-open:text-blue-600">
              How does Complex number mode work?
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
              Switch to COMPLEX engine via MODE. Enter complex numbers using 'i', e.g., "3+4i". Operations are performed in complex arithmetic. Results show both real and imaginary parts (e.g., "3+4i").
            </p>
          </details>

          <details className="group cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-gray-100 group-open:text-blue-600">
              What functions are supported?
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
              All standard scientific functions: sin, cos, tan, log, ln, sqrt, exp, abs, nCr, nPr, factorial (!), plus constants π and e. Use parentheses for grouping: 2*(3+4). Order of operations (PEMDAS) is respected.
            </p>
          </details>

          <details className="group cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-gray-100 group-open:text-blue-600">
              How do I use Memory (M)?
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
              M+ adds current result to memory, M- subtracts, MC clears memory, MR recalls. You can also use 'M' in expressions. The memory value persists until cleared.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'log', 'ln', 'log2', 'exp',
  'sqrt', 'cbrt', 'abs', 'ceil', 'floor', 'round',
  'fact', 'nCr', 'nPr', 'deg', 'rad',
]);

/**
 * Display Panel Component
 */
function DisplayPanel({
  input,
  result,
  engine,
  angleUnit,
  isShift,
  memory,
}: {
  input: string;
  result: string;
  engine: EngineMode;
  angleUnit: AngleUnit;
  isShift: boolean;
  memory: number;
}) {
  return (
    <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono min-h-[140px] flex flex-col">
      {/* Status bar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {engine}
        </span>
        <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
          {angleUnit}
        </span>
        {memory !== 0 && (
          <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded">
            M:{memory.toFixed(2)}
          </span>
        )}
        {isShift && (
          <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
            SHIFT
          </span>
        )}
      </div>

      {/* Input line */}
      <p className="text-gray-400 text-sm text-right font-normal min-h-[1.5rem] truncate">
        {input || ' '}
      </p>

      {/* Result line */}
      <p aria-live="polite" className="text-white text-3xl font-bold text-right mt-2">
        {result ? `= ${result}` : ' '}
      </p>
    </div>
  );
}

/**
 * Button Grid Component
 */
function ButtonGrid({
  isShift,
  engine,
  memory,
  onKey,
}: {
  isShift: boolean;
  engine: EngineMode;
  memory: number;
  onKey: (key: string) => void;
}) {
  const buttonClasses = {
    system: 'bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500',
    number: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    operator: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800',
    function: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:shadow-md',
    advanced: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 hover:shadow-md',
    execute: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold',
  };

  const Button = ({ label, onClick, className = '', disabled = false }: { label: string; onClick: () => void; className?: string; disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-1 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg font-semibold transition-all ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-2">
      {/* Row 1 - System */}
      <div className="grid grid-cols-8 gap-1">
        <button aria-pressed={isShift} onClick={() => onKey('SHIFT')} className={`px-1 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg font-semibold transition-all ${buttonClasses.system} ${isShift ? ' ring-2 ring-orange-400' : ''}`}>SHIFT</button>
        <Button label="MODE" onClick={() => onKey('MODE')} className={buttonClasses.system} />
        <Button label="DEG/RAD" onClick={() => onKey('DEG/RAD')} className={buttonClasses.system} />
        <Button label="M+" onClick={() => onKey('M+')} className={buttonClasses.system} />
        <Button label="M-" onClick={() => onKey('M-')} className={buttonClasses.system} />
        <Button label="MC" onClick={() => onKey('MC')} className={buttonClasses.system} disabled={memory === 0} />
        <Button label="DEL" onClick={() => onKey('DEL')} className={buttonClasses.system} />
        <Button label="AC" onClick={() => onKey('AC')} className={buttonClasses.system} />
      </div>

      {/* Row 2 - Power/Trig */}
      <div className="grid grid-cols-8 gap-1">
        <Button label="x²" onClick={() => onKey('^')} className={buttonClasses.function} />
        <Button label="x^y" onClick={() => onKey('^')} className={buttonClasses.function} />
        <Button label="√x" onClick={() => onKey('sqrt(')} className={buttonClasses.function} />
        <Button label={isShift ? 'asin' : 'sin'} onClick={() => onKey(isShift ? 'asin(' : 'sin(')} className={buttonClasses.function} />
        <Button label={isShift ? 'acos' : 'cos'} onClick={() => onKey(isShift ? 'acos(' : 'cos(')} className={buttonClasses.function} />
        <Button label={isShift ? 'atan' : 'tan'} onClick={() => onKey(isShift ? 'atan(' : 'tan(')} className={buttonClasses.function} />
        <Button label={isShift ? '10^' : 'log'} onClick={() => onKey(isShift ? '10^(' : 'log(')} className={buttonClasses.function} />
        <Button label={isShift ? 'e^' : 'ln'} onClick={() => onKey(isShift ? 'exp(' : 'ln(')} className={buttonClasses.function} />
      </div>

      {/* Row 3 - Constants/Memory */}
      <div className="grid grid-cols-8 gap-1">
        <Button label="π" onClick={() => onKey('π')} className={buttonClasses.function} />
        <Button label="e" onClick={() => onKey('e')} className={buttonClasses.function} />
        <Button label="(" onClick={() => onKey('(')} className={buttonClasses.operator} />
        <Button label=")" onClick={() => onKey(')')} className={buttonClasses.operator} />
        <Button label="MR" onClick={() => onKey('MR')} className={buttonClasses.system} disabled={memory === 0} />
        <Button label="Ans" onClick={() => onKey('Ans')} className={buttonClasses.system} />
        <Button label="sinh" onClick={() => onKey('sinh(')} className={buttonClasses.function} />
        <Button label="cosh" onClick={() => onKey('cosh(')} className={buttonClasses.function} />
      </div>

      {/* Row 4 - Advanced */}
      <div className="grid grid-cols-8 gap-1">
        <Button label="3√x" onClick={() => onKey('cbrt(')} className={buttonClasses.advanced} />
        <Button label="log₂" onClick={() => onKey('log2(')} className={buttonClasses.advanced} />
        <Button label="x!" onClick={() => onKey('fact(')} className={buttonClasses.advanced} />
        <Button label="nCr" onClick={() => onKey('nCr(')} className={buttonClasses.advanced} />
        <Button label="nPr" onClick={() => onKey('nPr(')} className={buttonClasses.advanced} />
        {engine === 'MATRIX' ? (
          <>
            <Button label="det" onClick={() => onKey('det')} className={buttonClasses.advanced} />
            <Button label="inv" onClick={() => onKey('inv')} className={buttonClasses.advanced} />
            <Button label="T" onClick={() => onKey('T')} className={buttonClasses.advanced} />
          </>
        ) : (
          <>
            <Button label="Mat A" onClick={() => onKey('Mat A')} className={buttonClasses.advanced} />
            <Button label="Mat B" onClick={() => onKey('Mat B')} className={buttonClasses.advanced} />
            <Button label="Stat" onClick={() => onKey('Stat')} className={buttonClasses.advanced} />
          </>
        )}
      </div>

      {/* Rows 5-7 - Number Pad */}
      <div className="grid grid-cols-8 gap-1">
        <Button label="7" onClick={() => onKey('7')} className={buttonClasses.number} />
        <Button label="8" onClick={() => onKey('8')} className={buttonClasses.number} />
        <Button label="9" onClick={() => onKey('9')} className={buttonClasses.number} />
        <Button label="÷" onClick={() => onKey('/')} className={buttonClasses.operator} />
        <Button label="%" onClick={() => onKey('%')} className={buttonClasses.operator} />
        <Button label="abs" onClick={() => onKey('abs(')} className={buttonClasses.function} />
        <Button label="tanh" onClick={() => onKey('tanh(')} className={buttonClasses.function} />
        <Button label="|" onClick={() => onKey('|')} className={buttonClasses.operator} />
      </div>

      <div className="grid grid-cols-8 gap-1">
        <Button label="4" onClick={() => onKey('4')} className={buttonClasses.number} />
        <Button label="5" onClick={() => onKey('5')} className={buttonClasses.number} />
        <Button label="6" onClick={() => onKey('6')} className={buttonClasses.number} />
        <Button label="×" onClick={() => onKey('*')} className={buttonClasses.operator} />
        <Button label="^" onClick={() => onKey('^')} className={buttonClasses.operator} />
        <Button label="floor" onClick={() => onKey('floor(')} className={buttonClasses.function} />
        <Button label="ceil" onClick={() => onKey('ceil(')} className={buttonClasses.function} />
        <Button label="rnd" onClick={() => onKey('round(')} className={buttonClasses.function} />
      </div>

      <div className="grid grid-cols-8 gap-1">
        <Button label="1" onClick={() => onKey('1')} className={buttonClasses.number} />
        <Button label="2" onClick={() => onKey('2')} className={buttonClasses.number} />
        <Button label="3" onClick={() => onKey('3')} className={buttonClasses.number} />
        <Button label="-" onClick={() => onKey('-')} className={buttonClasses.operator} />
        <Button label="+" onClick={() => onKey('+')} className={buttonClasses.operator} />
        <Button label="√3" onClick={() => onKey('cbrt(')} className={buttonClasses.function} />
        <Button label="i" onClick={() => onKey('i')} className={buttonClasses.function} />
        <Button label="±" onClick={() => onKey('*-1')} className={buttonClasses.operator} />
      </div>

      {/* Row 8 - Execute & Extras */}
      <div className="grid grid-cols-8 gap-1">
        <Button label="0" onClick={() => onKey('0')} className={buttonClasses.number} />
        <Button label="." onClick={() => onKey('.')} className={buttonClasses.number} />
        <Button label="exp" onClick={() => onKey('exp(')} className={buttonClasses.function} />
        {engine === 'MATRIX' ? (
          <>
            <Button label="A+B" onClick={() => onKey('A+B')} className={buttonClasses.advanced} />
            <Button label="A×B" onClick={() => onKey('A×B')} className={buttonClasses.advanced} />
            <Button label="Mat A" onClick={() => onKey('Mat A')} className={buttonClasses.advanced} />
            <Button label="Mat B" onClick={() => onKey('Mat B')} className={buttonClasses.advanced} />
          </>
        ) : (
          <>
            <Button label="Stat" onClick={() => onKey('Stat')} className={buttonClasses.advanced} />
            <Button label="Mat A" onClick={() => onKey('Mat A')} className={buttonClasses.advanced} />
            <Button label="Mat B" onClick={() => onKey('Mat B')} className={buttonClasses.advanced} />
          </>
        )}
        <Button label="=" onClick={() => onKey('=')} className={`${buttonClasses.execute} col-span-2`} />
      </div>
    </div>
  );
}

/**
 * Matrix Input Modal
 */
function MatrixInputModal({
  onClose,
  onSet,
  size,
  onSizeChange,
}: {
  onClose: () => void;
  onSet: (mat: number[][]) => void;
  size: { r: number; c: number };
  onSizeChange: (size: { r: number; c: number }) => void;
}) {
  const [values, setValues] = useState<number[][]>(
    Array(size.r).fill(null).map(() => Array(size.c).fill(0))
  );

  const handleSet = () => {
    onSet(values);
  };

  const handleSizeToggle = () => {
    const newSize = size.r === 2 ? { r: 3, c: 3 } : { r: 2, c: 2 };
    onSizeChange(newSize);
    setValues(Array(newSize.r).fill(null).map(() => Array(newSize.c).fill(0)));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-md mx-auto">
        <h3 className="text-2xl font-bold mb-4">Enter Matrix</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Size:</label>
          <button
            onClick={handleSizeToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {size.r}×{size.c} (Click to toggle 2×2/3×3)
          </button>
        </div>

        <div className="mb-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${size.c}, minmax(0, 1fr))` }}>
          {values.map((row, i) =>
            row.map((val, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => {
                  const newVals = [...values];
                  newVals[i][j] = parseFloat(e.target.value) || 0;
                  setValues(newVals);
                }}
                className="w-full px-2 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              />
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSet}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Set Matrix
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Statistics Input Modal
 */
function StatInputModal({
  data,
  onClose,
  onUpdate,
}: {
  data: StatDataPoint[];
  onClose: () => void;
  onUpdate: (data: StatDataPoint[]) => void;
}) {
  const [values, setValues] = useState<StatDataPoint[]>(data);

  const handleAddRow = () => {
    setValues([...values, { x: 0, y: 0 }]);
  };

  const handleRemoveRow = (idx: number) => {
    setValues(values.filter((_, i) => i !== idx));
  };

  const handleUpdate = () => {
    if (values.length > 0) {
      onUpdate(values);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-lg mx-auto max-h-[80vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Statistical Data</h3>

        <div className="mb-4 space-y-2 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-5 gap-2 font-bold mb-2">
            <span>X</span>
            <span>Y</span>
            <span></span>
          </div>
          {values.map((point, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <input
                type="number"
                value={point.x}
                onChange={(e) => {
                  const newVals = [...values];
                  newVals[i].x = parseFloat(e.target.value) || 0;
                  setValues(newVals);
                }}
                className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 col-span-2"
              />
              <input
                type="number"
                value={point.y}
                onChange={(e) => {
                  const newVals = [...values];
                  newVals[i].y = parseFloat(e.target.value) || 0;
                  setValues(newVals);
                }}
                className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 col-span-2"
              />
              <button
                onClick={() => handleRemoveRow(i)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddRow}
          className="w-full mb-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Add Row
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Statistics Result Card
 */
function StatResultCard({ statData }: { statData: StatDataPoint[] }) {
  const x = statData.map(d => d.x);
  const y = statData.map(d => d.y);
  const stats = computeStats(x);
  const statsY = computeStats(y);
  const reg = computeRegression(x, y);

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">📊 Statistical Analysis</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 uppercase font-semibold">X Data</p>
          <p className="text-2xl font-bold">n={stats.n}</p>
          <p className="text-sm mt-1">μ={stats.mean.toFixed(4)}</p>
          <p className="text-sm">σ={stats.stddev.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 uppercase font-semibold">Y Data</p>
          <p className="text-2xl font-bold">n={statsY.n}</p>
          <p className="text-sm mt-1">μ={statsY.mean.toFixed(4)}</p>
          <p className="text-sm">σ={statsY.stddev.toFixed(4)}</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Linear Regression</p>
        <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
          y = {reg.slope.toFixed(6)}x + {reg.intercept.toFixed(6)}
        </p>
        <p className="text-sm mt-2 text-blue-700 dark:text-blue-300">
          rÂ² = {(reg.r * reg.r).toFixed(6)}
        </p>
      </div>
    </div>
  );
}

