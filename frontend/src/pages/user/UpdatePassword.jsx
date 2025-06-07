import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import './UpdatePassword.css';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setErrorMsg] = useState(null);

    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const onSubmit = (data) => {
        if (!accessToken) {
            setErrorMsg('Bạn chưa đăng nhập!');
            return;
        }
        if (data.newPassword !== data.confirmNewPassword) {
            setError('confirmNewPassword', { type: 'manual', message: 'Mật khẩu mới không khớp' });
            return;
        }
        // Gửi yêu cầu đổi mật khẩu với mật khẩu cũ và mật khẩu mới
        userService.changePassword(
            {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        .then(() => {
            setUpdateSuccess(true);
            let redirectPath = '/';
            if (user?.userRole === 'ROLE_ADMIN') redirectPath = '/admin';
            else if (user?.userRole === 'ROLE_PARENT') redirectPath = '/parent';
            else if (user?.userRole === 'ROLE_NURSE') redirectPath = '/nurse';
            setTimeout(() => navigate(redirectPath), 1500);
        })
        .catch((err) => {
            if (err.response && err.response.data && err.response.data.error) {
                setErrorMsg(err.response.data.error);
            } else {
                setErrorMsg('Đổi mật khẩu thất bại');
            }
        });
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="update-user">
            <h2>Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Mật khẩu cũ</label>
                    <input
                        id="oldPassword"
                        type="password"
                        {...register('oldPassword', { required: 'Vui lòng nhập mật khẩu cũ' })}
                    />
                    {errors.oldPassword && <span className="error">{errors.oldPassword.message}</span>}
                </div>
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