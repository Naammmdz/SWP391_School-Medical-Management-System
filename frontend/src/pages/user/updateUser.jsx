
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import './UpdateUser.css';

const UpdateUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const users = [
        {
            userId: 2,
            fullName: "Nguyen Van A",
            email: "parent1@email.com",
            phone: "0912345678",
            passwordHash: "hashedpassword1",
            role: "PARENT",
            createdAt: "2025-06-06",
            isActive: true
        },
        {
            userId: 3,
            fullName: "Tran Thi B",
            email: "nurse1@email.com",
            phone: "0987654321",
            passwordHash: "hashedpassword2",
            role: "NURSE",
            createdAt: "2025-06-06",
            isActive: true
        },
        {
            userId: 4,
            fullName: "Le Van C",
            email: "admin1@email.com",
            phone: "0909123456",
            passwordHash: "hashedpassword3",
            role: "ADMIN",
            createdAt: "2025-06-06",
            isActive: true
        }
    ];


    useEffect(() => {
        UserService.getUserById(userId)
            .then(res => {
                if (res.data) {
                    Object.keys(res.data).forEach(key => {
                        setValue(key, res.data[key]);
                    });
                }
                setIsLoading(false);
            })
            .catch(() => {
                setError('Failed to load user data');
                setIsLoading(false);
            });
    }, [userId, setValue]);

    const onSubmit = (data) => {
        UserService.updateUser(userId, data)
            .then(() => {
                setUpdateSuccess(true);
                navigate('/parent');
            })
            .catch(() => {
                setError('Failed to update user data');
            });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="update-user">
            <h2>Update User Information</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input id="username" {...register('username', { required: true })} />
                    {errors.username && <span className="error">Username is required</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" {...register('email', { required: true })} />
                    {errors.email && <span className="error">Email is required</span>}
                </div>
                {/* Add more fields as necessary */}
                <button type="submit">Update</button>
            </form>
            {updateSuccess && <div className="success">User updated successfully!</div>}
        </div>
    );
}
export default UpdateUser;
