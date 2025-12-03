# Corrected MCP Prompt for Creating 7 Real SOPs

## 🔴 PROBLEM: Current 25 SOPs are WRONG

The 25 SOPs currently in Contentstack are actually **training module descriptions**, not Standard Operating Procedures.

**Before proceeding:** Delete all 25 existing SOPs in Contentstack UI.

---

## ✅ CORRECT SOP Structure

SOPs (Standard Operating Procedures) are **process documents** with:
- Step-by-step instructions
- Workflow guidelines
- Related tools
- Criticality level (critical/high/medium/low)
- Mandatory flag
- Target segments

---

## 📝 MCP Prompt: Create 7 Real SOPs

```
Please create 7 Standard Operating Procedure (SOP) entries in the qa_sop content type. 

IMPORTANT: These are PROCESS documents, not training modules. Each SOP should have step-by-step workflow instructions.

### SOP 1: Production Bug Escalation Process
- title: "Production Bug Escalation Process"
- sop_id: "sop-001"
- criticality: "critical"
- mandatory: true
- steps: (as JSON array)
  [
    "Verify the bug exists in production environment",
    "Assess severity: P0 (critical), P1 (high), P2 (medium), P3 (low)",
    "Create Jira ticket with [PROD] prefix and complete details",
    "For P0/P1: Immediately notify team lead and on-call developer via Slack",
    "Attach screenshots, logs, browser console errors, and network traces",
    "Document user impact and number of affected users",
    "Monitor ticket and respond to developer questions within 15 minutes",
    "Verify fix in staging environment before production deployment",
    "Retest in production after deployment",
    "Document post-mortem and add to regression suite"
  ]
- related_tools: (as JSON array) ["tool-001", "tool-003", "tool-005"]
- target_segments: (as JSON array) ["ROOKIE", "AT_RISK", "HIGH_FLYER"]
- target_teams: (as JSON array) []

### SOP 2: Sprint Testing Workflow
- title: "Sprint Testing Workflow"
- sop_id: "sop-002"
- criticality: "high"
- mandatory: true
- steps: (as JSON array)
  [
    "Attend sprint planning and review user stories/acceptance criteria",
    "Create test cases in TestRail within 24 hours of story assignment",
    "Set up test environment with required test data",
    "Execute smoke tests when build is deployed to QA environment",
    "Perform functional testing and log defects with complete repro steps",
    "Attend daily standups with test status updates (% complete, blockers)",
    "Regression test affected areas when bugs are fixed",
    "Execute full regression suite 2 days before sprint end",
    "Provide go/no-go sign-off for production deployment",
    "Update test documentation and archive test run results"
  ]
- related_tools: (as JSON array) ["tool-001", "tool-004", "tool-003"]
- target_segments: (as JSON array) ["ROOKIE", "AT_RISK", "HIGH_FLYER"]
- target_teams: (as JSON array) []

### SOP 3: Test Environment Setup & Configuration
- title: "Test Environment Setup & Configuration"
- sop_id: "sop-003"
- criticality: "medium"
- mandatory: false
- steps: (as JSON array)
  [
    "Submit access request via IT Service Portal",
    "Verify VPN access and credentials work correctly",
    "Install required browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)",
    "Install testing tools: Postman, TestRail, BrowserStack, screen recording software",
    "Configure database connections and verify connectivity",
    "Set up test data sets for different user roles and scenarios",
    "Validate API endpoints are accessible (ping, basic health checks)",
    "Document environment URLs, credentials, and configuration",
    "Run sample end-to-end test to validate complete setup",
    "Bookmark essential resources and documentation"
  ]
- related_tools: (as JSON array) ["tool-002", "tool-004", "tool-005"]
- target_segments: (as JSON array) ["ROOKIE"]
- target_teams: (as JSON array) []

### SOP 4: Automation Script Code Review Process
- title: "Automation Script Code Review Process"
- sop_id: "sop-004"
- criticality: "high"
- mandatory: false
- steps: (as JSON array)
  [
    "Create feature branch from main: git checkout -b feature/test-name",
    "Write automation scripts following framework standards",
    "Run tests locally and ensure 100% pass rate",
    "Commit with clear message: Add: Login page test suite",
    "Push branch to remote: git push origin feature/test-name",
    "Create Pull Request with description, test coverage, and screenshots",
    "Request review from senior automation engineer or QA lead",
    "Address review comments and update code",
    "Re-run tests after changes",
    "Merge to main branch after approval",
    "Verify CI/CD pipeline execution succeeds",
    "Update automation documentation and framework README"
  ]
- related_tools: (as JSON array) ["tool-005", "tool-007", "tool-004"]
- target_segments: (as JSON array) ["HIGH_FLYER"]
- target_teams: (as JSON array) []

### SOP 5: Bug Triage Meeting Protocol
- title: "Bug Triage Meeting Protocol"
- sop_id: "sop-005"
- criticality: "high"
- mandatory: true
- steps: (as JSON array)
  [
    "Review all new bugs logged since last triage (daily or twice-weekly)",
    "Verify each bug is reproducible with provided steps",
    "Validate severity and priority assignments",
    "Assign bugs to appropriate development team/individual",
    "Identify any duplicate or related issues",
    "Flag blockers and critical issues for immediate attention",
    "Defer low-priority bugs to backlog if needed",
    "Estimate fix effort with development team",
    "Update bug status and add triage notes",
    "Create action items for follow-up or missing information"
  ]
- related_tools: (as JSON array) ["tool-001", "tool-003"]
- target_segments: (as JSON array) ["ROOKIE", "AT_RISK", "HIGH_FLYER"]
- target_teams: (as JSON array) []

### SOP 6: Test Case Design & Review
- title: "Test Case Design & Review"
- sop_id: "sop-006"
- criticality: "medium"
- mandatory: false
- steps: (as JSON array)
  [
    "Review requirements and acceptance criteria thoroughly",
    "Identify positive, negative, and edge test scenarios",
    "Write test cases in TestRail with clear preconditions",
    "Include detailed step-by-step instructions",
    "Define expected results for each step",
    "Add test data requirements and environment prerequisites",
    "Tag test cases with appropriate labels (smoke, regression, etc.)",
    "Submit test cases for peer review",
    "Address review feedback and update test cases",
    "Get approval from QA lead or senior QA",
    "Link test cases to user stories in Jira",
    "Add to appropriate test suites for execution"
  ]
- related_tools: (as JSON array) ["tool-004", "tool-001"]
- target_segments: (as JSON array) ["ROOKIE", "HIGH_FLYER"]
- target_teams: (as JSON array) []

### SOP 7: Regression Testing Execution
- title: "Regression Testing Execution"
- sop_id: "sop-007"
- criticality: "high"
- mandatory: true
- steps: (as JSON array)
  [
    "Identify scope: full regression vs targeted regression",
    "Create test run in TestRail with appropriate test suite",
    "Assign test cases to QA team members",
    "Execute smoke tests first to validate build stability",
    "Run automated regression suite if available",
    "Execute manual regression test cases",
    "Log any new defects discovered during regression",
    "Retest previously fixed bugs to confirm no regression",
    "Track progress and report daily status",
    "Generate test execution report",
    "Provide summary and go/no-go recommendation",
    "Archive test run results for future reference"
  ]
- related_tools: (as JSON array) ["tool-004", "tool-001", "tool-005"]
- target_segments: (as JSON array) ["ROOKIE", "AT_RISK", "HIGH_FLYER"]
- target_teams: (as JSON array) []

After creating all 7 SOPs, please publish them to the 'dev' environment.
```

---

## 📋 Checklist

Before giving the prompt to MCP:

- [ ] Delete all 25 existing SOPs in Contentstack UI
- [ ] Copy the prompt above
- [ ] Give to MCP
- [ ] Verify 7 SOPs are created with correct step-by-step content
- [ ] Publish all 7 SOPs to 'dev' environment

---

## ✅ How to Verify

After MCP creates the SOPs, run this to verify:

```bash
node scripts/verify-all-entries.js
```

You should see:
- **7 SOPs** (not 25)
- Each with **step-by-step instructions** (not training descriptions)
- All should be **published** to `dev` environment


