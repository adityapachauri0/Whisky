import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ReturnsComparisonChartProps {
  data: {
    categories: string[];
    minReturns: number[];
    avgReturns: number[];
    maxReturns: number[];
  };
}

const ReturnsComparisonChart: React.FC<ReturnsComparisonChartProps> = ({ data }) => {
  const chartData = {
    labels: data.categories,
    datasets: [
      {
        label: 'Minimum Returns',
        data: data.minReturns,
        backgroundColor: '#8B4513',
        borderColor: '#5D2F0B',
        borderWidth: 1,
      },
      {
        label: 'Average Returns',
        data: data.avgReturns,
        backgroundColor: '#D2691E',
        borderColor: '#A0522D',
        borderWidth: 1,
      },
      {
        label: 'Maximum Returns',
        data: data.maxReturns,
        backgroundColor: '#FFD700',
        borderColor: '#DAA520',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#F5DEB3',
          font: {
            size: 14,
            family: 'Merriweather'
          }
        }
      },
      title: {
        display: true,
        text: 'Annual Returns by Cask Category (%)',
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
            return `${context.dataset.label}: ${context.parsed.y}% p.a.`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 14,
            family: 'Merriweather'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(245, 222, 179, 0.1)',
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return value + '%';
          }
        },
        max: 45
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-primary-black/50 p-6 rounded-lg border border-gold-light/20">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ReturnsComparisonChart;