import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Row, Col, Tabs, message, Divider } from 'antd';
import { SearchOutlined, MedicineBoxOutlined, TeamOutlined } from '@ant-design/icons';
import AllStudentsInCampaign from '../../../components/vaccination/AllStudentsInCampaign';
import StudentsWithVaccinationStatus from '../../../components/vaccination/StudentsWithVaccinationStatus';
import VaccinationService from '../../../services/VaccinationService';

const { Title, Text, Paragraph } = Typography;

const VaccinationStudentDemo = () => {
  const [campaignId, setCampaignId] = useState('');
  const [campaignInfo, setCampaignInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCampaignInfo = async () => {
    if (!campaignId) {
      message.error('Vui lòng nhập ID chiến dịch');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await VaccinationService.getVaccinationCampaignById(campaignId, config);
      setCampaignInfo(response.data || response);
      message.success('Đã tải thông tin chiến dịch');
    } catch (error) {
      console.error('Error fetching campaign info:', error);
      message.error('Không thể tải thông tin chiến dịch');
      setCampaignInfo(null);
    }
    setLoading(false);
  };

  const tabItems = [
    {
      key: 'eligible',
      label: (
        <span>
          <TeamOutlined />
          Học sinh đủ điều kiện
        </span>
      ),
      children: (
        <div>
          <Paragraph type="secondary">
            API này trả về danh sách tất cả học sinh đủ điều kiện tham gia chiến dịch dựa trên target group được thiết lập.
          </Paragraph>
          {campaignId && (
            <AllStudentsInCampaign 
              campaignId={parseInt(campaignId)} 
              campaignInfo={campaignInfo}
            />
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: (
        <span>
          <MedicineBoxOutlined />
          Trạng thái tiêm chủng
        </span>
      ),
      children: (
        <div>
          <Paragraph type="secondary">
            API này trả về danh sách học sinh với trạng thái chi tiết về phụ huynh xác nhận và kết quả tiêm chủng.
          </Paragraph>
          {campaignId && (
            <StudentsWithVaccinationStatus 
              campaignId={parseInt(campaignId)} 
              campaignInfo={campaignInfo}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Row justify="center" style={{ marginBottom: 32 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2} style={{ color: '#52c41a', marginBottom: 8 }}>
            <MedicineBoxOutlined style={{ marginRight: 12 }} />
            Demo API Quản lý Học sinh Tiêm chủng
          </Title>
          <Text style={{ fontSize: '16px', color: '#8c8c8c' }}>
            Thử nghiệm các API mới cho việc quản lý học sinh trong chiến dịch tiêm chủng
          </Text>
        </Col>
      </Row>

      {/* Campaign Input */}
      <Card 
        title="Thông tin chiến dịch" 
        style={{ marginBottom: 24, borderRadius: 8 }}
        size="small"
      >
        <Row gutter={[16, 16]} align="middle">
          <Col span={12}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Nhập ID chiến dịch tiêm chủng..."
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                onPressEnter={fetchCampaignInfo}
                size="large"
              />
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={fetchCampaignInfo}
                loading={loading}
                size="large"
              >
                Tìm kiếm
              </Button>
            </Space.Compact>
          </Col>
          <Col span={12}>
            {campaignInfo && (
              <div>
                <Text strong style={{ color: '#52c41a' }}>
                  {campaignInfo.campaignName || campaignInfo.title}
                </Text>
                <br />
                <Text type="secondary">
                  Đối tượng: {campaignInfo.targetGroup}
                </Text>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* API Information */}
      <Card 
        title="Thông tin API" 
        style={{ marginBottom: 24, borderRadius: 8 }}
        size="small"
      >
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <div style={{ padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px', border: '1px solid #b7eb8f' }}>
              <Title level={5} style={{ color: '#52c41a', marginBottom: 8 }}>
                API 1: Lấy tất cả học sinh đủ điều kiện
              </Title>
              <Text strong>Endpoint:</Text> <Text code>GET /{'{campaignId}'}/all-students</Text>
              <br />
              <Text strong>Mô tả:</Text> Trả về danh sách học sinh có thể tham gia chiến dịch theo target group
            </div>
          </Col>
          <Col span={12}>
            <div style={{ padding: '16px', backgroundColor: '#fff2e8', borderRadius: '6px', border: '1px solid #ffbb96' }}>
              <Title level={5} style={{ color: '#fa8c16', marginBottom: 8 }}>
                API 2: Lấy học sinh với trạng thái tiêm chủng
              </Title>
              <Text strong>Endpoint:</Text> <Text code>GET /{'{campaignId}'}/students-with-status</Text>
              <br />
              <Text strong>Mô tả:</Text> Trả về học sinh với trạng thái xác nhận PH và kết quả tiêm
            </div>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Demo Tabs */}
      {campaignId ? (
        <Tabs
          items={tabItems}
          size="large"
          style={{ marginTop: 16 }}
        />
      ) : (
        <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Vui lòng nhập ID chiến dịch để xem demo các API
          </Text>
        </Card>
      )}
    </div>
  );
};

export default VaccinationStudentDemo;
