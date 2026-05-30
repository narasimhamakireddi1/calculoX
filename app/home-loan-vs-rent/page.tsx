'use client';

import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import ExportButton from '@/components/ui/ExportButton';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';

interface HomeLoanVsRentFormData {
  homePrice: number;
  downPayment: number;
  loanTenure: number;
  interestRate: number;
  monthlyRent: number;
  rentIncreaseRate: number;
  propertyAppreciationRate: number;
  investmentReturn: number;
  yearsToCompare: number;
}

export default function HomeLoanVsRentCalculator() {
  const { watch, setValue } = useForm<HomeLoanVsRentFormData>({
    defaultValues: {
      homePrice: 5000000, // ₹50 lakhs
      downPayment: 1000000, // ₹10 lakhs (20%)
      loanTenure: 20,
      interestRate: 8.5,
      monthlyRent: 25000,
      rentIncreaseRate: 6,
      propertyAppreciationRate: 7,
      investmentReturn: 10,
      yearsToCompare: 20,
    },
  });

  const watchValues = watch();

  const results = useMemo(() => {
    const {
      homePrice,
      downPayment,
      loanTenure,
      interestRate,
      monthlyRent,
      rentIncreaseRate,
      propertyAppreciationRate,
      investmentReturn,
      yearsToCompare,
    } = watchValues;

    // Loan calculations
    const loanAmount = Math.max(0, homePrice - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    const monthlyEMI =
      loanAmount > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure * 12)) /
          (Math.pow(1 + monthlyRate, loanTenure * 12) - 1)
        : 0;
    const totalLoanPayment = monthlyEMI * loanTenure * 12;
    const totalInterestPaid = totalLoanPayment - loanAmount;

    // Rent calculations
    let totalRentPaid = 0;
    let currentMonthlyRent = monthlyRent;
    for (let i = 0; i < yearsToCompare * 12; i++) {
      totalRentPaid += currentMonthlyRent;
      if ((i + 1) % 12 === 0) {
        currentMonthlyRent *= 1 + rentIncreaseRate / 100;
      }
    }

    // Down payment invested returns
    const investmentReturnsFromDownPayment = downPayment * (Math.pow(1 + investmentReturn / 100, yearsToCompare) - 1);

    // Property appreciation
    const propertyValueAfter = homePrice * Math.pow(1 + propertyAppreciationRate / 100, yearsToCompare);

    // Home equity after years
    const monthsPaidAfter = Math.min(yearsToCompare * 12, loanTenure * 12);
    const principalPaidAfter = loanAmount - (loanAmount * Math.pow(1 + monthlyRate, loanTenure * 12 - monthsPaidAfter)) / Math.pow(1 + monthlyRate, loanTenure * 12);

    // Cost comparison
    const costOfBuying = totalLoanPayment - principalPaidAfter + (homePrice - propertyValueAfter);
    const costOfRenting = totalRentPaid;

    const netBenefit = costOfBuying < costOfRenting ? `Buying saves ₹${Math.round(costOfRenting - costOfBuying).toLocaleString('en-IN')}` : `Renting saves ₹${Math.round(costOfBuying - costOfRenting).toLocaleString('en-IN')}`;

    // Projection data
    const projectionData = [];
    let cumulativeBuyingCost = 0;
    let cumulativeRentingCost = 0;
    let currentPropertyValue = homePrice;
    let currentInvestedDownPayment = downPayment;
    currentMonthlyRent = monthlyRent;

    for (let month = 0; month <= yearsToCompare * 12; month++) {
      const year = Math.floor(month / 12);

      if (month > 0) {
        // Buying costs
        if (month <= loanTenure * 12) {
          cumulativeBuyingCost += monthlyEMI;
        }

        // Renting costs (increase yearly)
        if (month % 12 === 0 && month > 0) {
          currentMonthlyRent *= 1 + rentIncreaseRate / 100;
        }
        cumulativeRentingCost += currentMonthlyRent;

        // Property appreciation
        if (month % 12 === 0) {
          currentPropertyValue = homePrice * Math.pow(1 + propertyAppreciationRate / 100, year);
          currentInvestedDownPayment = downPayment * Math.pow(1 + investmentReturn / 100, year);
        }
      }

      // Calculate home equity
      const monthsPaid = Math.min(month, loanTenure * 12);
      const principalPaid = monthsPaid > 0 ? loanAmount - (loanAmount * Math.pow(1 + monthlyRate, loanTenure * 12 - monthsPaid)) / Math.pow(1 + monthlyRate, loanTenure * 12) : 0;
      const homeEquity = downPayment + principalPaid;

      if (month % 12 === 0) {
        projectionData.push({
          month,
          year,
          cumulativeBuyingCost,
          cumulativeRentingCost,
          propertyValue: Math.round(currentPropertyValue),
          investedDownPayment: Math.round(currentInvestedDownPayment),
          homeEquity: Math.round(homeEquity),
        });
      }
    }

    // Find break-even point
    let breakEvenMonth = null;
    for (let i = 1; i < projectionData.length; i++) {
      const curr = projectionData[i];
      const netCostBuying = curr.cumulativeBuyingCost - curr.homeEquity;
      const netCostRenting = curr.cumulativeRentingCost;
      if (netCostBuying < netCostRenting) {
        breakEvenMonth = curr.month;
        break;
      }
    }

    return {
      loanAmount,
      monthlyEMI,
      totalLoanPayment,
      totalInterestPaid,
      totalRentPaid,
      investmentReturnsFromDownPayment,
      propertyValueAfter,
      costOfBuying,
      costOfRenting,
      netBenefit,
      breakEvenMonth,
      projectionData,
    };
  }, [watchValues]);

  const chartData = results.projectionData.map((item) => ({
    year: item.year,
    Buying: Math.round(item.cumulativeBuyingCost - item.homeEquity),
    Renting: Math.round(item.cumulativeRentingCost),
  }));

  const lastProjection = results.projectionData[results.projectionData.length - 1];
  const homeEquityAfter = lastProjection ? lastProjection.homeEquity : 0;

  const pieData = [
    { name: 'Home Equity', value: Math.max(0, homeEquityAfter) },
    { name: 'Remaining Loan', value: Math.max(0, results.loanAmount - (homeEquityAfter - watchValues.downPayment)) },
  ];

  const inputsData = [
    { label: 'Home Price', value: `₹${results.costOfBuying.toLocaleString('en-IN')}` },
    { label: 'Down Payment', value: `₹${watchValues.downPayment.toLocaleString('en-IN')}` },
    { label: 'Loan Tenure', value: `${watchValues.loanTenure} years` },
    { label: 'Interest Rate', value: `${watchValues.interestRate}% p.a.` },
    { label: 'Monthly Rent', value: `₹${watchValues.monthlyRent.toLocaleString('en-IN')}` },
    { label: 'Comparison Period', value: `${watchValues.yearsToCompare} years` },
  ];

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient">Home Loan vs Rent Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Compare the costs of buying vs renting and find the best option for your financial situation
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Section */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Home & Loan Details</h2>

          {/* Home Price */}
          <div>
            <label htmlFor="homePrice" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Home Price (₹)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="homePrice"
                type="range"
                min="500000"
                max="50000000"
                step="100000"
                value={watchValues.homePrice}
                onChange={(e) => setValue('homePrice', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 font-bold text-xs md:text-sm">₹</span>
                <input
                  type="number"
                  value={watchValues.homePrice === 0 ? '' : watchValues.homePrice}
                  onChange={(e) => setValue('homePrice', e.target.value ? Number(e.target.value) : 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹5,00,000 - ₹5,00,00,000</p>
          </div>

          {/* Down Payment */}
          <div>
            <label htmlFor="downPayment" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Down Payment (₹)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="downPayment"
                type="range"
                min="0"
                max={watchValues.homePrice}
                step="50000"
                value={watchValues.downPayment}
                onChange={(e) => setValue('downPayment', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 font-bold text-xs md:text-sm">₹</span>
                <input
                  type="number"
                  value={watchValues.downPayment === 0 ? '' : watchValues.downPayment}
                  onChange={(e) => setValue('downPayment', e.target.value ? Number(e.target.value) : 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹0 - ₹{(watchValues.homePrice / 100000).toFixed(0)}L</p>
          </div>

          {/* Loan Tenure */}
          <div>
            <label htmlFor="loanTenure" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Loan Tenure (Years)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="loanTenure"
                type="range"
                min="5"
                max="30"
                step="1"
                value={watchValues.loanTenure}
                onChange={(e) => setValue('loanTenure', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">yrs</span>
                <input
                  type="number"
                  value={watchValues.loanTenure}
                  onChange={(e) => setValue('loanTenure', Number(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 - 30 years</p>
          </div>

          {/* Interest Rate */}
          <div>
            <label htmlFor="interestRate" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Interest Rate (% p.a.)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="interestRate"
                type="range"
                min="3"
                max="15"
                step="0.1"
                value={watchValues.interestRate}
                onChange={(e) => setValue('interestRate', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                <input
                  type="number"
                  step="0.1"
                  value={watchValues.interestRate}
                  onChange={(e) => setValue('interestRate', Number(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3% - 15%</p>
          </div>
        </div>

        {/* Rent Details */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Rent Details</h2>

          {/* Monthly Rent */}
          <div>
            <label htmlFor="monthlyRent" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Monthly Rent (₹)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="monthlyRent"
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={watchValues.monthlyRent}
                onChange={(e) => setValue('monthlyRent', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-rose-300 to-rose-600 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 font-bold text-xs md:text-sm">₹</span>
                <input
                  type="number"
                  value={watchValues.monthlyRent === 0 ? '' : watchValues.monthlyRent}
                  onChange={(e) => setValue('monthlyRent', e.target.value ? Number(e.target.value) : 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹5,000 - ₹2,00,000</p>
          </div>

          {/* Rent Increase Rate */}
          <div>
            <label htmlFor="rentIncreaseRate" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Rent Increase Rate (% per year)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="rentIncreaseRate"
                type="range"
                min="0"
                max="12"
                step="0.1"
                value={watchValues.rentIncreaseRate}
                onChange={(e) => setValue('rentIncreaseRate', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-lg appearance-none cursor-pointer accent-cyan-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                <input
                  type="number"
                  step="0.1"
                  value={watchValues.rentIncreaseRate}
                  onChange={(e) => setValue('rentIncreaseRate', Number(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 12%</p>
          </div>
        </div>

        {/* Assumptions */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Assumptions</h2>

          {/* Property Appreciation */}
          <div>
            <label htmlFor="propertyAppreciationRate" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Property Appreciation (% per year)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="propertyAppreciationRate"
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={watchValues.propertyAppreciationRate}
                onChange={(e) => setValue('propertyAppreciationRate', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-amber-300 to-amber-600 rounded-lg appearance-none cursor-pointer accent-amber-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                <input
                  type="number"
                  step="0.1"
                  value={watchValues.propertyAppreciationRate}
                  onChange={(e) => setValue('propertyAppreciationRate', Number(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% - 15%</p>
          </div>

          {/* Investment Return */}
          <div>
            <label htmlFor="investmentReturn" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Investment Return (% per year)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="investmentReturn"
                type="range"
                min="2"
                max="18"
                step="0.1"
                value={watchValues.investmentReturn}
                onChange={(e) => setValue('investmentReturn', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-indigo-300 to-indigo-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                <input
                  type="number"
                  step="0.1"
                  value={watchValues.investmentReturn}
                  onChange={(e) => setValue('investmentReturn', Number(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2% - 18%</p>
          </div>

          {/* Years to Compare */}
          <div>
            <label htmlFor="yearsToCompare" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Comparison Period (Years)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="yearsToCompare"
                type="range"
                min="5"
                max="40"
                step="1"
                value={watchValues.yearsToCompare}
                onChange={(e) => setValue('yearsToCompare', Number(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-teal-300 to-teal-600 rounded-lg appearance-none cursor-pointer accent-teal-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">yrs</span>
                <input
                  type="number"
                  value={watchValues.yearsToCompare}
                  onChange={(e) => setValue('yearsToCompare', Number(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 - 40 years</p>
          </div>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={() => {
              setValue('homePrice', 5000000);
              setValue('downPayment', 1000000);
              setValue('loanTenure', 20);
              setValue('interestRate', 8.5);
              setValue('monthlyRent', 25000);
              setValue('rentIncreaseRate', 5);
              setValue('propertyAppreciationRate', 5);
              setValue('investmentReturn', 10);
              setValue('yearsToCompare', 20);
            }}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</p>
            <p className="text-3xl font-bold text-gradient">₹{Math.round(results.monthlyEMI).toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Interest Paid</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{Math.round(results.totalInterestPaid).toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Rent (20 Years)</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">₹{Math.round(results.totalRentPaid).toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Winner</p>
            <p className={`text-xl font-bold ${results.costOfBuying < results.costOfRenting ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {results.costOfBuying < results.costOfRenting ? 'Buying Wins' : 'Renting Wins'}
            </p>
          </div>
        </div>

        {/* Verdict */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
          <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{results.netBenefit}</p>
          {results.breakEvenMonth && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Break-even point: After {Math.round(results.breakEvenMonth / 12)} years
            </p>
          )}
        </div>

        {/* Cost Comparison Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Cost Comparison Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideRight', offset: -10 }} />
              <YAxis label={{ value: 'Net Cost (₹)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Legend />
              <Line type="monotone" dataKey="Buying" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Renting" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Home Equity Pie Chart */}
        {pieData[0].value > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Home Equity After {watchValues.yearsToCompare} Years</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MemoizedPieChart data={pieData} colors={['#3b82f6', '#ef4444']} />
              <div className="flex flex-col justify-center space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Property Value</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{Math.round(results.propertyValueAfter).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Home Equity (Down Payment + Principal Paid)</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{Math.round(pieData[0].value).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <ExportButton
          fileName="home-loan-vs-rent"
          calculatorName="Home Loan vs Rent"
          resultElementId="results-section"
          inputsData={inputsData}
        />

        {/* Related Calculators */}
        <RelatedCalculators
          calculators={[
            { title: 'EMI Calculator', description: 'Calculate loan EMI and amortization schedule', icon: '🏦', href: '/emi-calculator' },
            { title: 'SIP Calculator', description: 'Calculate systematic investment plan returns', icon: '📊', href: '/sip-calculator' },
            { title: 'Retirement Calculator', description: 'Plan retirement corpus with 25x rule', icon: '🎯', href: '/retirement-calculator' },
            { title: 'CAGR Calculator', description: 'Measure investment growth rate', icon: '📊', href: '/cagr-calculator' },
          ]}
        />

        {/* FAQ Section */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">What factors should I consider when comparing buying vs renting?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Consider: property appreciation, rent increases, interest rates, down payment investment returns, maintenance costs, property taxes, insurance, and your time horizon. The calculator simplifies this by comparing net costs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">What is the break-even point?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Break-even is the point where total buying cost becomes less than total renting cost. Before break-even, renting is cheaper; after, buying is cheaper. This typically occurs in 5-15 years depending on your market.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">Should I include maintenance costs when buying?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                The calculator doesn't include maintenance (typically 1-2% of property value annually). For a complete picture, subtract 1% of property value from buying savings yearly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">What if I plan to move in 5 years?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Adjust the comparison period to 5 years. Note that selling costs (5-8% brokerage) and stamp duty should be factored in. Generally, if you stay less than 3-5 years, renting is cheaper.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">How accurate is this calculator?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This calculator provides a general comparison. For personalized advice, consult a financial advisor. It doesn't include property taxes, insurance, maintenance, HOA fees, or selling costs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
