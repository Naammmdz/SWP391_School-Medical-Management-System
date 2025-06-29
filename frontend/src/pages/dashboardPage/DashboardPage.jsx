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
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const [healthTrend] = useState({
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

  const [vaccinationData] = useState({
    labels: ['Đã tiêm', 'Chưa tiêm', 'Đang chờ'],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      },
    ],
  });

  const [diseaseDistribution] = useState({
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
      <div className="container-fluid">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-1 bg-dark text-white min-vh-100 p-2 position-fixed" style={{top: '80px', left: 0, zIndex: 1000, height: 'calc(100vh - 80px)'}}>
            <h4 className="text-center mb-4">📚 Admin</h4>
            <nav className="nav flex-column">
              <a className="nav-link text-white" href="#">📊 Tổng quan</a>
              <a className="nav-link text-white" href="#">👨‍⚕️ Hồ sơ y tế</a>
              <a className="nav-link text-white" href="#">💉 Tiêm chủng</a>
              <a className="nav-link text-white" href="#">🔔 Thông báo</a>
              <a className="nav-link text-white mt-4" href="#">🚪 Đăng xuất</a>
            </nav>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-md-1"></div>
          <div className="col-md-11 p-4">
            <h2 className="fw-bold mb-4">📈 Thống kê sức khỏe học sinh</h2>

            {/* STAT CARDS */}
            <div className="row g-4">
              {[
                {
                  title: 'Học sinh khỏe mạnh',
                  icon: <Heart size={24} />,
                  value: stats.healthyStudents,
                  change: '5%',
                  trend: <TrendingUp size={16} />,
                  color: 'success',
                },
                {
                  title: 'Học sinh bệnh',
                  icon: <Activity size={24} />,
                  value: stats.sickStudents,
                  change: '3%',
                  trend: <TrendingDown size={16} />,
                  color: 'danger',
                },
                {
                  title: 'Đã kiểm tra sức khỏe',
                  icon: <Stethoscope size={24} />,
                  value: stats.checkedStudents,
                  change: '8%',
                  trend: <TrendingUp size={16} />,
                  color: 'primary',
                },
                {
                  title: 'Đã tiêm chủng',
                  icon: <Syringe size={24} />,
                  value: stats.vaccinatedStudents,
                  change: '12%',
                  trend: <TrendingUp size={16} />,
                  color: 'warning',
                },
              ].map((stat, idx) => (
                  <div className="col-md-6 col-lg-3" key={idx}>
                    <div className={`card border-${stat.color} shadow-sm`}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">{stat.title}</span>
                          <span className={`text-${stat.color}`}>{stat.icon}</span>
                        </div>
                        <h3 className="fw-bold">{stat.value}</h3>
                        <p className={`mb-0 small text-${stat.color}`}>
                          {stat.trend} {stat.change} so với tháng trước
                        </p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* CHARTS */}
            <div className="row mt-5 g-4">
              <div className="col-lg-6">
                <div className="card h-100 shadow">
                  <div className="card-header bg-light fw-bold">📈 Xu hướng sức khỏe học sinh</div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <Line data={healthTrend} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card h-100 shadow">
                  <div className="card-header bg-light fw-bold">💉 Tình hình tiêm chủng</div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <Pie data={vaccinationData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-light fw-bold">🦠 Phân bố bệnh</div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <Bar data={diseaseDistribution} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* END MAIN CONTENT */}
        </div>
      </div>
  );
};

export default DashboardPage;
