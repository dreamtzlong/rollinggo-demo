import { CreditCard, Wallet, Clock, Info, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

export function PaymentCard({ payment, onPaid, onCancel }: any) {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-sm shadow-black/5 border border-gray-100 overflow-hidden w-full">
      
      {/* Header */}
      <div className="bg-orange-50/50 px-4 py-3 flex items-center justify-between border-b border-orange-100/50">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#ff5f00]" />
          <span className="font-medium text-[#ff5f00] text-[13px]">{t('unpaidLabel')}</span>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">#{payment.bookingId}</span>
      </div>
      
      <div className="p-5 flex flex-col">
        {/* Hotel Info */}
        <div className="mb-4 text-center">
          <div className="font-bold text-gray-900 text-[16px] leading-tight mb-1">{payment.hotelName}</div>
          <div className="text-[13px] text-gray-500">{payment.roomName} · {payment.dates}</div>
        </div>
        
        {/* Payment Amount Box */}
        <div className="w-full bg-[#f8f9fa] rounded-xl p-5 flex flex-col items-center border border-gray-100 mb-5 relative overflow-hidden">
          {/* subtle background decoration */}
          <div className="absolute top-0 right-0 p-2 opacity-[0.03]">
             <Wallet className="w-20 h-20" />
          </div>
          
          <div className="text-[12px] text-gray-500 mb-1 z-10">{t('payableAmountLabel')}</div>
          <div className="flex items-baseline gap-0.5 z-10">
            <span className="text-[18px] font-bold text-gray-900 mt-0.5">¥</span>
            <span className="text-[32px] font-bold text-gray-900 leading-none tracking-tight">{payment.amount}</span>
          </div>
          
          <button className="w-full mt-5 py-3 rounded-full bg-[#1677FF] hover:bg-[#1677FF]/90 active:scale-[0.98] text-white text-[15px] font-medium transition-all shadow-md shadow-[#1677FF]/20 flex items-center justify-center gap-2 z-10">
            <Wallet className="w-[18px] h-[18px]" /> {t('payAlipayBtn')}
          </button>
          
          <div className="text-[11px] text-gray-400 mt-3 flex items-center gap-1 z-10 relative">
             {t('orderExpiryLabel').replace('{time}', payment.expiresAt)}
          </div>
        </div>
        
        {/* Actions & Hints */}
        <div className="space-y-3">
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex gap-2 items-start mb-2">
             <Info className="w-[14px] h-[14px] text-blue-500 flex-shrink-0 mt-0.5" />
             <div className="text-[11.5px] text-blue-700/80 leading-relaxed">
               {t('payInstsLabel')}
             </div>
          </div>
          
          <button onClick={onPaid} className="w-full py-3 rounded-full bg-[#00b373] text-white text-[14px] font-medium hover:bg-[#00a067] active:scale-[0.98] transition-all shadow-md shadow-[#00b373]/20">
            {t('payConfirmBtn')}
          </button>
 
          <button onClick={onCancel} className="w-full py-2.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
            {t('cancelOrderBtn')}
          </button>
        </div>
 
      </div>
    </div>
  );
}
