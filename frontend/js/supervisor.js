// Supervisor-specific functionality
class SupervisorService {
    constructor() {
        this.chvs = [];
        this.households = [];
        this.assignments = [];
        this.patients = [];
        this.loadData();
    }

    async loadData() {
        try {
            // Fetch CHVs
            const chvResponse = await fetch('/api/supervisor/chvs', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (chvResponse.ok) {
                const chvData = await chvResponse.json();
                this.chvs = chvData.chvs || [];
            }

            // Fetch households
            const householdResponse = await fetch('/api/supervisor/households', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (householdResponse.ok) {
                const householdData = await householdResponse.json();
                this.households = householdData.households || [];
            }

            // Fetch assignments
            const assignmentResponse = await fetch('/api/supervisor/assignments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (assignmentResponse.ok) {
                const assignmentData = await assignmentResponse.json();
                this.assignments = assignmentData.household_assignments || [];
            }

            // Fetch patients
            const patientResponse = await fetch('/api/supervisor/patients', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (patientResponse.ok) {
                const patientData = await patientResponse.json();
                this.patients = patientData.patients || [];
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    getCHVs() {
        return this.chvs;
    }

    getHouseholds() {
        return this.households;
    }

    getAssignments() {
        return this.assignments;
    }

    getPatients() {
        return this.patients;
    }

    async assignCHV(chvId, householdId) {
        try {
            const response = await fetch('/api/supervisor/assign/household', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ chv_id: chvId, household_id: householdId })
            });
            if (response.ok) {
                const data = await response.json();
                // Reload data to reflect changes
                await this.loadData();
                return data.assignment;
            } else {
                throw new Error('Failed to assign CHV');
            }
        } catch (error) {
            console.error('Error assigning CHV:', error);
            throw error;
        }
    }

    async assignPatient(chvId, patientId) {
        try {
            const response = await fetch('/api/supervisor/assign/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ chv_id: chvId, patient_id: patientId })
            });
            if (response.ok) {
                const data = await response.json();
                // Reload data to reflect changes
                await this.loadData();
                return data.assignment;
            } else {
                throw new Error('Failed to assign patient');
            }
        } catch (error) {
            console.error('Error assigning patient:', error);
            throw error;
        }
    }

    async registerHousehold(householdData) {
        try {
            const response = await fetch('/api/supervisor/households', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(householdData)
            });
            if (response.ok) {
                const data = await response.json();
                // Reload data to reflect changes
                await this.loadData();
                return data.household;
            } else {
                throw new Error('Failed to register household');
            }
        } catch (error) {
            console.error('Error registering household:', error);
            throw error;
        }
    }
}

// Create global Supervisor service instance
const supervisorService = new SupervisorService();
