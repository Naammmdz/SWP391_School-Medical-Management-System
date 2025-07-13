import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import InventoryService from '../../../services/InventoryService';
import './Pharmaceutical.css';

const Pharmaceutical = () => {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Calculate tab counts by status
  const getTabCounts = () => {
    const counts = {
      all: medications.length,
      active: medications.filter(med => med.status === 'ACTIVE').length,
      inactive: medications.filter(med => med.status === 'INACTIVE').length,
      expired: medications.filter(med => med.status === 'EXPIRED').length,
      damaged: medications.filter(med => med.status === 'DAMAGED').length
    };
    return counts;
  };
  
  // Helper function to translate inventory status to Vietnamese
  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động';
      case 'INACTIVE': return 'Không hoạt động';
      case 'EXPIRED': return 'Hết hạn';
      case 'DAMAGED': return 'Hư hỏng';
      default: return status || 'Không có';
    }
  };
  
  // CRUD state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    unit: '',
    quantity: '',
    minStockLevel: '',
    expiryDate: '',
    batchNumber: '',
    manufacturer: '',
    importDate: '',
    importPrice: '',
    storageLocation: '',
    status: 'ACTIVE',
    source: '',
  });


  // Get all medications from API
  useEffect(() => {
    fetchMedications();
  }, []);

  // Filter medications when search term or active tab changes
  useEffect(() => {
    let filtered = medications;
    
    // Filter by tab (status)
    if (activeTab !== 'all') {
      filtered = filtered.filter(medication => 
        medication.status === activeTab.toUpperCase()
      );
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        medication => 
          medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (medication.type && medication.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (medication.manufacturer && medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (medication.batchNumber && medication.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (medication.source && medication.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (medication.storageLocation && medication.storageLocation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredMedications(filtered);
  }, [searchTerm, medications, activeTab]);

  const fetchMedications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await InventoryService.getInventoryList();
      console.log('API Response:', response); // Debug log
      
      // Check different possible response structures
      let medicationsData = [];
      
      if (response && Array.isArray(response)) {
        // Response is directly an array
        medicationsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response has data property with array
        medicationsData = response.data;
      } else if (response && response.result && Array.isArray(response.result)) {
        // Response has result property with array
        medicationsData = response.result;
      } else if (response && response.items && Array.isArray(response.items)) {
        // Response has items property with array
        medicationsData = response.items;
      }
      
      console.log('Medications Data:', medicationsData); // Debug log
      
      // Transform inventory data to match the expected medication format
      const transformedData = medicationsData
        .map(item => ({
          id: item.itemId || item.id || item._id,
          name: item.name || item.itemName || item.medication_name || 'Không có tên',
          type: item.type || item.category || '',
          unit: item.unit || item.unitOfMeasure || '',
          quantity: item.quantity || item.stock || item.amount || 0,
          minStockLevel: item.minStockLevel || 0,
          expiryDate: item.expiryDate || item.expiration_date || item.exp_date || '',
          batchNumber: item.batchNumber || '',
          manufacturer: item.manufacturer || item.supplier || '',
          importDate: item.importDate || '',
          importPrice: item.importPrice || 0,
          storageLocation: item.storageLocation || '',
          status: item.status || '',
          source: item.source || '',
          createdAt: item.createdAt || '',
          // Keep legacy fields for backward compatibility
          generic_name: item.generic_name || item.description || item.activeIngredient || '',
          category: item.category || item.type || '',
          dosage: item.dosage || item.strength || '',
          dosage_form: item.dosage_form || item.form || item.dosageForm || '',
          expiration_date: item.expiryDate || item.expiration_date || item.exp_date || '',
          instructions: item.instructions || item.usage || '',
          side_effects: item.side_effects || item.sideEffects || '',
          storage: item.storage || item.storageConditions || '',
          for_conditions: item.for_conditions || item.indications || item.description || '',
        }));
      
      console.log('Transformed Data:', transformedData); // Debug log
      
      setMedications(transformedData);
      setFilteredMedications(transformedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu từ server. Vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      type: '',
      unit: '',
      quantity: '',
      minStockLevel: '',
      expiryDate: '',
      batchNumber: '',
      manufacturer: '',
      importDate: '',
      importPrice: '',
      storageLocation: '',
      status: 'ACTIVE',
      source: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (medication) => {
    setIsEditMode(true);
    setCurrentMedication(medication);
    setFormData({
      name: medication.name || '',
      type: medication.type || '',
      unit: medication.unit || '',
      quantity: medication.quantity || '',
      minStockLevel: medication.minStockLevel || '',
      expiryDate: medication.expiryDate || medication.expiration_date || '',
      batchNumber: medication.batchNumber || '',
      manufacturer: medication.manufacturer || '',
      importDate: medication.importDate || '',
      importPrice: medication.importPrice || '',
      storageLocation: medication.storageLocation || '',
      status: medication.status || 'ACTIVE',
      source: medication.source || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.quantity || !formData.unit) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    try {
      if (isEditMode) {
        // Update existing medication using InventoryService
        const updateData = {
          name: formData.name,
          type: formData.type,
          unit: formData.unit,
          quantity: parseInt(formData.quantity),
          minStockLevel: parseInt(formData.minStockLevel || 0),
          expiryDate: formData.expiryDate || null,
          batchNumber: formData.batchNumber,
          manufacturer: formData.manufacturer,
          importDate: formData.importDate || null,
          importPrice: parseFloat(formData.importPrice || 0),
          storageLocation: formData.storageLocation,
          status: formData.status,
          source: formData.source,
        };
        
        await InventoryService.updateInventory(currentMedication.id, updateData);
        
        // Update local state for now
        const updatedMedications = medications.map(medication => 
          medication.id === currentMedication.id ? { ...medication, ...updateData } : medication
        );
        setMedications(updatedMedications);
      } else {
        // Add new medication using InventoryService
        const newInventoryData = {
          name: formData.name,
          type: formData.type,
          unit: formData.unit,
          quantity: parseInt(formData.quantity),
          minStockLevel: parseInt(formData.minStockLevel || 0),
          expiryDate: formData.expiryDate || null,
          batchNumber: formData.batchNumber,
          manufacturer: formData.manufacturer,
          importDate: formData.importDate || null,
          importPrice: parseFloat(formData.importPrice || 0),
          storageLocation: formData.storageLocation,
          status: formData.status,
          source: formData.source,
        };
        
        const response = await InventoryService.createInventory(newInventoryData);
        
        // Mock response for now
        const newMedication = {
          id: medications.length + 1,
          ...newInventoryData
        };
        
        setMedications([...medications, newMedication]);
      }
      
      closeModal();
      // Refresh data from API
      fetchMedications();
    } catch (err) {
      console.error('Error saving medication:', err);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const handleDelete = async (medicationId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thuốc này không?')) {
      return;
    }
    
    try {
      // API call would go here
      // await fetch(`api/medications/${medicationId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      const updatedMedications = medications.filter(medication => medication.id !== medicationId);
      setMedications(updatedMedications);
    } catch (err) {
      console.error('Error deleting medication:', err);
      alert('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const checkExpirationStatus = (date) => {
    if (!date) return 'no-expiry';
    
    const today = new Date();
    const expiryDate = new Date(date);
    const monthDiff = (expiryDate - today) / (1000 * 60 * 60 * 24 * 30);
    
    if (expiryDate < today) {
      return 'expired';
    } else if (monthDiff <= 1) {
      return 'expiring-soon';
    } else {
      return 'valid';
    }
  };

  // State for details modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedItem(null);
  };


  return (
    <div className="nurse-page">
      <div className="page-header">
        <h1>Quản Lý Kho Vật Tư</h1>
        <div className="header-actions">
          <button className="refresh-button" onClick={fetchMedications}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className="add-button" onClick={openAddModal}>
            <Plus size={16} />
            Thêm vật tư
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả <span className="tab-count">({getTabCounts().all})</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          data-status="active"
          onClick={() => setActiveTab('active')}
        >
          Hoạt động <span className="tab-count">({getTabCounts().active})</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
          data-status="inactive"
          onClick={() => setActiveTab('inactive')}
        >
          Không hoạt động <span className="tab-count">({getTabCounts().inactive})</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
          data-status="expired"
          onClick={() => setActiveTab('expired')}
        >
          Hết hạn <span className="tab-count">({getTabCounts().expired})</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'damaged' ? 'active' : ''}`}
          data-status="damaged"
          onClick={() => setActiveTab('damaged')}
        >
          Hư hỏng <span className="tab-count">({getTabCounts().damaged})</span>
        </button>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, loại, nhà sản xuất, số lô, nguồn cung cấp, vị trí lưu trữ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-results">
          {searchTerm && `Tìm thấy ${filteredMedications.length} kết quả`}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchMedications}>Thử lại</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên thuốc/Vật tư</th>
                <th>Số lượng</th>
                <th>Hạn sử dụng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.length > 0 ? (
                filteredMedications.map((medication) => {
                  const expiryStatus = checkExpirationStatus(medication.expiryDate || medication.expiration_date);
                  
                  return (
                    <tr key={medication.id}>
                      <td>{medication.id}</td>
                      <td>{medication.name}</td>
                      <td>{medication.quantity} {medication.unit}</td>
                      <td className={`expiry-cell ${expiryStatus}`}>
                        {expiryStatus === 'expired' && <AlertTriangle size={14} className="expiry-icon" />}
                        {medication.expiryDate || medication.expiration_date || 'Không có'}
                        {expiryStatus === 'expired' && <span className="expiry-label">Hết hạn</span>}
                        {expiryStatus === 'expiring-soon' && <span className="expiry-label">Sắp hết hạn</span>}
                      </td>
                      <td className={`status-cell ${medication.status ? medication.status.toLowerCase() : 'unknown'}`}>
                        {getStatusText(medication.status)}
                      </td>
                      <td className="actions">
                        <button 
                          className="view-button" 
                          onClick={() => openDetailsModal(medication)}
                          title="Xem chi tiết"
                        >
                          <Search size={16} />
                          Chi tiết
                        </button>
                        <button 
                          className="edit-button" 
                          onClick={() => openEditModal(medication)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">Không tìm thấy dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'Chỉnh sửa thông tin vật tư/thuốc' : 'Thêm vật tư/thuốc mới'}</h2>
              <button className="close-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Tên thuốc/Vật tư <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Loại <span className="required">*</span></label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Chọn loại --</option>
                    <option value="medicine">Thuốc</option>
                    <option value="medical supplies">Vật tư y tế</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Số lượng <span className="required">*</span></label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Đơn vị <span className="required">*</span></label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: viên, hộp, chai, lọ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minStockLevel">Mức tồn kho tối thiểu</label>
                  <input
                    type="number"
                    id="minStockLevel"
                    name="minStockLevel"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Hạn sử dụng</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="batchNumber">Số lô</label>
                  <input
                    type="text"
                    id="batchNumber"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="manufacturer">Nhà sản xuất</label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="importDate">Ngày nhập</label>
                  <input
                    type="date"
                    id="importDate"
                    name="importDate"
                    value={formData.importDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="importPrice">Giá nhập (VND)</label>
                  <input
                    type="number"
                    id="importPrice"
                    name="importPrice"
                    min="0"
                    step="0.01"
                    value={formData.importPrice}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storageLocation">Vị trí lưu trữ</label>
                  <input
                    type="text"
                    id="storageLocation"
                    name="storageLocation"
                    value={formData.storageLocation}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Kệ A1, Tủ lạnh B2"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                    <option value="EXPIRED">Hết hạn</option>
                    <option value="DAMAGED">Hư hỏng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="source">Nguồn cung cấp</label>
                  <input
                    type="text"
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Nhà cung cấp A, Bệnh viện B"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Hủy bỏ
                </button>
                <button type="submit" className="submit-button">
                  <Save size={16} />
                  {isEditMode ? 'Cập nhật' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Item Details Modal */}
      {detailsModalOpen && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Chi tiết vật tư/thuốc</h2>
              <button className="close-button" onClick={closeDetailsModal}>
                <X size={20} />
              </button>
            </div>

            <div className="details-content">
              <div className="detail-row">
                <strong>ID:</strong> {selectedItem.id}
              </div>
              <div className="detail-row">
                <strong>Tên:</strong> {selectedItem.name}
              </div>
              <div className="detail-row">
                <strong>Loại:</strong> {selectedItem.type || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Đơn vị:</strong> {selectedItem.unit || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Số lượng:</strong> {selectedItem.quantity}
              </div>
              <div className="detail-row">
                <strong>Mức tồn kho tối thiểu:</strong> {selectedItem.minStockLevel || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Hạn sử dụng:</strong> {selectedItem.expiryDate || selectedItem.expiration_date || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Số lô:</strong> {selectedItem.batchNumber || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Nhà sản xuất:</strong> {selectedItem.manufacturer || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Ngày nhập:</strong> {selectedItem.importDate || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Giá nhập:</strong> {selectedItem.importPrice ? `${selectedItem.importPrice} VND` : 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Vị trí lưu trữ:</strong> {selectedItem.storageLocation || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Trạng thái:</strong> {getStatusText(selectedItem.status)}
              </div>
              <div className="detail-row">
                <strong>Nguồn cung cấp:</strong> {selectedItem.source || 'Không có'}
              </div>
              <div className="detail-row">
                <strong>Ngày tạo:</strong> {selectedItem.createdAt || 'Không có'}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={closeDetailsModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmaceutical;
