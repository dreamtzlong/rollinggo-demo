import { MapPin, Star } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

export function SearchCard({ hotel, onDetail, onSelect }: any) {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full w-full">
      <div className="w-full h-32 shrink-0 bg-gray-100 relative">
        <img src={hotel.cover} alt={hotel.name} className="w-full h-full object-cover rounded-t-xl absolute inset-0" />
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-gray-900 truncate">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <span>{hotel.brand}</span>
            <span>·</span>
            <span className="flex items-center text-orange-400">
              {Array.from({length: hotel.starRating}).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
            </span>
          </div>
        </div>
        
        <div className="text-sm flex items-center">
          <span className="font-bold text-blue-600">{hotel.reviewScore}</span>
          <span className="text-blue-600 font-medium ml-1">{hotel.reviewText}</span>
          <span className="text-gray-500 text-xs ml-1">· {hotel.reviewCount}{lang === 'zh' ? '条评价' : ' reviews'}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <MapPin className="w-3 h-3 text-blue-500" />
          <span>{hotel.distanceText}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {hotel.amenities.map((am: string, i: number) => (
            <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">{am}</span>
          ))}
        </div>
        
        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-black leading-none">¥{hotel.price}<span className="text-xs font-normal text-gray-500 ml-0.5">{lang === 'zh' ? '起/晚' : ' up / night'}</span></div>
            <div className="text-[10px] text-gray-400 mt-1">{t('recheckPriceHint')}</div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <button onClick={() => onDetail(hotel.id)} className="flex-1 py-1.5 rounded-lg border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">{t('viewDetails')}</button>
          <button onClick={() => onSelect(hotel.id)} className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">{t('selectHotelBtn')}</button>
        </div>
      </div>
    </div>
  );
}
