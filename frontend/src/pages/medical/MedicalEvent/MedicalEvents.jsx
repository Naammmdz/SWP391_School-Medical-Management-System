import React, { useState, useEffect } from 'react';
import './MedicalEvents.css';
import MedicalEventService from '../../../services/MedicalEventService';
import studentService from '../../../services/StudentService';
import StudentSelectionModal from '../../../components/StudentSelectionModal';
import InventoryService from '../../../services/InventoryService';
import { getSeverityLevelText, getSeverityLevelOptions } from '../../../utils/severityLevelUtils';
import { getEventTypeText, getEventTypeOptions } from '../../../utils/eventTypeUtils';

// Get severity levels from centralized utility
const SEVERITY_LEVELS = getSeverityLevelOptions();

const MEDICAL_EVENT_STATUS = [
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'RESOLVED', label: 'Đã xử lý' }
];

// Get event types from centralized utility
const EVENT_TYPES = getEventTypeOptions();

const MedicalEvents = () => {
  // Helper functions for enum translation - now using centralized utility

  const getStatusText = (status) => {
    switch (status) {
      case 'PROCESSING': return 'Đang xử lý';
      case 'RESOLVED': return 'Đã xử lý';
      default: return status || 'Không có';
    }
  };
  
  // Helper function to get event type display text - now using centralized utility

  // Helper function to translate inventory status to Vietnamese
  const getInventoryStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động';
      case 'INACTIVE': return 'Không hoạt động';
      case 'EXPIRED': return 'Hết hạn';
      case 'DAMAGED': return 'Hư hỏng';
      default: return status || 'Không có';
    }
  };

  // State cho danh sách sự cố y tế
  const [medicalEvents, setMedicalEvents] = useState([]);
  // State cho thông tin học sinh
  const [studentsInfo, setStudentsInfo] = useState({});
  // State cho inventory items used
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState([]);
  const [inventoryUsageLogs, setInventoryUsageLogs] = useState([]);
  // Helper function to get current datetime in datetime-local format
  const getCurrentDateTime = () => {
    const now = new Date();
    // Adjust for local timezone
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return localDate.toISOString().slice(0, 16);
  };
  
  // State cho form thêm/sửa sự cố - matching backend DTO
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    title: '',
    stuId: [], // Array of student IDs
    eventType: '',
    eventDate: getCurrentDateTime(), // datetime-local format
    location: '',
    description: '',
    relatedItemUsed: [], // Array of InventoryUsedInMedicalEventRequestDTO objects
    notes: '',
    handlingMeasures: '',
    severityLevel: 'MINOR',
    status: 'PROCESSING'
  });

  // State for student selection
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [studentSelectionModalOpen, setStudentSelectionModalOpen] = useState(false);
  const [resetStudentModal, setResetStudentModal] = useState(false);
  const [editing, setEditing] = useState(false);
  // State cho hiển thị modal
  const [modalOpen, setModalOpen] = useState(false);

  // State for inventory search modal
  const [inventorySearchModalOpen, setInventorySearchModalOpen] = useState(false);
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [filteredInventoryItems, setFilteredInventoryItems] = useState([]);
  // State cho loading
  const [loading, setLoading] = useState(false);
  // State cho lọc và tìm kiếm - matching MedicalEventsFiltersRequestDTO
  const [filters, setFilters] = useState({
    stuId: null,
    from: null,
    to: null,
    createdBy: null,
    status: null
  });

  // Additional UI-only filters
  const [uiFilters, setUIFilters] = useState({
    searchTerm: '',
    fromDate: '',
    toDate: ''
  });

  // Track if filters are active
  const [isFiltering, setIsFiltering] = useState(false);
  
  // State for custom event type
  const [customEventType, setCustomEventType] = useState('');
  const [showCustomEventType, setShowCustomEventType] = useState(false);

  // Hàm lấy thông tin học sinh theo ID
  const fetchStudentInfo = async (studentId) => {
    try {
      const response = await studentService.getStudentById(studentId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      return null;
    }
  };

  // Hàm lấy danh sách tất cả học sinh
  const fetchAllStudents = async () => {
    try {
      const response = await studentService.getAllStudents();
      if (response.data && Array.isArray(response.data)) {
        setAvailableStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Hàm lấy danh sách lớp
  const fetchAvailableClasses = async () => {
    try {
      const response = await studentService.getDistinctClassNames();
      if (response.data && Array.isArray(response.data)) {
        const classOptions = response.data.map(className => ({
          id: className,
          name: className
        }));
        setAvailableClasses(classOptions);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Không thể lấy danh sách lớp. Vui lòng thử lại.');
    }
  };


  // Hàm mở modal chọn học sinh
  const handleOpenStudentModal = () => {
    setStudentSelectionModalOpen(true);
  };

  // Hàm đóng modal chọn học sinh
  const handleCloseStudentModal = () => {
    setStudentSelectionModalOpen(false);
  };

  // Hàm xác nhận chọn học sinh
  const handleConfirmStudentSelection = (selectedIds, selectedStudentObjects) => {
    setCurrentEvent({...currentEvent, stuId: selectedIds});
    setSelectedStudents(selectedStudentObjects);
    setStudentSelectionModalOpen(false);
  };

  // Hàm xóa học sinh khỏi danh sách đã chọn
  const handleRemoveStudent = (studentId) => {
    const updatedStudentIds = currentEvent.stuId.filter(id => id !== studentId);
    setCurrentEvent({...currentEvent, stuId: updatedStudentIds});
    const updatedSelectedStudents = selectedStudents.filter(s => s.studentId !== studentId);
    setSelectedStudents(updatedSelectedStudents);
  };

  // Hàm gọi API để lấy danh sách sự cố y tế
  const fetchMedicalEvents = async (filterParams = null) => {
    setLoading(true);
    try {
      let response;

      // If filtering is active, use the filtered endpoints
      if (isFiltering || filterParams) {
        const filtersToUse = filterParams || filters;
        console.log('Fetching filtered medical events with filters:', filtersToUse);
        response = await MedicalEventService.searchMedicalEvents(filtersToUse);
      } else {
        console.log('Fetching all medical events');
        response = await MedicalEventService.getAllMedicalEvents();
      }

      console.log('API Response:', response.data); // Debug log

      if (response.data && Array.isArray(response.data)) {
         const severityOrder = {
      'CRITICAL': 1, // Ưu tiên cao nhất
      'SERIOUS': 2,
      'MODERATE': 3,
      'MINOR': 4      // Ưu tiên thấp nhất
    };

    // 2. Tạo bản sao của mảng để tránh thay đổi mảng gốc và thực hiện sắp xếp đa cấp
    const sortedEvents = [...response.data].sort((a, b) => {
      if (a.status === 'PROCESSING' && b.status !== 'PROCESSING') {
        return -1; // a lên trước b
      }
      if (a.status !== 'PROCESSING' && b.status === 'PROCESSING') {
        return 1; // b lên trước a
      }
       const severityA = severityOrder[a.severityLevel];
          const severityB = severityOrder[b.severityLevel];
      if (severityA !== severityB) {
        return severityA - severityB; // Sắp xếp theo số ưu tiên (1 -> 4)
      }


      

      // Ưu tiên 3: Sắp xếp theo ID giảm dần (cuối cùng)
      // Nếu cả mức độ và trạng thái đều giống nhau, sắp xếp theo ID
      return b.id - a.id;
    });
        setMedicalEvents(sortedEvents);

        console.log('Medical events sorted by ID (desc):', sortedEvents.map(e => e.id).join(', '));

        // Lấy thông tin học sinh cho tất cả các sự cố
        const studentIds = new Set();
        sortedEvents.forEach(event => {
          if (event.stuId && Array.isArray(event.stuId)) {
            event.stuId.forEach(id => studentIds.add(id));
          }
        });

        // Fetch thông tin học sinh
        const studentsData = {};
        for (const studentId of studentIds) {
          const studentInfo = await fetchStudentInfo(studentId);
          if (studentInfo) {
            studentsData[studentId] = studentInfo;
          }
        }
        setStudentsInfo(studentsData);
      } else {
        console.warn('API response is not an array:', response.data);
        setMedicalEvents([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medical events:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);

      let errorMessage = 'Failed to fetch medical events. Please try again.';

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        // Redirect to login page
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You need NURSE role to access medical events.';
      } else if (error.response?.status === 400) {
        // Bad request - likely invalid filter parameters
        const serverMessage = error.response?.data?.message || error.response?.data || 'Invalid filter parameters';
        errorMessage = `Invalid request: ${serverMessage}`;
        console.error('Server response data:', error.response?.data);
      } else if (error.response?.status === 500) {
        // Internal server error
        const serverMessage = error.response?.data?.message || error.response?.data || 'Internal server error';
        errorMessage = `Server error: ${serverMessage}`;
        console.error('Server response data:', error.response?.data);
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
        console.error('Network error - no response received:', error.request);
      }

      alert(errorMessage);

      setMedicalEvents([]);
      setLoading(false);
    }
  };

  // Hàm thêm sự cố y tế mới
  const addMedicalEvent = async (event) => {
    setLoading(true);
    try {
      // Transform inventory items to match backend DTO format
      const transformedInventoryItems = event.relatedItemUsed ? event.relatedItemUsed.map(item => ({
        itemId: item.inventoryId,
        quantityUsed: item.quantity,
        notes: item.notes || null
      })) : [];

      // Transform event data to match backend DTO
      const eventDTO = {
        title: event.title,
        stuId: event.stuId,
        eventType: event.eventType,
        eventDate: event.eventDate,
        location: event.location,
        description: event.description,
        relatedItemUsed: transformedInventoryItems,
        notes: event.notes,
        handlingMeasures: event.handlingMeasures,
        severityLevel: event.severityLevel,
        status: event.status
      };

      // Debug logging
      console.log('=== MEDICAL EVENT DEBUG ===');
      console.log('Original event data:', JSON.stringify(event, null, 2));
      console.log('Original inventory items:', event.relatedItemUsed);
      console.log('Transformed inventory items:', transformedInventoryItems);
      console.log('Sending Event DTO:', JSON.stringify(eventDTO, null, 2));
      console.log('Student IDs:', eventDTO.stuId);
      console.log('Event Date:', eventDTO.eventDate);
      console.log('Severity Level:', eventDTO.severityLevel);
      console.log('Status:', eventDTO.status);
      console.log('Related Items Used:', eventDTO.relatedItemUsed);

      const response = await MedicalEventService.createMedicalEvent(eventDTO);

      console.log('Medical event created successfully:', response.data);

      // Refresh the medical events list
      await fetchMedicalEvents();

      setModalOpen(false);
      resetCurrentEvent();
      setLoading(false);

      alert('Tạo sự cố y tế thành công!');

    } catch (error) {
      console.error('=== MEDICAL EVENT ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);

        // Try to extract detailed error message from response
        let serverMessage = 'Unknown server error';
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            serverMessage = error.response.data;
          } else if (error.response.data.message) {
            serverMessage = error.response.data.message;
          } else if (error.response.data.error) {
            serverMessage = error.response.data.error;
          }
        }

        console.error('Server error message:', serverMessage);

        let errorMessage = 'Không thể thêm sự cố y tế. Vui lòng thử lại.';

        if (error.response.status === 400) {
          errorMessage = `Lỗi dữ liệu không hợp lệ: ${serverMessage}`;
        } else if (error.response.status === 401) {
          errorMessage = 'Bạn cần đăng nhập lại để thực hiện thao tác này.';
          // Redirect to login
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
        } else if (error.response.status === 500) {
          errorMessage = `Lỗi máy chủ: ${serverMessage}`;
        }

        alert(errorMessage);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Có lỗi xảy ra khi chuẩn bị yêu cầu.');
      }

      setLoading(false);
    }
  };

  // Hàm reset form
  const resetCurrentEvent = () => {
    setCurrentEvent({
      id: null,
      title: '',
      stuId: [],
      eventType: '',
      eventDate: getCurrentDateTime(),
      location: '',
      description: '',
      relatedItemUsed: [],
      notes: '',
      handlingMeasures: '',
      severityLevel: 'MINOR',
      status: 'PROCESSING'
    });
    setSelectedStudents([]);
    setSelectedInventoryItems([]);
    setInventoryUsageLogs([]);
    // Reset custom event type states
    setCustomEventType('');
    setShowCustomEventType(false);
  };

  // Hàm cập nhật sự cố y tế
  const updateMedicalEvent = async (id, updatedEvent) => {
    setLoading(true);
    try {
      // Transform inventory items to match backend DTO format
      const transformedInventoryItems = updatedEvent.relatedItemUsed ? updatedEvent.relatedItemUsed.map(item => ({
        itemId: item.inventoryId || item.itemId,
        quantityUsed: item.quantity || item.quantityUsed,
        notes: item.notes || item.usageNote || null
      })) : [];

      // Transform event data to match backend DTO
      const eventDTO = {
        title: updatedEvent.title,
        stuId: updatedEvent.stuId,
        eventType: updatedEvent.eventType,
        eventDate: updatedEvent.eventDate,
        location: updatedEvent.location,
        description: updatedEvent.description,
        relatedItemUsed: transformedInventoryItems,
        notes: updatedEvent.notes,
        handlingMeasures: updatedEvent.handlingMeasures,
        severityLevel: updatedEvent.severityLevel,
        status: updatedEvent.status
      };

      console.log('=== UPDATING MEDICAL EVENT ===');
      console.log('Event ID:', id);
      console.log('Update data:', JSON.stringify(eventDTO, null, 2));

      // Call the API to update the medical event
      await MedicalEventService.updateMedicalEvent(id, eventDTO);

      console.log('Medical event updated successfully');

      // Refresh the medical events list
      await fetchMedicalEvents();

      setEditing(false);
      setModalOpen(false);
      resetCurrentEvent();
      setLoading(false);

      alert('Cập nhật sự cố y tế thành công!');

    } catch (error) {
      console.error('=== UPDATE MEDICAL EVENT ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        let errorMessage = 'Không thể cập nhật sự cố y tế. Vui lòng thử lại.';

        if (error.response.status === 400) {
          errorMessage = `Lỗi dữ liệu không hợp lệ: ${error.response.data.message || error.response.data}`;
        } else if (error.response.status === 401) {
          errorMessage = 'Bạn cần đăng nhập lại để thực hiện thao tác này.';
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
        } else if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy sự cố y tế cần cập nhật.';
        } else if (error.response.status === 500) {
          errorMessage = `Lỗi máy chủ: ${error.response.data.message || error.response.data}`;
        }

        alert(errorMessage);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Có lỗi xảy ra khi chuẩn bị yêu cầu.');
      }

      setLoading(false);
    }
  };


  // Hàm lấy inventory usage logs theo medical event ID và trả về chúng
  const fetchInventoryUsageLogsAndReturn = async (medicalEventId) => {
    try {
      console.log('=== FETCHING INVENTORY USAGE LOGS ===');
      console.log('Medical Event ID:', medicalEventId);

      const response = await InventoryService.getInventoryUsageLogsByMedicalEventId(medicalEventId);
      console.log('Raw API response:', response);
      if (response && typeof response === 'object') {
        console.log('Keys in response:', Object.keys(response));
      }

      // Handle different response formats
      let usageLogs = [];
      if (Array.isArray(response)) {
        usageLogs = response;
        console.log('Using direct array response');
      } else if (response && Array.isArray(response.data)) {
        usageLogs = response.data;
        console.log('Using response.data array');
      } else if (response && Array.isArray(response.content)) {
        usageLogs = response.content;
        console.log('Using response.content array');
      } else {
        console.log('No valid array found in response');
        console.log('Response structure:', JSON.stringify(response, null, 2));
      }

      console.log('Final usage logs:', usageLogs);
      console.log('Usage logs count:', usageLogs.length);

      // Set the logs for the UI
      setInventoryUsageLogs(usageLogs);
      return usageLogs;
    } catch (error) {
      console.error('=== ERROR FETCHING INVENTORY USAGE LOGS ===');
      console.error('Error details:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      setInventoryUsageLogs([]);
      return [];
    }
  };

  // Hàm mở form chỉnh sửa
  const editMedicalEvent = async (event) => {
    setLoading(true);
    setEditing(true);
    try {
      const response = await MedicalEventService.getMedicalEventById(event.id);
      const fullEventData = response.data;
      setCurrentEvent({...fullEventData});
      
      // Handle custom event types
      const isCustomEventType = !EVENT_TYPES.some(type => type.value === fullEventData.eventType);
      if (isCustomEventType) {
        setShowCustomEventType(true);
        setCustomEventType(fullEventData.eventType);
      } else {
        setShowCustomEventType(false);
        setCustomEventType('');
      }

      // Set selected students for multi-select
      if (fullEventData.stuId && Array.isArray(fullEventData.stuId)) {
        const students = fullEventData.stuId.map(id => availableStudents.find(s => s.id === id)).filter(Boolean);
        setSelectedStudents(students);
      }

      // Set selected inventory items for editing
      if (fullEventData.relatedItemUsed && Array.isArray(fullEventData.relatedItemUsed)) {
        setSelectedInventoryItems(fullEventData.relatedItemUsed);
      }

      // Fetch inventory usage logs for this medical event
      const fetchedLogs = await fetchInventoryUsageLogsAndReturn(event.id);

      // Fallback: if no usage logs found, try to use existing relatedItemUsed data
      if (fetchedLogs.length === 0 && fullEventData.relatedItemUsed && fullEventData.relatedItemUsed.length > 0) {
        console.log('Using fallback: converting relatedItemUsed to usage logs format');
        const fallbackLogs = fullEventData.relatedItemUsed.map(item => ({
          itemId: item.inventoryId || item.itemId,
          quantityUsed: item.quantity || item.quantityUsed,
          notes: item.notes || item.usageNote,
          usedDate: fullEventData.eventDate || fullEventData.createdAt,
          usedBy: fullEventData.createdBy || 'Unknown'
        }));
        console.log('Fallback usage logs:', fallbackLogs);
        setInventoryUsageLogs(fallbackLogs);
      }

      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching medical event details:', error);
      alert('Failed to load event details. Please try again.');
    }
    setLoading(false);
  };

  // Hàm xem chi tiết sự cố y tế
  const viewMedicalEventDetails = (event) => {
    setCurrentEvent({...event});
    setEditing(false);
    setModalOpen(true);
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('=== FORM VALIDATION ===');
    console.log('Current Event:', currentEvent);
    console.log('Selected Students:', selectedStudents);
    console.log('Available Classes:', availableClasses);

    // Enhanced validation
    const validationErrors = [];

    if (!currentEvent.title || currentEvent.title.trim() === '') {
      validationErrors.push('Tiêu đề sự cố không được để trống');
    }

    if (!currentEvent.eventType || currentEvent.eventType.trim() === '') {
      validationErrors.push('Loại sự cố không được để trống');
    }

    if (!currentEvent.eventDate) {
      validationErrors.push('Ngày xảy ra sự cố không được để trống');
    }

    if (!currentEvent.stuId || currentEvent.stuId.length === 0) {
      validationErrors.push('Phải chọn ít nhất một học sinh');
    }

    // Check if selected students are valid
    if (currentEvent.stuId && currentEvent.stuId.length > 0) {
      const invalidStudents = currentEvent.stuId.filter(id => !id || id === null || id === undefined);
      if (invalidStudents.length > 0) {
        validationErrors.push('Có học sinh không hợp lệ trong danh sách đã chọn');
      }
    }

    // Check if eventDate is valid
    if (currentEvent.eventDate) {
      const eventDateObj = new Date(currentEvent.eventDate);
      if (isNaN(eventDateObj.getTime())) {
        validationErrors.push('Ngày xảy ra sự cố không hợp lệ');
      }
    }

    // Check severityLevel
    const validSeverityLevels = ['MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL'];
    if (!validSeverityLevels.includes(currentEvent.severityLevel)) {
      validationErrors.push('Mức độ nghiêm trọng không hợp lệ');
    }

    // Check status
    const validStatuses = ['PROCESSING', 'RESOLVED'];
    if (!validStatuses.includes(currentEvent.status)) {
      validationErrors.push('Trạng thái không hợp lệ');
    }

    // Check inventory items if any are selected
    if (currentEvent.relatedItemUsed && currentEvent.relatedItemUsed.length > 0) {
      const invalidInventoryItems = currentEvent.relatedItemUsed.filter(item => {
        const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity;
        return !item.inventoryId || item.inventoryId === null || item.inventoryId === undefined ||
            quantity === null || quantity === undefined || quantity < 0 || isNaN(quantity);
      });
      if (invalidInventoryItems.length > 0) {
        validationErrors.push('Có vật phẩm y tế không hợp lệ trong danh sách đã chọn. Số lượng phải là số nguyên không âm.');
      }
    }

    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      alert('Lỗi kiểm tra dữ liệu:\n' + validationErrors.join('\n'));
      return;
    }

    console.log('Form validation passed. Submitting...');

    if (editing) {
      updateMedicalEvent(currentEvent.id, currentEvent);
    } else {
      addMedicalEvent(currentEvent);
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({...currentEvent, [name]: value});
  };
  
  // Xử lý thay đổi event type
  const handleEventTypeChange = (e) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === 'OTHER') {
      setShowCustomEventType(true);
      setCurrentEvent({...currentEvent, eventType: customEventType});
    } else {
      setShowCustomEventType(false);
      setCustomEventType('');
      setCurrentEvent({...currentEvent, eventType: selectedValue});
    }
  };
  
  // Xử lý thay đổi custom event type
  const handleCustomEventTypeChange = (e) => {
    const value = e.target.value;
    setCustomEventType(value);
    setCurrentEvent({...currentEvent, eventType: value});
  };

  // Xử lý thay đổi student selection
  const handleStudentSelection = (studentId) => {
    let updatedStudentIds;

    if (currentEvent.stuId.includes(studentId)) {
      // Remove student
      updatedStudentIds = currentEvent.stuId.filter(id => id !== studentId);
    } else {
      // Add student
      updatedStudentIds = [...currentEvent.stuId, studentId];
    }

    setCurrentEvent({...currentEvent, stuId: updatedStudentIds});
  };

  // Xử lý thay đổi inventory item selection
  const handleInventoryItemSelection = (itemId, quantity = 1) => {
    console.log('handleInventoryItemSelection called with:', { itemId, quantity });
    console.log('Current selectedInventoryItems:', selectedInventoryItems);

    if (!itemId) {
      console.log('No itemId provided, returning');
      return;
    }

    const existingItemIndex = selectedInventoryItems.findIndex(item => item.inventoryId === itemId);
    let updatedItems;

    if (existingItemIndex >= 0) {
      // Update existing item quantity (allow empty strings and zero during editing)
      console.log('Updating existing item at index:', existingItemIndex);
      updatedItems = [...selectedInventoryItems];
      updatedItems[existingItemIndex].quantity = quantity;
    } else {
      // Add new item
      console.log('Adding new item to selection');
      updatedItems = [...selectedInventoryItems, {
        inventoryId: itemId,
        quantity: quantity
      }];
    }

    console.log('Updated items:', updatedItems);
    setSelectedInventoryItems(updatedItems);
    setCurrentEvent({...currentEvent, relatedItemUsed: updatedItems});
  };

  // Xử lý xóa inventory item
  const handleRemoveInventoryItem = (itemId) => {
    const updatedItems = selectedInventoryItems.filter(item => item.inventoryId !== itemId);
    setSelectedInventoryItems(updatedItems);
    setCurrentEvent({...currentEvent, relatedItemUsed: updatedItems});
  };

  // Filter inventory items based on search term
  const filterInventoryItems = (searchTerm) => {
    // Always filter to only show active items
    const activeItems = inventoryItems.filter(item => item.status === 'ACTIVE');

    if (!searchTerm.trim()) {
      setFilteredInventoryItems(activeItems);
      return;
    }

    const filtered = activeItems.filter(item => {
      const itemName = item.name || item.itemName || '';
      const itemType = item.type || item.category || '';
      const itemManufacturer = item.manufacturer || '';
      const itemBatchNumber = item.batchNumber || '';
      const itemSource = item.source || '';
      const itemStorageLocation = item.storageLocation || '';

      return itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemManufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemBatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemStorageLocation.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredInventoryItems(filtered);
  };

  // Handle inventory search modal
  const openInventorySearchModal = () => {
    setInventorySearchTerm('');
    // Only show active items when modal opens
    const activeItems = inventoryItems.filter(item => item.status === 'ACTIVE');
    setFilteredInventoryItems(activeItems);
    setInventorySearchModalOpen(true);
  };

  const closeInventorySearchModal = () => {
    setInventorySearchModalOpen(false);
    setInventorySearchTerm('');
    setFilteredInventoryItems([]);
  };

  const handleInventorySearchChange = (e) => {
    const searchTerm = e.target.value;
    setInventorySearchTerm(searchTerm);
    filterInventoryItems(searchTerm);
  };

  const handleInventoryItemSelect = (itemId) => {
    handleInventoryItemSelection(itemId, 1);
    closeInventorySearchModal();
  };
  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Handle UI filters
    if (name === 'searchTerm' || name === 'fromDate' || name === 'toDate') {
      setUIFilters({...uiFilters, [name]: value});

      // Auto-apply filters when search term changes (with debounce)
      if (name === 'searchTerm') {
        // Clear existing timeout
        if (window.searchTimeout) {
          clearTimeout(window.searchTimeout);
        }

        // Set new timeout for auto-search
        window.searchTimeout = setTimeout(() => {
          applyFilters();
        }, 300); // 300ms debounce
      }
    } else {
      // Handle DTO filters
      const updatedFilters = {...filters};

      // Convert UI values to DTO format
      if (name === 'status') {
        updatedFilters.status = value || null;
      }

      setFilters(updatedFilters);
    }
  };
  // Apply filters function
  const applyFilters = () => {
    const filterParams = {...filters};

    // Convert UI date filters to DTO format
    if (uiFilters.fromDate) {
      filterParams.from = `${uiFilters.fromDate}T00:00:00`;
    }
    if (uiFilters.toDate) {
      filterParams.to = `${uiFilters.toDate}T23:59:59`;
    }

    // Add search term to filter params
    if (uiFilters.searchTerm && uiFilters.searchTerm.trim() !== '') {
      filterParams.searchTerm = uiFilters.searchTerm.trim();
    }

    // Remove empty filters
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key] === null || filterParams[key] === '' || filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });

    console.log('Applying filters:', filterParams);

    // Check if any filters are active
    const hasFilters = Object.keys(filterParams).length > 0;
    setIsFiltering(hasFilters);

    // Fetch filtered results
    fetchMedicalEvents(hasFilters ? filterParams : null);
  };

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      stuId: null,
      from: null,
      to: null,
      createdBy: null,
      status: null
    });
    setUIFilters({
      searchTerm: '',
      fromDate: '',
      toDate: ''
    });
    setIsFiltering(false);
    fetchMedicalEvents(null);
  };


  // Events are already filtered by the backend and sorted by ID descending
  const filteredEvents = medicalEvents;

// Fetch inventory items
  const fetchInventoryItems = async () => {
    try {
      console.log('Fetching inventory items...');
      const response = await InventoryService.getInventoryList();
      console.log('Raw inventory response:', response);

      let inventoryData = response;

      // Handle different response formats
      if (response && typeof response === 'object') {
        // Check if response is wrapped in a data property
        if (response.data && Array.isArray(response.data)) {
          inventoryData = response.data;
          console.log('Using response.data for inventory items');
        } else if (response.content && Array.isArray(response.content)) {
          inventoryData = response.content;
          console.log('Using response.content for inventory items');
        } else if (response.items && Array.isArray(response.items)) {
          inventoryData = response.items;
          console.log('Using response.items for inventory items');
        } else if (Array.isArray(response)) {
          inventoryData = response;
          console.log('Using response directly for inventory items');
        } else {
          console.warn('Unknown response format:', response);
          inventoryData = [];
        }
      }

      if (Array.isArray(inventoryData)) {
        // Filter to only show active inventory items
        const activeInventoryItems = inventoryData.filter(item => item.status === 'ACTIVE');
        setInventoryItems(activeInventoryItems);
        console.log('Successfully loaded', activeInventoryItems.length, 'active inventory items out of', inventoryData.length, 'total items');
      } else {
        console.warn('Invalid inventory response format:', response);
        setInventoryItems([]);
      }
    } catch (error) {
      console.error('Error fetching inventory items:', error);

      // Handle authentication errors
      if (error.response?.status === 401) {
        console.error('Authentication failed - redirecting to login');
        alert('Authentication failed. Please login again.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        console.error('Access denied - insufficient permissions');
        alert('Access denied. You need proper permissions to access inventory.');
      } else {
        console.error('Failed to fetch inventory items:', error.message);
      }

      // Set empty array as fallback
      setInventoryItems([]);
    }
  };

  // Lấy danh sách khi component mount
  useEffect(() => {
    fetchMedicalEvents();
    fetchAllStudents();
    fetchAvailableClasses();
    fetchInventoryItems();

    // Cleanup timeout on unmount
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  return (
      <div className="medical-events-page">
        <h1 className="page-title">Quản lý sự cố y tế</h1>

        {/* Bộ lọc */}
        <div className="filters-container">
          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Tìm kiếm</label>
              <div className="search-box">
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Tìm kiếm theo tiêu đề hoặc tên học sinh"
                    value={uiFilters.searchTerm}
                    onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Trạng thái</label>
              <select
                  name="status"
                  value={filters.status || ''}
                  onChange={handleFilterChange}
                  className="filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                {MEDICAL_EVENT_STATUS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Từ ngày</label>
              <input
                  type="date"
                  name="fromDate"
                  value={uiFilters.fromDate}
                  onChange={handleFilterChange}
                  className="filter-date"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Đến ngày</label>
              <input
                  type="date"
                  name="toDate"
                  value={uiFilters.toDate}
                  onChange={handleFilterChange}
                  className="filter-date"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
                type="button"
                className="apply-filters-btn"
                onClick={applyFilters}
            >
              <span className="btn-icon">🔍</span>
              Áp dụng lọc
            </button>
            <button
                type="button"
                className="clear-filters-btn"
                onClick={clearFilters}
            >
              <span className="btn-icon">🗑️</span>
              Xóa lọc
            </button>
          </div>
        </div>

        {/* Nút thêm sự cố mới */}
        <button
            className="add-event-btn"
            onClick={() => {
              setEditing(false);
              resetCurrentEvent();
              setModalOpen(true);
            }}
        >
          Thêm sự cố y tế
        </button>

        {/* Bảng danh sách sự cố */}
        {loading ? (
            <div className="loading">Đang tải dữ liệu...</div>
        ) : (
            <table className="events-table">
              <thead>
              <tr>
                <th>ID <span className="sort-indicator">↓</span></th>
                <th>Tiêu đề</th>
                <th>Học sinh</th>
                <th>Ngày xảy ra</th>
                <th>Biện pháp xử lý</th>
                <th>Mức độ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
              </thead>
              <tbody>
              {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                      <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.title}</td>
                        <td>
                          {event.stuId && event.stuId.length > 0 ? (
                              <div>
                                {event.stuId.map(studentId => {
                                  const studentInfo = studentsInfo[studentId];
                                  return (
                                      <div key={studentId} className="student-info">
                                        {studentInfo ? (
                                            <span>
                                  <strong>{studentInfo.fullName}</strong>
                                  <br />
                                  <small>ID: {studentId} | Lớp: {studentInfo.className}</small>
                                </span>
                                        ) : (
                                            <span>Đang tải thông tin học sinh {studentId}...</span>
                                        )}
                                      </div>
                                  );
                                })}
                              </div>
                          ) : (
                              <span>Chưa gán học sinh</span>
                          )}
                        </td>
                        <td>{event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : 'Không có'}</td>
                        <td>{event.handlingMeasures || 'Không có'}</td>
                        <td>{getSeverityLevelText(event.severityLevel) }</td>
                        <td>
                    <span className={`status ${event.status === 'PROCESSING' ? 'pending' : 'resolved'}`}>
                      {getStatusText(event.status)}
                    </span>
                        </td>
                        <td className="actions">
                          <button className="view-btn" onClick={() => viewMedicalEventDetails(event)} title="Xem chi tiết">
                            <span className="btn-icon">👁️</span>
                            Xem
                          </button>
                          <button className="edit-btn" onClick={() => editMedicalEvent(event)} title="Chỉnh sửa">
                            <span className="btn-icon">✏️</span>
                            Sửa
                          </button>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="7" className="no-data">Không có dữ liệu sự cố y tế</td>
                  </tr>
              )}
              </tbody>
            </table>
        )}

        {/* Modal thêm/sửa/xem chi tiết sự cố y tế */}
        {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                <h2>
                  {!editing && currentEvent.id ? 'Chi tiết sự cố y tế' :
                      editing ? 'Sửa sự cố y tế' : 'Thêm sự cố y tế mới'}
                </h2>

                {/* View Details Mode */}
                {!editing && currentEvent.id && (
                    <div className="event-details">
                      <div className="event-details-left">
                        <div className="detail-row">
                          <strong>ID:</strong> {currentEvent.id}
                        </div>
                        <div className="detail-row">
                          <strong>Tiêu đề:</strong> {currentEvent.title}
                        </div>
                        <div className="detail-row">
                          <strong>Loại sự cố:</strong> {getEventTypeText(currentEvent.eventType)}
                        </div>
                        <div className="detail-row">
                          <strong>Ngày xảy ra:</strong> {currentEvent.eventDate ? new Date(currentEvent.eventDate).toLocaleString('vi-VN') : 'Không có'}
                        </div>
                        <div className="detail-row">
                          <strong>Địa điểm:</strong> {currentEvent.location || 'Không có'}
                        </div>
                        <div className="detail-row">
                          <strong>Mức độ nghiêm trọng:</strong> {getSeverityLevelText(currentEvent.severityLevel)}
                        </div>
                        <div className="detail-row">
                          <strong>Trạng thái:</strong> {getStatusText(currentEvent.status)}
                        </div>
                      </div>

                      <div className="event-details-right">
                        <div className="detail-row">
                          <strong>Ngày tạo:</strong> {currentEvent.createdAt ? new Date(currentEvent.createdAt).toLocaleString('vi-VN') : 'Không có'}
                        </div>
                        <div className="detail-row">
                          <strong>Người tạo:</strong> {currentEvent.createdBy || 'Không có'}
                        </div>
                        <div className="detail-row">
                          <strong>Biện pháp xử lý:</strong> {currentEvent.handlingMeasures || 'Không có'}
                        </div>

                        {/* Related medicines/inventory items used */}
                        {currentEvent.relatedMedicinesUsed && currentEvent.relatedMedicinesUsed.length > 0 && (
                            <div className="detail-row">
                              <strong>Vật phẩm y tế đã sử dụng:</strong>
                              <ul className="inventory-used-list">
                                {currentEvent.relatedMedicinesUsed.map((item, index) => (
                                    <li key={index} className="inventory-used-item">
                                      <div className="item-info">
                                        <strong>{item.medicineName || `Vật phẩm ID: ${item.medicineId}`}</strong>
                                        <div className="item-details">
                                          <span className="quantity">Số lượng: {item.quantityUsed || item.quantity || 0}</span>
                                          {item.unit && <span className="unit">({item.unit})</span>}
                                          {item.usageNote && (
                                              <div className="usage-note">
                                                <em>Ghi chú: {item.usageNote}</em>
                                              </div>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                ))}
                              </ul>
                            </div>
                        )}
                      </div>

                      <div className="event-details-full">
                        <div className="detail-row">
                          <strong>Mô tả:</strong> {currentEvent.description || 'Không có'}
                        </div>

                        <div className="detail-row student-detail-row">
                          <strong>Học sinh liên quan:</strong>
                          {currentEvent.stuId && currentEvent.stuId.length > 0 ? (
                              <div className="students-detail">
                                {currentEvent.stuId.map(studentId => {
                                  const studentInfo = studentsInfo[studentId];
                                  return (
                                      <div key={studentId} className="student-detail-item-row">
                                        {studentInfo ? (
                                            <div>
                                              <strong>{studentInfo.fullName}</strong>
                                              <br />
                                              <small>ID: {studentId}</small>
                                              <br />
                                              <small>Lớp: {studentInfo.className}</small>
                                              <br />
                                              <small>Ngày sinh: {studentInfo.dob}</small>
                                              <br />
                                              <small>Giới tính: {studentInfo.gender}</small>
                                            </div>
                                        ) : (
                                            <span>Đang tải học sinh {studentId}...</span>
                                        )}
                                      </div>
                                  );
                                })}
                              </div>
                          ) : (
                              'Không có'
                          )}
                        </div>
                      </div>

                      <div className="modal-actions event-details-full">
                        <button className="close-btn" onClick={() => setModalOpen(false)}>
                          <span className="btn-icon">❌</span>
                          Đóng
                        </button>
                        <button className="edit-btn" onClick={() => setEditing(true)}>
                          <span className="btn-icon">✏️</span>
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                )}

                {/* Edit/Add Form Mode */}
                {(editing || !currentEvent.id) && (
                    <form onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="title">Tiêu đề sự cố <span className="required">*</span></label>
                          <input
                              type="text"
                              name="title"
                              id="title"
                              value={currentEvent.title}
                              onChange={handleInputChange}
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="eventType">Loại sự cố <span className="required">*</span></label>
                          <select
                              name="eventType"
                              id="eventType"
                              value={showCustomEventType ? 'OTHER' : currentEvent.eventType}
                              onChange={handleEventTypeChange}
                              required
                              className="event-type-select"
                          >
                            <option value="">-- Chọn loại sự cố --</option>
                            {EVENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          {showCustomEventType && (
                              <input
                                  type="text"
                                  name="customEventType"
                                  id="customEventType"
                                  value={customEventType}
                                  onChange={handleCustomEventTypeChange}
                                  placeholder="Nhập loại sự cố khác..."
                                  required
                                  className="custom-event-type-input"
                              />
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="students">Học sinh liên quan <span className="required">*</span></label>
                          <div className="students-selection">
                            <div className="student-selection-actions">
                              <button
                                  type="button"
                                  onClick={handleOpenStudentModal}
                                  className="open-student-modal-btn"
                              >
                                Chọn học sinh
                              </button>
                            </div>

                            {currentEvent.stuId.length > 0 && (
                                <div className="selected-students-summary">
                                  <strong>Đã chọn {currentEvent.stuId.length} học sinh:</strong>
                                  <div className="selected-students-list">
                                    {currentEvent.stuId.map(studentId => {
                                      const studentInfo = studentsInfo[studentId] || availableStudents.find(s => s.studentId === studentId);
                                      return (
                                          <span key={studentId} className="selected-student-tag">
                                {studentInfo ? studentInfo.fullName : `ID: ${studentId}`} (ID: {studentId})
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStudent(studentId)}
                                    className="remove-student-btn"
                                >
                                  ×
                                </button>
                              </span>
                                      );
                                    })}
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="eventDate">Ngày và giờ xảy ra <span className="required">*</span></label>
                          <input
                              type="datetime-local"
                              name="eventDate"
                              id="eventDate"
                              value={currentEvent.eventDate}
                              onChange={handleInputChange}
                              max={getCurrentDateTime()}
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="location">Địa điểm</label>
                          <input
                              type="text"
                              name="location"
                              id="location"
                              value={currentEvent.location}
                              onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="handlingMeasures">Biện pháp xử lý</label>
                          <textarea
                              name="handlingMeasures"
                              id="handlingMeasures"
                              value={currentEvent.handlingMeasures}
                              onChange={handleInputChange}
                              rows="3"
                              placeholder="Mô tả các biện pháp xử lý đã thực hiện..."
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="severityLevel">Mức độ nghiêm trọng</label>
                          <select
                              name="severityLevel"
                              id="severityLevel"
                              value={currentEvent.severityLevel}
                              onChange={handleInputChange}
                          >
                            {SEVERITY_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Mô tả chi tiết</label>
                        <textarea
                            name="description"
                            id="description"
                            value={currentEvent.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Mô tả chi tiết về sự cố..."
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inventoryItems">Vật phẩm y tế đã sử dụng</label>
                        <div className="inventory-selection">
                          <div className="inventory-input-row">
                            <select
                                id="inventoryItemsSelect"
                                onChange={(e) => {
                                  const itemId = e.target.value;

                                  if (itemId && itemId !== '') {
                                    const parsedItemId = parseInt(itemId);

                                    if (!isNaN(parsedItemId)) {
                                      handleInventoryItemSelection(parsedItemId, 1);

                                      // Reset the select to placeholder after selection
                                      e.target.selectedIndex = 0;
                                    }
                                  }
                                }}
                                defaultValue=""
                            >
                              <option value="">-- Chọn vật phẩm y tế --</option>
                              {inventoryItems && inventoryItems.length > 0 ? (
                                  inventoryItems
                                      .filter(item => item.status === 'ACTIVE') // Only show active items
                                      .map((item, index) => {
                                        // Handle different possible ID field names
                                        const itemId = item.id || item.inventoryId || item.itemId;
                                        const itemName = item.name || item.itemName || item.title || 'Unknown Item';
                                        const itemQuantity = item.quantity || item.stock || item.availableQuantity || 0;

                                        return (
                                            <option key={itemId || index} value={itemId}>
                                              {itemName} (Còn lại: {itemQuantity})
                                            </option>
                                        );
                                      })
                              ) : (
                                  <option value="" disabled>Đang tải danh sách vật phẩm...</option>
                              )}
                            </select>
                            <button
                                type="button"
                                className="search-inventory-btn"
                                onClick={openInventorySearchModal}
                                title="Tìm kiếm vật phẩm y tế"
                            >
                              🔍 Tìm kiếm
                            </button>
                            {inventoryItems && inventoryItems.length === 0 && (
                                <div className="inventory-debug-info">
                                  <small style={{color: 'red'}}>Không có vật phẩm y tế nào.</small>
                                </div>
                            )}
                          </div>
                          <div className="selected-inventory-items">
                            {selectedInventoryItems.length > 0 && (
                                <div className="selected-items-header">
                                  <h4>Vật phẩm y tế đã chọn:</h4>
                                </div>
                            )}
                            {selectedInventoryItems.map(item => {
                              const inventoryItem = inventoryItems.find(inv => {
                                const invId = inv.id || inv.inventoryId || inv.itemId;
                                return invId === item.inventoryId;
                              });

                              // Extract item details with fallbacks
                              const itemName = inventoryItem?.name || inventoryItem?.itemName || inventoryItem?.title || 'Unknown Item';
                              const itemUnit = inventoryItem?.unit || inventoryItem?.measurementUnit || 'đơn vị';
                              const itemExpiry = inventoryItem?.expirationDate || inventoryItem?.expiry || null;
                              const itemCondition = inventoryItem?.condition || inventoryItem?.status || 'N/A';
                              const availableQuantity = inventoryItem?.quantity || inventoryItem?.stock || inventoryItem?.availableQuantity || 0;
                              const itemStatus = inventoryItem?.status || '';

                              return (
                                  <div key={item.inventoryId} className="selected-inventory-item-detailed">
                                    <div className="item-info">
                                      <div className="item-header">
                                        <h5 className="item-name">{itemName}</h5>
                                        <span className="item-id">ID: {item.inventoryId}</span>
                                      </div>
                                      <div className="item-details">
                                        <div className="item-detail-row">
                                          <span className="detail-label">Tình trạng:</span>
                                          <span className="detail-value">{itemStatus ? getInventoryStatusText(itemStatus) : (itemCondition || 'Không có')}</span>
                                        </div>
                                        <div className="item-detail-row">
                                          <span className="detail-label">Còn lại:</span>
                                          <span className="detail-value">{availableQuantity} {itemUnit}</span>
                                        </div>
                                        {itemExpiry && (
                                            <div className="item-detail-row">
                                              <span className="detail-label">Hạn sử dụng:</span>
                                              <span className="detail-value">{new Date(itemExpiry).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="item-controls">
                                      <div className="quantity-control">
                                        <label htmlFor={`quantity-${item.inventoryId}`}>Số lượng sử dụng:</label>
                                        <input
                                            id={`quantity-${item.inventoryId}`}
                                            type="number"
                                            min="0"
                                            max={availableQuantity}
                                            value={item.quantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              handleInventoryItemSelection(item.inventoryId, parseInt(value) || 0);
                                            }}
                                            onBlur={(e) => {
                                              // When user leaves the field, ensure it has a valid value
                                              const value = e.target.value;
                                              if (value === '' || parseInt(value) < 0) {
                                                handleInventoryItemSelection(item.inventoryId, 0);
                                              }
                                            }}
                                            className="quantity-input"
                                        />
                                        <span className="unit-label">{itemUnit}</span>
                                      </div>
                                      <button
                                          type="button"
                                          onClick={() => handleRemoveInventoryItem(item.inventoryId)}
                                          className="remove-item-btn"
                                          title="Xóa vật phẩm này"
                                      >
                                        🗑️ Xóa
                                      </button>
                                    </div>
                                  </div>
                              );
                            })}
                            {selectedInventoryItems.length === 0 && (
                                <div className="no-selected-items">
                                  <p>Chưa chọn vật phẩm y tế nào.</p>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inventory Usage Logs Section - Only show in edit mode */}

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="status">Trạng thái</label>
                          <select
                              name="status"
                              id="status"
                              value={currentEvent.status}
                              onChange={handleInputChange}
                          >
                            {MEDICAL_EVENT_STATUS.map(status => {
                              // Disable RESOLVED status when creating new event
                              const isDisabled = !editing && status.value === 'RESOLVED';
                              return (
                                <option 
                                  key={status.value} 
                                  value={status.value}
                                  disabled={isDisabled}
                                >
                                  {status.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
                          Hủy
                        </button>
                        <button type="submit" className="submit-btn">
                          {editing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
        )}

        {/* Student Selection Modal */}
        <StudentSelectionModal
            isOpen={studentSelectionModalOpen}
            onClose={handleCloseStudentModal}
            onConfirm={handleConfirmStudentSelection}
            selectedStudentIds={currentEvent.stuId}
            availableClasses={availableClasses}
        />

        {/* Inventory Search Modal */}
        {inventorySearchModalOpen && (
            <div className="modal inventory-search-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Tìm kiếm vật phẩm y tế</h2>
                  <button className="close-btn" onClick={closeInventorySearchModal}>
                    ×
                  </button>
                </div>

                <div className="inventory-search-content">
                  <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, loại, nhà sản xuất, số lô, nguồn cung cấp, vị trí lưu trữ..."
                        value={inventorySearchTerm}
                        onChange={handleInventorySearchChange}
                        className="inventory-search-input"
                        autoFocus
                    />
                    <div className="search-results-info">
                      {inventorySearchTerm && `Tìm thấy ${filteredInventoryItems.length} kết quả`}
                    </div>
                  </div>

                  <div className="inventory-search-results">
                    {filteredInventoryItems.length > 0 ? (
                        <div className="inventory-items-grid">
                          {filteredInventoryItems.map((item) => {
                            const itemId = item.id || item.inventoryId || item.itemId;
                            const itemName = item.name || item.itemName || item.title || 'Unknown Item';
                            const itemQuantity = item.quantity || item.stock || item.availableQuantity || 0;
                            const itemType = item.type || item.category || '';
                            const itemManufacturer = item.manufacturer || '';
                            const itemBatchNumber = item.batchNumber || '';
                            const itemExpiryDate = item.expiryDate || item.expiration_date || '';
                            const itemStorageLocation = item.storageLocation || '';
                            const itemUnit = item.unit || '';
                            const itemStatus = item.status || '';

                            // Check if item is already selected
                            const isSelected = selectedInventoryItems.some(selected => selected.inventoryId === itemId);

                            return (
                                <div
                                    key={itemId}
                                    className={`inventory-item-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => !isSelected && handleInventoryItemSelect(itemId)}
                                >
                                  <div className="item-header">
                                    <h4 className="item-name">{itemName}</h4>
                                    <span className="item-id">ID: {itemId}</span>
                                  </div>

                                  <div className="item-details">
                                    {itemType && (
                                        <div className="item-detail">
                                          <span className="detail-label">Loại:</span>
                                          <span className="detail-value">{itemType}</span>
                                        </div>
                                    )}

                                    <div className="item-detail">
                                      <span className="detail-label">Số lượng:</span>
                                      <span className="detail-value">{itemQuantity} {itemUnit}</span>
                                    </div>

                                    {itemManufacturer && (
                                        <div className="item-detail">
                                          <span className="detail-label">Nhà sản xuất:</span>
                                          <span className="detail-value">{itemManufacturer}</span>
                                        </div>
                                    )}

                                    {itemBatchNumber && (
                                        <div className="item-detail">
                                          <span className="detail-label">Số lô:</span>
                                          <span className="detail-value">{itemBatchNumber}</span>
                                        </div>
                                    )}

                                    {itemExpiryDate && (
                                        <div className="item-detail">
                                          <span className="detail-label">Hạn sử dụng:</span>
                                          <span className="detail-value">{itemExpiryDate}</span>
                                        </div>
                                    )}

                                    {itemStorageLocation && (
                                        <div className="item-detail">
                                          <span className="detail-label">Vị trí:</span>
                                          <span className="detail-value">{itemStorageLocation}</span>
                                        </div>
                                    )}

                                    {itemStatus && (
                                        <div className="item-detail">
                                          <span className="detail-label">Trạng thái:</span>
                                          <span className="detail-value">{getInventoryStatusText(itemStatus)}</span>
                                        </div>
                                    )}
                                  </div>

                                  {isSelected && (
                                      <div className="item-selected-indicator">
                                        ✓ Đã chọn
                                      </div>
                                  )}
                                </div>
                            );
                          })}
                        </div>
                    ) : (
                        <div className="no-results">
                          {inventorySearchTerm ? 'Không tìm thấy vật phẩm nào phù hợp.' : 'Nhập từ khóa để tìm kiếm vật phẩm y tế.'}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default MedicalEvents;




