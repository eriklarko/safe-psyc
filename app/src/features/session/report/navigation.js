// @flow

import { setNavigationStack } from '~/src/navigation-actions.js';
import { routes } from '~/src/routes.js';
import type { Report } from '~/src/features/session/report/SessionReport.js';

export function navigateToSessionReport(report: Report) {
    setNavigationStack([
        { route: routes.Home },
        { 
            route: routes.SessionReport,
            params: {
                report: report,
            },
        },
    ]);
}

