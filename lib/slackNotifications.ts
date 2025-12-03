/**
 * Slack Notification Service
 * 
 * Sends notifications to Slack for key events:
 * - User completes onboarding
 * - User fails a quiz (score < 50%)
 * 
 * Note: Notifications are sent via API route to keep webhook URL secure
 */

interface OnboardingCompletePayload {
  userName: string;
  userTeam?: string;
  avgScore: number;
  completionDate?: string;
}

interface QuizFailurePayload {
  userName: string;
  userTeam?: string;
  moduleTitle: string;
  score: number;
}

/**
 * Send notification when user completes onboarding
 */
export async function notifyOnboardingComplete(payload: OnboardingCompletePayload): Promise<boolean> {
  try {
    const response = await fetch('/api/slack/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'onboarding_complete',
        userName: payload.userName,
        userTeam: payload.userTeam,
        avgScore: payload.avgScore,
        completionDate: payload.completionDate || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send onboarding complete notification:', error);
      return false;
    }

    console.log('✅ Onboarding complete notification sent to Slack');
    return true;
  } catch (error) {
    console.error('Error sending onboarding complete notification:', error);
    return false;
  }
}

/**
 * Send notification when user fails a quiz (score < 50%)
 */
export async function notifyQuizFailure(payload: QuizFailurePayload): Promise<boolean> {
  try {
    const response = await fetch('/api/slack/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'quiz_failure',
        userName: payload.userName,
        userTeam: payload.userTeam,
        moduleTitle: payload.moduleTitle,
        score: Math.round(payload.score),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send quiz failure notification:', error);
      return false;
    }

    console.log('✅ Quiz failure notification sent to Slack');
    return true;
  } catch (error) {
    console.error('Error sending quiz failure notification:', error);
    return false;
  }
}

