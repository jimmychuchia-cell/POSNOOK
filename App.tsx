
import React, { useState } from 'react';
import { User, AppView, Product, Member, IntegrationConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_MEMBERS } from './constants';
import Layout from './components/Layout';
import Login from './components/Login';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Members from './components/Members';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // App State Data
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfig>({
    shopeeApiKey: '',
    shopeeShopId: '',
    invoiceApiKey: '',
    invoiceApiSecret: ''
  });

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(AppView.POS);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.POS:
        return <POS products={products} members={members} setMembers={setMembers} integrationConfig={integrationConfig} />;
      case AppView.INVENTORY:
        return <Inventory products={products} setProducts={setProducts} />;
      case AppView.MEMBERS:
        return <Members members={members} setMembers={setMembers} />;
      case AppView.SETTINGS:
        return <Settings config={integrationConfig} setConfig={setIntegrationConfig} products={products} />;
      default:
        return <POS products={products} members={members} setMembers={setMembers} integrationConfig={integrationConfig} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
