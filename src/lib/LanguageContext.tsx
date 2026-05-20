import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Header & Info
    appName: 'RollingGo',
    appDesc: 'AI酒店预订演示',
    toolCall: '已调用',
    inputPlaceholder: '告诉我想找什么样的酒店，比如\'外滩五星\'...',
    confirmText: '确认',
    selectedTagsLabel: '我需要：',
    searchResultPrefix: '找到 10 家符合条件的酒店，为您推荐：',
    ratesPrefix: '有以下房型：',
    ratesRoomLeft: '仅剩 {num} 间',
    ratesBookBtn: '预订此房',
    detailsSubTabOverview: '概览',
    detailsSubTabAmenities: '设施',
    detailsSubTabReviews: '评价',
    detailsSubTabPolicies: '政策与人群',
    detailsHotelAmenities: '── 酒店设施 ──',
    detailsRoomAmenities: '── 房间设施 ──',
    detailsReviewHighlights: '👍 亮点',
    detailsReviewConcerns: '👎 注意',
    detailsCheckInPolicy: '── 入住政策 ──',
    detailsTargetGuests: '── 适用人群 ──',
    detailsBookBtn: '选这家看房型',
    checkInTime: '入住 14:00 后',
    checkOutTime: '离店 12:00 前',
    kidFriendly: '12岁以下儿童与父母同住免费',
    nonSmoking: '全楼禁烟，设有指定吸烟区',
    noPets: '不可携带宠物',
    creditCardRequired: '入住时可能需预授权信用卡作押金',
    viewDetails: '查看详情',
    selectHotelBtn: '选这家',
    recheckPriceHint: '展示价，下单前重新确认',
    baseRate: '基础房费',
    taxAndService: '税费与服务费',
    priceLocked: '价格已锁定',
    totalPrice: '总价',
    bookNowBtn: '立即预订',
    paymentMethodLabel: '支付方式：',
    timeoutPaymentHint: '提交订单后请在30分钟内完成支付',
    fillGuestDetailTitle: '填写入住人信息',
    guestNameLabel: '住客姓名',
    phoneLabel: '联系电话',
    emailLabel: '联系邮箱',
    specialReqLabel: '特殊需求（选填）',
    specialReqPlaceholder: '如：高楼层、安静房间',
    agreeToTermsLabel: '我已阅读并同意',
    bookingTerms: '《预订条款》',
    privacyPolicy: '《隐私政策》',
    submitOrderBtn: '提交订单',
    unpaidLabel: '待支付',
    payableAmountLabel: '应付金额',
    payAlipayBtn: '支付宝支付',
    orderExpiryLabel: '订单保留至 {time}',
    payInstsLabel: '点击上方按钮跳转支付宝完成支付，支付成功后请点击下方告知我。',
    payConfirmBtn: '我已完成支付',
    cancelOrderBtn: '取消订单',
    bookSuccessTitle: '预订成功！',
    bookSuccessSubtitle: '感谢您的预订，酒店已确认订单',
    voucherLabel: '入住凭证号',
    voucherInstLabel: '到店后请出示此号码与身份证件',
    checkInLabel: '入住',
    checkOutLabel: '离店',
    roomTypeLabel: '房型',
    paidLabel: '已支付',
    orderDetailsBtn: '订单详情',
    invoiceBtn: '预订发票',
    orderStatusConfirmed: '🟢 已确认 · 待入住',
    orderStatusCompleted: '⚪ 已完成',
    orderNumberLabel: '订单',
    confirmationCodeLabel: '确认号',
    orderChecked: '为您查找到以下订单：',
    orderCancelSuccess: '✅ 订单已取消\n\n退款金额：¥1,760\n退款将在3-5个工作日原路退回',
    searchRecommend: '找到一些符合条件的酒店，为您推荐：',
    initialUserMsg: '我想订上海外滩附近的酒店',
    initialAiMsg: '上海外滩附近有不少好酒店，您关心哪些方面？'
  },
  en: {
    // Header & Info
    appName: 'RollingGo',
    appDesc: 'AI Hotel Booking Demo',
    toolCall: 'Called',
    inputPlaceholder: 'Search for hotels, e.g. \'Bund 5 star\'...',
    confirmText: 'Confirm',
    selectedTagsLabel: 'I need: ',
    searchResultPrefix: 'Found 10 matching hotels, here are our recommendations:',
    ratesPrefix: ' offers the following room types:',
    ratesRoomLeft: 'Only {num} rooms left',
    ratesBookBtn: 'Book Now',
    detailsSubTabOverview: 'Overview',
    detailsSubTabAmenities: 'Amenities',
    detailsSubTabReviews: 'Reviews',
    detailsSubTabPolicies: 'Policies',
    detailsHotelAmenities: '── Hotel Amenities ──',
    detailsRoomAmenities: '── Room Amenities ──',
    detailsReviewHighlights: '👍 Highlights',
    detailsReviewConcerns: '👎 Notice',
    detailsCheckInPolicy: '── Check-in Policies ──',
    detailsTargetGuests: '── For Guests ──',
    detailsBookBtn: 'View Room Types',
    checkInTime: 'Check-in after 14:00',
    checkOutTime: 'Check-out before 12:00',
    kidFriendly: 'Free stay for kids under 12 occupying parent\'s room',
    nonSmoking: 'Non-smoking building with designated outdoor smoking areas',
    noPets: 'Pets are not allowed',
    creditCardRequired: 'Credit card pre-authorization may be required at check-in',
    viewDetails: 'Details',
    selectHotelBtn: 'Select',
    recheckPriceHint: 'Estimated price, will re-verify before booking',
    baseRate: 'Base Rate',
    taxAndService: 'Tax & Service Fees',
    priceLocked: 'Price Locked',
    totalPrice: 'Total',
    bookNowBtn: 'Book Instantly',
    paymentMethodLabel: 'Payment Method: ',
    timeoutPaymentHint: 'Please complete payment within 30 minutes after submission',
    fillGuestDetailTitle: 'Guest Information',
    guestNameLabel: 'Guest Name',
    phoneLabel: 'Phone Number',
    emailLabel: 'Email Address',
    specialReqLabel: 'Special Requests (Optional)',
    specialReqPlaceholder: 'e.g., high floor, quiet room',
    agreeToTermsLabel: 'I have read and agree to ',
    bookingTerms: 'Booking Terms',
    privacyPolicy: 'Privacy Policy',
    submitOrderBtn: 'Submit Order',
    unpaidLabel: 'Pending Payment',
    payableAmountLabel: 'Payable Amount',
    payAlipayBtn: 'Pay with Alipay',
    orderExpiryLabel: 'Order kept until {time}',
    payInstsLabel: 'Click the button above to pay via Alipay, then click "I have completed payment" below.',
    payConfirmBtn: 'I Have Paid',
    cancelOrderBtn: 'Cancel Order',
    bookSuccessTitle: 'Booking Successful!',
    bookSuccessSubtitle: 'Thank you for your booking. The hotel has confirmed your stay.',
    voucherLabel: 'Voucher Number',
    voucherInstLabel: 'Please present this number and ID card upon checking in',
    checkInLabel: 'Check-in',
    checkOutLabel: 'Check-out',
    roomTypeLabel: 'Room Type',
    paidLabel: 'Paid',
    orderDetailsBtn: 'Order Details',
    invoiceBtn: 'Invoice',
    orderStatusConfirmed: '🟢 Confirmed · Standard',
    orderStatusCompleted: '⚪ Completed',
    orderNumberLabel: 'Booking',
    confirmationCodeLabel: 'Confirmation',
    orderChecked: 'Found the following bookings for you:',
    orderCancelSuccess: '✅ Order has been cancelled\n\nRefund amount: ¥1,760\nRefund will return to original payment method in 3-5 business days',
    searchRecommend: 'Found some matching hotels for you:',
    initialUserMsg: 'I want to book a hotel near the Bund, Shanghai',
    initialAiMsg: 'There are several great hotels near the Bund, Shanghai. What preferences do you care about?'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
