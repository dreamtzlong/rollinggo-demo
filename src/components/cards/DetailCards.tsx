import { MapPin, Star, Plane, Train, CheckCircle2, AlertCircle, Baby, CigaretteOff, PawPrint, CreditCard, Users, Bed, Anchor, Coffee, Wifi, Dumbbell, Car, PlayCircle, Plus } from 'lucide-react';
import { HorizontalScroller } from '../HorizontalScroller';
import { useLanguage } from '../../lib/LanguageContext';

export function DetailCardGroup({ hotel, onSelectRoom }: any) {
  const { lang, t } = useLanguage();

  return (
    <HorizontalScroller className="items-stretch">
      {/* Subcard 1: Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col gap-3">
        <div className="text-sm font-bold border-b border-gray-100 pb-2 text-center text-gray-500">
          {t('detailsSubTabOverview')}
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-1 rounded-lg overflow-hidden h-32">
          <img src={hotel.photos[0]} className="col-span-2 row-span-2 w-full h-full object-cover" alt="" />
          <img src={hotel.photos[1]} className="w-full h-full object-cover" alt="" />
          <img src={hotel.photos[2]} className="w-full h-full object-cover relative" alt="" />
        </div>
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
        <div className="flex items-start gap-1 text-xs text-gray-600">
          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>{hotel.address}</span>
        </div>
        <div className="text-xs text-gray-600 line-clamp-3">
          {hotel.description}
        </div>
        <div className="mt-auto space-y-1">
          {hotel.transportTips.map((tip: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-1.5 rounded">
              {tip.type === 'train' ? <Train className="w-3.5 h-3.5 text-gray-400" /> : <Plane className="w-3.5 h-3.5 text-gray-400" />}
              <span className="truncate">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subcard 2: Amenities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide">
        <div className="text-sm font-bold border-b border-gray-100 pb-2 text-center text-gray-500">
          {t('detailsSubTabAmenities')}
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2 font-medium">{t('detailsHotelAmenities')}</div>
          <div className="grid grid-cols-2 gap-2">
            {hotel.amenities.hotelLevel.map((am: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 p-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="truncate">{am}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-2 font-medium">{t('detailsRoomAmenities')}</div>
          <div className="grid grid-cols-2 gap-2">
            {hotel.amenities.roomLevel.map((am: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 p-1.5 rounded">
                <Bed className="w-3.5 h-3.5 text-green-500" />
                <span className="truncate">{am}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subcard 3: Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col gap-3">
        <div className="text-sm font-bold border-b border-gray-100 pb-2 text-center text-gray-500">
          {t('detailsSubTabReviews')}
        </div>
        <div className="flex items-end gap-2 border-b border-gray-50 pb-3">
          <span className="text-3xl font-bold text-blue-600 leading-none">{hotel.reviewScore}</span>
          <span className="text-blue-600 font-medium">{hotel.reviewText}</span>
        </div>
        
        <div className="space-y-1.5 text-xs">
          {hotel.dimensionScores.map((dim: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-10 text-gray-600 text-right">{dim.name}</span>
              <span className="w-6 text-gray-800 font-medium">{dim.score}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(dim.score / 10) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
            <span>{t('detailsReviewHighlights')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {hotel.highlights.map((h: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-100 text-[10px] rounded">{h}</span>
            ))}
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
            <span>{t('detailsReviewConcerns')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {hotel.concerns.map((c: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 text-[10px] rounded">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Subcard 4: Policies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col gap-3">
        <div className="text-sm font-bold border-b border-gray-100 pb-2 text-center text-gray-500">
          {t('detailsSubTabPolicies')}
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="text-xs text-gray-500 mb-2 font-medium">{t('detailsCheckInPolicy')}</div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <span className="mt-0.5">🕐</span>
              <span>{lang === 'zh' ? '入住 14:00 / 退房 12:00' : 'Check-in 14:00 / Check-out 12:00'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <Baby className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{t('kidFriendly')}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <CigaretteOff className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" />
              <span>{t('nonSmoking')}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <PawPrint className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" />
              <span>{t('noPets')}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <CreditCard className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>{t('creditCardRequired')}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 mb-2 font-medium">{t('detailsTargetGuests')}</div>
          <div className="flex flex-wrap gap-1">
            {hotel.suitableFor.map((s: string, i: number) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs rounded-full">
                <Users className="w-3 h-3 text-blue-500" /> {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-2">
          <button onClick={() => onSelectRoom(hotel.id)} className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            {t('detailsBookBtn')}
          </button>
        </div>
      </div>
    </HorizontalScroller>
  );
}
