import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ChevronRight, CheckCircle2, CreditCard, Wallet, Coins } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

interface AlipayCashierProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  hotelName: string;
  roomName: string;
  dates: string;
  onPaymentSuccess: () => void;
}

const PAYMENT_METHODS = [
  { id: 'yuebao', name: '余额宝', desc: '理财收益不中断 · 推荐', icon: Coins, color: 'text-orange-500' },
  { id: 'balance', name: '账户余额', desc: '剩 1,280.00 元', icon: Wallet, color: 'text-blue-500' },
  { id: 'cmb', name: '招商银行信用卡', desc: '尾号 8888 · 单笔10万免息', icon: CreditCard, color: 'text-red-500' },
  { id: 'ccb', name: '建设银行借记卡', desc: '尾号 9921 · 免收手续费', icon: CreditCard, color: 'text-blue-700' }
];

export function AlipayCashier({
  isOpen,
  onClose,
  amount,
  hotelName,
  roomName,
  dates,
  onPaymentSuccess
}: AlipayCashierProps) {
  const { lang } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [payState, setPayState] = useState<'idle' | 'processing' | 'success'>('idle');

  // Format currency
  const formatAmount = (val: string) => {
    const num = parseFloat(val.replace(/,/g, ''));
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handlePay = () => {
    setPayState('processing');
    setTimeout(() => {
      setPayState('success');
      setTimeout(() => {
        onPaymentSuccess();
        // Reset state after closure
        setTimeout(() => {
          setPayState('idle');
          setShowMethodSelector(false);
        }, 300);
      }, 1500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden font-sans select-none">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          exit={{ opacity: 0 }}
          onClick={payState === 'idle' ? onClose : undefined}
          className="absolute inset-0 bg-black/70 backdrop-blur-3xs"
        />

        {/* Sliding Main Casher Sheet Panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-[#f6f6f9] rounded-t-[24px] max-w-full w-full min-h-[460px] max-h-[92%] flex flex-col overflow-hidden text-gray-800 shadow-2xl pb-safe"
        >
          {payState === 'success' ? (
            /* ================= 3. Payment Success Page ================= */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-white"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-11 h-11 text-emerald-500 animate-[bounce_1s_infinite]" />
              </div>
              <h2 className="text-[19px] font-extrabold text-gray-900 leading-none">
                {lang === 'zh' ? '支付成功' : 'Payment Successful'}
              </h2>
              <div className="flex items-baseline gap-0.5 mt-4 text-[#ff5000] font-sans">
                <span className="text-[16px] font-bold">¥</span>
                <span className="text-[34px] font-black tracking-tight leading-none">
                  {formatAmount(amount)}
                </span>
              </div>
              <p className="text-[12px] text-gray-400 mt-5 font-medium max-w-[220px] text-center leading-relaxed">
                {lang === 'zh' 
                  ? '收款方：RollingGo · 正在为您确认房型，请稍后'
                  : 'Payee: RollingGo · Confirming room with hotel...'}
              </p>
            </motion.div>
          ) : (
            <>
              {/* ================= 1. Header ================= */}
              <div className="px-5 py-4 border-b border-gray-150/50 bg-white flex items-center justify-between">
                <button 
                  type="button"
                  onClick={payState === 'idle' ? onClose : undefined}
                  className="p-1 -ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={payState !== 'idle'}
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 justify-center">
                  <div className="bg-[#1677ff] p-0.5 rounded-sm flex items-center justify-center">
                    <span className="text-white text-[10px] leading-none px-0.5 font-bold">支</span>
                  </div>
                  <span className="font-bold text-[15px] text-gray-900">
                    {lang === 'zh' ? '支付宝收银台' : 'Alipay Cashier'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#00b373] text-[10px] font-bold">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'zh' ? '安全合作' : 'Secure'}</span>
                </div>
              </div>

              {/* ================= 2. Body Details ================= */}
              <div className="flex-1 overflow-y-auto px-5 py-4.5 space-y-4">
                
                {/* Large Amount view */}
                <div className="flex flex-col items-center justify-center py-4 bg-white rounded-2xl border border-gray-100/50 shadow-3xs">
                  <span className="text-[12px] text-gray-400 font-medium">
                    {lang === 'zh' ? '订单需付总额' : 'Amount Due'}
                  </span>
                  <div className="flex items-baseline gap-0.5 mt-2 text-gray-900 font-sans">
                    <span className="text-[18px] font-bold">¥</span>
                    <span className="text-[34px] font-black tracking-tight leading-none text-gray-900">
                      {formatAmount(amount)}
                    </span>
                  </div>
                </div>

                {/* Info Card List */}
                <div className="bg-white rounded-2xl border border-gray-100/50 p-4 space-y-3.5 shadow-3xs text-left">
                  
                  {/* Order info cell */}
                  <div className="flex items-start justify-between gap-4 py-0.5">
                    <span className="text-[12.5px] text-gray-400 font-bold shrink-0">
                      {lang === 'zh' ? '订单信息' : 'Order Details'}
                    </span>
                    <span className="text-[12.5px] text-gray-800 font-extrabold text-right line-clamp-2 leading-snug">
                      {hotelName} · {roomName}
                    </span>
                  </div>

                  <div className="h-[1px] bg-gray-100 w-full" />

                  {/* Dates cell */}
                  <div className="flex items-start justify-between gap-4 py-0.5">
                    <span className="text-[12.5px] text-gray-400 font-bold shrink-0">
                      {lang === 'zh' ? '入住时间' : 'Check-in stay'}
                    </span>
                    <span className="text-[12.5px] text-gray-800 font-bold text-right">
                      {dates}
                    </span>
                  </div>

                  <div className="h-[1px] bg-gray-100 w-full" />

                  {/* Payment method selector triggers */}
                  <div 
                    onClick={() => payState === 'idle' && setShowMethodSelector(true)}
                    className="flex items-center justify-between py-1 hover:bg-gray-50/50 -mx-1 px-1 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="text-[12.5px] text-gray-400 font-bold shrink-0">
                      {lang === 'zh' ? '付款方式' : 'Payment Method'}
                    </span>
                    <div className="flex items-center gap-2">
                      <selectedMethod.icon className={cn("w-4.5 h-4.5 shrink-0", selectedMethod.color)} />
                      <div className="flex flex-col text-right leading-none gap-0.5">
                        <span className="text-[12.5px] font-extrabold text-gray-800">{selectedMethod.name}</span>
                        <span className="text-[9.5px] text-gray-400 font-medium">{selectedMethod.desc}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>

                </div>

                {/* Hint banner */}
                <div className="text-[11px] text-gray-400 flex items-center gap-1.5 justify-center py-1 mt-1 bg-gray-100/50 rounded-xl leading-none font-medium">
                  <Shield className="w-3 h-3 text-[#1677ff] shrink-0" />
                  <span>{lang === 'zh' ? '支付宝端内官方安全收银保障' : 'Alipay official payment safety guaranteed'}</span>
                </div>

              </div>

              {/* ================= 4. Footer Pay Button ================= */}
              <div className="p-5 bg-white border-t border-gray-150/50 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={payState !== 'idle'}
                  className="w-full py-3.5 rounded-full bg-[#1677ff] disabled:bg-[#1677ff]/60 hover:bg-[#005ee0] active:scale-[0.98] text-white text-[15.5px] font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
                >
                  {payState === 'processing' ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{lang === 'zh' ? '支付处理中...' : 'Processing Payment...'}</span>
                    </div>
                  ) : (
                    <span>{lang === 'zh' ? '立即付款' : 'Pay Now'}</span>
                  )}
                </button>
              </div>
            </>
          )}

          {/* ================= 5. Sliding Selection Sheet for payment methods ================= */}
          <AnimatePresence>
            {showMethodSelector && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMethodSelector(false)}
                  className="absolute inset-0 bg-black"
                />
                
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="relative bg-white rounded-t-2xl max-h-[75%] flex flex-col overflow-hidden text-gray-800 pb-safe"
                >
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-extrabold text-[14.5px] text-gray-900">
                      {lang === 'zh' ? '选择付款方式' : 'Choose Payment Method'}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowMethodSelector(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto py-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div
                          key={method.id}
                          onClick={() => {
                            setSelectedMethod(method);
                            setShowMethodSelector(false);
                          }}
                          className={cn(
                            "flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors border-b border-gray-50",
                            selectedMethod.id === method.id && "bg-blue-50/20"
                          )}
                        >
                          <div className="flex items-center gap-3 text-left">
                            <Icon className={cn("w-5 h-5 shrink-0", method.color)} />
                            <div className="flex flex-col leading-none gap-1">
                              <span className="text-[13.5px] font-bold text-gray-800">{method.name}</span>
                              <span className="text-[10px] text-gray-400 font-medium">{method.desc}</span>
                            </div>
                          </div>
                          {selectedMethod.id === method.id && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
