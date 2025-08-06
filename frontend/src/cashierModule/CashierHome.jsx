import Sidebar, { SidebarItem } from './Sidebar';
import React,{ useState } from 'react';
import {
  FileText,
  Users
} from "lucide-react";

import CustomerList from './CustomerList';
import CashierBilling from './CashierBilling';


function CashierHome() {
  const [activePage, setActivePage] = useState("billing");

  const renderContent = () => {
    switch (activePage) {
      
      case "billing": return <CashierBilling />;
            case "customers": return <CustomerList />;

      default: return <CashierBilling/>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarItem
          icon={<FileText size={20} />}
          text="Billing"
          active={activePage === "billing"}
          onClick={() => setActivePage("billing")}
        />
       
        <SidebarItem
          icon={<Users size={20} />}
          text="Customers"
          active={activePage === "customers"}
          onClick={() => setActivePage("customers")}
        />

        
        
        
      </Sidebar>

      <div className="flex-grow overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default CashierHome;
