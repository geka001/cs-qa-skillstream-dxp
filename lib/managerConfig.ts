/**
 * Manager Configuration
 * Maps each Contentstack product team to their manager
 * Easily configurable - update manager details here
 */

import { Team, ManagerConfig } from '@/types';

// Manager configuration for each team
export const MANAGER_CONFIG: ManagerConfig[] = [
  {
    team: 'Launch',
    managerName: 'Sarah Johnson',
    managerEmail: 'sarah.johnson@contentstack.com'
  },
  {
    team: 'Data & Insights',
    managerName: 'Mike Chen',
    managerEmail: 'mike.chen@contentstack.com'
  },
  {
    team: 'AutoDraft',
    managerName: 'Lisa Wong',
    managerEmail: 'lisa.wong@contentstack.com'
  },
  {
    team: 'DAM',
    managerName: 'Tom Brown',
    managerEmail: 'tom.brown@contentstack.com'
  }
];

/**
 * Get manager details for a specific team
 */
export function getManagerForTeam(team: Team): ManagerConfig | undefined {
  return MANAGER_CONFIG.find(config => config.team === team);
}

/**
 * Simulate sending email to manager
 * In production, this would call an actual email service
 */
export function notifyManager(
  team: Team,
  notificationType: 'onboarding_complete' | 'at_risk',
  userName: string
): void {
  const manager = getManagerForTeam(team);
  if (!manager) return;

  // Generate email content (ready for production email service)
  const emailContent = generateEmailContent(notificationType, userName, team, manager);
  
  // In production, send actual email:
  // sendEmail(manager.managerEmail, emailContent.subject, emailContent.body);
  
  // For now, just log to server (not browser console)
  if (typeof window === 'undefined') {
    console.log(`[Email] To: ${manager.managerEmail}, Subject: ${emailContent.subject}`);
  }
}

/**
 * Generate email content based on notification type
 */
function generateEmailContent(
  type: 'onboarding_complete' | 'at_risk',
  userName: string,
  team: Team,
  manager: ManagerConfig
): { subject: string; body: string } {
  if (type === 'onboarding_complete') {
    return {
      subject: `🎉 ${userName} from ${team} Team Completed Onboarding!`,
      body: `
Hi ${manager.managerName},

Great news! ${userName} from the ${team} team has successfully completed their QA onboarding.

Onboarding Summary:
✅ All mandatory training modules completed
✅ All required SOPs reviewed
✅ All essential tools explored
✅ Quiz scores meet or exceed threshold
✅ Ready to contribute to the team!

${userName} is now fully onboarded and ready to take on QA responsibilities for ${team}.

Best regards,
SkillStream QA Training Platform
      `.trim()
    };
  } else {
    return {
      subject: `⚠️ ${userName} from ${team} Team Needs Support`,
      body: `
Hi ${manager.managerName},

This is an automated alert regarding ${userName} from the ${team} team.

Status: AT-RISK
${userName}'s recent quiz performance indicates they may need additional support and guidance.

Recommended Actions:
• Schedule a 1-on-1 check-in
• Review challenging topics together
• Assign a buddy/mentor if needed
• Provide additional resources or training time

${userName} has been provided with remedial content to help them get back on track.

Please reach out to provide support and encouragement.

Best regards,
SkillStream QA Training Platform
      `.trim()
    };
  }
}

/**
 * Update manager configuration (for admin use)
 * In production, this might be stored in a database or CMS
 */
export function updateManager(team: Team, managerName: string, managerEmail: string): boolean {
  const index = MANAGER_CONFIG.findIndex(config => config.team === team);
  if (index === -1) return false;

  MANAGER_CONFIG[index] = { team, managerName, managerEmail };
  return true;
}

/**
 * Get all manager configurations
 */
export function getAllManagers(): ManagerConfig[] {
  return [...MANAGER_CONFIG];
}

