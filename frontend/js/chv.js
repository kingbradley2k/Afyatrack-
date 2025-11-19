// CHV-specific functionality
class CHVService {
    constructor() {
        this.assignedHouseholds = [];
        this.visits = [];
        this.loadData();
    }

    loadData() {
        // Load mock data - replace with actual API calls
        this.assignedHouseholds = [
            { id: 1, name: 'Mwangi Family', location: 'Kibera', members: 4, lastVisit: '2024-01-15' },
            { id: 2, name: 'Otieno Household', location: 'Mathare', members: 3, lastVisit: '2024-01-14' },
            { id: 3, name: 'Kamau Residence', location: 'Kawangware', members: 5, lastVisit: '2024-01-13' }
        ];

        this.visits = [
            { id: 1, householdId: 1, date: '2024-01-15', symptoms: [], notes: 'Routine checkup' },
            { id: 2, householdId: 2, date: '2024-01-14', symptoms: ['fever'], notes: 'Reported high fever' }
        ];
    }

    getHouseholds() {
        return this.assignedHouseholds;
    }

    getVisits() {
        return this.visits;
    }

    recordVisit(visitData) {
        const newVisit = {
            id: Date.now(),
            ...visitData,
            date: new Date().toISOString().split('T')[0]
        };
        this.visits.unshift(newVisit);
        return newVisit;
    }

    getHouseholdVisits(householdId) {
        return this.visits.filter(visit => visit.householdId === householdId);
    }
}

// Create global CHV service instance
const chvService = new CHVService();