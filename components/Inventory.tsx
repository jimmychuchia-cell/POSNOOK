
import React, { useState } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { generateItemDescription } from '../services/geminiService';
import { Plus, Edit3, Trash, Download, Upload, Image as ImageIcon, Sparkles, X, DollarSign, Tag, Box } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [loadingAi, setLoadingAi] = useState(false);

  // File Upload Handler for Product Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // CSV Export
  const handleExport = () => {
    const headers = "id,name,price,costPrice,discountPrice,stock,category,description\n";
    const rows = products.map(p => `${p.id},${p.name},${p.price},${p.costPrice || 0},${p.discountPrice || ''},${p.stock},${p.category},"${p.description || ''}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_nook.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import (Simple parser)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const lines = text.split('\n').slice(1); // skip header
        const newProducts: Product[] = [];
        lines.forEach((line, index) => {
          if(!line.trim()) return;
          const [id, name, price, costPrice, discountPrice, stock, category, desc] = line.split(','); 
          newProducts.push({
            id: id || `imp-${Date.now()}-${index}`,
            name: name,
            price: Number(price) || 0,
            costPrice: Number(costPrice) || 0,
            discountPrice: discountPrice ? Number(discountPrice) : undefined,
            stock: Number(stock) || 0,
            category: category || '其他',
            description: desc ? desc.replace(/"/g, '') : '',
            imageUrl: 'https://picsum.photos/200/200' // Default
          });
        });
        setProducts(prev => [...prev, ...newProducts]);
        alert(`匯入成功！共 ${newProducts.length} 筆資料`);
      };
      reader.readAsText(file);
    }
  };

  const saveProduct = () => {
    if (!currentProduct.name || !currentProduct.price) {
        alert("請填寫名稱與價格");
        return;
    }

    if (currentProduct.id) {
      setProducts(prev => prev.map(p => p.id === currentProduct.id ? { ...p, ...currentProduct } as Product : p));
    } else {
      setProducts(prev => [...prev, { ...currentProduct, id: Date.now().toString(), stock: currentProduct.stock || 0, category: currentProduct.category || '未分類' } as Product]);
    }
    setIsEditing(false);
    setCurrentProduct({});
  };

  const deleteProduct = (id: string) => {
    if (confirm('確定要刪除這個商品嗎？')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAiDescription = async () => {
    if (!currentProduct.name) return alert("請先輸入商品名稱");
    setLoadingAi(true);
    const desc = await generateItemDescription(currentProduct.name, currentProduct.category || 'Items');
    setCurrentProduct(prev => ({ ...prev, description: desc }));
    setLoadingAi(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border-4 border-nook-cream">
        <div className="flex items-center gap-3">
            <div className="bg-nook-yellow p-3 rounded-full text-white shadow-sm">
                <Box size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-nook-brown">庫存與產品管理</h2>
        </div>
        <div className="flex gap-3">
            <label className="flex items-center gap-2 bg-nook-cream text-nook-brown px-5 py-3 rounded-2xl cursor-pointer hover:bg-nook-green/20 transition-colors font-bold">
                <Upload size={20} />
                <span className="hidden md:inline">匯入 CSV</span>
                <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={handleExport} className="flex items-center gap-2 bg-nook-cream text-nook-brown px-5 py-3 rounded-2xl hover:bg-nook-green/20 transition-colors font-bold">
                <Download size={20} />
                <span className="hidden md:inline">匯出 CSV</span>
            </button>
            <button 
                onClick={() => { setCurrentProduct({}); setIsEditing(true); }}
                className="flex items-center gap-2 bg-nook-green text-white px-6 py-3 rounded-2xl font-black text-lg shadow-[0_4px_0_#4FA38B] active:translate-y-[4px] active:shadow-none hover:brightness-105 transition-all"
            >
                <Plus size={24} strokeWidth={3} />
                <span>新增商品</span>
            </button>
        </div>
      </div>

      {/* Product List Table-ish Grid */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col border-8 border-white ring-4 ring-nook-cream/50">
        <div className="grid grid-cols-12 gap-4 p-5 bg-nook-yellow/10 text-nook-brown font-black text-base border-b-4 border-nook-yellow/20">
            <div className="col-span-1">圖片</div>
            <div className="col-span-3">名稱</div>
            <div className="col-span-2">分類</div>
            <div className="col-span-3 text-right">價格 (售價/優惠/成本)</div>
            <div className="col-span-1 text-right">庫存</div>
            <div className="col-span-2 text-center">操作</div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
            {products.map(p => (
                <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-nook-cream rounded-2xl transition-transform hover:scale-[1.01] mb-2 border-2 border-transparent hover:border-nook-green/30">
                    <div className="col-span-1">
                        <img src={p.imageUrl || 'https://picsum.photos/50'} className="w-14 h-14 rounded-xl object-cover bg-white shadow-sm border-2 border-nook-brown/10" alt="" />
                    </div>
                    <div className="col-span-3 font-bold text-nook-text text-lg truncate">{p.name}</div>
                    <div className="col-span-2">
                        <span className="bg-nook-blue/20 text-nook-blue px-3 py-1.5 rounded-xl text-sm font-bold inline-block">{p.category}</span>
                    </div>
                    <div className="col-span-3 text-right font-mono text-base flex flex-col items-end justify-center">
                        <div className={p.discountPrice ? "text-gray-400 line-through text-sm decoration-2" : "text-nook-orange font-black text-lg"}>
                          ${p.price}
                        </div>
                        {p.discountPrice && (
                           <div className="text-red-500 font-black text-lg">${p.discountPrice}</div>
                        )}
                        <div className="text-gray-400 text-xs mt-1">成本: ${p.costPrice || '-'}</div>
                    </div>
                    <div className="col-span-1 text-right text-lg font-bold text-nook-brown/70">{p.stock}</div>
                    <div className="col-span-2 flex justify-center gap-3">
                        <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} className="p-3 bg-nook-cream text-nook-brown hover:bg-nook-green hover:text-white rounded-xl transition-colors shadow-sm"><Edit3 size={20} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-3 bg-nook-cream text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors shadow-sm"><Trash size={20} /></button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-nook-brown/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-leaf-pattern w-full max-w-4xl rounded-[3rem] p-8 shadow-2xl relative border-8 border-white max-h-[90vh] overflow-y-auto animate-bounce-sm">
                <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 p-3 bg-white rounded-full hover:bg-red-100 text-nook-brown hover:text-red-500 transition-colors shadow-md">
                    <X size={28} strokeWidth={3} />
                </button>
                
                <h3 className="text-3xl font-extrabold text-nook-brown mb-8 flex items-center gap-3 bg-white inline-block px-6 py-3 rounded-2xl shadow-sm">
                    {currentProduct.id ? <Edit3 size={28} /> : <Plus size={28} />}
                    {currentProduct.id ? '編輯商品' : '新增商品'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Image */}
                    <div className="flex flex-col gap-4 md:col-span-1">
                        <div className="aspect-square rounded-[2rem] bg-white border-4 border-dashed border-nook-brown/30 flex items-center justify-center relative overflow-hidden group shadow-inner hover:border-nook-green transition-colors">
                            {currentProduct.imageUrl ? (
                                <img src={currentProduct.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-center text-nook-brown/40 p-4">
                                    <ImageIcon className="mx-auto mb-3" size={64} />
                                    <p className="text-lg font-bold">點擊上傳圖片</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="absolute inset-0 bg-nook-green/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xl pointer-events-none">更換圖片</div>
                        </div>
                        <p className="text-sm text-center text-nook-text/60 font-bold">支援 JPG, PNG 格式</p>
                    </div>

                    {/* Right Column: Fields */}
                    <div className="space-y-6 md:col-span-2 bg-white/80 p-6 rounded-[2rem] backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-6">
                             <div className="col-span-2">
                                <label className="block text-base font-bold text-nook-brown mb-2">商品名稱</label>
                                <input 
                                    className="w-full bg-white border-2 border-nook-brown/10 rounded-2xl px-5 py-3 text-lg font-bold outline-none focus:border-nook-green focus:ring-4 focus:ring-nook-green/20 transition-all"
                                    value={currentProduct.name || ''}
                                    onChange={e => setCurrentProduct(prev => ({...prev, name: e.target.value}))}
                                    placeholder="例如: 狸克咖啡"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-nook-brown mb-2">分類</label>
                                <select 
                                    className="w-full bg-white border-2 border-nook-brown/10 rounded-2xl px-5 py-3 text-lg outline-none focus:border-nook-green focus:ring-4 focus:ring-nook-green/20 transition-all appearance-none"
                                    value={currentProduct.category || '全部'}
                                    onChange={e => setCurrentProduct(prev => ({...prev, category: e.target.value}))}
                                >
                                    {CATEGORIES.filter(c => c !== '全部').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-base font-bold text-nook-brown mb-2">庫存數量</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white border-2 border-nook-brown/10 rounded-2xl px-5 py-3 text-lg font-mono outline-none focus:border-nook-green focus:ring-4 focus:ring-nook-green/20 transition-all"
                                    value={currentProduct.stock || ''}
                                    onChange={e => setCurrentProduct(prev => ({...prev, stock: Number(e.target.value)}))}
                                />
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-nook-yellow/20 p-5 rounded-[2rem] space-y-4 border-2 border-nook-yellow/30">
                            <h4 className="text-lg font-bold text-nook-brown flex items-center gap-2"><DollarSign size={20} strokeWidth={3}/> 價格設定</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-nook-brown/70 mb-1">原價 (售價)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-nook-green font-mono text-nook-text text-lg font-bold"
                                        value={currentProduct.price || ''}
                                        onChange={e => setCurrentProduct(prev => ({...prev, price: Number(e.target.value)}))}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-red-500/80 mb-1">優惠價格</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-red-200 font-mono text-red-500 text-lg font-bold"
                                        value={currentProduct.discountPrice || ''}
                                        onChange={e => setCurrentProduct(prev => ({...prev, discountPrice: e.target.value ? Number(e.target.value) : undefined}))}
                                        placeholder="無"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-1">成本價格</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-gray-200 font-mono text-gray-500 text-lg"
                                        value={currentProduct.costPrice || ''}
                                        onChange={e => setCurrentProduct(prev => ({...prev, costPrice: e.target.value ? Number(e.target.value) : undefined}))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <label className="block text-base font-bold text-nook-brown">商品描述</label>
                                <button 
                                    onClick={handleAiDescription} 
                                    disabled={loadingAi}
                                    className="text-sm bg-nook-blue text-white px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-nook-blue/80 transition-all hover:scale-105 font-bold shadow-sm"
                                >
                                    <Sparkles size={16} />
                                    {loadingAi ? '思考中...' : 'AI 魔法描述'}
                                </button>
                             </div>
                            <textarea 
                                className="w-full bg-white border-2 border-nook-brown/10 rounded-2xl px-5 py-3 outline-none focus:border-nook-green focus:ring-4 focus:ring-nook-green/20 transition-all h-28 resize-none text-lg"
                                value={currentProduct.description || ''}
                                onChange={e => setCurrentProduct(prev => ({...prev, description: e.target.value}))}
                                placeholder="輸入商品描述..."
                            />
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                onClick={saveProduct}
                                className="w-full bg-nook-green text-white font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_#4FA38B] active:translate-y-[6px] active:shadow-none transition-all hover:brightness-105"
                            >
                                儲存商品
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
