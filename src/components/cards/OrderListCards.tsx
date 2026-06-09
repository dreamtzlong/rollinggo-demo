import { Calendar, Clock, CreditCard, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

interface OrderListCardsProps {
  orders: any[];
  onCancel?: (order: any) => void;
  onPay?: (order: any) => void;
  onDetail?: (order: any) => void;
  onShowAllOrders?: () => void;
}

export function OrderListCards({ orders = [], onCancel, onPay, onDetail, onShowAllOrders }: OrderListCardsProps) {
  const { lang, t } = useLanguage();

  // Filter orders to only show: 待入住 (status === 'confirmed') and 待支付 (status === 'pending_payment')
  const filteredOrders = orders.filter(
    (order: any) => order.status === 'confirmed' || order.status === 'pending_payment'
  );

  if (filteredOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full text-center text-gray-500 shadow-sm flex flex-col items-center gap-3 animate-in fade-in duration-200">
        <div className="text-gray-300 text-3xl">📥</div>
        <p className="text-sm font-medium">
          {lang === 'zh' ? '暂无待入住或待支付的订单' : 'No bookings pending stay or payment'}
        </p>
        <button
          onClick={onShowAllOrders}
          className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-bold transition-all"
        >
          {lang === 'zh' ? '查看全部历史订单' : 'View All Historic Bookings'}
        </button>
      </div>
    );
  }

  // Choose a beautiful hotel matching image
  const getHotelImage = (hotelName: string) => {
    const name = (hotelName || '').toLowerCase();
    if (name.includes('丽笙') || name.includes('radisson')) {
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300';
    }
    if (name.includes('茂悦') || name.includes('hyatt')) {
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=300';
    }
    if (name.includes('和平') || name.includes('peace')) {
      return 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=300';
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 w-full flex flex-col gap-4 shadow-sm select-none animate-in fade-in duration-200">
      
      {/* List Header */}
      <div className="border-b border-gray-50 pb-2 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
          {lang === 'zh' ? '当前行程与订单' : 'Active Bookings & Orders'}
        </span>
        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full font-mono">
          {filteredOrders.length} {lang === 'zh' ? '笔订单' : 'Order(s)'}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {filteredOrders.map((order: any, idx: number) => {
          const isConfirmed = order.status === 'confirmed';
          const isPendingPay = order.status === 'pending_payment';

          return (
            <div key={order.confirmationCode || idx} className="flex flex-col">
              {/* Separator line for subsequent items */}
              {idx > 0 && <div className="border-t border-gray-100/90 w-full mb-4" />}
              
              <div className="flex gap-3 sm:gap-4">
                {/* Left side: Hotel image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex-shrink-0 overflow-hidden relative bg-gray-50 border border-gray-100">
                  <img 
                    src={getHotelImage(order.hotelName)} 
                    alt={order.hotelName} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/40 text-[8px] text-white px-1 py-0.5 rounded scale-90 translate-x-0.5 translate-y-0.5 font-medium leading-none whitespace-nowrap">
                    RollingGo
                  </span>
                </div>

                {/* Right side info only */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-[14px] sm:text-[15px] font-bold text-gray-900 tracking-tight leading-snug truncate">
                      {order.hotelName}
                    </h4>
                    
                    {/* Status Tag */}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 leading-none ${
                      isConfirmed 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {isConfirmed 
                        ? (lang === 'zh' ? '待入住' : 'Stay Pending') 
                        : (lang === 'zh' ? '待支付' : 'Payment Overdue')
                      }
                    </span>
                  </div>

                  {/* Dates detail */}
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-normal">
                    <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{order.dates}</span>
                  </div>

                  {/* Policy / Code / Status Detail info */}
                  <div className="mt-1 flex flex-col gap-0.5">
                    {isConfirmed && (
                      <>
                        <div className="text-[10.5px] font-mono text-gray-400">
                          {t('confirmationCodeLabel')}: <span className="text-gray-600 font-semibold select-all">{order.confirmationCode}</span>
                        </div>
                        {order.cancelPolicy && (
                          <div className="flex items-center gap-0.5 mt-0.5 text-[10px] font-medium text-teal-600">
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full border border-teal-500 text-teal-600 text-[8px] font-black shrink-0 leading-none">✓</span>
                            <span className="truncate">{order.cancelPolicy}</span>
                          </div>
                        )}
                      </>
                    )}

                    {isPendingPay && (
                      <>
                        <div className="text-[10.5px] font-mono text-gray-400">
                          {lang === 'zh' ? '订单号' : 'Order ID'}: <span className="text-gray-600 font-semibold select-all">{order.confirmationCode}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10.5px] font-medium text-rose-500">
                          <Clock className="w-3 h-3 shrink-0 animate-pulse text-rose-500" />
                          <span className="truncate font-semibold">{order.cancelPolicy || (lang === 'zh' ? '请尽快完成支付' : 'Pay as soon as possible')}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom: Money Amount & Interaction Actions - Extracted to be full-width of the card item */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-gray-100">
                {/* Price tag */}
                <div className="flex items-baseline gap-0.5 leading-none shrink-0 pr-2">
                  <span className="text-[12px] font-bold text-gray-900">¥</span>
                  <span className="text-[17px] sm:text-[18px] font-black text-gray-900 tracking-tight">
                    {order.amount}
                  </span>
                </div>

                {/* Interactive Buttons */}
                <div className="flex gap-2 text-xs shrink-0">
                  {isConfirmed && (
                    <>
                      <button 
                        onClick={() => onDetail && onDetail(order)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 font-bold text-[11px] hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        {t('viewDetails')}
                      </button>
                      <button 
                        onClick={() => onCancel && onCancel(order)}
                        className="px-2.5 py-1 rounded-lg border border-rose-100 text-rose-600 bg-rose-50/20 hover:bg-rose-50 font-bold text-[11px] transition-colors whitespace-nowrap"
                      >
                        {t('cancelOrderBtn')}
                      </button>
                    </>
                  )}

                  {isPendingPay && (
                    <>
                      <button 
                        onClick={() => onCancel && onCancel(order)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 font-medium text-[11px] hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        {t('cancelOrderBtn')}
                      </button>
                      <button 
                        onClick={() => onPay && onPay(order)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm shadow-blue-100 transition-all active:scale-95 flex items-center gap-1 shrink-0 whitespace-nowrap"
                      >
                        <CreditCard className="w-3 h-3 text-white/90" />
                        <span>{lang === 'zh' ? '去支付' : 'Pay Now'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {onShowAllOrders && (
        <div className="border-t border-gray-100 pt-2 shrink-0">
          <button
            onClick={onShowAllOrders}
            className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-blue-600 transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>{lang === 'zh' ? '🔍 查询更多订单' : '🔍 Query More Bookings'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
