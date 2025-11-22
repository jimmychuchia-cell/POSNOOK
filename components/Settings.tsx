import React, { useState } from 'react';
import { IntegrationConfig, Product } from '../types';
import { syncWithShopee } from '../services/integrationService';
import { Settings as SettingsIcon, Save, RefreshCw, AlertCircle } from 'lucide-react';

interface SettingsProps {
  config: IntegrationConfig;
  setConfig: React.Dispatch<React.SetStateAction<IntegrationConfig>>;
  products: Product[];
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, products }) => {
  const [syncing, setSyncing] = useState(false);

  const handleChange = (key: keyof IntegrationConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSync = async () => {
    if(!config.shopeeApiKey) return alert("請先設定 Shopee API Key");
    setSyncing(true);
    await syncWithShopee(config, products);
    setSyncing(false);
    alert("同步完成！(模擬)");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
         <div className="bg-nook-brown/10 p-3 rounded-full text-nook-brown">
             <SettingsIcon size={32} />
         </div>
         <div>
             <h2 className="text-2xl font-bold text-nook-brown">系統設定</h2>
             <p className="text-nook-text/60">設定外部系統串接資訊</p>
         </div>
      </div>

      <div className="grid gap-6">
        {/* Shopee Integration */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-nook-orange">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-nook-brown flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee-logo.svg" alt="Shopee" className="h-6" /> 
                    蝦皮賣場串接
                </h3>
                <button 
                    onClick={handleSync}
                    disabled={syncing}
                    className="text-sm bg-nook-cream text-nook-orange font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-nook-orange hover:text-white transition-colors"
                >
                    <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                    {syncing ? '同步中...' : '同步商品庫存'}
                </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-nook-brown mb-1">Partner ID / API Key</label>
                    <input 
                        type="password"
                        className="w-full bg-nook-cream rounded-xl px-4 py-3 border-2 border-transparent focus:border-nook-orange outline-none"
                        value={config.shopeeApiKey}
                        onChange={e => handleChange('shopeeApiKey', e.target.value)}
                        placeholder="輸入 Shopee API Key"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-bold text-nook-brown mb-1">Shop ID</label>
                    <input 
                        type="text"
                        className="w-full bg-nook-cream rounded-xl px-4 py-3 border-2 border-transparent focus:border-nook-orange outline-none"
                        value={config.shopeeShopId}
                        onChange={e => handleChange('shopeeShopId', e.target.value)}
                        placeholder="輸入賣場 ID"
                    />
                </div>
            </div>
        </div>

        {/* E-Invoice Integration */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-nook-blue">
            <h3 className="text-xl font-bold text-nook-brown mb-6 flex items-center gap-2">
                <div className="bg-nook-blue text-white p-1 rounded">發</div>
                光貿電子發票 API
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-nook-brown mb-1">API ID</label>
                    <input 
                        type="text"
                        className="w-full bg-nook-cream rounded-xl px-4 py-3 border-2 border-transparent focus:border-nook-blue outline-none"
                        value={config.invoiceApiKey}
                        onChange={e => handleChange('invoiceApiKey', e.target.value)}
                        placeholder="輸入發票平台 API ID"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-bold text-nook-brown mb-1">API Secret Key</label>
                    <input 
                        type="password"
                        className="w-full bg-nook-cream rounded-xl px-4 py-3 border-2 border-transparent focus:border-nook-blue outline-none"
                        value={config.invoiceApiSecret}
                        onChange={e => handleChange('invoiceApiSecret', e.target.value)}
                        placeholder="輸入密鑰"
                    />
                </div>
            </div>
        </div>

        {/* Gemini API Key Section */}
         <div className="bg-nook-cream p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-nook-brown flex-shrink-0 mt-1" />
            <div className="text-sm text-nook-text">
                <p className="font-bold">關於 AI 功能</p>
                <p>商品描述生成功能使用 Gemini API。請確保環境變數 <code>API_KEY</code> 已正確設定。</p>
            </div>
        </div>
      </div>
      
      <div className="flex justify-end">
          <button className="bg-nook-green text-white font-bold px-8 py-3 rounded-2xl shadow-[0_4px_0_#4FA38B] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2">
            <Save size={20} /> 儲存設定
          </button>
      </div>
    </div>
  );
};

export default Settings;