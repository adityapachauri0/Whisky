import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CostBreakdownChartProps {
  data: {
    labels: string[];
    values: number[];
    total: number;
  };
}

const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#8B4513', // Storage - Saddle Brown
          '#D2691E', // Insurance - Chocolate
          '#DEB887', // Regauging - Burlywood
          '#F4A460', // Purchase Commission - Sandy Brown
          '#CD853F'  // Sale Commission - Peru
        ],
        borderColor: '#1A0D08',
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#F5DEB3',
          font: {
            size: 14,
            family: 'Merriweather'
          },
          padding: 20,
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const percentage = ((value / data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
                return {
                  text: `${label}: £${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Cost Breakdown for £10,000 Investment (5 Years)',
        color: '#F5DEB3',
        font: {
          size: 18,
          family: 'Merriweather',
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 13, 8, 0.9)',
        titleColor: '#F5DEB3',
        bodyColor: '#F5DEB3',
        borderColor: '#D2691E',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / data.total) * 100).toFixed(1);
            return `${label}: £${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-primary-black/50 p-6 rounded-lg border border-gold-light/20">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CostBreakdownChart;