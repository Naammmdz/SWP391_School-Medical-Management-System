import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from "antd";
import UserService from "../../services/UserService";
import "./UserManagement.css";

const { Option } = Select;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Lấy token lưu ở localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };

    // Data mẫu (mock) nếu API lỗi
    const mockUsers = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            email: "nguyenvana@gmail.com",
            phone: "0912345678",
            userRole: "ADMIN",
        },
        {
            id: 2,
            name: "Trần Thị B",
            email: "tranthib@gmail.com",
            phone: "0909876543",
            userRole: "NURSE",
        },
        {
            id: 3,
            name: "Lê Văn C",
            email: "levanc@gmail.com",
            phone: "0988123456",
            userRole: "PARENT",
        },
    ];

    // Hàm lấy danh sách người dùng, mock nếu API lỗi
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await UserService.getAllUsers(config);
            setUsers(res.data);
        } catch {
            message.warning("API lỗi. Dùng dữ liệu mẫu.");
            setUsers(mockUsers);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    // Hiển thị form thêm/sửa
    const openModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
        setModalOpen(true);
    };

    // Thêm hoặc cập nhật user, mock nếu API lỗi khi tạo mới
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingUser) {
                await UserService.updateUser(editingUser.id, values, config);
                message.success("Cập nhật thành công");
                setModalOpen(false);
                fetchUsers();
            } else {
                try {
                    await UserService.createUser(values, config);
                    message.success("Tạo mới thành công");
                    setModalOpen(false);
                    fetchUsers();
                } catch {
                    message.warning("API lỗi. Thêm dữ liệu mới vào danh sách tạm thời.");
                    setUsers(prev => [
                        ...prev,
                        { ...values, id: Date.now(), userRole: values.userRole }
                    ]);
                    setModalOpen(false);
                }
            }
        } catch {
            message.error("Thao tác thất bại");
        }
    };

    // Xóa user, mock nếu API lỗi
    const handleDelete = async (id) => {
        try {
            await UserService.deleteUser(id, config);
            message.success("Đã đổi trạng thái người dùng");
            fetchUsers();
        } catch {
            message.warning("API lỗi. Xóa người dùng trên giao diện tạm thời.");
            setUsers(prev => prev.filter(user => user.id !== id));
        }
    };

    const columns = [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        {
            title: "Vai trò",
            dataIndex: "userRole",
            key: "userRole",
            render: (role) => (
                <span className={`role-badge ROLE_${role}`}>{role === "ADMIN" ? "Admin" : role === "NURSE" ? "Y tá" : "Phụ huynh"}</span>
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <>
                    <Button type="link" className="action-btn" onClick={() => openModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger className="action-btn delete">
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="user-management-page">
            <h2 className="user-management-title">Quản lý người dùng</h2>
            <Button type="primary" className="add-user-btn" onClick={() => openModal()}>
                Thêm người dùng
            </Button>
            <Table
                className="user-table"
                dataSource={users}
                columns={columns}
                rowKey="id"
                style={{ marginTop: 16 }}
                loading={loading}
                pagination={{ pageSize: 6 }}
            />
            <Modal
                className="user-modal"
                open={modalOpen}
                title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
                onCancel={() => setModalOpen(false)}
                onOk={handleSubmit}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Nhập email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Nhập số điện thoại" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="userRole" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
                        <Select>
                            <Option value="ADMIN">Admin</Option>
                            <Option value="PARENT">Phụ huynh</Option>
                            <Option value="NURSE">Y tá</Option>
                        </Select>
                    </Form.Item>
                    {!editingUser && (
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Nhập mật khẩu" }]}>
                            <Input.Password />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;