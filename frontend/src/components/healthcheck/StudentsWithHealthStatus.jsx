import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Badge, Typography } from 'antd';
import HealthCheckService from '../../services/HealthCheckService';

const { Title } = Typography;

const StudentsWithHealthStatus = ({ campaignId }) => {
    const [studentsWithStatus, setStudentsWithStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStudentsWithStatus = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await HealthCheckService.getStudentsWithHealthStatus(campaignId, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Handle different response structures
                const students = Array.isArray(data) ? data : (data.data || data.students || []);
                setStudentsWithStatus(students);
            } catch (error) {
                console.error('Error fetching students with status:', error);
                setError('Không thể tải danh sách trạng thái học sinh');
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchStudentsWithStatus();
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
            title: 'Mã học sinh',
            dataIndex: 'studentId',
            key: 'studentId',
            render: (text, record) => record.studentId || record.id || record.studentCode || 'N/A',
            width: 100,
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                const status = record.status || record.healthStatus || record.checkStatus || record.parentConfirmation;
                
                // Map different status values to display text and color
                let displayText = 'Chưa xác định';
                let badgeStatus = 'default';
                
                if (status === true || status === 'true' || status === 'COMPLETED' || status === 'Completed') {
                    displayText = 'Đã hoàn thành';
                    badgeStatus = 'success';
                } else if (status === false || status === 'false' || status === 'PENDING' || status === 'In Progress') {
                    displayText = 'Chờ kiểm tra';
                    badgeStatus = 'processing';
                } else if (status === 'REJECTED' || status === 'Rejected') {
                    displayText = 'Từ chối';
                    badgeStatus = 'error';
                } else if (status === 'REGISTERED' || status === 'Registered') {
                    displayText = 'Đã đăng ký';
                    badgeStatus = 'processing';
                }
                
                return (
                    <Badge
                        status={badgeStatus}
                        text={displayText}
                    />
                );
            },
        },
        {
            title: 'Lịch kiểm tra',
            dataIndex: 'checkDate',
            key: 'checkDate',
            render: (text, record) => {
                const dateValue = record.checkDate || record.healthCheckDate || record.examinationDate || record.scheduledDate;
                if (!dateValue) return 'Chưa có lịch';
                
                // Handle different date formats
                if (Array.isArray(dateValue) && dateValue.length === 3) {
                    // Format [year, month, day] array
                    const [year, month, day] = dateValue;
                    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
                }
                
                if (typeof dateValue === 'string') {
                    // Check if it's a valid date string first
                    if (dateValue === '' || dateValue === 'null' || dateValue === 'undefined') {
                        return 'Chưa có lịch';
                    }
                    
                    // Try to parse and format string dates
                    try {
                        const date = new Date(dateValue);
                        if (!isNaN(date.getTime())) {
                            return date.toLocaleDateString('vi-VN');
                        } else {
                            // If can't parse, return the original string
                            return dateValue;
                        }
                    } catch (e) {
                        // If parsing fails, return as is
                        return dateValue;
                    }
                }
                
                // For other data types, convert to string
                return String(dateValue);
            },
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '10px' }}>Đang tải danh sách trạng thái học sinh...</div>
            </div>
        );
    }

    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <div>
            <Title level={4}>Trạng thái kiểm tra sức khỏe ({studentsWithStatus.length} học sinh)</Title>
            <Table
                columns={columns}
                dataSource={studentsWithStatus}
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

export default StudentsWithHealthStatus;
