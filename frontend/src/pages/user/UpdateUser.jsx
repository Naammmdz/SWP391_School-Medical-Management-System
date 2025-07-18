import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaSpinner } from 'react-icons/fa'; // Import icons
import './UpdateUser.css';

const UpdateUser = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [accessToken, setAccessToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (!accessToken) {
            setError('Bạn chưa đăng nhập!');
            setIsLoading(false);
            return;
        }
        userService.getUserById({
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => {
                const data = res.data;
                setValue('fullName', data.fullName || '');
                setValue('email', data.email || '');
                setValue('phone', data.phone || '');
                setValue('isActive', data.isActive ? 'true' : 'false');
                setIsLoading(false);
            })
            .catch(() => {
                setError('Không thể tải thông tin người dùng');
                setIsLoading(false);
            });
    }, [setValue, accessToken]);

    const onSubmit = (data) => {
        if (!accessToken) {
            setError('Bạn chưa đăng nhập!');
            return;
        }

        userService.updateUserByUser(
            {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
            .then((res) => {
                let newToken = null;
                if (res.headers && res.headers['authorization']) {
                    const authHeader = res.headers['authorization'];
                    if (authHeader.startsWith('Bearer ')) {
                        newToken = authHeader.substring(7);
                    }
                } else if (res.data && res.data.token) {
                    newToken = res.data.token;
                }
                if (newToken) {
                    localStorage.setItem('token', newToken);
                    setAccessToken(newToken);
                }
                setUpdateSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(() => {
                setError('Cập nhật thông tin thất bại');
            });
    };

    if (isLoading) return <div className="loading"><FaSpinner className="spinner" /> Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="update-user">
            <h2>Cập nhật thông tin cá nhân</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="fullName"><FaUser className="icon" /> Họ và tên</label>
                    <input id="fullName" {...register('fullName', { required: true })} />
                    {errors.fullName && <span className="error">Họ và tên không được để trống</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email"><FaEnvelope className="icon" /> Email</label>
                    <input id="email" type="email" {...register('email', { required: true })} />
                    {errors.email && <span className="error">Email không được để trống</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="phone"><FaPhone className="icon" /> Số điện thoại</label>
                    <input id="phone" {...register('phone', { required: true })} />
                    {errors.phone && <span className="error">Số điện thoại không được để trống</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="isActive"><FaCheckCircle className="icon" /> Trạng thái hoạt động</label>
                    <input
                        id="isActive"
                        value={watch('isActive') === 'true' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        disabled
                        readOnly
                        style={{ background: '#f5f5f5', color: '#888' }}
                    />
                </div>
                <button type="submit">Cập nhật</button>
            </form>
            {updateSuccess && <div className="success"><FaCheckCircle className="icon" /> Cập nhật thành công!</div>}
        </div>
    );
};

export default UpdateUser;
