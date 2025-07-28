import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logRef = useRef<string[]>([]);
  const [logs, setLogs] = React.useState<string[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `${timestamp}: Navigated to ${location.pathname}`;
    logRef.current = [...logRef.current.slice(-4), newLog]; // Keep last 5 logs
    setLogs([...logRef.current]);
    
    console.log('🔍 Route Debug:', newLog);
    
    // Show alert for how-it-works navigation to help debug
    if (location.pathname === '/how-it-works' && logRef.current.length > 1) {
      console.warn('⚠️ Navigated to How It Works! Check if this was expected.');
    }
  }, [location.pathname]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <h4 className="font-bold mb-2">🔍 Route Debug Info</h4>
      <div className="space-y-1 mb-3">
        <div><strong>Current:</strong> {location.pathname}</div>
        <div><strong>Search:</strong> {location.search || 'None'}</div>
        <div><strong>Hash:</strong> {location.hash || 'None'}</div>
        <div><strong>State:</strong> {JSON.stringify(location.state) || 'None'}</div>
      </div>
      
      <div className="mb-3">
        <h5 className="font-bold mb-1">📝 Recent Navigation:</h5>
        <div className="space-y-1 text-xs text-gray-300 max-h-20 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
      <div className="mt-3 space-x-2">
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/about')}
          className="bg-green-600 px-2 py-1 rounded text-xs"
        >
          About
        </button>
        <button 
          onClick={() => navigate('/contact')}
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default RouteDebugger;