/**
 * Utility functions for SeverityLevel translations
 * This ensures consistent Vietnamese translations across all components
 */

// Centralized SeverityLevel mapping to Vietnamese
// This matches the backend enum display names
export const SEVERITY_LEVEL_TRANSLATIONS = {
  MINOR: 'Nhẹ',
  MODERATE: 'Trung bình', 
  SERIOUS: 'Nặng',
  MAJOR: 'Nặng',  // Alternative name used in some components
  CRITICAL: 'Cấp cứu'
};

// Array format for dropdowns/selects
export const SEVERITY_LEVELS = [
  { value: 'MINOR', label: 'Nhẹ' },
  { value: 'MODERATE', label: 'Trung bình' },
  { value: 'MAJOR', label: 'Nặng' },
  { value: 'CRITICAL', label: 'Cấp cứu' }
];

/**
 * Get Vietnamese display text for severity level
 * @param {string} severityLevel - The severity level enum value
 * @returns {string} Vietnamese display text
 */
export const getSeverityLevelText = (severityLevel) => {
  return SEVERITY_LEVEL_TRANSLATIONS[severityLevel] || severityLevel || 'Không có';
};

/**
 * Get severity level options for form dropdowns
 * @returns {Array} Array of {value, label} objects for dropdowns
 */
export const getSeverityLevelOptions = () => {
  return SEVERITY_LEVELS;
};
