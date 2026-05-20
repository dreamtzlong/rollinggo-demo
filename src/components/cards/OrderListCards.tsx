import { HorizontalScroller } from '../HorizontalScroller';
import { useLanguage } from '../../lib/LanguageContext';

export function OrderListCards({ orders }: any) {
  const { lang, t } = useLanguage();

  return (
    <HorizontalScroller className="h-auto">
      {orders.map((order: any, i: number) => (
        <div key={i} className="bg-white rounded-xl shadow-sm shadow-black/5 border border-gray-100 p-4 h-[240px] flex flex-col relative overflow-hidden w-[90%] sm:w-[320px] max-w-[320px]">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {order.status === 'confirmed' ? t('orderStatusConfirmed') : t('orderStatusCompleted')}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {t('orderNumberLabel')} {i+1}/{orders.length}
            </span>
          </div>
          
          <div className="font-bold text-gray-900 border-l-2 border-blue-500 pl-2 mb-2 line-clamp-1">
            {order.hotelName}
          </div>
          
          <div className="text-xs text-gray-600 space-y-1 mb-2 flex-1">
            <div>📅 {order.dates}</div>
            <div>{t('confirmationCodeLabel')}: <span className="font-mono text-gray-800 select-all">{order.confirmationCode}</span></div>
          </div>
          
          <div className="flex items-end justify-between border-t border-gray-100 pt-3">
            <div>
              <div className="text-lg font-bold text-black leading-none">¥{order.amount}</div>
              {order.status === 'confirmed' && (
                <div className="text-[10px] text-green-600 mt-1">{order.cancelPolicy}</div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-3 text-xs">
            <button className="flex-1 py-1.5 rounded border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
              {t('viewDetails')}
            </button>
            {order.status === 'confirmed' ? (
              <button className="flex-1 py-1.5 rounded border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                {t('cancelOrderBtn')}
              </button>
            ) : (
              <button className="flex-1 py-1.5 rounded border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                {t('invoiceBtn')}
              </button>
            )}
          </div>
        </div>
      ))}
    </HorizontalScroller>
  );
}
