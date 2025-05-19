import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import './NursePages.css';

const Pharmaceutical = () => {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // CRUD state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    dosage: '',
    dosage_form: '',
    quantity: '',
    unit: '',
    expiration_date: '',
    manufacturer: '',
    instructions: '',
    side_effects: '',
    storage: '',
    for_conditions: '',
  });

  // Get all medications from API
  useEffect(() => {
    fetchMedications();
  }, []);

  // Filter medications when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedications(medications);
    } else {
      const filtered = medications.filter(
        medication => 
          medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.for_conditions.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedications(filtered);
    }
  }, [searchTerm, medications]);

  const fetchMedications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // API call would go here
      // const response = await fetch('api/medications');
      // const data = await response.json();
      
      // For now, using mock data
      const mockData = [
        { 
          id: 1, 
          name: 'Paracetamol', 
          generic_name: 'Acetaminophen',
          category: 'Thuốc giảm đau',
          dosage: '500mg', 
          dosage_form: 'Viên nén',
          quantity: 100, 
          unit: 'viên', 
          expiration_date: '2025-04-15',
          manufacturer: 'Công ty Dược phẩm Nam Hà',
          instructions: 'Uống sau khi ăn. Người lớn: 1-2 viên/lần, 3-4 lần/ngày. Trẻ em: theo hướng dẫn của bác sĩ.',
          side_effects: 'Buồn nôn, nôn, đau dạ dày, dị ứng (hiếm gặp)',
          storage: 'Nơi khô ráo, nhiệt độ dưới 30°C',
          for_conditions: 'Đau nhẹ, đau đầu, sốt, cảm cúm',
        },
        { 
          id: 2, 
          name: 'Cetirizine', 
          generic_name: 'Cetirizine Hydrochloride',
          category: 'Thuốc kháng histamine',
          dosage: '10mg', 
          dosage_form: 'Viên nén',
          quantity: 50, 
          unit: 'viên', 
          expiration_date: '2025-02-20',
          manufacturer: 'Công ty Cổ phần Dược phẩm OPC',
          instructions: 'Uống 1 viên/ngày, tốt nhất vào buổi tối',
          side_effects: 'Buồn ngủ, khô miệng, mệt mỏi',
          storage: 'Nơi khô ráo, nhiệt độ phòng',
          for_conditions: 'Dị ứng, viêm mũi dị ứng, mày đay',
        },
        { 
          id: 3, 
          name: 'Amoxicillin', 
          generic_name: 'Amoxicillin Trihydrate',
          category: 'Kháng sinh',
          dosage: '500mg', 
          dosage_form: 'Viên nang',
          quantity: 60, 
          unit: 'viên', 
          expiration_date: '2024-10-10',
          manufacturer: 'Công ty CP Dược phẩm Hà Tây',
          instructions: 'Uống 1 viên mỗi 8 giờ. Hoàn thành đủ liệu trình điều trị.',
          side_effects: 'Tiêu chảy, buồn nôn, phát ban. Dị ứng kháng sinh (gọi bác sĩ ngay nếu xảy ra)',
          storage: 'Nơi khô ráo, nhiệt độ dưới 25°C',
          for_conditions: 'Nhiễm trùng đường hô hấp, tai, mũi họng, tiết niệu',
        },
        { 
          id: 4, 
          name: 'Loratadine', 
          generic_name: 'Loratadine',
          category: 'Thuốc kháng histamine',
          dosage: '10mg', 
          dosage_form: 'Viên nén',
          quantity: 30, 
          unit: 'viên', 
          expiration_date: '2025-04-30',
          manufacturer: 'Công ty Dược phẩm Trung ương 1',
          instructions: 'Uống 1 viên mỗi ngày',
          side_effects: 'Ít gây buồn ngủ, đau đầu (hiếm gặp)',
          storage: 'Nơi khô ráo, tránh ánh sáng',
          for_conditions: 'Dị ứng, viêm mũi dị ứng theo mùa',
        },
        { 
          id: 5, 
          name: 'Ibuprofen', 
          generic_name: 'Ibuprofen',
          category: 'Thuốc giảm đau, chống viêm',
          dosage: '400mg', 
          dosage_form: 'Viên nén bao phim',
          quantity: 80, 
          unit: 'viên', 
          expiration_date: '2025-01-15',
          manufacturer: 'Công ty TNHH Dược phẩm Boston',
          instructions: 'Uống sau khi ăn. Người lớn: 1 viên/lần, 3 lần/ngày',
          side_effects: 'Đau dạ dày, buồn nôn, có thể gây loét dạ dày nếu dùng kéo dài',
          storage: 'Nơi khô ráo, nhiệt độ phòng',
          for_conditions: 'Đau, viêm khớp, đau đầu, đau răng, đau kinh',
        }
      ];
      
      setMedications(mockData);
      setFilteredMedications(mockData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
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
      generic_name: '',
      category: '',
      dosage: '',
      dosage_form: '',
      quantity: '',
      unit: '',
      expiration_date: '',
      manufacturer: '',
      instructions: '',
      side_effects: '',
      storage: '',
      for_conditions: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (medication) => {
    setIsEditMode(true);
    setCurrentMedication(medication);
    setFormData({
      name: medication.name,
      generic_name: medication.generic_name || '',
      category: medication.category || '',
      dosage: medication.dosage || '',
      dosage_form: medication.dosage_form || '',
      quantity: medication.quantity,
      unit: medication.unit || '',
      expiration_date: medication.expiration_date || '',
      manufacturer: medication.manufacturer || '',
      instructions: medication.instructions || '',
      side_effects: medication.side_effects || '',
      storage: medication.storage || '',
      for_conditions: medication.for_conditions || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.quantity || !formData.unit) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    try {
      if (isEditMode) {
        // Update existing medication
        // API call would go here
        // await fetch(`api/medications/${currentMedication.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        // Update local state
        const updatedMedications = medications.map(medication => 
          medication.id === currentMedication.id ? { ...medication, ...formData } : medication
        );
        setMedications(updatedMedications);
      } else {
        // Add new medication
        // API call would go here
        // const response = await fetch('api/medications', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        // const newMedication = await response.json();
        
        // Mock response
        const newMedication = {
          id: medications.length + 1,
          ...formData
        };
        
        setMedications([...medications, newMedication]);
      }
      
      closeModal();
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
    } else if (monthDiff <= 3) {
      return 'expiring-soon';
    } else {
      return 'valid';
    }
  };

  return (
    <div className="nurse-page">
      <div className="page-header">
        <h1>Quản Lý Thuốc</h1>
        <div className="header-actions">
          <button className="refresh-button" onClick={fetchMedications}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className="add-button" onClick={openAddModal}>
            <Plus size={16} />
            Thêm thuốc
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên thuốc, thành phần, loại thuốc, công dụng..."
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
                <th>Tên thuốc</th>
                <th>Thành phần</th>
                <th>Liều lượng</th>
                <th>Dạng thuốc</th>
                <th>Số lượng</th>
                <th>Hạn sử dụng</th>
                <th>Công dụng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.length > 0 ? (
                filteredMedications.map((medication) => {
                  const expiryStatus = checkExpirationStatus(medication.expiration_date);
                  
                  return (
                    <tr key={medication.id}>
                      <td>{medication.name}</td>
                      <td>{medication.generic_name}</td>
                      <td>{medication.dosage}</td>
                      <td>{medication.dosage_form}</td>
                      <td>{medication.quantity} {medication.unit}</td>
                      <td className={`expiry-cell ${expiryStatus}`}>
                        {expiryStatus === 'expired' && <AlertTriangle size={14} className="expiry-icon" />}
                        {medication.expiration_date || 'Không có'}
                        {expiryStatus === 'expired' && <span className="expiry-label">Hết hạn</span>}
                        {expiryStatus === 'expiring-soon' && <span className="expiry-label">Sắp hết hạn</span>}
                      </td>
                      <td>{medication.for_conditions}</td>
                      <td className="actions">
                        <button 
                          className="edit-button" 
                          onClick={() => openEditModal(medication)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => handleDelete(medication.id)}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">Không tìm thấy dữ liệu</td>
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
              <h2>{isEditMode ? 'Chỉnh sửa thông tin thuốc' : 'Thêm thuốc mới'}</h2>
              <button className="close-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Tên thuốc <span className="required">*</span></label>
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
                  <label htmlFor="generic_name">Thành phần hoạt chất</label>
                  <input
                    type="text"
                    id="generic_name"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Loại thuốc</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
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
                  <label htmlFor="dosage">Liều lượng <span className="required">*</span></label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dosage_form">Dạng thuốc</label>
                  <select
                    id="dosage_form"
                    name="dosage_form"
                    value={formData.dosage_form}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn dạng thuốc --</option>
                    <option value="Viên nén">Viên nén</option>
                    <option value="Viên nang">Viên nang</option>
                    <option value="Viên sủi">Viên sủi</option>
                    <option value="Sirô">Sirô</option>
                    <option value="Thuốc tiêm">Thuốc tiêm</option>
                    <option value="Thuốc mỡ">Thuốc mỡ</option>
                    <option value="Thuốc nhỏ mắt">Thuốc nhỏ mắt</option>
                    <option value="Khác">Khác</option>
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiration_date">Hạn sử dụng</label>
                  <input
                    type="date"
                    id="expiration_date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="for_conditions">Công dụng</label>
                <input
                  type="text"
                  id="for_conditions"
                  name="for_conditions"
                  value={formData.for_conditions}
                  onChange={handleInputChange}
                  placeholder="Liệt kê các tình trạng, bệnh lý mà thuốc có thể điều trị"
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Hướng dẫn sử dụng</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="side_effects">Tác dụng phụ</label>
                  <textarea
                    id="side_effects"
                    name="side_effects"
                    value={formData.side_effects}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="storage">Bảo quản</label>
                  <input
                    type="text"
                    id="storage"
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                    placeholder="Điều kiện bảo quản"
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
    </div>
  );
};

export default Pharmaceutical;
