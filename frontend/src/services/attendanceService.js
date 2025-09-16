const API_BASE_URL = 'http://localhost:3002/api';

class AttendanceService {
    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // Get attendance data
    async getAttendance() {
        try {
            const response = await fetch(`${API_BASE_URL}/attendance`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching attendance:', error);
            throw error;
        }
    }

    // Get attendance statistics
    async getAttendanceStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/attendance/stats`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching attendance stats:', error);
            throw error;
        }
    }

    // Update daily attendance
    async updateDailyAttendance(attendanceData) {
        try {
            const response = await fetch(`${API_BASE_URL}/attendance/daily`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(attendanceData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating attendance:', error);
            throw error;
        }
    }
}

export default new AttendanceService();