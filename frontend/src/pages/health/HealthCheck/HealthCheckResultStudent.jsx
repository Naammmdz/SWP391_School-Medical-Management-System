import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Avatar, Button, Collapse, Row, Col, Tag } from 'antd';
import { UserOutlined, ArrowLeftOutlined, CheckCircleTwoTone, CloseCircleTwoTone, InfoCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { FaRegCalendarCheck, FaNotesMedical } from 'react-icons/fa';
import HealthCheckService from '../../../services/HealthCheckService';

const { Panel } = Collapse;

const HealthCheckResultStudent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState({ fullName: '', className: '' });
  const [campaignName, setcampaignName] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);

  const studentId = localStorage.getItem('selectedStudentId');
  const token = localStorage.getItem('token');

  // Lấy thông tin học sinh từ localStorage
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const found = students.find(s => String(s.studentId) === String(studentId));
    if (found) {
      setStudentInfo({ fullName: found.fullName, className: found.className });
    } else {
      setStudentInfo({ fullName: '', className: '' });
    }
  }, [studentId]);

  // Lấy map {campaignId: campaignName} từ API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setCampaignsLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const campaigns = await HealthCheckService.getAllHealthCheckCampaign(config);
        const map = {};
        if (Array.isArray(campaigns)) {
          campaigns.forEach(c => {
            map[c.campaignId] = c.campaignName;
          });
        }
        setcampaignName(map);
        console.log('Campaign map loaded:', map);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        // Fallback to localStorage if API fails
        const campaigns = JSON.parse(localStorage.getItem('healthCheckCampaigns') || '[]');
        const map = {};
        campaigns.forEach(c => {
          map[c.campaignId] = c.campaignName;
        });
        setcampaignName(map);
      } finally {
        setCampaignsLoading(false);
      }
    };
    fetchCampaigns();
  }, [token]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!studentId) {
        setError('Vui lòng chọn học sinh ở trang trước.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const data = await HealthCheckService.getResultByStudentId(studentId, config);
        console.log('Kết quả kiểm tra sức khỏe:', data);
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setResults([data]);
          console.log('Kết quả kiểm tra sức khỏe:', data);
        } else if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError('Không thể lấy kết quả kiểm tra sức khỏe.');
      }
      setLoading(false);
    };
    fetchResults();
  }, [studentId, token]);

  // Lọc các kết quả đã được phụ huynh xác nhận
  const confirmedResults = results.filter(r => r.parentConfirmation);

  const handleBack = () => {
    window.history.back();
  };

  const toggleExpand = key => {
    setExpandedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: 16, background: '#f4f8fb', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px #e6f7ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
          <div>
            <h2 style={{ margin: 0, color: '#1890ff', fontWeight: 700 }}>Kết quả kiểm tra sức khỏe của học sinh</h2>
            {studentInfo.fullName && (
              <div style={{ marginTop: 8, fontSize: 16 }}>
                <b>Họ tên:</b> {studentInfo.fullName} &nbsp; | &nbsp;
                <b>Lớp:</b> {studentInfo.className}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }} />
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack} 
            size="large"
            style={{
              backgroundColor: '#f0f7ff',
              borderColor: '#d6e4ff',
              color: '#597ef7'
            }}
          >
            Quay lại
          </Button>
        </div>
      </Card>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin tip="Đang tải kết quả..." size="large" />
          </div>
        ) : confirmedResults.length === 0 ? (
          <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #e6f7ff', textAlign: 'center', color: '#bfbfbf', padding: '32px 0' }}>
            <InfoCircleOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <div>Không có kết quả kiểm tra sức khỏe đã xác nhận.</div>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {confirmedResults.map((result, idx) => {
              const key = `${result.studentId}-${result.campaignId}-${result.date}`;
              const isExpanded = expandedKeys.includes(key);
              return (
                <Col xs={24} sm={24} md={12} lg={12} key={key}>
                  <Card
                    hoverable
                    style={{ borderRadius: 14, boxShadow: '0 2px 8px #e6f7ff', marginBottom: 0, background: '#fff' }}
                    bodyStyle={{ padding: 20 }}
                    onClick={() => toggleExpand(key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 18, color: '#1890ff' }}>
                          {campaignName[result.campaignId] || `Chiến dịch #${result.campaignId}`}
                        </div>
                        <div style={{ margin: '8px 0', color: '#555' }}>
                          <FaRegCalendarCheck style={{ color: '#1890ff', marginRight: 6 }} />
                          <span style={{ fontSize: 15 }}>{result.date}</span>
                        </div>
                        <div>
                          <Tag color={result.parentConfirmation ? 'success' : 'error'}>
                            {result.parentConfirmation ? (
                              <span><CheckCircleTwoTone twoToneColor="#52c41a" /> Đã xác nhận</span>
                            ) : (
                              <span><CloseCircleTwoTone twoToneColor="#ff4d4f" /> Chưa xác nhận</span>
                            )}
                          </Tag>
                        </div>
                      </div>
                      <div style={{ marginLeft: 16, fontSize: 22, color: '#1890ff' }}>
                        {isExpanded ? <UpOutlined /> : <DownOutlined />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 18, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                        <Row gutter={[12, 12]}>
                          <Col span={12}><b>Chiều cao:</b> {result.height} cm</Col>
                          <Col span={12}><b>Cân nặng:</b> {result.weight} kg</Col>
                          <Col span={12}><b>Thị lực trái:</b> {result.eyesightLeft}</Col>
                          <Col span={12}><b>Thị lực phải:</b> {result.eyesightRight}</Col>
                          <Col span={12}><b>Huyết áp:</b> {result.bloodPressure}</Col>
                          <Col span={12}><b>Thính lực trái:</b> {result.hearingLeft}</Col>
                          <Col span={12}><b>Thính lực phải:</b> {result.hearingRight}</Col>
                          <Col span={12}><b>Nhiệt độ:</b> {result.temperature} °C</Col>
                          <Col span={12}><b>Đặt lịch tư vấn:</b> {result.consultationAppointment ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />}</Col>
                          <Col span={24} style={{ marginTop: 8 }}>
                            <b><FaNotesMedical style={{ color: '#faad14', marginRight: 4 }} />Ghi chú:</b> {result.notes || <span style={{ color: '#bfbfbf' }}>Không có</span>}
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HealthCheckResultStudent;