import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Input, message, Descriptions, Space, Row, Col, Image, Tag, Divider, Alert, Upload, Modal } from 'antd';
import { MedicineBoxOutlined, ArrowLeftOutlined, UserOutlined, CalendarOutlined, FileTextOutlined, CameraOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import MedicineDeclarationService from '../../../services/MedicineDeclarationService';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const generateDates = (start, end) => {
  const dates = [];
  let current = dayjs(start);
  const last = dayjs(end);
  while (current.isSameOrBefore(last, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }
  return dates;
};

const MedicineLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submission = location.state?.submission;

  const [dailyNotes, setDailyNotes] = useState({});
  const [dailyImages, setDailyImages] = useState({});
  const [markTakenDayLoading, setMarkTakenDayLoading] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [medicineLogsStatus, setMedicineLogsStatus] = useState({});
  
  // Modal states
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentNote, setCurrentNote] = useState('');
  const [currentImage, setCurrentImage] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isParent = user.userRole === 'ROLE_PARENT';

  // Fetch medicine logs status
  const fetchMedicineLogsStatus = async () => {
    if (!submission || !submission.id) {
      console.log('No submission or submission ID:', submission);
      return;
    }
    
    console.log('Fetching medicine logs for submission:', submission.id);
    try {
      const token = localStorage.getItem('token');
      const response = await MedicineDeclarationService.getMedicineSubmissionById(submission.id, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Medicine submission response:', response);
      
      if (response.data && response.data.medicineLogs) {
        console.log('Found medicine logs:', response.data.medicineLogs);
        const logsMap = {};
        response.data.medicineLogs.forEach(log => {
          console.log('Processing log:', log);
          console.log('Log status type:', typeof log.status, 'Value:', log.status);
          // Ensure date format consistency
          const logDate = dayjs(log.givenAt).format('YYYY-MM-DD');
          console.log('Log date formatted:', logDate, 'Original:', log.givenAt);
          logsMap[logDate] = {
            status: log.status,
            notes: log.notes,
            givenByName: log.givenByName,
            imageData: log.imageData
          };
          console.log('Stored in logsMap:', logsMap[logDate]);
        });
        console.log('Final logs map:', logsMap);
        setMedicineLogsStatus(logsMap);
      } else {
        console.log('No medicine logs found in response');
      }
    } catch (error) {
      console.error('Error fetching medicine logs:', error);
    }
  };

  useEffect(() => {
    if (!submission) {
      navigate('/donthuoc');
    } else {
      fetchMedicineLogsStatus();
    }
  }, [submission, navigate, refresh]);

  const handleMarkTakenByDay = async (date, isGiven = true) => {
    if (!submission) return;
    
    // Prevent double submission for the same status
    const logStatus = medicineLogsStatus[date];
    if (logStatus?.status === isGiven) {
      const statusText = isGiven ? 'đã được ghi nhận' : 'đã được đánh dấu là chưa uống';
      message.warning(`Thuốc ngày này ${statusText} rồi!`);
      return;
    }
    
    setMarkTakenDayLoading(prev => ({ ...prev, [date]: true }));
    try {
      const token = localStorage.getItem('token');
      const nurse = JSON.parse(localStorage.getItem('user') || '{}');
      const requestData = {
        givenByUserId: nurse.id,
        givenAt: date,
        notes: currentNote || dailyNotes[date] || '',
        status: isGiven // true = given, false = not given
      };
      console.log('Sending request data:', requestData);
      console.log('Status being sent:', isGiven, 'Type:', typeof isGiven);
      
      const formData = new FormData();
      formData.append(
        'request',
        new Blob(
          [
            JSON.stringify(requestData)
          ],
          { type: 'application/json' }
        )
      );
      if (currentImage) {
        formData.append('image', currentImage);
      } else if (dailyImages[date]) {
        formData.append('image', dailyImages[date]);
      }
      await MedicineDeclarationService.markMedicineTaken(submission.id, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const successMessage = isGiven 
        ? `Đã ghi nhận uống thuốc ngày ${dayjs(date).format('DD/MM/YYYY')}`
        : `Đã ghi nhận KHÔNG uống thuốc ngày ${dayjs(date).format('DD/MM/YYYY')}`;
      message.success(successMessage);
      setDailyNotes(prev => ({ ...prev, [date]: '' }));
      setDailyImages(prev => ({ ...prev, [date]: null }));
      
      // Close modal and reset modal state
      setCheckInModalOpen(false);
      setCurrentNote('');
      setCurrentImage(null);
      setSelectedDate(null);
      
      // Immediately update the status for this date
      setMedicineLogsStatus(prev => ({
        ...prev,
        [date]: {
          status: isGiven,
          notes: currentNote || dailyNotes[date] || '',
          givenByName: nurse.fullName || nurse.username || 'Bạn',
          imageData: null
        }
      }));
      // Also trigger a full refresh
      setTimeout(() => {
        fetchMedicineLogsStatus();
      }, 500);
    } catch (err) {
      message.error('Ghi nhận trạng thái uống thuốc thất bại!');
    }
    setMarkTakenDayLoading(prev => ({ ...prev, [date]: false }));
  };

  if (!submission) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            size="large"
            style={{ borderRadius: 8 }}
          >
            Quay lại
          </Button>
        </Col>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <MedicineBoxOutlined style={{ marginRight: 12 }} />
            Chi tiết thuốc
          </Title>
        </Col>
        <Col />
      </Row>

      {/* Thông tin học sinh và thuốc */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
          color: 'white'
        }}
        bordered={false}
      >
        <Space align="center" size={16}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'white' }}>{submission.studentName}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              Phụ huynh: {submission.parentName}
            </Text>
          </div>
        </Space>
      </Card>

      {/* Chi tiết đơn thuốc */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <FileTextOutlined style={{ marginRight: 8, color: '#15803d' }} />
            Thông tin đơn thuốc
          </span>
        }
        style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ color: '#666', fontSize: 14 }}>Hướng dẫn sử dụng:</Text>
              <Paragraph style={{ margin: '4px 0 0 0', fontSize: 15 }}>
                {submission.instruction}
              </Paragraph>
            </div>
            
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <CalendarOutlined style={{ color: '#52c41a', marginRight: 6 }} />
                  <Text strong style={{ fontSize: 12 }}>Bắt đầu:</Text>
                </div>
                <Text style={{ fontSize: 13 }}>{dayjs(submission.startDate).format('DD/MM/YYYY')}</Text>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <CalendarOutlined style={{ color: '#fa8c16', marginRight: 6 }} />
                  <Text strong style={{ fontSize: 12 }}>Kết thúc:</Text>
                </div>
                <Text style={{ fontSize: 13 }}>{dayjs(submission.endDate).format('DD/MM/YYYY')}</Text>
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <ClockCircleOutlined style={{ color: '#15803d', marginRight: 6 }} />
                <Text strong style={{ fontSize: 12 }}>Thời gian:</Text>
              </div>
              <Tag color="blue">{submission.duration} ngày</Tag>
            </div>

            {submission.notes && (
              <div style={{ marginTop: 16 }}>
                <Text strong style={{ color: '#666', fontSize: 14 }}>Ghi chú:</Text>
                <Paragraph style={{ margin: '4px 0 0 0', fontSize: 13, color: '#666' }}>
                  {submission.notes}
                </Paragraph>
              </div>
            )}
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#666', fontSize: 14 }}>Hình ảnh đơn thuốc:</Text>
              <div style={{ marginTop: 8 }}>
                {submission.imageData ? (
                  <Image
                    src={submission.imageData}
                    alt="Đơn thuốc"
                    style={{
                      width: '100%',
                      maxWidth: 300,
                      borderRadius: 12,
                      border: '1px solid #f0f0f0'
                    }}
                  />
                ) : (
                  <div style={{
                    height: 200,
                    background: '#f5f5f5',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <FileTextOutlined style={{ fontSize: 32, color: '#d9d9d9', marginBottom: 8 }} />
                    <Text type="secondary">Không có hình ảnh đơn thuốc</Text>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Ghi nhận uống thuốc (chỉ cho y tá) */}
      {!isParent && submission.submissionStatus === 'APPROVED' && (
        <Card
          title={
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              Ghi nhận uống thuốc từng ngày
            </span>
          }
          style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
          bodyStyle={{ padding: 24 }}
        >
          <Row gutter={[16, 24]}>
            {generateDates(submission.startDate, submission.endDate)
              .filter(date => {
                const dayOfWeek = dayjs(date).day();
                return dayOfWeek !== 0 && dayOfWeek !== 6; // 0: Chủ nhật, 6: Thứ 7
              })
              .map(date => {
                const today = dayjs().format('YYYY-MM-DD');
                const isTodayOrPast = dayjs(date).isSameOrBefore(today, 'day');
                const isToday = dayjs(date).isSame(today, 'day');
const logStatus = medicineLogsStatus[date];
                // Status logic: null = default (no action yet), true = given, false = not given
                const isCheckedIn = logStatus?.status !== null && logStatus?.status !== undefined;
                const isGiven = logStatus?.status === true;
                const isNotGiven = logStatus?.status === false;
                const isDefault = logStatus?.status === null || logStatus?.status === undefined;
                const dayOfWeek = dayjs(date).day(); // 0: Chủ nhật, 6: Thứ 7
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                
                console.log(`Status check for ${date}:`, {
                  logStatus,
                  statusValue: logStatus?.status,
                  statusType: typeof logStatus?.status,
                  isCheckedIn,
                  isGiven,
                  isNotGiven
                });
              
                console.log(`Date ${date}:`, {
                  logStatus,
                  isCheckedIn,
                  isTodayOrPast,
                  isToday,
                  'Available dates in medicineLogsStatus': Object.keys(medicineLogsStatus),
                  'Looking for date': date,
                  'Full medicineLogsStatus': medicineLogsStatus
                });
                
                return (
                  <Col xs={24} lg={12} key={date}>
                    <Card
                      size="small"
                      style={{
                        borderRadius: 12,
                        border: isGiven ? '2px solid #52c41a' : 
                               isNotGiven ? '2px solid #ff4d4f' :
                               isToday ? '2px solid #15803d' : '1px solid #f0f0f0',
                        background: isGiven ? '#f6ffed' : 
                                   isNotGiven ? '#fff2f0' :
                                   isToday ? '#f0fdf4' : 'white'
                      }}
                      title={
                        <Space>
                          <CalendarOutlined style={{ 
                            color: isCheckedIn ? '#52c41a' : 
                                  isToday ? '#15803d' : '#666' 
                          }} />
                          <Text strong style={{ 
                            color: isCheckedIn ? '#52c41a' : 
                                  isToday ? '#15803d' : '#333' 
                          }}>
                            {dayjs(date).format('DD/MM/YYYY')}
                          </Text>
                          {isGiven && <Tag color="green" icon={<CheckCircleOutlined />}>Đã uống</Tag>}
                          {isNotGiven && <Tag color="red" icon={<CloseOutlined />}>Không uống</Tag>}
                          {isDefault && !isToday && !isWeekend && <Tag color="default">Chưa ghi nhận</Tag>}
                          {isToday && !isCheckedIn && <Tag color="blue">Hôm nay</Tag>}
                          {!isTodayOrPast && !isCheckedIn && <Tag color="orange">Tương lai</Tag>}
                          {isWeekend && <Tag color="red">Cuối tuần</Tag>}
                        </Space>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        {isCheckedIn && (
                          <Alert
                            message={isGiven ? "Đã ghi nhận uống thuốc" : "Đã ghi nhận không uống thuốc"}
                            description={
                              <div>
                                {logStatus.givenByName && (
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    Ghi nhận bởi: {logStatus.givenByName}
                                  </Text>
                                )}
                                {logStatus.notes && (
                                  <div style={{ marginTop: 4 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                      Ghi chú: {logStatus.notes}
                                    </Text>
                                  </div>
                                )}
                              </div>
                            }
                            type={isGiven ? "success" : "warning"}
                            showIcon
                            style={{ marginBottom: 12 }}
                          />
                        )}
                        
                        {!isCheckedIn && (
                          <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            onClick={() => {
                              setSelectedDate(date);
                              setCheckInModalOpen(true);
                              setCurrentNote(logStatus?.notes || '');
                              setCurrentImage(dailyImages[date] || null);
                            }}
                            disabled={isWeekend || !isTodayOrPast}
                            style={{ width: '100%' }}
                          >
                            Ghi nhận
                          </Button>
                        )}
                        
                        {isCheckedIn && (
                          <Button 
                            type="default" 
                            icon={isGiven ? <CheckCircleOutlined /> : <CloseOutlined />}
                            disabled
                            style={{ 
                              width: '100%',
                              backgroundColor: isGiven ? '#f6ffed' : '#fff2f0',
                              borderColor: isGiven ? '#52c41a' : '#ff4d4f',
                              color: isGiven ? '#52c41a' : '#ff4d4f'
                            }}
                          >
                            {isGiven ? '✓ Đã xác nhận uống' : '✗ Đã xác nhận không uống'}
                          </Button>
                        )}
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        )}
      <Modal
        title={`Chi tiết ghi nhận ngày ${selectedDate}`}
        visible={checkInModalOpen}
        onCancel={() => setCheckInModalOpen(false)}
        footer={null}
      >
        <div>
          <Text strong style={{ fontSize: 12, color: '#666' }}>Ghi chú:</Text>
          <TextArea
            rows={2}
            placeholder="Ghi chú về việc uống thuốc..."
            value={currentNote}
            onChange={e => setCurrentNote(e.target.value)}
            style={{ marginTop: 4, borderRadius: 8 }}
          />
          
          <Text strong style={{ fontSize: 12, color: '#666', marginTop: 16 }}>Ảnh xác nhận:</Text>
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            onChange={(info) => {
              const file = info.file.originFileObj || info.file;
              setCurrentImage(file);
            }}
            maxCount={1}
            listType="picture-card"
            style={{ marginTop: 4 }}
          >
            {!currentImage && (
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8, fontSize: 12 }}>Tải ảnh</div>
              </div>
            )}
          </Upload>
          <Button
            type="primary"
            block
            style={{ marginTop: 16 }}
            onClick={() => handleMarkTakenByDay(selectedDate, true)}
          >
            Xác nhận đã uống thuốc
          </Button>
          
          <Button
            type="danger"
            block
            style={{ marginTop: 8 }}
            onClick={() => handleMarkTakenByDay(selectedDate, false)}
          >
            Xác nhận không uống thuốc
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MedicineLog;
