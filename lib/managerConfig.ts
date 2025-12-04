/**
 * Manager Configuration
 * 
 * Teams and managers are now fetched dynamically from Contentstack.
 * To add a new team: Create a new entry in the `manager_config` content type.
 * 
 * This file provides fallback data and utility functions.
 */

import { ManagerConfig } from '@/types';
import { getTeams, getManagerForTeam as getManagerFromService } from '@/lib/teamService';

// Fallback manager configuration (used when Contentstack is unavailable)
export const MANAGER_CONFIG: ManagerConfig[] = [
  { team: 'Launch', managerName: 'Sarah Chen', managerEmail: 'sarah.chen@contentstack.com' },
  { team: 'Data & Insights', managerName: 'Michael Rodriguez', managerEmail: 'michael.rodriguez@contentstack.com' },
  { team: 'AutoDraft', managerName: 'James Kim', managerEmail: 'james.kim@contentstack.com' },
  { team: 'DAM', managerName: 'Emily Thompson', managerEmail: 'emily.thompson@contentstack.com' },
];

/**
 * Get manager details for a specific team (sync version - uses fallback)
 */
export function getManagerForTeam(team: string): ManagerConfig | undefined {
  return MANAGER_CONFIG.find(config => config.team === team);
}

/**
 * Get manager details for a specific team (async version - fetches from Contentstack)
 */
export async function getManagerForTeamAsync(team: string): Promise<ManagerConfig | undefined> {
  const manager = await getManagerFromService(team);
  if (manager) {
    return {
      team,
      managerName: manager.name,
      managerEmail: manager.email,
    };
  }
  // Fallback to static config
  return getManagerForTeam(team);
}

/**
 * Get all teams (async - fetches from Contentstack)
 */
export async function getAllTeams(): Promise<string[]> {
  const teams = await getTeams();
  return teams.map(t => t.team);
}

/**
 * Send notification to manager
 */
export function notifyManager(
  team: string,
  notificationType: 'onboarding_complete' | 'at_risk',
  userName: string
): void {
  const manager = getManagerForTeam(team);
  if (!manager) return;

  const emailContent = generateEmailContent(notificationType, userName, team, manager);
  
  // In production, send actual email:
  // sendEmail(manager.managerEmail, emailContent.subject, emailContent.body);
  
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
  team: string,
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
 * Get all manager configurations (async - fetches from Contentstack)
 */
export async function getAllManagers(): Promise<ManagerConfig[]> {
  const teams = await getTeams();
  return teams.map(t => ({
    team: t.team,
    managerName: t.managerName,
    managerEmail: t.managerEmail,
  }));
}
