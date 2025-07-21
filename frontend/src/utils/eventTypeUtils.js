/**
 * Utility functions for EventType translations
 * This ensures consistent Vietnamese translations across all components
 */

// Centralized EventType mapping to Vietnamese
export const EVENT_TYPE_TRANSLATIONS = {
  INJURY: 'Chấn thương',
  FALLS: 'Ngã, té',
  CUTS_WOUNDS: 'Vết cắt, vết thương',
  BURNS: 'Bỏng',
  SPRAINS: 'Bong gân',
  ILLNESS: 'Bệnh tật',
  FEVER: 'Sốt',
  HEADACHE: 'Đau đầu',
  STOMACH_ACHE: 'Đau bụng',
  NAUSEA_VOMITING: 'Buồn nôn, nôn',
  ALLERGIC_REACTION: 'Phản ứng dị ứng',
  FOOD_ALLERGY: 'Dị ứng thức ăn',
  SKIN_ALLERGY: 'Dị ứng da',
  RESPIRATORY: 'Khó thở, hen suyễn',
  NOSE_BLEED: 'Chảy máu cam',
  FAINTING: 'Ngất xíu',
  SEIZURE: 'Co giật',
  EMERGENCY: 'Cấp cứu',
  OTHER: 'Khác'
};

// Array format for dropdowns/selects
export const EVENT_TYPES = [
  { value: 'INJURY', label: 'Chấn thương' },
  { value: 'FALLS', label: 'Ngã, té' },
  { value: 'CUTS_WOUNDS', label: 'Vết cắt, vết thương' },
  { value: 'BURNS', label: 'Bỏng' },
  { value: 'SPRAINS', label: 'Bong gân' },
  { value: 'ILLNESS', label: 'Bệnh tật' },
  { value: 'FEVER', label: 'Sốt' },
  { value: 'HEADACHE', label: 'Đau đầu' },
  { value: 'STOMACH_ACHE', label: 'Đau bụng' },
  { value: 'NAUSEA_VOMITING', label: 'Buồn nôn, nôn' },
  { value: 'ALLERGIC_REACTION', label: 'Phản ứng dị ứng' },
  { value: 'FOOD_ALLERGY', label: 'Dị ứng thức ăn' },
  { value: 'SKIN_ALLERGY', label: 'Dị ứng da' },
  { value: 'RESPIRATORY', label: 'Khó thở, hen suyễn' },
  { value: 'NOSE_BLEED', label: 'Chảy máu cam' },
  { value: 'FAINTING', label: 'Ngất xíu' },
  { value: 'SEIZURE', label: 'Co giật' },
  { value: 'EMERGENCY', label: 'Cấp cứu' },
  { value: 'OTHER', label: 'Khác' }
];

/**
 * Get Vietnamese display text for event type
 * @param {string} eventType - The event type enum value
 * @returns {string} Vietnamese display text
 */
export const getEventTypeText = (eventType) => {
  return EVENT_TYPE_TRANSLATIONS[eventType] || eventType || 'Không có';
};

/**
 * Get event type options for form dropdowns
 * @returns {Array} Array of {value, label} objects for dropdowns
 */
export const getEventTypeOptions = () => {
  return EVENT_TYPES;
};
