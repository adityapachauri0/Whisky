import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyPoundIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface StatsData {
  totalVisitors: number;
  totalContacts: number;
  totalSellSubmissions: number;
  recentActivity: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Contact Inquiries',
      value: stats.totalContacts.toLocaleString(),
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Sell Submissions',
      value: stats.totalSellSubmissions.toLocaleString(),
      icon: CurrencyPoundIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Recent Activity',
      value: `${stats.recentActivity}%`,
      icon: ChartBarIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                Live
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(DashboardStats);