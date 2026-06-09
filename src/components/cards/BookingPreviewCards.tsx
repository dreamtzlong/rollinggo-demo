import { useState } from 'react';
import { Calendar, ShieldCheck, ChevronUp, ChevronDown, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

export function BookingPreviewCards({ detail, onConfirm, onReselect }: any) {
  const [showPolicies, setShowPolicies] = useState(false);
  const [showPriceDetail, setShowPriceDetail] = useState(false);
  const { lang, t } = useLanguage();

  const isKing = detail.roomName?.includes('大床') || detail.roomName?.includes('King') || detail.roomName?.includes('A') || false;
  const isTwin = detail.roomName?.includes('双床') || detail.roomName?.includes('Twin') || false;
  const bedType = isKing 
    ? (lang === 'zh' ? '大床' : 'King Bed') 
    : isTwin 
      ? (lang === 'zh' ? '双床' : 'Twin Beds') 
      : (lang === 'zh' ? '单人床' : 'Single Bed');

  const sizeText = isKing ? '42m²' : isTwin ? '48m²' : '20m²';
  const breakfastText = detail.planSummary?.split(' · ')[0] || (lang === 'zh' ? '含双早' : 'Breakfast Included');

  // Unified reselect handler
  const handleReselectClick = () => {
    if (onReselect) {
      onReselect();
    } else {
      // Small fallback if not provided
      window.dispatchEvent(new CustomEvent('reselect-room'));
    }
  };

  return (
    <div id="fliggy-checkout-card" className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full shadow-md select-none">
      
      {/* 1. Header with Branded Label */}
      <div className="px-4.5 pt-4 pb-3 border-b border-gray-100/50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col text-left">
            <h3 className="font-extrabold text-[16px] sm:text-[17px] text-gray-900 leading-snug tracking-tight">
              {detail.hotelName}
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5 font-medium">
              {detail.roomName} · {breakfastText}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Fliggy Style Stay Details & Chamber Specs */}
      <div className="px-4 pb-3.5 pt-3.5 space-y-3">
        
        {/* Stay Timing Box Container */}
        <div className="bg-[#f7fafe] rounded-xl p-3.5 border border-blue-500/5 select-none flex flex-col gap-2.5 text-left">
          
          {/* Arrival and Departure line */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="text-[12.5px] font-bold text-gray-800 flex items-center gap-1 flex-wrap leading-none">
              <span>{detail.checkIn}</span>
              <span className="text-gray-400 font-normal text-[11.5px] mx-0.5">—</span>
              <span>{detail.checkOut}</span>
              <span className="text-gray-300 font-normal mx-1">|</span>
              <span className="text-gray-600 font-medium">{detail.rooms}{lang === 'zh' ? '间' : ' Rm'}</span>
              <span className="text-gray-300 font-normal mx-1">|</span>
              <span className="text-gray-600 font-medium">
                {lang === 'zh' ? '2晚' : '2 Nights'}
              </span>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-blue-100/30"></div>

          {/* Dynamic Room Features specs */}
          <div className="text-[12px] text-gray-500 flex flex-wrap items-center gap-1 font-medium leading-relaxed">
            <span>{detail.roomName}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span>{bedType}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span>{breakfastText}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span>{sizeText}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span>{lang === 'zh' ? '有窗' : 'Windowed'}</span>
          </div>
        </div>

        {/* 3. Cancellation Policy Banner */}
        <div className="flex flex-col gap-1.5 text-left bg-emerald-50/50 p-3 rounded-xl border border-emerald-500/10 relative">
          <button 
            type="button"
            onClick={() => setShowPolicies(!showPolicies)}
            className="flex items-center justify-between text-[#00a870] font-bold text-[12.5px] w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <ShieldCheck className="w-[15px] h-[15px] text-[#00b373] shrink-0" />
              <span className="truncate leading-none">{detail.cancellation?.summary || (lang === 'zh' ? '可免费取消' : 'Free Cancellation')}</span>
            </div>
            {showPolicies ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
            )}
          </button>
          
          <div 
            onClick={() => setShowPolicies(!showPolicies)}
            className="flex items-center justify-between text-[10.5px] text-gray-400 font-medium cursor-pointer"
          >
            <span>{lang === 'zh' ? '该房型仅限本人入住 预订须知 >' : 'This room is limited to guests, Booking info >'}</span>
          </div>

          {/* Collapsible cancellation tiers */}
          {showPolicies && (
            <div className="mt-2.5 bg-white rounded-lg border border-emerald-100/50 p-2 text-[11.5px] space-y-2 text-left animate-in fade-in duration-200">
              {detail.cancellation?.tiers?.map((tier: any, i: number) => (
                <div key={i} className="flex gap-2 pb-1.5 border-b border-gray-50 last:border-0 last:pb-0">
                  <span className="font-bold text-[#00b373] shrink-0">{tier.time}:</span>
                  <span className="text-gray-500 leading-snug">{tier.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Contact & Occupant Pre-filled Fields */}
        <div className="border-t border-gray-100/80 pt-3.5 flex flex-col gap-0.5 select-none text-left">
          
          {/* Guest occupant item */}
          <div className="flex items-center justify-between py-2.5 px-0.5 border-b border-gray-50/75 hover:bg-gray-50/50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center gap-1 text-[12.5px] text-gray-500 font-bold">
              <span>{lang === 'zh' ? '入住人' : 'Guest'}</span>
              <Info className="w-3 h-3 text-gray-300" />
            </div>
            <div className="flex items-center gap-1 text-[12.5px] font-extrabold text-gray-800">
              <span>{lang === 'zh' ? '张* (张三)' : 'J**n Doe'}</span>
              <span className="text-gray-300 font-normal text-xs">&gt;</span>
            </div>
          </div>

          {/* Contact cell item */}
          <div className="flex items-center justify-between py-2.5 px-0.5 border-b border-gray-50/75 hover:bg-gray-50/50 rounded-lg transition-colors cursor-pointer">
            <div className="text-[12.5px] text-gray-500 font-bold">
              {lang === 'zh' ? '联系方式' : 'Contact Phone'}
            </div>
            <div className="flex items-center gap-1 text-[12.5px] font-extrabold text-gray-800">
              <span>138****1111</span>
              <span className="text-gray-300 font-normal text-xs">&gt;</span>
            </div>
          </div>

          {/* Interactive Pricing Item */}
          <div 
            onClick={() => setShowPriceDetail(!showPriceDetail)}
            className="flex items-center justify-between py-3 px-0.5 hover:bg-gray-50/50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-[12.5px] text-gray-500 font-bold">
              {lang === 'zh' ? '总价格' : 'Total Price'}
            </div>
            <div className="flex items-center gap-1 leading-none">
              <div className="flex items-baseline gap-0.5 text-[#ff5500] font-sans">
                <span className="text-[11px] font-bold">¥</span>
                <span className="text-[18px] font-black tracking-tight leading-none">
                  {detail.price.total}
                </span>
              </div>
              {showPriceDetail ? (
                <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-0.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-0.5" />
              )}
            </div>
          </div>

          {/* Collapsible Pricing Breakdown */}
          {showPriceDetail && (
            <div className="mt-1 bg-gray-50/80 rounded-xl p-3 border border-gray-100 text-[12px] space-y-1.5 animate-in fade-in duration-150">
              <div className="flex justify-between text-gray-500">
                <span>{lang === 'zh' ? '起价 / 基础房费' : 'Base Rate'}</span>
                <span>¥{detail.price.base}</span>
              </div>
              <div className="flex justify-between text-gray-500 shadow-2xs">
                <span>{lang === 'zh' ? '税费及杂费' : 'Taxes & Extras'}</span>
                <span>¥{detail.price.tax}</span>
              </div>
              <div className="h-[1px] w-full bg-gray-200/50 my-1"></div>
              <div className="flex justify-between text-gray-700 font-bold">
                <span>{lang === 'zh' ? '应付总价' : 'Payable Total'}</span>
                <span>¥{detail.price.total}</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Bottom Dual Navigation Buttons */}
        <div className="flex gap-3 pt-3 flex-row w-full select-none">
          <button
            type="button"
            onClick={handleReselectClick}
            className="flex-1 py-3 text-[13.5px] font-extrabold rounded-xl bg-gray-100 hover:bg-gray-150/80 text-gray-600 transition-all duration-150 active:scale-97 border border-gray-200/20 shadow-2xs"
          >
            {lang === 'zh' ? '重新选择' : 'Reselect'}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="flex-[1.3] py-3 text-[13.5px] font-extrabold rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-97 text-white transition-all duration-150 shadow-sm"
          >
            {lang === 'zh' ? '立即支付' : 'Pay Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
