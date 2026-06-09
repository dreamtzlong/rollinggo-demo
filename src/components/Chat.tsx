import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockSearchCards, mockHotelDetails, mockRoomRates, mockPreviewDetail, mockBookingSuccess, mockOrders } from '../lib/mockData';
import { HorizontalScroller } from './HorizontalScroller';
import { TagsSelector } from './TagsSelector';
import { useLanguage } from '../lib/LanguageContext';
import {
  SearchCard, DetailCardGroup, RoomRateCards, BookingPreviewCards,
  FormCard, PaymentCard, SuccessCards, OrderListCards
} from './cards';

type MessageType = 'text' | 'tags' | 'hotel-search' | 'hotel-detail' | 'room-rates' | 'booking-preview' | 'guest-form' | 'payment' | 'booking-success' | 'order-list';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text?: string;
  toolCall?: string;
  type?: MessageType;
  data?: any;
}

const tagTranslations: Record<string, string> = {
  '五星级': '5 Star',
  '四星级': '4 Star',
  '经济型': 'Budget',
  '泳池': 'Pool',
  '含早餐': 'Breakfast Included',
  '可免费取消': 'Free Cancellation',
  '免费停车': 'Free Parking',
  '健身房': 'Gym',
  '浴缸': 'Bathtub',
  '亲子酒店': 'Kid-Friendly',
  '江景房': 'River View',
  '近地铁': 'Near Subway',
  '商务出行': 'Business'
};

function ToolCall({ text }: { text: string }) {
  const { lang } = useLanguage();
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5 bg-gray-50/50 w-fit max-w-full px-2 py-0.5 rounded-full border border-gray-100">
      <Wrench className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{lang === 'zh' ? '已调用' : 'Called'} {text}</span>
    </div>
  );
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-0',
    sender: 'user',
    text: '我想订上海外滩附近的酒店'
  },
  {
    id: 'msg-1',
    sender: 'ai',
    toolCall: 'getHotelSearchFacets',
    text: '上海外滩附近有不少好酒店，您关心哪些方面？',
    type: 'tags',
    data: [
      { 
        category: '星级/价格', 
        tags: [
          { label: '五星级', icon: 'Star' }, 
          { label: '四星级', icon: 'Star' }, 
          { label: '经济型', icon: 'Wallet' }
        ] 
      },
      { 
        category: '设施/服务', 
        tags: [
          { label: '泳池', icon: 'Waves' }, 
          { label: '含早餐', icon: 'Coffee' }, 
          { label: '可免费取消', icon: 'RefreshCcw' }, 
          { label: '免费停车', icon: 'Car' }, 
          { label: '健身房', icon: 'Dumbbell' }, 
          { label: '浴缸', icon: 'Bath' }
        ] 
      },
      { 
        category: '特色/人群', 
        tags: [
          { label: '亲子酒店', icon: 'Baby' }, 
          { label: '江景房', icon: 'Building' }, 
          { label: '近地铁', icon: 'Train' }, 
          { label: '商务出行', icon: 'Briefcase' }
        ] 
      }
    ]
  }
];

export function Chat() {
  const { lang, setLang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMsg = (msg: Omit<Message, 'id'>) => {
    const newMsg = { ...msg, id: Date.now().toString() };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    addMsg({ sender: 'user', text: input.trim() });
    
    const text = input.trim().toLowerCase();
    setInput('');
    
    if (text.includes('查订单') || text.includes('我的订单') || text.includes('order') || text.includes('booking')) {
      setTimeout(() => {
        addMsg({
          sender: 'ai',
          toolCall: 'getHotelBooking',
          text: '为您查找到以下订单：',
          type: 'order-list',
          data: mockOrders
        });
      }, 800);
    } else if (text.includes('取消') || text.includes('退订') || text.includes('cancel')) {
      setTimeout(() => {
        addMsg({
          sender: 'ai',
          toolCall: 'cancelHotelBooking',
          text: '✅ 订单已取消\n\n退款金额：¥1,760\n退款将在3-5个工作日原路退回'
        });
      }, 800);
    } else {
      setTimeout(() => {
        addMsg({
          sender: 'ai',
          toolCall: lang === 'zh' ? `searchHotels（${input.trim()}）` : `searchHotels("${input.trim()}")`,
          text: '找到一些符合条件的酒店，为您推荐：',
          type: 'hotel-search',
          data: mockSearchCards
        });
      }, 1000);
    }
  };

  const handleTagsConfirm = (selectedTags: string[]) => {
    const tagsStr = selectedTags.join(' · ');
    addMsg({ sender: 'user', text: `我需要：${tagsStr}` });
    
    setTimeout(() => {
      const translatedTagsStr = selectedTags.map(tag => tagTranslations[tag] || tag).join(' · ');
      addMsg({
        sender: 'ai',
        toolCall: lang === 'zh' ? `searchHotels（上海外滩 · ${tagsStr}）` : `searchHotels("Shanghai Bund · ${translatedTagsStr}")`,
        text: '找到 10 家符合条件的酒店，为您推荐：',
        type: 'hotel-search',
        data: mockSearchCards
      });
    }, 1000);
  };

  const handleDetail = (id: string) => {
    addMsg({ sender: 'user', text: lang === 'zh' ? '查看详情' : 'Details' });
    setTimeout(() => {
      // Build Chinese details
      const fallbackZh = mockSearchCards.zh.find((h: any) => h.id === id);
      const hotelZh = mockHotelDetails.zh[id] || {
        ...fallbackZh,
        photos: [
          fallbackZh?.cover || '',
          'https://images.unsplash.com/photo-1584132967334-10e028b1840dc?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d13264426?auto=format&fit=crop&w=400&q=80'
        ],
        description: '位于外滩腹地，地理位置优越，环境优美。',
        address: '上海市黄浦区',
        transportTips: [
          { type: 'train', text: '地铁1/2/8号线人民广场站 步行约5分钟' },
          { type: 'plane', text: '距虹桥机场约16公里 车程约30分钟' }
        ],
        amenities: {
          hotelLevel: ['免费WiFi', '健身房', '餐厅', '室外泳池'],
          roomLevel: ['独立卫浴', '电视', '空调', '浴缸']
        },
        highlights: ['位置优越', '视野开阔'],
        concerns: [],
        suitableFor: ['情侣度假', '商务出行']
      };

      // Build English details
      const fallbackEn = mockSearchCards.en.find((h: any) => h.id === id);
      const hotelEn = mockHotelDetails.en[id] || {
        ...fallbackEn,
        photos: [
          fallbackEn?.cover || '',
          'https://images.unsplash.com/photo-1584132967334-10e028b1840dc?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d13264426?auto=format&fit=crop&w=400&q=80'
        ],
        description: 'Located in the core area of the Bund, with excellent location and environment.',
        address: 'Huangpu District, Shanghai',
        transportTips: [
          { type: 'train', text: 'Metro Line 1/2/8 People\'s Square Station, 5 mins walk' },
          { type: 'plane', text: 'Approx. 16 km from Hongqiao Airport, 30 mins drive' }
        ],
        amenities: {
          hotelLevel: ['Free WiFi', 'Gym', 'Restaurant', 'Outdoor Pool'],
          roomLevel: ['Private Bathroom', 'TV', 'A/C', 'Bathtub']
        },
        highlights: ['Prime Location', 'Excellent View'],
        concerns: [],
        suitableFor: ['Couple Vacation', 'Business Trip']
      };
      
      addMsg({
        sender: 'ai',
        toolCall: 'getHotelContent + getHotelReviews',
        type: 'hotel-detail',
        data: { zh: hotelZh, en: hotelEn }
      });
    }, 1000);
  };

  const handleSelectHotel = (id: string) => {
    addMsg({ sender: 'user', text: lang === 'zh' ? '选这家看房型' : 'Select this hotel' });
    setTimeout(() => {
      const hotelNameZh = mockHotelDetails.zh[id]?.name || mockSearchCards.zh.find((h: any) => h.id === id)?.name || '未知酒店';
      const hotelNameEn = mockHotelDetails.en[id]?.name || mockSearchCards.en.find((h: any) => h.id === id)?.name || 'Radisson';
      const hotelName = lang === 'zh' ? hotelNameZh : hotelNameEn;
      addMsg({
        sender: 'ai',
        toolCall: lang === 'zh' ? `getHotelRoomRates（${hotelName} · 2晚 · 2成人）` : `getHotelRoomRates("${hotelName} · 2 Nights · 2 Adults")`,
        text: `${hotelName} 有以下房型：`,
        type: 'room-rates',
        data: mockRoomRates
      });
    }, 1000);
  };

  const handleSelectPlan = (planId: string) => {
    addMsg({ sender: 'user', text: lang === 'zh' ? '选择此方案' : 'Select this plan' });
    setTimeout(() => {
      addMsg({
        sender: 'ai',
        toolCall: lang === 'zh' ? 'previewHotelBooking（豪华大床房 · 含双早）' : 'previewHotelBooking("Deluxe King Room · Double Breakfast Included")',
        type: 'booking-preview',
        data: mockPreviewDetail
      });
    }, 1000);
  };

  const handleConfirmOrder = () => {
    addMsg({ sender: 'user', text: lang === 'zh' ? '确认下单，填写信息' : 'Confirm Order & Fill Details' });
    setTimeout(() => {
      addMsg({
        sender: 'ai',
        type: 'guest-form'
      });
    }, 500);
  };

  const handleFormSubmit = () => {
    addMsg({ sender: 'user', text: lang === 'zh' ? '提交订单' : 'Submit Order' });
    setTimeout(() => {
      addMsg({
        sender: 'ai',
        toolCall: 'createHotelBooking + createHotelPaymentSession',
        text: '订单已创建，请在30分钟内完成支付：',
        type: 'payment',
        data: {
          zh: {
            bookingId: 'BK2026051301',
            hotelName: '上海新世界丽笙大酒店',
            roomName: '豪华大床房',
            dates: '5月13日-15日 · 2晚',
            amount: '1,760.00',
            expiresAt: '08:30'
          },
          en: {
            bookingId: 'BK2026051301',
            hotelName: 'Radisson Blu Hotel Shanghai New World',
            roomName: 'Deluxe King Room',
            dates: 'May 13 - 15 · 2 Nights',
            amount: '1,760.00',
            expiresAt: '08:30'
          }
        }
      });
    }, 1200);
  };

  const handlePaid = () => {
    addMsg({ sender: 'user', text: lang === 'zh' ? '我已支付完成' : 'I Have Paid' });
    setTimeout(() => {
      addMsg({
        sender: 'ai',
        toolCall: 'confirmHotelBooking',
        type: 'booking-success',
        data: mockBookingSuccess
      });
    }, 1200);
  };

  const renderMessageContent = (msg: Message) => {
    const activeData = (() => {
      const data = msg.data;
      if (!data) return data;
      if (Array.isArray(data)) return data;
      if (typeof data === 'object') {
        if ('zh' in data || 'en' in data) {
          return data[lang] || data.zh;
        }
      }
      return data;
    })();

    switch (msg.type) {
      case 'tags':
        return <TagsSelector groups={activeData} onConfirm={handleTagsConfirm} />;
      case 'hotel-search':
        return (
          <div className="mt-3 w-full min-w-0">
            <HorizontalScroller>
              {activeData?.map((hotel: any) => (
                <div key={hotel.id} className="w-full h-full">
                  <SearchCard hotel={hotel} onDetail={handleDetail} onSelect={handleSelectHotel} />
                </div>
              ))}
            </HorizontalScroller>
          </div>
        );
      case 'hotel-detail':
        return (
          <div className="mt-3 w-full min-w-0">
            <DetailCardGroup hotel={activeData} onSelectRoom={handleSelectHotel} />
          </div>
        );
      case 'room-rates':
        return (
          <div className="mt-3 w-full min-w-0">
            <RoomRateCards dateSummary={lang === 'zh' ? '5月13日入住 · 5月15日离店 · 2晚' : '5/13 Check-in · 5/15 Check-out · 2 Nights'} plans={activeData} onSelectPlan={handleSelectPlan} />
          </div>
        );
      case 'booking-preview':
        return (
          <div className="mt-3 w-full min-w-0 flex justify-center">
            <BookingPreviewCards detail={activeData} onConfirm={handleConfirmOrder} />
          </div>
        );
      case 'guest-form':
        return (
          <div className="mt-3 w-full min-w-0 flex justify-center">
            <FormCard onSubmit={handleFormSubmit} />
          </div>
        );
      case 'payment':
        return (
          <div className="mt-3 w-full min-w-0 flex justify-center">
            <PaymentCard payment={activeData} onPaid={handlePaid} onCancel={() => setMessages(INITIAL_MESSAGES)} />
          </div>
        );
      case 'booking-success':
        return (
          <div className="mt-3 w-full min-w-0 flex justify-center">
            <SuccessCards booking={activeData} />
          </div>
        );
      case 'order-list':
        return (
          <div className="mt-3 w-full min-w-0 flex justify-center">
            <OrderListCards orders={activeData} />
          </div>
        );
      default:
        return null;
    }
  };

  const getTranslatedText = (msg: Message) => {
    if (msg.id === 'msg-0') {
      return t('initialUserMsg');
    }
    if (msg.id === 'msg-1') {
      return t('initialAiMsg');
    }
    
    if (msg.text?.startsWith('我需要：') || msg.text?.startsWith('I need: ')) {
      const suffix = msg.text.replace('我需要：', '').replace('I need: ', '');
      const parts = suffix.split(' · ');
      const translatedParts = parts.map(p => {
        if (lang === 'en') {
          return tagTranslations[p] || p;
        } else {
          const foundZh = Object.keys(tagTranslations).find(k => tagTranslations[k] === p);
          return foundZh || p;
        }
      });
      return `${t('selectedTagsLabel')}${translatedParts.join(' · ')}`;
    }

    if (msg.text === '找到一些符合条件的酒店，为您推荐：' || msg.text === 'Found some matching hotels for you:') {
      return t('searchRecommend');
    }

    if (msg.text === '找到 10 家符合条件的酒店，为您推荐：' || msg.text === 'Found 10 matching hotels, here are our recommendations:') {
      return t('searchResultPrefix');
    }

    if (msg.text === '查看详情' || msg.text === 'Details') {
      return t('viewDetails');
    }

    if (msg.text === '选这家看房型' || msg.text === 'Select this hotel') {
      return t('detailsBookBtn');
    }

    if (msg.text?.includes('有以下房型：') || msg.text?.includes('offers the following room types:')) {
      const parts = msg.text.split(/ 有以下房型：| offers the following room types:/);
      const extractedName = parts[0] || 'RADISSON';
      return `${extractedName}${t('ratesPrefix')}`;
    }

    if (msg.text === '选择此方案' || msg.text === 'Select this plan') {
      return t('selectHotelBtn');
    }

    if (msg.text === '确认下单，填写信息' || msg.text === 'Confirm Order & Fill Details') {
      return lang === 'zh' ? '确认下单，填写信息' : 'Confirm Order & Fill Details';
    }

    if (msg.text === '提交订单' || msg.text === 'Submit Order') {
      return t('submitOrderBtn');
    }

    if (msg.text === '订单已创建，请在30分钟内完成支付：' || msg.text === 'Order created, please complete payment within 30 minutes:') {
      return t('timeoutPaymentHint');
    }

    if (msg.text === '我已支付完成' || msg.text === 'I Have Paid') {
      return t('payConfirmBtn');
    }

    if (msg.text === '为您查找到以下订单：' || msg.text === 'Found the following bookings for you:') {
      return t('orderChecked');
    }

    if (msg.text?.includes('订单已取消') || msg.text?.includes('Order has been cancelled')) {
      return t('orderCancelSuccess');
    }

    return msg.text;
  };

  const toggleLanguage = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="max-w-md mx-auto w-full h-full bg-white flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="w-12"></div>
        <div className="text-center flex-1">
          <h1 className="font-bold text-gray-900 leading-none">RollingGo</h1>
          <p className="text-[10px] text-gray-400 mt-1 font-medium">{lang === 'zh' ? 'AI酒店预订演示' : 'AI Hotel Booking Demo'}</p>
        </div>
        <button 
          onClick={toggleLanguage}
          className="px-2.5 py-1 text-[11px] font-bold rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all active:scale-[0.96] flex items-center gap-1 shadow-sm h-7"
        >
          🌐 {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn("flex flex-col min-w-0 w-full", msg.sender === 'user' ? "items-end max-w-[95%]" : "items-start max-w-full")}>
                {msg.toolCall && <ToolCall text={msg.toolCall} />}
                
                {msg.text && (
                  <div className={cn(
                    "px-3 py-2 rounded-2xl text-[15px] leading-relaxed relative whitespace-pre-wrap break-words shadow-sm animate-in fade-in duration-200",
                    msg.sender === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm w-fit max-w-[95%]"
                  )}>
                    {getTranslatedText(msg)}
                  </div>
                )}
                
                {renderMessageContent(msg)}
              </div>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <footer className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')} 
            className="w-full bg-gray-100 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow text-gray-900"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 -mr-0.5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
