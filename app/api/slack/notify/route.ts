import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route makes external API calls
export const dynamic = 'force-dynamic';

// Slack configuration from environment variables
// IMPORTANT: Set these in your .env.local file, never commit real values
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || '';

interface SlackNotificationPayload {
  type: 'onboarding_complete' | 'quiz_failure' | 'at_risk_recovery';
  userName: string;
  userTeam?: string;
  moduleTitle?: string;
  score?: number;
  avgScore?: number;
  completionDate?: string;
  recoveryDate?: string;
  totalInterventions?: number;
}

function formatOnboardingCompleteMessage(payload: SlackNotificationPayload): object {
  return {
    channel: SLACK_CHANNEL_ID,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 Onboarding Complete!',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*User:*\n${payload.userName}`
          },
          {
            type: 'mrkdwn',
            text: `*Team:*\n${payload.userTeam || 'N/A'}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Average Score:*\n${payload.avgScore}%`
          },
          {
            type: 'mrkdwn',
            text: `*Completed:*\n${payload.completionDate ? new Date(payload.completionDate).toLocaleDateString() : new Date().toLocaleDateString()}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `✨ User has successfully completed all onboarding requirements and is now a *HIGH_FLYER*!`
          }
        ]
      },
      {
        type: 'divider'
      }
    ],
    text: `🎉 ${payload.userName} from ${payload.userTeam || 'Unknown Team'} has completed onboarding!`
  };
}

function formatQuizFailureMessage(payload: SlackNotificationPayload): object {
  return {
    channel: SLACK_CHANNEL_ID,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⚠️ Quiz Failure Alert',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*User:*\n${payload.userName}`
          },
          {
            type: 'mrkdwn',
            text: `*Team:*\n${payload.userTeam || 'N/A'}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Module:*\n${payload.moduleTitle || 'Unknown Module'}`
          },
          {
            type: 'mrkdwn',
            text: `*Score:*\n${payload.score}%`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🔔 User scored below 50% and may need additional support. Consider reaching out to provide assistance.`
          }
        ]
      },
      {
        type: 'divider'
      }
    ],
    text: `⚠️ ${payload.userName} from ${payload.userTeam || 'Unknown Team'} failed a quiz (${payload.score}%)`
  };
}

function formatAtRiskRecoveryMessage(payload: SlackNotificationPayload): object {
  return {
    channel: SLACK_CHANNEL_ID,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎊 AT_RISK Recovery Success!',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*User:*\n${payload.userName}`
          },
          {
            type: 'mrkdwn',
            text: `*Team:*\n${payload.userTeam || 'N/A'}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Recovered On:*\n${payload.recoveryDate ? new Date(payload.recoveryDate).toLocaleDateString() : new Date().toLocaleDateString()}`
          },
          {
            type: 'mrkdwn',
            text: `*Total Interventions:*\n${payload.totalInterventions || 1}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🌟 Great news! User has successfully completed all remedial modules and is back on track. They have been promoted back to *ROOKIE* status.`
          }
        ]
      },
      {
        type: 'divider'
      }
    ],
    text: `🎊 ${payload.userName} from ${payload.userTeam || 'Unknown Team'} has recovered from AT_RISK status!`
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: SlackNotificationPayload = await request.json();

    // Validate payload
    if (!payload.type || !payload.userName) {
      return NextResponse.json(
        { error: 'Missing required fields: type and userName' },
        { status: 400 }
      );
    }

    // Format message based on type
    let message: object;
    switch (payload.type) {
      case 'onboarding_complete':
        message = formatOnboardingCompleteMessage(payload);
        break;
      case 'quiz_failure':
        message = formatQuizFailureMessage(payload);
        break;
      case 'at_risk_recovery':
        message = formatAtRiskRecoveryMessage(payload);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${payload.type}` },
          { status: 400 }
        );
    }

    // Send to Slack
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error('Slack API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to send Slack notification', details: errorText },
        { status: 500 }
      );
    }

    console.log(`✅ Slack notification sent: ${payload.type} for ${payload.userName}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Notification sent for ${payload.type}` 
    });

  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
