import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Typography } from 'antd';
import HealthCheckService from '../../services/HealthCheckService';

const { Title } = Typography;

const AllStudentsInHealthCheckCampaign = ({ campaignId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await HealthCheckService.getAllStudentsInCampaign(campaignId, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Handle different response structures
                const students = Array.isArray(data) ? data : (data.data || data.students || []);
                setStudents(students);
            } catch (error) {
                console.error('Error fetching students:', error);
                setError('Không thể tải danh sách học sinh');
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchStudents();
        }
    }, [campaignId, token]);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: 'Tên học sinh',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => record.name || record.fullName || record.studentName || 'N/A',
        },
        {
            title: 'Lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text, record) => record.className || record.class || record.grade || 'N/A',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (text, record) => record.dateOfBirth || record.birthDate || record.dob || 'N/A',
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '10px' }}>Đang tải danh sách học sinh...</div>
            </div>
        );
    }

    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <div>
            <Title level={4}>Học sinh đủ điều kiện tham gia ({students.length} học sinh)</Title>
            <Table
                columns={columns}
                dataSource={students}
                rowKey={record => record.id || record.studentId}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Tổng cộng ${total} học sinh`,
                }}
                size="small"
                scroll={{ y: 300 }}
            />
        </div>
    );
};

export default AllStudentsInHealthCheckCampaign;
