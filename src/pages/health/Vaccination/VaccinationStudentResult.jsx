import React, { useEffect, useState } from "react";
import vaccinationService from "../../../services/VaccinationService";
import { User, Calendar, BookOpen, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import "./VaccinationStudentResult.css";

const VaccinationStudentResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const studentId = localStorage.getItem("selectedStudentId");
        const token = localStorage.getItem("token");
        
        if (!studentId || !token) {
          setResults([]);
          setLoading(false);
          return;
        }

        // Lấy thông tin học sinh từ localStorage
        const students = JSON.parse(localStorage.getItem("students") || "[]");
        const student = students.find(s => String(s.studentId) === String(studentId));
        console.log("Selected Student:", student);
        if (student) {
          setStudentInfo(student);
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await vaccinationService.getvaccinationResultByStudentId(studentId, config);
        // Lọc chỉ những kết quả có parentConfirmation: true
        const filtered = (response.data || []).filter(r => r.parentConfirmation === true);
        setResults(filtered);
        console.log("Filtered Results:", filtered);
      } catch (error) {
        setResults([]);
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  const getResultIcon = (result) => {
    switch (result) {
      case "SUCCESS":
        return <CheckCircle className="result-icon success" />;
      case "FAIL":
        return <XCircle className="result-icon fail" />;
      default:
        return <Clock className="result-icon pending" />;
    }
  };

  const getResultText = (result) => {
    switch (result) {
      case "SUCCESS":
        return "Thành công";
      case "FAIL":
        return "Thất bại";
      default:
        return "Chưa có kết quả";
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "SUCCESS":
        return "#10b981";
      case "FAIL":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  if (loading) {
    return (
      <div className="vaccination-result-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin tiêm chủng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-result-container">
      {/* Header */}
      <div className="page-header">
        <h1>Kết quả tiêm chủng</h1>
        <p>Thông tin chi tiết về các mũi tiêm chủng của học sinh</p>
      </div>

      {/* Student Information Card */}
      {studentInfo && (
        <div className="student-card">
          <div className="student-avatar">
            <User size={48} />
          </div>
          <div className="student-info">
            <h2>{studentInfo.fullName}</h2>
            <div className="student-details">
              <div className="detail-item">
                <BookOpen size={16} />
                <span>Lớp: {studentInfo.className}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Ngày sinh: {new Date(studentInfo.dob || studentInfo.yob).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="detail-item">
                <span>Giới tính: {studentInfo.gender === "Male" ? "Nam" : "Nữ"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="results-section">
        <div className="section-header">
          <h3>Danh sách tiêm chủng đã xác nhận</h3>
          <div className="result-count">
            <span>{results.length} mũi tiêm</span>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} className="empty-icon" />
            <h4>Chưa có kết quả tiêm chủng</h4>
            <p>Hiện tại chưa có kết quả tiêm chủng nào đã được xác nhận bởi phụ huynh.</p>
          </div>
        ) : (
          <div className="results-grid">
            {results.map((result, index) => (
              <div key={result.vaccinationId || index} className="result-card">
                <div className="result-header">
                  <div className="vaccine-info">
                    <h4> Tên vaccin: {result.vaccineName}</h4>
                  </div>
                  <div className="result-status">
                    {getResultIcon(result.result)}
                    <span
                      className="result-text"
                      style={{ color: getResultColor(result.result) }}
                    >
                      {getResultText(result.result)}
                    </span>
                  </div>
                </div>

                <div className="result-details">
                  <div className="detail-row">
                    <span className="label">Ngày tiêm:</span>
                    <span className="value">
                      {new Date(result.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="result-footer">
                  <button className="view-details-btn" onClick={() => setSelectedResult(result)}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedResult && (
        <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết kết quả tiêm chủng</h3>
              <button className="close-button" onClick={() => setSelectedResult(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="result-card-detail">
                <div className="result-header">
                  <div className="vaccine-info">
                    <h4>Tên vaccin: {selectedResult.vaccineName}</h4>
                    <span className="dose-number">Mũi {selectedResult.doseNumber}</span>
                  </div>
                  <div className="result-status">
                    {getResultIcon(selectedResult.result)}
                    <span
                      className="result-text"
                      style={{ color: getResultColor(selectedResult.result) }}
                    >
                      {getResultText(selectedResult.result)}
                    </span>
                  </div>
                </div>

                <div className="result-details">
                  <div className="detail-row">
                    <span className="label">Ngày tiêm:</span>
                    <span className="value">
                      {new Date(selectedResult.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {selectedResult.adverseReaction && (
                    <div className="detail-row">
                      <span className="label">Phản ứng sau tiêm:</span>
                      <span className="value reaction">
                        {selectedResult.adverseReaction}
                      </span>
                    </div>
                  )}

                  {selectedResult.notes && (
                    <div className="detail-row">
                      <span className="label">Ghi chú:</span>
                      <span className="value notes">
                        {selectedResult.notes}
                      </span>
                    </div>
                  )}
                </div>

                <div className="result-footer">
                  <div className="confirmation-badge">
                    <CheckCircle size={14} />
                    <span>Đã xác nhận bởi phụ huynh</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-btn-modal" onClick={() => setSelectedResult(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationStudentResult;