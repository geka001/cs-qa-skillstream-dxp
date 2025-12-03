/**
 * Slack Notification Service
 * Sends notifications to Slack for key events via API route
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

export async function notifyOnboardingComplete(payload: OnboardingCompletePayload): Promise<boolean> {
  try {
    const response = await fetch('/api/slack/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'onboarding_complete',
        userName: payload.userName,
        userTeam: payload.userTeam,
        avgScore: payload.avgScore,
        completionDate: payload.completionDate || new Date().toISOString(),
      }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function notifyQuizFailure(payload: QuizFailurePayload): Promise<boolean> {
  try {
    const response = await fetch('/api/slack/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'quiz_failure',
        userName: payload.userName,
        userTeam: payload.userTeam,
        moduleTitle: payload.moduleTitle,
        score: Math.round(payload.score),
      }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
