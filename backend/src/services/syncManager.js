const cron = require('node-cron');
const config = require('../config/config');

// Import all integrations here
const bolpatra = require('../integrations/bolpatra');

/**
 * Sync Manager: Coordinates all registered data bridges
 */
class SyncManager {
    constructor() {
        this.integrations = {
            bolpatra: bolpatra
            // Add more integrations here as they are created
        };
    }

    /**
     * Run all ENABLED integrations once (useful for startup)
     */
    async runAll() {
        console.log('🚀 [SyncManager] Triggering all active integrations...');
        for (const [name, settings] of Object.entries(config.integrations)) {
            if (settings.enabled && this.integrations[name]) {
                console.log(`[SyncManager] Running: ${name}`);
                await this.integrations[name].sync();
            }
        }
    }

    /**
     * Schedule all ENABLED integrations based on their config
     */
    startSchedules() {
        console.log('⏰ [SyncManager] Initializing Cron Schedules...');
        for (const [name, settings] of Object.entries(config.integrations)) {
            if (settings.enabled && this.integrations[name]) {
                cron.schedule(settings.syncInterval, () => {
                    console.log(`[Cron] Scheduled trigger for: ${name}`);
                    this.integrations[name].sync();
                });
                console.log(`[SyncManager] Scheduled ${name} with interval: ${settings.syncInterval}`);
            }
        }
    }
}

module.exports = new SyncManager();
