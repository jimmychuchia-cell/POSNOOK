
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Member, IntegrationConfig, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Search, Plus, Minus, Trash2, ShoppingBag, CreditCard, Printer, Tag, X } from 'lucide-react';
import { issueInvoice } from '../services/integrationService';

interface POSProps {
  products: Product[];
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  integrationConfig: IntegrationConfig;
}

const POS: React.FC<POSProps> = ({ products, members, setMembers, integrationConfig }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === '全部' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  // Calculate Totals with Discount logic
  const { subtotal, discountTotal, finalTotal } = useMemo(() => {
    let sub = 0;
    let final = 0;

    cart.forEach(item => {
      const price = item.discountPrice || item.price;
      sub += item.price * item.quantity;
      final += price * item.quantity;
    });

    return { subtotal: sub, discountTotal: sub - final, finalTotal: final };
  }, [cart]);

  const handleCheckout = async () => {
    setProcessing(true);
    // Simulate API calls
    let invoiceNo = '';
    if (integrationConfig.invoiceApiKey) {
        invoiceNo = await issueInvoice(integrationConfig, finalTotal);
    } else {
        // Local mock invoice number
        invoiceNo = `NK-${Date.now().toString().slice(-6)}`;
    }

    const newTransaction: Transaction = {
        id: invoiceNo,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: finalTotal,
        originalTotal: subtotal,
        discountAmount: discountTotal
    };
    
    // Simulate processing time
    setTimeout(() => {
      setProcessing(false);
      
      // Update Member History & Points
      if (selectedMember) {
          const pointsEarned = Math.floor(finalTotal / 100);
          setMembers(prev => prev.map(m => {
              if (m.id === selectedMember.id) {
                  return {
                      ...m,
                      points: m.points + pointsEarned,
                      history: [newTransaction, ...m.history]
                  };
              }
              return m;
          }));
      }

      setLastTransaction(newTransaction);
      setCart([]);
      setSelectedMember(null);
      setShowCheckout(false);
      setShowReceipt(true); // Show receipt modal for printing
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6">
      {/* Product Grid Area (Left) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Search & Filter */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm flex flex-wrap gap-4 items-center border-4 border-nook-cream">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nook-brown/50" size={24} />
            <input 
              type="text" 
              placeholder="搜尋商品..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-nook-cream border-2 border-transparent focus:border-nook-green rounded-2xl pl-12 pr-4 py-3 text-lg text-nook-text outline-none transition-all placeholder:text-nook-brown/30"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar max-w-full items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl whitespace-nowrap text-base font-bold transition-all transform active:scale-95 ${
                  selectedCategory === cat 
                  ? 'bg-nook-brown text-white shadow-md -translate-y-1 rotate-1' 
                  : 'bg-nook-cream text-nook-brown hover:bg-nook-green/30 hover:-translate-y-1'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-3 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-[2rem] p-4 shadow-[0_4px_0_rgba(0,0,0,0.05)] hover:shadow-[0_8px_0_rgba(0,0,0,0.05)] transition-all cursor-pointer border-4 border-transparent hover:border-nook-green hover:-translate-y-2 active:scale-95 flex flex-col items-center text-center group relative overflow-hidden"
              >
                {/* Discount Badge */}
                {product.discountPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full z-10 shadow-sm animate-pulse">
                        特價
                    </div>
                )}

                <div className="w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-nook-cream relative">
                    {product.imageUrl ? (
                         <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-nook-green">
                            <ShoppingBag opacity={0.5} size={48} />
                        </div>
                    )}
                    {/* Add Button Overlay */}
                    <div className="absolute inset-0 bg-nook-green/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="bg-white rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <Plus className="text-nook-green" strokeWidth={4} size={28} />
                        </div>
                    </div>
                </div>
                <h3 className="font-extrabold text-nook-brown text-lg line-clamp-1 mb-1">{product.name}</h3>
                
                <div className="flex items-center gap-2 bg-nook-cream px-3 py-1 rounded-xl">
                    {product.discountPrice ? (
                        <>
                            <span className="text-gray-400 text-sm line-through decoration-2">${product.price}</span>
                            <span className="text-red-500 font-black text-xl">${product.discountPrice}</span>
                        </>
                    ) : (
                        <span className="text-nook-orange font-black text-xl">${product.price}</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar (Right) */}
      <div className="w-[420px] bg-white rounded-[2.5rem] shadow-xl flex flex-col overflow-hidden border-8 border-white ring-4 ring-nook-cream/50">
        <div className="bg-nook-yellow p-6 text-white font-black text-2xl flex justify-between items-center shadow-sm z-10 relative overflow-hidden">
           {/* Decorative Circles */}
           <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full"></div>
           <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/20 rounded-full"></div>
           
          <span className="flex items-center gap-3 relative z-10"><ShoppingBag size={28} fill="currentColor" /> 購物清單</span>
          <span className="bg-white/30 px-4 py-1.5 rounded-full text-base shadow-inner backdrop-blur-sm relative z-10">{cart.length} 項</span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-nook-brown/30 gap-4">
              <ShoppingBag size={80} strokeWidth={1.5} />
              <p className="text-xl font-bold">購物車空空的...</p>
            </div>
          ) : (
            cart.map(item => {
                const finalPrice = item.discountPrice || item.price;
                return (
                <div key={item.id} className="flex items-center gap-4 bg-nook-cream p-4 rounded-3xl relative group transition-transform hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border-2 border-white">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-nook-text text-lg truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-nook-orange font-black text-lg">${finalPrice * item.quantity}</p>
                            {item.discountPrice && (
                                <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-lg font-bold">省 { (item.price - item.discountPrice) * item.quantity }</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-nook-brown/5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-nook-cream hover:bg-red-100 text-nook-brown hover:text-red-500 transition-colors active:scale-90">
                            <Minus size={18} strokeWidth={3} />
                        </button>
                        <span className="text-lg font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-nook-cream hover:bg-nook-green/30 text-nook-brown transition-colors active:scale-90">
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-white text-red-400 hover:text-red-600 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>
            )})
          )}
        </div>

        {/* Member & Totals */}
        <div className="bg-nook-cream p-6 border-t-4 border-dashed border-nook-brown/10 rounded-t-[2rem] shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <select 
            className="w-full mb-4 p-4 rounded-2xl border-4 border-white bg-white text-nook-text text-lg font-bold outline-none focus:border-nook-green shadow-sm appearance-none"
            onChange={(e) => setSelectedMember(members.find(m => m.id === e.target.value) || null)}
            value={selectedMember?.id || ''}
          >
            <option value="">選擇會員 (非必填)</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
            ))}
          </select>

          <div className="space-y-2 mb-6 text-base">
             {discountTotal > 0 && (
                <div className="flex justify-between text-nook-brown/60 font-bold px-2">
                    <span>原價總計</span>
                    <span className="line-through decoration-2 decoration-nook-brown/40">${subtotal}</span>
                </div>
             )}
             {discountTotal > 0 && (
                <div className="flex justify-between text-red-500 font-black px-2">
                    <span>折扣優惠</span>
                    <span>-${discountTotal}</span>
                </div>
             )}
            <div className="flex justify-between items-end pt-4 border-t-2 border-nook-brown/10 px-2">
                <span className="text-nook-brown font-black text-xl">總金額</span>
                <span className="text-4xl font-black text-nook-orange drop-shadow-sm">${finalTotal}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-nook-green text-white font-black text-xl py-5 rounded-3xl shadow-[0_6px_0_#4FA38B] active:shadow-none active:translate-y-[6px] disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_6px_0_#4FA38B] transition-all flex justify-center items-center gap-3 group"
          >
            <CreditCard size={28} className="group-hover:animate-bounce" /> 結帳
          </button>
        </div>
      </div>

        {/* Checkout Modal Overlay */}
        {showCheckout && (
            <div className="fixed inset-0 bg-nook-brown/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-leaf-pattern w-full max-w-md rounded-[3rem] p-8 shadow-2xl border-8 border-white relative transform transition-all animate-bounce-sm">
                    <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-nook-brown/50 hover:text-nook-brown p-2 bg-white rounded-full">
                         <X size={24} strokeWidth={3} />
                    </button>
                    
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-nook-orange rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                             <Tag size={40} />
                        </div>
                    </div>
                    
                    <h3 className="text-3xl font-extrabold text-center text-nook-brown mb-8">確認付款</h3>
                    
                    <div className="bg-white p-6 rounded-3xl shadow-inner mb-8 space-y-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-nook-text font-bold">商品數量</span>
                            <span className="font-black bg-nook-cream px-3 py-1 rounded-lg">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-nook-text font-bold">會員</span>
                            <span className="font-black text-nook-blue">{selectedMember ? selectedMember.name : '未指定'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl pt-4 border-t-2 border-dashed border-gray-200">
                            <span className="font-bold text-nook-brown">應付金額</span>
                            <span className="font-black text-nook-orange text-4xl">${finalTotal}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleCheckout} 
                            disabled={processing}
                            className="w-full bg-nook-green text-white font-bold text-xl py-4 rounded-2xl shadow-[0_5px_0_#4FA38B] active:shadow-none active:translate-y-[5px] flex justify-center items-center gap-2 hover:brightness-105"
                        >
                            {processing ? '處理中...' : '💰 現金結帳'}
                        </button>
                         <button 
                            onClick={handleCheckout} 
                            disabled={processing}
                            className="w-full bg-nook-blue text-white font-bold text-xl py-4 rounded-2xl shadow-[0_5px_0_rgb(86,177,196)] active:shadow-none active:translate-y-[5px] flex justify-center items-center gap-2 hover:brightness-105"
                        >
                            {processing ? '處理中...' : '📱 電子支付'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Receipt / Print Modal */}
        {showReceipt && lastTransaction && (
             <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                 <div className="bg-nook-cream w-full max-w-sm rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-8 border-white">
                    <div className="p-5 bg-nook-green text-white font-bold text-xl flex justify-between items-center shadow-md z-10">
                        <span className="flex items-center gap-2"><Printer /> 列印收據</span>
                        <button onClick={() => setShowReceipt(false)} className="bg-white/20 p-1 rounded-full hover:bg-white/40"><X size={20}/></button>
                    </div>
                    
                    {/* Actual Print Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white text-black font-mono text-sm leading-relaxed" id="print-area">
                        <div className="text-center mb-6">
                            <div className="text-2xl font-black mb-2">Nook Inc.</div>
                            <div className="mb-2">無人島開發計畫商店</div>
                            <div className="text-xs">================================</div>
                        </div>
                        
                        <div className="mb-4 text-xs">
                            <p>單號: {lastTransaction.id}</p>
                            <p>時間: {lastTransaction.date}</p>
                        </div>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold border-b border-black pb-1 mb-1">
                                <span>品項</span>
                                <span>金額</span>
                            </div>
                            {lastTransaction.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between mb-1">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${(item.discountPrice || item.price) * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-xs">================================</div>

                        <div className="text-right space-y-1 mt-2 font-bold">
                             {lastTransaction.discountAmount > 0 && (
                                <div>原價: ${lastTransaction.originalTotal}</div>
                             )}
                             {lastTransaction.discountAmount > 0 && (
                                <div>折扣: -${lastTransaction.discountAmount}</div>
                             )}
                             <div className="text-xl pt-2">總計: ${lastTransaction.total}</div>
                        </div>

                        <div className="mt-8 text-center text-xs">
                            <p>謝謝光臨！</p>
                            <p>Please come again!</p>
                            <br/>
                            <p>*** 電子發票證明聯 ***</p>
                        </div>
                    </div>

                    <div className="p-5 bg-nook-cream flex gap-4">
                        <button onClick={handlePrint} className="flex-1 bg-nook-brown text-white font-bold text-lg py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 hover:bg-nook-brown/90">
                            <Printer size={24} /> 列印
                        </button>
                        <button onClick={() => setShowReceipt(false)} className="flex-1 bg-white text-nook-brown border-2 border-nook-brown/20 font-bold text-lg py-4 rounded-2xl hover:bg-nook-brown/10">
                            關閉
                        </button>
                    </div>
                 </div>
             </div>
        )}
    </div>
  );
};

export default POS;
