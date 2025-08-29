// Shreeji Restaurant Navigation - With Pickup Orders
import React from 'react';
import { useAppContext, ACTIONS } from '../context/AppContext';

const Navigation = () => {
  const { state, dispatch } = useAppContext();
  const { currentView, selectedTable } = state;

  const setCurrentView = (view) => {
    if (dispatch) {
      dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: view });
   <div className="flex items-center gap-3">
   <div className="greeting font-semibold text-lg">Jay Swaminarayan</div>
   </div>
  /* Compact Status Info */

    }
  };

  const navigationItems = [
    {
      id: 'staff',
      label: '🍽️ Dine In',
      description: 'Table orders',
      color: 'orange'
    },
    {
      id: 'pickup',
      label: '📦 Pickup',
      description: 'Takeaway orders',
      color: 'red'
    },
    {
      id: 'tables',
      label: '🏓 Tables',
      description: 'Manage tables',
      color: 'green'
    },
    {
      id: 'admin',
      label: '📊 Dashboard',
      description: 'Analytics',
      color: 'orange'
    },
    {
      id: 'inventory',
      label: '📦 Stock',
      description: 'Inventory',
      color: 'green'
    },
    {
      id: 'reports',
      label: '📈 Reports',
      description: 'Analytics',
      color: 'red'
    },
    {
      id: 'settings',
      label: '⚙️ Settings',
      description: 'Configure',
      color: 'gray'
    },
    {
      id: 'backup',
      label: '💾 Backup',
      description: 'Data backup',
      color: 'green'
    }
  ];

 

  const getButtonClasses = (item) => {
    const isActive = currentView === item.id;
    const baseClasses = 'px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm border flex flex-col items-center gap-1 min-w-0';
    
    const colorClasses = {
      orange: isActive ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      green: isActive ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      red: isActive ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      gray: isActive ? 'bg-gray-600 text-white border-gray-600 shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    };

    return `${baseClasses} ${colorClasses[item.color]}`;
  };

  return (
    <nav className="bg-white border-b-2 border-lime-400 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {/* Compact Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg shadow flex items-center justify-center">
                <span className="text-sm font-bold text-orange-500">श्री</span>
              </div>
              <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded shadow flex items-center justify-center">
                <span className="text-xs font-bold text-white">जी</span>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">
                <span className="bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">Shreeji</span>
                <span className="text-red-600 ml-1">Restaurant</span>
              </h1>
            </div>
            
            {/* Mobile title */}
            <div className="block sm:hidden">
              <h1 className="text-base font-bold">
                <span className="text-green-600">श्रीजी</span>
              </h1>
            </div>
          </div>
          
          {/* Compact Status Info */}
          <div className="flex items-center gap-2 text-xs">
            {selectedTable ? (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                Table {selectedTable}
              </div>
            ) : currentView === 'pickup' ? (
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                Pickup Mode
              </div>
            ) : null}
            <div className="hidden md:block text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Compact Navigation Buttons - Horizontal Scroll */}
        <div className="pb-3 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={getButtonClasses(item)}
                title={item.description}
              >
                <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                <span className="text-xs opacity-75 whitespace-nowrap hidden sm:block">{item.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Compact Status Bar */}
        <div className="pb-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs pt-2">
            <div className="flex items-center gap-3">
              <span className="text-green-600 font-medium">
                {currentView === 'pickup' ? 'Pickup Orders' : currentView === 'staff' ? 'Dine In' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
              </span>
              {selectedTable && (
                <span className="text-gray-500">Table #{selectedTable}</span>
              )}
              {currentView === 'pickup' && (
                <span className="text-red-600 font-medium">Takeaway Mode</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-lime-500 rounded-full"></div>
              <span className="text-gray-500 ml-2">Jay Swaminarayan</span>
              <span className="text-gray-500 hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;