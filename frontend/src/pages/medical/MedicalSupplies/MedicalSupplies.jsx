import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, RefreshCw } from 'lucide-react';
import '../../../pages/nurse/NursePages.css';
import './MedicalSupplies.css';
const MedicalSupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [filteredSupplies, setFilteredSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // CRUD state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    location: '',
    expiration_date: '',
    condition: 'Tốt',
    notes: '',
  });

  // Get all supplies from API
  useEffect(() => {
    fetchSupplies();
  }, []);

  // Filter supplies when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSupplies(supplies);
    } else {
      const filtered = supplies.filter(
        supply => 
          supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supply.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supply.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSupplies(filtered);
    }
  }, [searchTerm, supplies]);

  const fetchSupplies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // API call would go here
      // const response = await fetch('api/supplies');
      // const data = await response.json();
      
      // For now, using mock data
      const mockData = [
        { 
          id: 1, 
          name: 'Băng gạc y tế', 
          category: 'Vật tư sơ cứu', 
          quantity: 50, 
          unit: 'cuộn', 
          location: 'Tủ A - Ngăn 1',
          expiration_date: '2024-12-31',
          condition: 'Tốt',
          notes: 'Sử dụng cho vết thương nhẹ, cần bổ sung thêm' 
        },
        { 
          id: 2, 
          name: 'Nhiệt kế điện tử', 
          category: 'Thiết bị đo', 
          quantity: 10, 
          unit: 'cái', 
          location: 'Tủ B - Ngăn 2',
          expiration_date: '',
          condition: 'Tốt',
          notes: 'Kiểm tra pin định kỳ' 
        },
        { 
          id: 3, 
          name: 'Khẩu trang y tế', 
          category: 'Vật tư bảo hộ', 
          quantity: 200, 
          unit: 'cái', 
          location: 'Tủ A - Ngăn 3',
          expiration_date: '2024-06-30',
          condition: 'Tốt',
          notes: '' 
        },
        { 
          id: 4, 
          name: 'Găng tay y tế', 
          category: 'Vật tư bảo hộ', 
          quantity: 150, 
          unit: 'đôi', 
          location: 'Tủ A - Ngăn 3',
          expiration_date: '2024-08-15',
          condition: 'Tốt',
          notes: 'Size S, M, L' 
        },
        { 
          id: 5, 
          name: 'Cồn y tế 70 độ', 
          category: 'Dung dịch sát khuẩn', 
          quantity: 20, 
          unit: 'chai', 
          location: 'Tủ C - Ngăn 1',
          expiration_date: '2024-10-20',
          condition: 'Tốt',
          notes: 'Chai 250ml' 
        }
      ];
      
      setSupplies(mockData);
      setFilteredSupplies(mockData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching supplies:', err);
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
      category: '',
      quantity: '',
      unit: '',
      location: '',
      expiration_date: '',
      condition: 'Tốt',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (supply) => {
    setIsEditMode(true);
    setCurrentSupply(supply);
    setFormData({
      name: supply.name,
      category: supply.category,
      quantity: supply.quantity,
      unit: supply.unit,
      location: supply.location,
      expiration_date: supply.expiration_date || '',
      condition: supply.condition,
      notes: supply.notes || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity || !formData.unit || !formData.location) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    try {
      if (isEditMode) {
        // Update existing supply
        // API call would go here
        // await fetch(`api/supplies/${currentSupply.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        // Update local state
        const updatedSupplies = supplies.map(supply => 
          supply.id === currentSupply.id ? { ...supply, ...formData } : supply
        );
        setSupplies(updatedSupplies);
      } else {
        // Add new supply
        // API call would go here
        // const response = await fetch('api/supplies', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        // const newSupply = await response.json();
        
        // Mock response
        const newSupply = {
          id: supplies.length + 1,
          ...formData
        };
        
        setSupplies([...supplies, newSupply]);
      }
      
      closeModal();
    } catch (err) {
      console.error('Error saving supply:', err);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const handleDelete = async (supplyId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vật tư y tế này không?')) {
      return;
    }
    
    try {
      // API call would go here
      // await fetch(`api/supplies/${supplyId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      const updatedSupplies = supplies.filter(supply => supply.id !== supplyId);
      setSupplies(updatedSupplies);
    } catch (err) {
      console.error('Error deleting supply:', err);
      alert('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="nurse-page">
      <div className="page-header">
        <h1>Quản Lý Vật Tư Y Tế</h1>
        <div className="header-actions">
          <button className="refresh-button" onClick={fetchSupplies}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className="add-button" onClick={openAddModal}>
            <Plus size={16} />
            Thêm vật tư
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm vật tư y tế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-results">
          {searchTerm && `Tìm thấy ${filteredSupplies.length} kết quả`}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchSupplies}>Thử lại</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên vật tư</th>
                <th>Danh mục</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Vị trí lưu trữ</th>
                <th>Hạn sử dụng</th>
                <th>Tình trạng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSupplies.length > 0 ? (
                filteredSupplies.map((supply) => (
                  <tr key={supply.id}>
                    <td>{supply.name}</td>
                    <td>{supply.category}</td>
                    <td>{supply.quantity}</td>
                    <td>{supply.unit}</td>
                    <td>{supply.location}</td>
                    <td>{supply.expiration_date || 'Không có'}</td>
                    <td>{supply.condition}</td>
                    <td className="actions">
                      <button 
                        className="edit-button" 
                        onClick={() => openEditModal(supply)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(supply.id)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
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
              <h2>{isEditMode ? 'Chỉnh sửa vật tư y tế' : 'Thêm vật tư y tế mới'}</h2>
              <button className="close-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Tên vật tư <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Danh mục <span className="required">*</span></label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="condition">Tình trạng</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Cần bảo trì">Cần bảo trì</option>
                    <option value="Hư hỏng">Hư hỏng</option>
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Vị trí lưu trữ <span className="required">*</span></label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
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
                <label htmlFor="notes">Ghi chú</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
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

export default MedicalSupplies;
