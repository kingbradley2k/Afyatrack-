// Supervisor-specific functionality
class SupervisorService {
    constructor() {
        this.chvs = [];
        this.households = [];
        this.assignments = [];
        this.loadData();
    }

    loadData() {
        // Load mock data - replace with actual API calls
        this.chvs = [
            { id: 1, name: 'Jane Muthoni', email: 'jane@chv.afyatrack', location: 'Kibera', households: 15 },
            { id: 2, name: 'John Kamau', email: 'john@chv.afyatrack', location: 'Mathare', households: 12 },
            { id: 3, name: 'Mary Achieng', email: 'mary@chv.afyatrack', location: 'Kawangware', households: 18 }
        ];

        this.households = [
            { id: 1, name: 'Mwangi Family', location: 'Kibera', members: 4, chvId: 1 },
            { id: 2, name: 'Otieno Household', location: 'Mathare', members: 3, chvId: 2 }
        ];

        this.assignments = [
            { id: 1, chvId: 1, householdId: 1, assignedDate: '2024-01-10' },
            { id: 2, chvId: 2, householdId: 2, assignedDate: '2024-01-11' }
        ];
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

    assignCHV(chvId, householdId) {
        const assignment = {
            id: Date.now(),
            chvId: parseInt(chvId),
            householdId: parseInt(householdId),
            assignedDate: new Date().toISOString().split('T')[0]
        };
        this.assignments.push(assignment);
        return assignment;
    }

    registerHousehold(householdData) {
        const household = {
            id: Date.now(),
            ...householdData
        };
        this.households.push(household);
        return household;
    }
}

// Create global Supervisor service instance
const supervisorService = new SupervisorService();