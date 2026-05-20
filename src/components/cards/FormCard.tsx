import React, { useState } from 'react';
import { PenLine } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

export function FormCard({ onSubmit }: any) {
  const [agreed, setAgreed] = useState(true);
  const { lang, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) onSubmit();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <div className="bg-blue-50 px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <PenLine className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-blue-900 text-sm">{t('fillGuestDetailTitle')}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('guestNameLabel')} <span className="text-red-500">*</span></label>
            <input type="text" defaultValue={lang === 'zh' ? '张三' : 'John Doe'} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('phoneLabel')} <span className="text-red-500">*</span></label>
            <input type="tel" defaultValue="+86 13800001111" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('emailLabel')} <span className="text-red-500">*</span></label>
            <input type="email" defaultValue="johndoe@email.com" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50" required />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t('specialReqLabel')}</label>
            <input type="text" placeholder={t('specialReqPlaceholder')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
        </div>
        
        <label className="flex items-start gap-2 mt-2 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" />
          <span className="text-xs text-gray-500 select-none">
            {t('agreeToTermsLabel')} <a href="#" className="text-blue-600">{t('bookingTerms')}</a> {lang === 'zh' ? '和' : 'and'} <a href="#" className="text-blue-600">{t('privacyPolicy')}</a>
          </span>
        </label>
        
        <button type="submit" disabled={!agreed} className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {t('submitOrderBtn')}
        </button>
      </form>
    </div>
  );
}
