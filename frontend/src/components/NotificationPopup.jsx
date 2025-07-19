import React, { useEffect, useState } from 'react';
import NotificationService from '../services/NotificationService';
import axios from 'axios';
import {
  Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText
} from '@mui/material';

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch unread count
        const unread = await NotificationService.countUnreadNotifications(config);
        setUnreadCount(unread);

        // Fetch all notifications
        const allNotifications = await NotificationService.getAllNotifications(config);
        setNotifications(allNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNotificationClick = async (notification) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Mark notification as read
      await NotificationService.removeEventListener(notification.id, config);

      // Redirect if title matches
      if (notification.title === 'THÔNG BÁO THĂM KHÁM Y TẾ CÁ NHÂN') {
        window.location.href = '/parent/sukienytehocsinh';
      }
      else if (notification.title === '[THÔNG BÁO] Tổ chức kiểm tra sức khỏe định kỳ cho học sinh') {
        window.location.href = '/parent/kiemtradinhkyhocsinh';
      }
      else if (notification.title === '[THÔNG BÁO] Triển khai chiến dịch tiêm chủng tại trường!') {
        window.location.href = '/parent/thongbaotiemchung';
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Thông báo ({unreadCount} chưa đọc)
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Danh sách thông báo</DialogTitle>
        <DialogContent dividers>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} button onClick={() => handleNotificationClick(notification)}>
                <ListItemText primary={notification.title} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationPopup;