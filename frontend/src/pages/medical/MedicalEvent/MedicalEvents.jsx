import React, { useState, useEffect } from 'react';
import MedicalEventService from '../../../services/MedicalEventService';
import InventoryService from '../../../services/InventoryService';

const severityLevels = [
  { value: 'MINOR', label: 'Nhẹ' },
  { value: 'MODERATE', label: 'Trung bình' },
  { value: 'SEVERE', label: 'Nặng' }
];
const statusOptions = [
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'RESOLVED', label: 'Đã xử lý' }
];

const boxStyle = {
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: 24,
  marginBottom: 24
};
const labelStyle = { fontWeight: 600, marginBottom: 4, display: 'block' };
const inputStyle = { marginBottom: 16, width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' };
const rowStyle = { display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 };

const MedicalEvents = () => {
  const [students, setStudents] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [relatedItemUsed, setRelatedItemUsed] = useState([]);
  const [form, setForm] = useState({
    title: '',
    eventType: '',
    eventDate: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    notes: '',
    handlingMeasures: '',
    severityLevel: 'MINOR',
    status: 'PROCESSING'
  });
  const [loading, setLoading] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch {
        setStudents([]);
      }
    }
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await InventoryService.getInventoryList(config);
        setInventoryItems(Array.isArray(res) ? res : []);
      } catch {
        setInventoryItems([]);
      }
    };
    fetchInventory();
  }, []);

  const addItemRow = () => {
    setRelatedItemUsed([
      ...relatedItemUsed,
      { itemId: '', quantityUsed: 1, notes: '' }
    ]);
  };
  const removeItemRow = idx => {
    setRelatedItemUsed(relatedItemUsed.filter((_, i) => i !== idx));
  };
  const updateItemRow = (idx, field, value) => {
    const updated = [...relatedItemUsed];
    updated[idx][field] = value;
    setRelatedItemUsed(updated);
  };

  const handleStudentCheckbox = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const classList = Array.from(new Set(students.map(stu => stu.className))).sort();
  const filteredStudents = students.filter(stu =>
    (classFilter === '' || stu.className === classFilter) &&
    (nameFilter === '' || stu.fullName.toLowerCase().includes(nameFilter.toLowerCase()))
  );

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.eventType || !form.eventDate || selectedStudents.length === 0) {
      alert('Vui lòng nhập đủ thông tin bắt buộc và chọn học sinh!');
      return;
    }
    const validItems = relatedItemUsed.filter(item => item.itemId !== '' && item.itemId !== undefined && item.itemId !== null);
    if (validItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thuốc/vật tư đã dùng!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        ...form,
        stuId: selectedStudents,
        relatedItemUsed: validItems.map(item => ({
          ...item,
          itemId: Number(item.itemId)
        })),
        eventDate: new Date(form.eventDate).toISOString()
      };
      await MedicalEventService.createMedicalEvent(payload, config);
      alert('Tạo sự kiện y tế thành công!');
      setForm({
        title: '', eventType: '', eventDate: new Date().toISOString().split('T')[0],
        location: '', description: '', notes: '', handlingMeasures: '', severityLevel: 'MINOR', status: 'PROCESSING'
      });
      setSelectedStudents([]);
      setRelatedItemUsed([]);
    } catch (err) {
      alert('Có lỗi khi tạo sự kiện y tế!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', background: '#f6f8fa', padding: 32, borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Tạo sự kiện y tế</h2>
      <form onSubmit={handleSubmit}>
        <div style={boxStyle}>
          <div style={rowStyle}>
            <label style={labelStyle}>Tiêu đề*:</label>
            <input style={inputStyle} type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Loại sự kiện*:</label>
            <input style={inputStyle} type="text" value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} required />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Ngày xảy ra*:</label>
            <input style={inputStyle} type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} required />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Địa điểm:</label>
            <input style={inputStyle} type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>
        <div style={boxStyle}>
          <label style={labelStyle}>Lọc học sinh:</label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <select style={inputStyle} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
              <option value="">Tất cả lớp</option>
              {classList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <input
              style={inputStyle}
              type="text"
              placeholder="Tìm theo tên học sinh"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #eee', borderRadius: 4, padding: 8 }}>
            {filteredStudents.length === 0 && <div style={{ color: '#888' }}>Không có học sinh phù hợp</div>}
            {filteredStudents.map(stu => (
              <label key={stu.studentId} style={{ minWidth: 180, display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(stu.studentId)}
                  onChange={() => handleStudentCheckbox(stu.studentId)}
                />
                {stu.fullName} - {stu.className}
              </label>
            ))}
          </div>
        </div>
        <div style={boxStyle}>
          <label style={labelStyle}>Mô tả:</label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <label style={labelStyle}>Biện pháp xử lý:</label>
          <input style={inputStyle} type="text" value={form.handlingMeasures} onChange={e => setForm({ ...form, handlingMeasures: e.target.value })} />
          <div style={rowStyle}>
            <label style={labelStyle}>Mức độ nghiêm trọng:</label>
            <select style={inputStyle} value={form.severityLevel} onChange={e => setForm({ ...form, severityLevel: e.target.value })}>
              {severityLevels.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={boxStyle}>
          <label style={labelStyle}>Thuốc/vật tư đã dùng*:</label>
          {relatedItemUsed.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}>
              <select
                style={{ ...inputStyle, width: 180, marginBottom: 0 }}
                value={item.itemId !== undefined && item.itemId !== null ? String(item.itemId) : ''}
                onChange={e => updateItemRow(idx, 'itemId', e.target.value)}
                required
              >
                <option value="">Chọn thuốc/vật tư</option>
                {inventoryItems.map(inv => (
                  <option key={inv.itemId || inv.id} value={String(inv.itemId || inv.id)}>{inv.name}</option>
                ))}
              </select>
              <input
                style={{ ...inputStyle, width: 60, marginBottom: 0 }}
                type="number"
                min={1}
                value={item.quantityUsed}
                onChange={e => updateItemRow(idx, 'quantityUsed', e.target.value)}
                required
              />
              <input
                style={{ ...inputStyle, width: 120, marginBottom: 0 }}
                type="text"
                value={item.notes}
                onChange={e => updateItemRow(idx, 'notes', e.target.value)}
                placeholder="Ghi chú"
              />
              <button type="button" onClick={() => removeItemRow(idx)} style={{ padding: '4px 10px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4 }}>Xóa</button>
            </div>
          ))}
          <button type="button" onClick={addItemRow} style={{ marginTop: 8, padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Thêm thuốc/vật tư</button>
        </div>
        <div style={boxStyle}>
          <label style={labelStyle}>Ghi chú:</label>
          <input style={inputStyle} type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div style={rowStyle}>
            <label style={labelStyle}>Trạng thái:</label>
            <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#43a047', color: '#fff', fontWeight: 600, fontSize: 18, border: 'none', borderRadius: 6 }}>
          {loading ? 'Đang gửi...' : 'Tạo sự kiện'}
        </button>
      </form>
    </div>
  );
};

export default MedicalEvents;
