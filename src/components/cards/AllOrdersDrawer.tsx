import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, CreditCard, Check, AlertCircle, RefreshCw, Clipboard } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

interface AllOrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
  onCancel?: (order: any) => void;
  onPay?: (order: any) => void;
  onDetail?: (order: any) => void;
}

export function AllOrdersDrawer({
  isOpen,
  onClose,
  orders = [],
  onCancel,
  onPay,
  onDetail
}: AllOrdersDrawerProps) {
  const { lang, t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter criteria
  const getFilteredOrders = () => {
    switch (selectedTab) {
      case 'pending':
        return orders.filter(o => o.status === 'confirmed' || o.status === 'pending_payment');
      case 'completed':
        return orders.filter(o => o.status === 'completed');
      case 'cancelled':
        return orders.filter(o => o.status === 'cancelled');
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  // Hotel matching images
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
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-end justify-center overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Content sheet - 2/3 Height */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-gray-50 rounded-t-[32px] w-full max-w-lg h-[66vh] flex flex-col shadow-2xl overflow-hidden border-t border-white"
        >
          {/* Header Drag Bar Handle */}
          <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header title & Close Button */}
          <div className="px-5 pb-3 flex items-center justify-between shrink-0 border-b border-gray-100 bg-white">
            <div>
              <h3 className="text-lg font-black text-gray-950 tracking-tight">
                {lang === 'zh' ? '我的全部订单' : 'All My Orders'}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                {lang === 'zh' ? '管理所有的行程与支付记录' : 'Manage your travels & payment history'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector Section */}
          <div className="p-3 bg-white shrink-0 border-b border-gray-100 flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', zh: '全部', en: 'All' },
              { id: 'pending', zh: '待入住/支付', en: 'Pending' },
              { id: 'completed', zh: '已完成', en: 'Completed' },
              { id: 'cancelled', zh: '已取消', en: 'Cancelled' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {lang === 'zh' ? tab.zh : tab.en}
              </button>
            ))}
          </div>

          {/* Order List Scrollable Container */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4 pb-12">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <span className="text-4xl mb-3">🔔</span>
                <p className="text-sm font-bold text-gray-500">
                  {lang === 'zh' ? '没有找到相关状态的订单' : 'No bookings found with this status'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {lang === 'zh' ? '换个筛选条件试试吧' : 'Try switching status filter tabs'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order: any, idx: number) => {
                const isConfirmed = order.status === 'confirmed';
                const isPendingPay = order.status === 'pending_payment';
                const isCompleted = order.status === 'completed';
                const isCancelled = order.status === 'cancelled';

                return (
                  <div
                    key={order.confirmationCode || idx}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm relative flex flex-col gap-3 group hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Left side image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0 overflow-hidden relative bg-gray-50 border border-gray-100">
                        <img
                          src={getHotelImage(order.hotelName)}
                          alt={order.hotelName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Right side info text */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-[13.5px] sm:text-[14.5px] font-bold text-gray-900 leading-snug truncate">
                              {order.hotelName}
                            </h4>

                            {/* Status Pill Badge */}
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wide ${
                              isConfirmed ? 'bg-green-50 text-green-700 border border-green-100' :
                              isPendingPay ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              isCompleted ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              'bg-gray-100 text-gray-400 border border-gray-150'
                            }`}>
                              {isConfirmed && (lang === 'zh' ? '待入住' : 'Stay Pending')}
                              {isPendingPay && (lang === 'zh' ? '待支付' : 'Pay Pending')}
                              {isCompleted && (lang === 'zh' ? '已完成' : 'Completed')}
                              {isCancelled && (lang === 'zh' ? '已取消' : 'Cancelled')}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-normal">
                            <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{order.dates}</span>
                          </div>

                          {/* Info lines */}
                          <div className="mt-1 flex flex-col gap-0.5">
                            <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                              <span>ID:</span>
                              <span className="text-gray-600 font-bold select-all">{order.confirmationCode}</span>
                              <button
                                onClick={() => handleCopy(order.confirmationCode)}
                                className="text-gray-400 hover:text-blue-500 p-0.5"
                                title="Copy ID"
                              >
                                {copiedId === order.confirmationCode ? (
                                  <Check className="w-2.5 h-2.5 text-green-500" />
                                ) : (
                                  <Clipboard className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>

                            {/* Alert/Policy Info lines */}
                            {isConfirmed && order.cancelPolicy && (
                              <div className="text-[9.5px] font-medium text-teal-600 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-teal-500" />
                                <span className="truncate">{order.cancelPolicy}</span>
                              </div>
                            )}

                            {isPendingPay && (
                              <div className="text-[9.5px] font-medium text-rose-500 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 shrink-0 animate-pulse text-rose-500" />
                                <span className="truncate font-semibold">{order.cancelPolicy || (lang === 'zh' ? '请尽快完成支付' : 'Complete pay soon')}</span>
                              </div>
                            )}

                            {isCompleted && (
                              <div className="text-[9.5px] font-medium text-gray-500 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span>{lang === 'zh' ? '感谢入住，期待再次相遇' : 'Thank you for staying! See you again.'}</span>
                              </div>
                            )}

                            {isCancelled && (
                              <div className="text-[9.5px] font-medium text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{order.cancelPolicy || (lang === 'zh' ? '订单已退款' : 'Order refunded')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom strip of the order list card: pricing & actions */}
                    <div className="flex items-center justify-between border-t border-dashed border-gray-100 pt-2.5 mt-1">
                      <div className="flex items-baseline gap-0.5 leading-none">
                        <span className="text-[10px] font-bold text-gray-400">Total:</span>
                        <span className="text-[11px] font-bold text-gray-900 ml-1">¥</span>
                        <span className="text-[15px] font-black text-gray-900 tracking-tight">{order.amount}</span>
                      </div>

                      {/* Action buttons list based on states */}
                      <div className="flex gap-1.5 text-[11px]">
                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => {
                                onDetail && onDetail(order);
                                onClose();
                              }}
                              className="px-2 py-0.5 rounded border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                              {t('viewDetails')}
                            </button>
                            <button
                              onClick={() => {
                                onCancel && onCancel(order);
                                onClose();
                              }}
                              className="px-2 py-0.5 rounded border border-rose-100 text-rose-600 bg-rose-50/10 hover:bg-rose-55 font-bold transition-colors"
                            >
                              {t('cancelOrderBtn')}
                            </button>
                          </>
                        )}

                        {isPendingPay && (
                          <>
                            <button
                              onClick={() => {
                                onPay && onPay(order);
                                onClose();
                              }}
                              className="px-3 py-1 rounded bg-blue-600 font-black text-white hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
                            >
                              <CreditCard className="w-2.5 h-2.5" />
                              <span>{lang === 'zh' ? '去支付' : 'Pay Now'}</span>
                            </button>
                          </>
                        )}

                        {(isCompleted || isCancelled) && (
                          <button
                            onClick={() => {
                              // Deep re-booking, trigger search details again
                              onDetail && onDetail(order);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg border border-blue-150 text-blue-600 hover:bg-blue-50/30 font-bold transition-all flex items-center gap-1 active:scale-95"
                          >
                            <RefreshCw className="w-2.5 h-2.5 shrink-0" />
                            <span>{lang === 'zh' ? '再次预订' : 'Book Again'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
