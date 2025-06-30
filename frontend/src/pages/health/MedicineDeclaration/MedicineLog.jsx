import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Input, message, Descriptions, Space, Row, Col, Image, Tag, Divider, Alert, Upload } from 'antd';
import { MedicineBoxOutlined, ArrowLeftOutlined, UserOutlined, CalendarOutlined, FileTextOutlined, CameraOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
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

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isParent = user.userRole === 'ROLE_PARENT';

  useEffect(() => {
    if (!submission) {
      navigate('/donthuoc');
    }
  }, [submission, navigate]);

  const handleMarkTakenByDay = async (date) => {
    if (!submission) return;
    setMarkTakenDayLoading(prev => ({ ...prev, [date]: true }));
    try {
      const token = localStorage.getItem('token');
      const nurse = JSON.parse(localStorage.getItem('user') || '{}');
      const formData = new FormData();
      formData.append(
        'request',
        new Blob(
          [
            JSON.stringify({
              givenByUserId: nurse.id,
              givenAt: date,
              notes: dailyNotes[date] || ''
            })
          ],
          { type: 'application/json' }
        )
      );
      if (dailyImages[date]) {
        formData.append('image', dailyImages[date]);
      }
      await MedicineDeclarationService.markMedicineTaken(submission.id, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success(`Đã ghi nhận uống thuốc ngày ${dayjs(date).format('DD/MM/YYYY')}`);
      setDailyNotes(prev => ({ ...prev, [date]: '' }));
      setDailyImages(prev => ({ ...prev, [date]: null }));
      setRefresh(r => !r);
    } catch (err) {
      message.error('Ghi nhận uống thuốc thất bại!');
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
            {generateDates(submission.startDate, submission.endDate).map(date => {
              const today = dayjs().format('YYYY-MM-DD');
              const isTodayOrPast = dayjs(date).isSameOrBefore(today, 'day');
              const isToday = dayjs(date).isSame(today, 'day');
              
              return (
                <Col xs={24} lg={12} key={date}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: 12,
                      border: isToday ? '2px solid #15803d' : '1px solid #f0f0f0',
                      background: isToday ? '#f0fdf4' : 'white'
                    }}
                    title={
                      <Space>
                        <CalendarOutlined style={{ color: isToday ? '#15803d' : '#666' }} />
                        <Text strong style={{ color: isToday ? '#15803d' : '#333' }}>
                          {dayjs(date).format('DD/MM/YYYY')}
                        </Text>
                        {isToday && <Tag color="green">Hôm nay</Tag>}
                        {!isTodayOrPast && <Tag color="orange">Tương lai</Tag>}
                      </Space>
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size={12}>
                      <div>
                        <Text strong style={{ fontSize: 12, color: '#666' }}>Ghi chú:</Text>
                        <TextArea
                          rows={2}
                          placeholder="Ghi chú về việc uống thuốc..."
                          value={dailyNotes[date] || ''}
                          onChange={e => setDailyNotes(prev => ({ ...prev, [date]: e.target.value }))}
                          disabled={!isTodayOrPast}
                          style={{ marginTop: 4, borderRadius: 8 }}
                        />
                      </div>
                      
                      <div>
                        <Text strong style={{ fontSize: 12, color: '#666' }}>Ảnh xác nhận:</Text>
                        <Upload
                          accept="image/*"
                          beforeUpload={() => false}
                          onChange={(info) => {
                            const file = info.file.originFileObj || info.file;
                            setDailyImages(prev => ({ ...prev, [date]: file }));
                          }}
                          disabled={!isTodayOrPast}
                          maxCount={1}
                          listType="picture-card"
                          style={{ marginTop: 4 }}
                        >
                          {!dailyImages[date] && (
                            <div>
                              <CameraOutlined />
                              <div style={{ marginTop: 8, fontSize: 12 }}>Tải ảnh</div>
                            </div>
                          )}
                        </Upload>
                        {dailyImages[date] && (
                          <Image
                            src={URL.createObjectURL(dailyImages[date])}
                            alt="Ảnh xác nhận"
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              objectFit: 'cover',
                              marginTop: 8
                            }}
                          />
                        )}
                      </div>
                      
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        loading={markTakenDayLoading[date]}
                        onClick={() => handleMarkTakenByDay(date)}
                        disabled={!isTodayOrPast || !dailyImages[date]}
                        style={{ borderRadius: 8, width: '100%' }}
                      >
                        Xác nhận đã uống thuốc
                      </Button>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default MedicineLog;