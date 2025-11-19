// Alert Management System
class AlertService {
    constructor() {
        this.alerts = [];
        this.loadAlerts();
    }

    loadAlerts() {
        // Mock alerts data
        this.alerts = [
            {
                id: 1,
                type: 'outbreak',
                severity: 'high',
                title: 'High Fever Cluster',
                description: 'Multiple cases of high fever reported in Kibera area',
                location: 'Kibera',
                reportedBy: 'Jane Muthoni',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            },
            {
                id: 2,
                type: 'disease',
                severity: 'medium',
                title: 'Waterborne Disease Alert',
                description: 'Increased cases of diarrhea in Mathare',
                location: 'Mathare',
                reportedBy: 'John Kamau',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            }
        ];
    }

    getAlerts() {
        return this.alerts;
    }

    getAlert(id) {
        return this.alerts.find(alert => alert.id === parseInt(id));
    }

    createAlert(alertData) {
        const alert = {
            id: Date.now(),
            ...alertData,
            timestamp: new Date().toISOString(),
            status: 'active'
        };
        this.alerts.unshift(alert);
        return alert;
    }

    updateAlertStatus(id, status) {
        const alert = this.getAlert(id);
        if (alert) {
            alert.status = status;
        }
        return alert;
    }

    getAlertsBySeverity(severity) {
        return this.alerts.filter(alert => alert.severity === severity && alert.status === 'active');
    }
}

// Create global Alert service instance
const alertService = new AlertService();