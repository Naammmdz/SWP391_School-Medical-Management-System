import React, { useState } from 'react';
import MedicalEventService from '../services/MedicalEventService';

const MedicalEventDebugTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testBasicEvent = async () => {
    setLoading(true);
    setResult(null);

    const testEventData = {
      title: "Thử nghiệm sự cố y tế",
      stuId: [1], // Using a simple student ID
      eventType: "THử NGHIỆM",
      eventDate: "2024-01-15T10:00:00", // ISO format
      location: "Vị trí thử nghiệm",
      description: "Mô tả thử nghiệm",
      relatedItemUsed: [], // Empty array
      notes: "Ghi chú thử nghiệm",
      handlingMeasures: "Biện pháp thử nghiệm",
      severityLevel: "MINOR",
      status: "PROCESSING"
    };

    try {
      console.log('Đang thử nghiệm tạo sự cố y tế cơ bản...');
      const response = await MedicalEventService.createMedicalEvent(testEventData);
      console.log('Thành công:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Lỗi:', error);
      setResult({ 
        success: false, 
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const testWithMultipleStudents = async () => {
    setLoading(true);
    setResult(null);

    const testEventData = {
      title: "Test Multiple Students",
      stuId: [1, 2, 3], // Multiple student IDs
      eventType: "MULTIPLE_TEST",
      eventDate: "2024-01-15T10:00:00",
      location: "Test Location",
      description: "Test Description",
      relatedItemUsed: [],
      notes: "Test Notes",
      handlingMeasures: "Test Handling",
      severityLevel: "MINOR",
      status: "PROCESSING"
    };

    try {
      console.log('Testing multiple students medical event creation...');
      const response = await MedicalEventService.createMedicalEvent(testEventData);
      console.log('Success:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Error:', error);
      setResult({ 
        success: false, 
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const testWithInventoryItems = async () => {
    setLoading(true);
    setResult(null);

    const testEventData = {
      title: "Test With Inventory",
      stuId: [1],
      eventType: "INVENTORY_TEST",
      eventDate: "2024-01-15T10:00:00",
      location: "Test Location",
      description: "Test Description",
      relatedItemUsed: [
        { inventoryId: 1, quantity: 2 },
        { inventoryId: 2, quantity: 1 }
      ],
      notes: "Test Notes",
      handlingMeasures: "Test Handling",
      severityLevel: "MINOR",
      status: "PROCESSING"
    };

    try {
      console.log('Testing medical event with inventory items...');
      const response = await MedicalEventService.createMedicalEvent(testEventData);
      console.log('Success:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Error:', error);
      setResult({ 
        success: false, 
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const testCurrentDateTime = async () => {
    setLoading(true);
    setResult(null);

    const testEventData = {
      title: "Test Current Time",
      stuId: [1],
      eventType: "CURRENT_TIME_TEST",
      eventDate: new Date().toISOString(), // Current time
      location: "Test Location",
      description: "Test Description",
      relatedItemUsed: [],
      notes: "Test Notes",
      handlingMeasures: "Test Handling",
      severityLevel: "MINOR",
      status: "PROCESSING"
    };

    try {
      console.log('Testing medical event with current datetime...');
      const response = await MedicalEventService.createMedicalEvent(testEventData);
      console.log('Success:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Error:', error);
      setResult({ 
        success: false, 
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Thử nghiệm sự cố y tế</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBasicEvent}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Thử nghiệm cơ bản
        </button>
        
        <button 
          onClick={testWithMultipleStudents}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Thử nhiều học sinh
        </button>
        
        <button 
          onClick={testWithInventoryItems}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
        >
          Thử với vật phẩm
        </button>
        
        <button 
          onClick={testCurrentDateTime}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Thử thời gian hiện tại
        </button>
      </div>

      {loading && <div style={{ color: '#007bff' }}>Đang tải...</div>}

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <h3>{result.success ? 'Thành công!' : 'Lỗi!'}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {JSON.stringify(result.success ? result.data : result.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MedicalEventDebugTest;
