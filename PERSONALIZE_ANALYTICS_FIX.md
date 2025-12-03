Add an Event to an A/B Test Experience
Adding an event to an A/B Test experience in Contentstack allows you to evaluate variant performance for impressions and conversions.

Events serve as metrics within A/B tests, and you can add up to 5 events (1 primary and 4 secondary) to each test.

The primary metric determines the winning variant, while secondary metrics provide additional insights into user behavior.

Prerequisites

link
Contentstack account
Access to the Contentstack Organization that has Personalize enabled
Access to a project in Personalize
Steps for Execution

link
Note: For this guide, we have assumed that you have already created a Personalize project and an event.

To add the created event to an A/B Test experience, log in to your Contentstack account and perform the following steps:

In the top navigation bar, click the App Switcher icon and then click Personalize.
You will be redirected to the Personalize Projects landing page. Click the project for which you want to add the event.
On the Experiences page, you can create a new A/B Test experience by clicking the + New Experience button or select an existing A/B Test experience.
Note: If you have an A/B Test experience already created then click the existing A/B Test experience to open it or click the corresponding vertical ellipses under the Actions section, select Edit, and jump directly to step 6.


In the Select Experience Type modal, click the A/B Test experience type.

On the experience draft page, in the Overview tab, provide a suitable Name and an optional Description for the experience.
Click Save General Details.
Click Configuration tab in the left-hand menu.
Scroll to the Metrics section and then click + Add Event.
Select the preferred event from the drop-down list.
You can add multiple events to an A/B Test experience as Metrics. Use the Personalize Edge SDK to trigger the events for your experiences using the triggerImpressions and triggerEvent methods.

Note: When adding an event for the first time, it is automatically set as ‘primary’. The 'primary' metric determines A/B test winners from the variants, while secondary metrics offer additional insights. When any of the listed events occur, metrics calculate an increase in unique conversions per visitor which you can view in the Experience Analytics.

Click Save to complete the set up.
This adds the new event as a reference in your A/B Test experience.