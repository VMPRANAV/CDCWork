const API_BASE_URL = 'http://localhost:3002/api';

class ApplicationService {
    // Get my applications
    async getMyApplications() {
        try {
            const response = await fetch(`${API_BASE_URL}/applications/my-applications`, {
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
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    // Get all applications
    async getAllApplications() {
        try {
            const response = await fetch(`${API_BASE_URL}/applications`, {
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
            console.error('Error fetching all applications:', error);
            throw error;
        }
    }

    // Create new application
    async createApplication(applicationData) {
        try {
            const response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(applicationData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating application:', error);
            throw error;
        }
    }
}

export default new ApplicationService();