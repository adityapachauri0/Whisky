import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems, className = '' }) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    const pathMap: { [key: string]: string } = {
      'about': 'About Us',
      'how-it-works': 'How It Works',
      'blog': 'Blog & Insights',
      'contact': 'Contact',
      'faq': 'FAQ',
      'buy-sell': 'Buy & Sell',
      'sell-whisky': 'Sell Your Cask',
      'privacy-policy': 'Privacy Policy',
      'terms': 'Terms of Service',
      'regions': 'Whisky Regions',
      'speyside': 'Speyside',
      'islay': 'Islay',
      'lowland': 'Lowland',
      'highlands': 'Highlands',
      'distilleries': 'Distilleries',
      'investment': 'Investment Options',
      'premium-casks': 'Premium Casks',
      'rare-collections': 'Rare Collections'
    };

    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      const label = pathMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: index === pathnames.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {item.isActive ? (
              <span 
                className="text-amber-600 font-medium"
                aria-current="page"
              >
                {index === 0 && <HomeIcon className="h-4 w-4 inline mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-600 hover:text-amber-600 transition-colors duration-200 flex items-center"
              >
                {index === 0 && <HomeIcon className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;