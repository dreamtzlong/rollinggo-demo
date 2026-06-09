import { useState } from 'react';
import { Calendar, Users, AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

export function BookingPreviewCards({ detail, onConfirm }: any) {
  const [showPolicies, setShowPolicies] = useState(false);
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full">
      
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="font-bold text-[17px] text-gray-900 leading-tight">{detail.hotelName}</h3>
        <p className="text-[13px] text-gray-500 mt-1">{detail.roomName} · {detail.planSummary}</p>
      </div>

      {/* Booking Details */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex flex-col gap-3 text-[13px] text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-100/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium text-[13px]">{detail.checkIn} <span className="text-gray-400 font-normal mx-1">{lang === 'zh' ? '至' : 'to'}</span> {detail.checkOut}</span>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-200/60"></div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium text-[13px]">{detail.rooms}{lang === 'zh' ? '间' : ' Room(s)'} · {detail.guests}{lang === 'zh' ? '成人' : ' Adult(s)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy Collapsible */}
      <div className="px-4 pb-4 border-b border-gray-100">
        <button 
          onClick={() => setShowPolicies(!showPolicies)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl border transition-colors",
            showPolicies ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200 hover:bg-gray-50"
          )}
        >
          <div className="flex items-center gap-2 text-left">
            <ShieldCheck className="w-[18px] h-[18px] text-[#00b373] flex-shrink-0" />
            <span className="text-[13px] font-medium text-gray-800 leading-tight">{detail.cancellation.summary}</span>
          </div>
          {showPolicies ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />}
        </button>

        {showPolicies && (
          <div className="mt-2 bg-[#f8f9fa] rounded-xl border border-gray-100 p-3 text-[12px] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-3">
              {detail.cancellation.tiers.map((tier: any, i: number) => (
                <div key={i} className="flex gap-2.5">
                  <div className="mt-[3px] flex-shrink-0">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      i === 0 ? "bg-[#00b373]" : "bg-gray-300"
                    )}></div>
                  </div>
                  <div>
                    <div className={cn("font-medium", i === 0 ? "text-[#00b373]" : "text-gray-700")}>{tier.time}</div>
                    <div className="text-gray-500 mt-0.5 leading-relaxed">{tier.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="p-4 bg-gray-50/30">
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-[13px] text-gray-500">
            <span>{t('baseRate')}</span>
            <span>¥{detail.price.base}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-500">
            <span>{t('taxAndService')}</span>
            <span>¥{detail.price.tax}</span>
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div className="text-[12px] flex items-center gap-1 text-gray-400">
            <AlertCircle className="w-3.5 h-3.5" /> {t('priceLocked')}
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-400 mb-0.5">{t('totalPrice')}</div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[16px] font-bold text-[#ff5e00]">¥</span>
              <span className="text-[28px] font-bold text-[#ff5e00] leading-none tracking-tight">{detail.price.total}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button 
            onClick={onConfirm} 
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#0066ff] to-[#005ce6] hover:from-[#005ce6] hover:to-[#0052cc] active:scale-[0.98] text-white text-[15px] font-medium transition-all"
          >
            {t('bookNowBtn')}
          </button>
          
          <div className="flex flex-col items-center justify-center gap-1 mt-3">
            <div className="text-[11px] text-gray-400 flex items-center gap-1">
              {t('paymentMethodLabel')}{detail.paymentMethod}
            </div>
            <div className="text-[10px] text-gray-400">
              {t('timeoutPaymentHint')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
