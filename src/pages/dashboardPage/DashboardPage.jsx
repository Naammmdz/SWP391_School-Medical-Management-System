import React, { useState, useEffect } from 'react';
import { Heart, Activity, Stethoscope, Syringe, TrendingUp, TrendingDown } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './DashboardPage.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    healthyStudents: 0,
    sickStudents: 0,
    checkedStudents: 0,
    vaccinatedStudents: 0,
  });

  const [healthTrend, setHealthTrend] = useState({
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Học sinh khỏe mạnh',
        data: [65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Học sinh bệnh',
        data: [35, 32, 30, 28, 25, 22, 20, 18, 15, 12, 10, 8],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
      },
    ],
  });

  const [vaccinationData, setVaccinationData] = useState({
    labels: ['Đã tiêm', 'Chưa tiêm', 'Đang chờ'],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      },
    ],
  });

  const [diseaseDistribution, setDiseaseDistribution] = useState({
    labels: ['Cảm cúm', 'Sốt', 'Đau đầu', 'Dị ứng', 'Khác'],
    datasets: [
      {
        label: 'Số ca bệnh',
        data: [30, 25, 15, 20, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  });

  useEffect(() => {
    // Fetch data from API
    // For now using mock data
    setStats({
      totalStudents: 1000,
      healthyStudents: 850,
      sickStudents: 150,
      checkedStudents: 920,
      vaccinatedStudents: 750,
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Thống kê sức khỏe học sinh</h1>
        <p className="dashboard-subtitle">Tổng quan về tình hình sức khỏe học sinh trong trường</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Học sinh khỏe mạnh</span>
            <div className="stat-icon healthy">
              <Heart size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.healthyStudents}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>5% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Học sinh bệnh</span>
            <div className="stat-icon sick">
              <Activity size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.sickStudents}</div>
          <div className="stat-change negative">
            <TrendingDown size={16} />
            <span>3% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Đã kiểm tra sức khỏe</span>
            <div className="stat-icon checked">
              <Stethoscope size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.checkedStudents}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>8% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Đã tiêm chủng</span>
            <div className="stat-icon vaccinated">
              <Syringe size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.vaccinatedStudents}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>12% so với tháng trước</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Xu hướng sức khỏe học sinh</h3>
          </div>
          <div className="chart-container">
            <Line data={healthTrend} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tình hình tiêm chủng</h3>
          </div>
          <div className="chart-container">
            <Pie data={vaccinationData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Phân bố bệnh</h3>
          </div>
          <div className="chart-container">
            <Bar data={diseaseDistribution} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
