import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import './UpdatePassword.css';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setErrorMsg] = useState(null);
    const [userData, setUserData] = useState({});

    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem('token');

    // Lấy thông tin user khi load trang
    useEffect(() => {
        if (!accessToken) {
            setErrorMsg('Bạn chưa đăng nhập!');
            return;
        }
        userService.getUserById({
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(res => {
            setUserData(res.data);
            setValue('fullName', res.data.fullName || '');
            setValue('email', res.data.email || '');
            setValue('phone', res.data.phone || '');
        })
        .catch(() => {
            setErrorMsg('Không thể tải thông tin người dùng');
        });
    }, [accessToken, setValue]);

    const onSubmit = (data) => {
        if (!accessToken) {
            setErrorMsg('Bạn chưa đăng nhập!');
            return;
        }
        if (data.newPassword !== data.confirmNewPassword) {
            setError('confirmNewPassword', { type: 'manual', message: 'Mật khẩu mới không khớp' });
            return;
        }
        // Gửi đầy đủ các trường lên backend
        userService.updateUserByUser(
            {
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                password: data.newPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
       .then(() => {
    setUpdateSuccess(true);
    let redirectPath = '';
    if (userData.role === 'ROLE_ADMIN') redirectPath = '/admin';
    else if (userData.role === 'ROLE_PARENT') redirectPath = '/parent';
    else if (userData.role === 'ROLE_NURSE') redirectPath = '/nurse';
    setTimeout(() => navigate(redirectPath), 1500);
})
        .catch(() => {
            setErrorMsg('Đổi mật khẩu thất bại');
        });
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="update-user">
            <h2>Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                        id="newPassword"
                        type="password"
                        {...register('newPassword', { required: 'Vui lòng nhập mật khẩu mới', minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } })}
                    />
                    {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewPassword">Nhập lại mật khẩu mới</label>
                    <input
                        id="confirmNewPassword"
                        type="password"
                        {...register('confirmNewPassword', { required: 'Vui lòng nhập lại mật khẩu mới' })}
                    />
                    {errors.confirmNewPassword && <span className="error">{errors.confirmNewPassword.message}</span>}
                </div>
                <button type="submit">Đổi mật khẩu</button>
            </form>
            {updateSuccess && <div className="success">Đổi mật khẩu thành công!</div>}
        </div>
    );
};

export default UpdatePassword;