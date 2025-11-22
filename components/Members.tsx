
import React, { useState } from 'react';
import { Member, MemberTier } from '../types';
import { TIER_THRESHOLDS } from '../constants';
import { Users, Search, Plus, UserPlus, Crown, History, ChevronRight, ShoppingBag } from 'lucide-react';

interface MembersProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const Members: React.FC<MembersProps> = ({ members, setMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const selectedMember = members.find(m => m.id === selectedMemberId);

  const getTier = (points: number): { name: MemberTier, color: string, icon: any, bg: string } => {
      if (points >= TIER_THRESHOLDS.DIAMOND) return { name: '鑽石', color: 'text-cyan-600', bg: 'bg-cyan-100', icon: '💎' };
      if (points >= TIER_THRESHOLDS.GOLD) return { name: '金牌', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🥇' };
      if (points >= TIER_THRESHOLDS.SILVER) return { name: '銀牌', color: 'text-gray-600', bg: 'bg-gray-200', icon: '🥈' };
      return { name: '普通', color: 'text-nook-brown', bg: 'bg-nook-cream', icon: '🍃' };
  };

  const addMember = () => {
    if (!newMemberName || !newMemberPhone) return;
    const newMember: Member = {
      id: `m${Date.now()}`,
      name: newMemberName,
      phone: newMemberPhone,
      points: 0,
      joinDate: new Date().toISOString().split('T')[0],
      history: []
    };
    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberPhone('');
  };

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* Member List (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] shadow-sm p-8 flex flex-col border-8 border-nook-cream">
            <h2 className="text-3xl font-extrabold text-nook-brown mb-6 flex items-center gap-3">
                <div className="bg-nook-brown text-white p-2 rounded-xl"><Users size={32} /></div>
                會員列表
            </h2>
            
            <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-nook-brown/50" size={28} />
                <input 
                  type="text" 
                  placeholder="搜尋會員姓名或電話..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-nook-cream border-4 border-transparent focus:border-nook-green rounded-3xl pl-14 pr-6 py-4 text-xl text-nook-text outline-none transition-all"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {filteredMembers.map(member => {
                    const tier = getTier(member.points);
                    const isSelected = selectedMemberId === member.id;
                    return (
                    <div 
                        key={member.id} 
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`p-5 rounded-[2rem] flex justify-between items-center group cursor-pointer transition-all border-4 ${isSelected ? 'bg-nook-green/10 border-nook-green scale-[1.02]' : 'bg-nook-cream border-transparent hover:bg-nook-yellow/10 hover:scale-[1.01]'}`}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white ${tier.bg}`}>
                                {tier.icon}
                            </div>
                            <div>
                                <div className="font-extrabold text-nook-text text-2xl flex items-center gap-3">
                                    {member.name}
                                    <span className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider ${tier.bg} ${tier.color}`}>{tier.name}</span>
                                </div>
                                <div className="text-nook-brown/60 text-lg font-medium mt-1">{member.phone}</div>
                            </div>
                        </div>
                        <div className="text-right flex items-center gap-6">
                            <div>
                                <div className="text-sm text-nook-brown/60 mb-1 font-bold">累積點數</div>
                                <div className="font-black text-3xl text-nook-green drop-shadow-sm">
                                    {member.points}
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-nook-green text-white' : 'bg-white text-nook-brown/20'}`}>
                                <ChevronRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>

        {/* Right Column: Add Form OR Member Details */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-hidden">
            
            {selectedMember ? (
                <div className="bg-white rounded-[3rem] p-8 shadow-lg border-8 border-white ring-4 ring-nook-cream/50 h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-nook-green/20 to-transparent pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-8 border-b-2 border-dashed border-gray-200 pb-6 relative z-10">
                        <div>
                            <h3 className="text-4xl font-black text-nook-brown mb-2">{selectedMember.name}</h3>
                            <p className="text-nook-text/60 font-bold text-lg">入會日期: {selectedMember.joinDate}</p>
                        </div>
                        <button onClick={() => setSelectedMemberId(null)} className="bg-nook-blue/10 text-nook-blue font-bold px-4 py-2 rounded-xl hover:bg-nook-blue hover:text-white transition-colors">
                            關閉
                        </button>
                    </div>

                    {/* Purchase History */}
                    <div className="flex-1 overflow-y-auto relative z-10">
                        <h4 className="font-extrabold text-xl text-nook-brown mb-4 flex items-center gap-2"><History size={24}/> 購買歷史</h4>
                        {selectedMember.history.length === 0 ? (
                            <div className="text-center text-gray-400 py-12 bg-nook-cream rounded-[2rem]">
                                <ShoppingBag size={48} className="mx-auto mb-2 opacity-30"/>
                                <p className="text-lg font-bold">尚無購買紀錄</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedMember.history.map((tx, idx) => (
                                    <div key={tx.id} className="bg-nook-cream p-5 rounded-[2rem] border-2 border-transparent hover:border-nook-green/30 transition-colors">
                                        <div className="flex justify-between text-sm text-gray-500 font-bold mb-3">
                                            <span className="bg-white px-2 py-1 rounded-lg">{tx.date}</span>
                                            <span className="font-mono">#{tx.id}</span>
                                        </div>
                                        <div className="space-y-2 mb-3 pl-2 border-l-4 border-nook-brown/10">
                                            {tx.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-base font-bold text-nook-text">
                                                    <span>{item.name} <span className="text-nook-brown/50 text-sm">x{item.quantity}</span></span>
                                                    <span>${(item.discountPrice || item.price) * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t-2 border-white pt-3 flex justify-between font-black text-xl text-nook-orange">
                                            <span className="text-nook-brown text-base">總計</span>
                                            <span>${tx.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-nook-blue/10 rounded-[3rem] p-8 border-8 border-white shadow-sm h-fit text-center">
                    <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-nook-blue shadow-md mb-6 mx-auto animate-float">
                        <UserPlus size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-nook-brown mb-3">新增會員</h2>
                    <p className="text-lg text-nook-text/70 mb-8 font-bold">加入會員累積點數換好禮！</p>

                    <div className="space-y-5 text-left">
                        <div>
                            <label className="block text-lg font-bold text-nook-brown mb-2 ml-3">姓名</label>
                            <input 
                                className="w-full bg-white rounded-2xl px-6 py-4 text-xl outline-none focus:ring-4 focus:ring-nook-blue/30 font-bold placeholder:text-nook-text/20"
                                value={newMemberName}
                                onChange={e => setNewMemberName(e.target.value)}
                                placeholder="輸入姓名"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-nook-brown mb-2 ml-3">電話</label>
                            <input 
                                className="w-full bg-white rounded-2xl px-6 py-4 text-xl outline-none focus:ring-4 focus:ring-nook-blue/30 font-mono font-bold placeholder:text-nook-text/20"
                                value={newMemberPhone}
                                onChange={e => setNewMemberPhone(e.target.value)}
                                placeholder="輸入電話號碼"
                            />
                        </div>
                        <button 
                            onClick={addMember}
                            className="w-full bg-nook-blue text-white font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_rgb(86,177,196)] active:translate-y-[6px] active:shadow-none transition-all mt-4 hover:brightness-105"
                        >
                            加入會員
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Members;
