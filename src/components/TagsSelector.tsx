import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { 
  Check, Star, Wallet, Waves, Coffee, RefreshCcw, 
  Car, Dumbbell, Bath, Baby, Building, Train, Briefcase,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface TagItem {
  label: string;
  icon: string;
}

interface TagGroup {
  category: string;
  tags: TagItem[];
}

interface TagsSelectorProps {
  groups: TagGroup[];
  onConfirm: (selected: string[]) => void;
}

const IconMap: Record<string, React.ElementType> = {
  Star, Wallet, Waves, Coffee, RefreshCcw, Car, Dumbbell, Bath, Baby, Building, Train, Briefcase
};

const tagTranslations: Record<string, string> = {
  // categories
  '星级/价格': 'Rating / Price',
  '设施/服务': 'Amenities / Services',
  '特色/人群': 'Features / Guests',
  // tags
  '五星级': '5 Star',
  '四星级': '4 Star',
  '经济型': 'Budget',
  '泳池': 'Pool',
  '含早餐': 'Breakfast Included',
  '可免费取消': 'Free Cancellation',
  '免费停车': 'Free Parking',
  '健身房': 'Gym',
  '浴缸': 'Bathtub',
  '亲子酒店': 'Kid-Friendly',
  '江景房': 'River View',
  '近地铁': 'Near Subway',
  '商务出行': 'Business'
};

export function TagsSelector({ groups, onConfirm }: TagsSelectorProps) {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});
  const [isOverallCollapsed, setIsOverallCollapsed] = useState(false);

  const toggleTag = (tag: string) => {
    if (confirmed) return;
    setSelected(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0 || confirmed) return;
    setConfirmed(true);
    setIsOverallCollapsed(true);
    onConfirm(selected);
  };

  const toggleGroup = (idx: number) => {
    setCollapsedGroups(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getLabel = (lbl: string) => {
    if (lang === 'zh') return lbl;
    return tagTranslations[lbl] || lbl;
  };

  return (
    <div className="mt-3 bg-white p-3 rounded-xl border border-gray-100 w-full">
      <button 
        onClick={() => setIsOverallCollapsed(!isOverallCollapsed)}
        className="w-full text-xs text-gray-500 mb-1 flex flex-wrap gap-x-2 gap-y-1 justify-between items-center hover:text-gray-700 focus:outline-none"
      >
        <span className="font-medium text-gray-600 text-left flex-1 min-w-[150px]">
          {lang === 'zh' ? '请选择您的偏好' : 'Please select your preferences'}{' '}
          {selected.length > 0 && (lang === 'zh' ? `(已选${selected.length}项)` : `(${selected.length} selected)`)}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="opacity-80">{lang === 'zh' ? '可多选' : 'Multi-select'}</span>
          {isOverallCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </button>
      
      {!isOverallCollapsed && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto scrollbar-hide pb-1 pr-1 mt-2">
            {groups.map((group, groupIdx) => {
              const isCollapsed = collapsedGroups[groupIdx];
              return (
              <div key={groupIdx}>
                <button 
                   onClick={() => toggleGroup(groupIdx)}
                   className="flex justify-between items-center w-full text-[12px] font-bold text-gray-500 py-1.5 focus:outline-none hover:text-gray-700 transition-colors"
                >
                  <span>{getLabel(group.category)}</span>
                  {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
                {!isCollapsed && (
                <div className="flex flex-wrap gap-2 mt-1 mb-2 animate-in fade-in zoom-in-95 duration-200">
                  {group.tags.map((tagItem, i) => {
                    const isSelected = selected.includes(tagItem.label);
                    const Icon = IconMap[tagItem.icon];
                    return (
                      <button 
                        key={i} 
                        onClick={() => toggleTag(tagItem.label)}
                        disabled={confirmed}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 border",
                          isSelected 
                            ? "bg-blue-50 text-blue-600 border-blue-200" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
                          confirmed && !isSelected && "opacity-50 blur-[1px]",
                          confirmed && isSelected && "ring-2 ring-blue-100 border-blue-300"
                        )}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : Icon ? (
                          <Icon className="w-3.5 h-3.5 opacity-60" />
                        ) : null}
                        {getLabel(tagItem.label)}
                      </button>
                    )
                  })}
                </div>
                )}
              </div>
            )})}
          </div>
          {!confirmed && selected.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button 
                onClick={handleConfirm}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow transition-all active:scale-95"
              >
                {lang === 'zh' ? `确认选中的 ${selected.length} 项` : `Confirm ${selected.length} Selected`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
