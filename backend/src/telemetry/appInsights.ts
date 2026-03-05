import * as appInsights from 'applicationinsights';
import { env } from '../config/env';

export const setupAppInsights = () => {
    if (env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
        appInsights.setup(env.APPLICATIONINSIGHTS_CONNECTION_STRING)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true, true)
            .setUseDiskRetryCaching(true)
            .start();

        console.log('✅ Azure Application Insights initialized.');
    } else {
        console.warn('⚠️ APPLICATIONINSIGHTS_CONNECTION_STRING not provided. Telemetry disabled.');
    }
};

export const getTelemetryClient = () => {
    if (appInsights.defaultClient) {
        return appInsights.defaultClient;
    }
    return null;
};
