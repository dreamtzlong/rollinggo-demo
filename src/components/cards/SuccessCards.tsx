import { MapPin, Phone, CheckCircle2, Info, FileText, ReceiptText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

export function SuccessCards({ booking }: any) {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full">
      
      {/* Header & Success Status */}
      <div className="bg-gradient-to-b from-[#00b373]/10 to-white pt-6 pb-4 px-4 flex flex-col items-center border-b border-gray-100/50">
        <div className="w-12 h-12 bg-[#00b373]/10 rounded-full flex items-center justify-center mb-2.5">
           <CheckCircle2 className="w-7 h-7 text-[#00b373]" />
        </div>
        <h2 className="font-bold text-[20px] text-gray-900 tracking-tight text-center">{t('bookSuccessTitle')}</h2>
        <p className="text-[12px] text-gray-500 mt-1 text-center max-w-[270px] leading-relaxed">{t('bookSuccessSubtitle')}</p>
      </div>
      
      <div className="p-4 space-y-4">
        
        {/* Confirmation Code */}
        <div className="bg-[#f2fcf7] rounded-xl p-3.5 text-center border border-[#00b373]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00b373]"></div>
          <div className="text-[12px] font-medium text-[#00905c] mb-1">{t('voucherLabel')}</div>
          <div className="font-mono text-[22px] font-bold text-[#00b373] tracking-widest select-all leading-tight">{booking.confirmationCode}</div>
          <div className="text-[11px] text-[#00905c]/80 mt-1.5 flex items-center justify-center gap-1">
             <Info className="w-3.5 h-3.5" /> {t('voucherInstLabel')}
          </div>
        </div>
        
        {/* Reservation Details */}
        <div className="flex flex-col gap-3 text-[13px] text-gray-700 bg-gray-50/80 p-4 rounded-xl border border-gray-100/50">
           
           <div className="flex justify-between items-start">
             <div>
               <div className="font-bold text-[15px] text-gray-900 leading-tight mb-1 content-start">{booking.hotelName}</div>
               <div className="flex items-start gap-1 text-gray-500 text-[12px] pr-2">
                 <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                 <span className="leading-snug">{booking.hotelAddress}</span>
               </div>
             </div>
             <a href={`tel:${booking.hotelPhone}`} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors" aria-label="联系酒店">
               <Phone className="w-4 h-4" />
             </a>
           </div>
           
           <div className="h-[1px] w-full bg-gray-200/60 my-1"></div>
           
           <div className="flex justify-between items-center py-1">
             <div className="flex flex-col">
               <span className="text-gray-400 text-[11px] mb-0.5">{lang === 'zh' ? '入住 (14:00后)' : 'Check-in (after 14:00)'}</span>
               <span className="font-medium text-[14px] text-gray-900">{booking.checkIn}</span>
             </div>
             <div className="flex mt-3 gap-1">
               <div className="w-1 h-1 rounded-full bg-gray-300"></div>
               <div className="w-1 h-1 rounded-full bg-gray-300"></div>
               <div className="w-1 h-1 rounded-full bg-gray-300"></div>
             </div>
             <div className="flex flex-col text-right">
               <span className="text-gray-400 text-[11px] mb-0.5">{lang === 'zh' ? '离店 (12:00前)' : 'Check-out (before 12:00)'}</span>
               <span className="font-medium text-[14px] text-gray-900">{booking.checkOut}</span>
             </div>
           </div>
           
           <div className="flex flex-col gap-2 bg-white p-2.5 rounded-lg border border-gray-100 mt-1">
             <div className="flex justify-between items-center">
               <span className="text-gray-500 text-[12px]">{t('roomTypeLabel')}</span>
               <span className="font-medium text-[13px]">{booking.roomName}</span>
             </div>
             <div className="flex justify-between items-center border-t border-gray-50 pt-2">
               <span className="text-gray-500 text-[12px]">{t('paidLabel')}</span>
               <span className="font-bold text-[14px] text-gray-900">¥{booking.amount}</span>
             </div>
           </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
            <button className="py-2.5 rounded-xl border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]">
               <FileText className="w-4 h-4 text-gray-500" />
               {t('orderDetailsBtn')}
            </button>
            <button className="py-2.5 rounded-xl border border-gray-200 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]">
               <ReceiptText className="w-4 h-4 text-gray-500" />
               {t('invoiceBtn')}
            </button>
        </div>
        
      </div>
    </div>
  );
}
