import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Input, message, Descriptions } from 'antd';
import { MedicineBoxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MedicineDeclarationService from '../../../services/MedicineDeclarationService';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;

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
    <div style={{ maxWidth: 700, margin: '32px auto' }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: 24,
          background: '#f9fafb'
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>
        <Title level={3} style={{ color: '#2563eb', marginBottom: 16 }}>
          <MedicineBoxOutlined /> Chi tiết thuốc cho học sinh: <b>{submission.studentName}</b>
        </Title>
        <p><b>Phụ huynh:</b> {submission.parentName}</p>
        <p><b>Hướng dẫn sử dụng:</b> {submission.instruction}</p>
        <p><b>Thời gian dùng:</b> {submission.startDate} → {submission.endDate} ({submission.duration} ngày)</p>
        <p><b>Ghi chú:</b> {submission.notes}</p>
        <h4>Hình ảnh đơn thuốc:</h4>
        {submission.imageData ? (
          <img
            src={submission.imageData}
            alt="Đơn thuốc"
            style={{
              maxWidth: 350,
              maxHeight: 250,
              borderRadius: 8,
              border: '1px solid #eee',
              marginTop: 8
            }}
          />
        ) : (
          <p style={{ color: '#888' }}>Không có hình ảnh đơn thuốc.</p>
        )}

        {/* Danh sách các ngày uống thuốc */}
        {!isParent && submission.submissionStatus === 'APPROVED' && (
          <div style={{ marginTop: 24 }}>
            <h4>Chấm công uống thuốc từng ngày:</h4>
            {generateDates(submission.startDate, submission.endDate).map(date => {
              const today = dayjs().format('YYYY-MM-DD');
              const isTodayOrPast = dayjs(date).isSameOrBefore(today, 'day');
              return (
                <Descriptions
                  key={date}
                  column={1}
                  bordered
                  size="small"
                  style={{ marginBottom: 16, background: '#f6f8fa' }}
                  title={dayjs(date).format('DD/MM/YYYY')}
                >
                  <Descriptions.Item label="Ghi chú">
                    <Input.TextArea
                      rows={2}
                      placeholder="Ghi chú (nếu có)"
                      value={dailyNotes[date] || ''}
                      onChange={e => setDailyNotes(prev => ({ ...prev, [date]: e.target.value }))}
                      disabled={!isTodayOrPast}
                      style={{ width: 220 }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ảnh xác nhận">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setDailyImages(prev => ({ ...prev, [date]: e.target.files[0] || null }))}
                      disabled={!isTodayOrPast}
                    />
                    {dailyImages[date] && (
                      <img
                        src={URL.createObjectURL(dailyImages[date])}
                        alt="Ảnh xác nhận"
                        style={{
                          maxWidth: 120,
                          maxHeight: 80,
                          borderRadius: 6,
                          border: '1px solid #eee',
                          marginTop: 8
                        }}
                      />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="">
                    <Button
                      icon={<MedicineBoxOutlined />}
                      type="primary"
                      loading={markTakenDayLoading[date]}
                      onClick={() => handleMarkTakenByDay(date)}
                      disabled={!isTodayOrPast || !dailyImages[date]}
                    >
                      Xác nhận đã uống thuốc ngày {dayjs(date).format('DD/MM/YYYY')}
                    </Button>
                  </Descriptions.Item>
                </Descriptions>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicineLog;