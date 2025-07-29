import Sidebar, { SidebarItem } from './Sidebar';
import React,{ useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Users,
  PackageSearch,
} from "lucide-react";

import Dashboard from './Dashboard';
import CustomerList from './CustomerList';
import CashierBilling from './CashierBilling';


function CashierHome() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderContent = () => {
    switch (activePage) {
      
      case "dashboard": return <Dashboard />;
            case "customers": return <CustomerList />;
            case "billing": return <CashierBilling />;

      default: return <Dashboard/>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Dashboard"
          active={activePage === "dashboard"}
          onClick={() => setActivePage("dashboard")}
        />
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Customers"
          active={activePage === "customers"}
          onClick={() => setActivePage("customers")}
        />

        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Billing"
          active={activePage === "billing"}
          onClick={() => setActivePage("billing")}
        />
        
        
      </Sidebar>

      <div className="flex-grow overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default CashierHome;
