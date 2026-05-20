import { Check, X, Calendar, User, Maximize } from 'lucide-react';
import { HorizontalScroller } from '../HorizontalScroller';
import { useLanguage } from '../../lib/LanguageContext';

export function RoomRateCards({ dateSummary, plans, onSelectPlan }: any) {
  const { lang, t } = useLanguage();

  return (
    <HorizontalScroller className="items-stretch">
      {plans.map((plan: any, idx: number) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm shadow-black/5 border border-gray-100 flex flex-col overflow-hidden h-full pb-5">
          
          <div className="flex items-center justify-between px-4 py-3 bg-blue-50/60 border-b border-blue-100/50">
            <div className="flex items-start gap-1.5 text-xs text-blue-700 font-medium">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span className="leading-normal">{dateSummary}</span>
            </div>
          </div>
          
          <div className="px-4 pt-4 pb-0 flex flex-col flex-1">
            <div className="mb-4">
              <div className="font-bold text-gray-900 text-[17px] tracking-tight">{plan.roomName}</div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px] text-gray-500 mt-2.5">
                <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-gray-400"/> {plan.roomSize}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1">{plan.bedSummary}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400"/> {plan.maxOccupancy}{lang === 'zh' ? '人' : ' Guest(s)'}</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="bg-[#f8f9fa] rounded-xl p-3.5 border border-gray-100/80">
                <div className="font-semibold text-[14px] text-gray-900 flex items-start gap-1.5">
                  {plan.cancelable ? <Check className="w-[18px] h-[18px] text-[#00b373] flex-shrink-0" /> : <X className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" />}
                  <span className="leading-tight">{plan.ratePlanName}</span>
                </div>
                
                <div className="mt-3 ml-[24px] text-[12px]">
                  <div className="flex flex-col gap-2 text-gray-600">
                    <div className="flex flex-col gap-1.5">
                      {plan.benefits.map((b: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-gray-300 before:rounded-full">{b}</div>
                      ))}
                    </div>
                    <div className={plan.cancelable ? 'text-[#00b373] mt-0.5 font-medium' : 'text-gray-500 mt-0.5'}>
                      {plan.cancellationSummary}
                    </div>
                  </div>
                </div>
              </div>
              
              {plan.availableRooms < 5 && (
                <div className="text-[12px] text-[#ff5f00] font-medium flex items-center gap-1.5 px-1 py-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5f00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5f00]"></span>
                  </span>
                  {t('ratesRoomLeft').replace('{num}', plan.availableRooms.toString())}
                </div>
              )}
            </div>
            
            <div className="mt-5 pt-4 border-t border-gray-100/80 flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm font-bold text-[#ff5e00]">¥</span>
                  <span className="text-[26px] font-bold text-[#ff5e00] tracking-tight leading-none">{plan.price.totalAmount}</span>
                </div>
                <div className="text-[12px] text-gray-400 mt-1">{lang === 'zh' ? '含税' : 'incl. tax'} ¥{plan.price.averageNightlyRate} {lang === 'zh' ? '/ 晚' : '/ night'}</div>
              </div>
              
              <button 
                onClick={() => onSelectPlan(plan.id)} 
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0066ff] to-[#005ce6] hover:from-[#005ce6] hover:to-[#0052cc] active:scale-[0.98] text-white text-[14px] font-medium transition-all shadow-md shadow-blue-500/20"
              >
                {t('ratesBookBtn')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </HorizontalScroller>
  );
}
