import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './UpdatePassword.css';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setErrorMsg] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            if (user?.userRole === 'ROLE_ADMIN' || user?.userRole === 'ROLE_PRINCIPAL') redirectPath = '/admin';
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

    if (error) return <div className="error-page"><FaExclamationTriangle className="icon" /> {error}</div>;

    return (
        <div className="update-password">
            <h2>Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="oldPassword"><FaLock className="icon" /> Mật khẩu cũ</label>
                    <div className="password-input">
                        <input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            {...register('oldPassword', { required: 'Vui lòng nhập mật khẩu cũ' })}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.oldPassword && <span className="error">{errors.oldPassword.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword"><FaLock className="icon" /> Mật khẩu mới</label>
                    <div className="password-input">
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            {...register('newPassword', { required: 'Vui lòng nhập mật khẩu mới', minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } })}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewPassword"><FaLock className="icon" /> Nhập lại mật khẩu mới</label>
                    <div className="password-input">
                        <input
                            id="confirmNewPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...register('confirmNewPassword', { required: 'Vui lòng nhập lại mật khẩu mới' })}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmNewPassword && <span className="error">{errors.confirmNewPassword.message}</span>}
                </div>
                <button type="submit">Đổi mật khẩu</button>
            </form>
            {updateSuccess && <div className="success"><FaCheckCircle className="icon" /> Đổi mật khẩu thành công!</div>}
            {error && <div className="error-message"><FaExclamationTriangle className="icon" /> {error}</div>}
        </div>
    );
};

export default UpdatePassword;
