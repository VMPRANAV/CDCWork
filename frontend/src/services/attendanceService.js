const API_BASE_URL = 'http://localhost:3002/api';

class AttendanceService {
    // Get attendance data
    async getAttendance() {
        try {
            const response = await fetch(`${API_BASE_URL}/attendance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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
                headers: {
                    'Content-Type': 'application/json'
                }
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
}

export default new AttendanceService();