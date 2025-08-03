import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AngelsShareChartProps {
  data: {
    years: number[];
    volumes: number[];
  };
}

const AngelsShareChart: React.FC<AngelsShareChartProps> = ({ data }) => {
  const chartData = {
    labels: data.years.map(year => `Year ${year}`),
    datasets: [
      {
        label: 'Remaining Volume (%)',
        data: data.volumes,
        borderColor: '#D2691E',
        backgroundColor: 'rgba(210, 105, 30, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#D2691E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
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
        text: 'Whiskey Volume Reduction Over Time (Angel\'s Share)',
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
            return `${context.parsed.y.toFixed(2)}% remaining`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(245, 222, 179, 0.1)',
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 12
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
        min: 50,
        max: 100
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-primary-black/50 p-6 rounded-lg border border-gold-light/20">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AngelsShareChart;