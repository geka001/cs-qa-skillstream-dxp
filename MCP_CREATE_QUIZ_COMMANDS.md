# 🤖 MCP Commands - Create All Missing Quiz Items

## ⚠️ Important: Run these commands when MCP connection is stable

This document contains ready-to-run MCP commands to create all 20 missing quiz items.

---

## ✅ Module: Introduction to Contentstack Launch
**Status**: Already has 3 quiz items ✅
- q-launch-001
- q-launch-002  
- q-launch-003

**No additional quizzes needed for this module.**

---

## 📝 Module: Getting Started with Data & Insights
**Existing**: q-data-001, q-data-002
**Need to create**: 1 more

### Create q-data-004
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Data & Insights Q3 - Advanced",
      quiz_id: "q-data-004",
      question: "How can you track custom user events in Data & Insights?",
      answer_options: "[\"It's automatic\", \"Using event API calls in your application code\", \"Only through UI clicks\", \"Through server logs only\"]",
      correct_answer: 1,
      explanation: "Custom events are tracked by implementing event API calls in your application code to send specific user interactions to Data & Insights."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: AutoDraft AI Content Generation
**Existing**: q-autodraft-001
**Need to create**: 1 more

### Create q-autodraft-003
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "AutoDraft Q3",
      quiz_id: "q-autodraft-003",
      question: "What makes a good AutoDraft prompt?",
      answer_options: "[\"Single word\", \"Specific context, tone, and key points\", \"Just the topic name\", \"Generic instructions\"]",
      correct_answer: 1,
      explanation: "Effective AutoDraft prompts include specific context, desired tone, target audience, and key points to generate high-quality, relevant content."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Introduction to Test Automation
**Existing**: q-testing-003
**Need to create**: 1 more

### Create q-automation-004
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Test Automation Q2",
      quiz_id: "q-automation-004",
      question: "When should you NOT automate a test?",
      answer_options: "[\"Never automate anything\", \"Tests that change frequently or run once\", \"Regression tests\", \"API tests\"]",
      correct_answer: 1,
      explanation: "Tests that change frequently, run only once, or require significant human judgment are often not good candidates for automation due to high maintenance costs."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Effective Bug Reporting
**Existing**: q-tools-001
**Need to create**: 1 more

### Create q-bug-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Bug Reporting Q1",
      quiz_id: "q-bug-001",
      question: "What is the most important part of a bug report?",
      answer_options: "[\"Who found it\", \"Clear steps to reproduce\", \"When it was found\", \"The bug ID\"]",
      correct_answer: 1,
      explanation: "Clear, detailed steps to reproduce the bug are crucial for developers to understand, replicate, and fix the issue efficiently."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Understanding Test Coverage
**Existing**: NONE
**Need to create**: 2

### Create q-coverage-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Test Coverage Q1",
      quiz_id: "q-coverage-001",
      question: "What does code coverage measure?",
      answer_options: "[\"Number of tests written\", \"Percentage of code executed by tests\", \"Number of bugs found\", \"Test execution time\"]",
      correct_answer: 1,
      explanation: "Code coverage measures the percentage of your codebase that is executed when your test suite runs."
    }
  },
  locale: "en-us"
})
```

### Create q-coverage-002
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Test Coverage Q2",
      quiz_id: "q-coverage-002",
      question: "What is a realistic code coverage target for most projects?",
      answer_options: "[\"100% always\", \"70-80% with focus on critical paths\", \"Less than 50% is fine\", \"Coverage doesn't matter\"]",
      correct_answer: 1,
      explanation: "While 100% coverage is ideal, 70-80% coverage focusing on critical business logic and high-risk areas is more realistic and practical."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Data & Insights Advanced Analytics
**Existing**: q-data-003
**Need to create**: 1 more

### Create q-data-advanced-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Data & Insights Advanced Q2",
      quiz_id: "q-data-advanced-001",
      question: "What is funnel analysis used for?",
      answer_options: "[\"Analyzing sales funnels only\", \"Tracking user journey through conversion steps\", \"Server performance\", \"Bug tracking\"]",
      correct_answer: 1,
      explanation: "Funnel analysis tracks how users move through a series of steps (like signup, checkout) to identify where they drop off and optimize conversion rates."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Visual Builder Advanced Techniques
**Existing**: q-vb-003
**Need to create**: 1 more

### Create q-vb-advanced-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Visual Builder Advanced Q2",
      quiz_id: "q-vb-advanced-001",
      question: "What is the benefit of custom components in Visual Builder?",
      answer_options: "[\"They load faster\", \"Reusable, consistent design across pages\", \"No coding required\", \"Automatic SEO\"]",
      correct_answer: 1,
      explanation: "Custom components allow you to create reusable design elements that maintain consistency across multiple pages and can be updated centrally."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: AutoDraft Advanced Content Generation
**Existing**: q-autodraft-002
**Need to create**: 1 more

### Create q-autodraft-advanced-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "AutoDraft Advanced Q2",
      quiz_id: "q-autodraft-advanced-001",
      question: "How can you ensure AutoDraft generated content maintains brand voice?",
      answer_options: "[\"Can't control it\", \"Provide examples and style guidelines in the prompt\", \"Always rewrite everything\", \"Use only single-word prompts\"]",
      correct_answer: 1,
      explanation: "Including brand voice examples, tone guidelines, and style preferences in your prompts helps AutoDraft generate content that aligns with your brand identity."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: DAM Advanced Asset Management
**Existing**: q-dam-003
**Need to create**: 1 more

### Create q-dam-advanced-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "DAM Advanced Q2",
      quiz_id: "q-dam-advanced-001",
      question: "What is the purpose of asset transformations in DAM?",
      answer_options: "[\"Just for fun\", \"Automatically optimize images for different devices and contexts\", \"Only for compression\", \"To change file format only\"]",
      correct_answer: 1,
      explanation: "Asset transformations automatically create optimized versions (resized, cropped, formatted) of assets for different devices, screen sizes, and use cases."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Performance Testing Essentials
**Existing**: NONE
**Need to create**: 3

### Create q-performance-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Performance Testing Q1",
      quiz_id: "q-performance-001",
      question: "What is the difference between load testing and stress testing?",
      answer_options: "[\"They are the same thing\", \"Load tests expected traffic, stress tests beyond capacity\", \"Load is automated, stress is manual\", \"Load is for APIs, stress is for UI\"]",
      correct_answer: 1,
      explanation: "Load testing validates performance under expected traffic, while stress testing pushes the system beyond normal capacity to find breaking points."
    }
  },
  locale: "en-us"
})
```

### Create q-performance-002
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Performance Testing Q2",
      quiz_id: "q-performance-002",
      question: "Which metric indicates how many users a system can handle?",
      answer_options: "[\"Response time\", \"Throughput\", \"Error rate\", \"CPU usage\"]",
      correct_answer: 1,
      explanation: "Throughput measures the number of requests or transactions the system can process in a given time period, indicating capacity."
    }
  },
  locale: "en-us"
})
```

### Create q-performance-003
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Performance Testing Q3",
      quiz_id: "q-performance-003",
      question: "What is the recommended response time for a good user experience?",
      answer_options: "[\"Under 100ms\", \"Under 1 second\", \"Under 5 seconds\", \"Under 10 seconds\"]",
      correct_answer: 1,
      explanation: "Response times under 1 second provide a good user experience, while anything over 3 seconds can lead to user frustration and abandonment."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: Remedial Testing Fundamentals
**Existing**: NONE
**Need to create**: 3

### Create q-fundamentals-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Testing Fundamentals Q1",
      quiz_id: "q-fundamentals-001",
      question: "What are the main phases of the Software Testing Life Cycle (STLC)?",
      answer_options: "[\"Plan, Design, Execute, Report\", \"Code, Test, Deploy\", \"Write tests, Run tests\", \"Manual then Automated\"]",
      correct_answer: 0,
      explanation: "STLC consists of planning, test design, environment setup, test execution, and reporting/closure phases."
    }
  },
  locale: "en-us"
})
```

### Create q-fundamentals-002
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Testing Fundamentals Q2",
      quiz_id: "q-fundamentals-002",
      question: "What is boundary value analysis?",
      answer_options: "[\"Testing at the edges of input ranges\", \"Testing country borders in maps\", \"Testing UI boundaries\", \"Testing time zones\"]",
      correct_answer: 0,
      explanation: "Boundary value analysis is a test design technique that focuses on testing at the boundaries between partitions, where defects often occur."
    }
  },
  locale: "en-us"
})
```

### Create q-fundamentals-003
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "Testing Fundamentals Q3",
      quiz_id: "q-fundamentals-003",
      question: "What is the purpose of equivalence partitioning?",
      answer_options: "[\"Dividing inputs into groups that should behave similarly\", \"Splitting test team equally\", \"Organizing test cases by module\", \"Balancing test coverage\"]",
      correct_answer: 0,
      explanation: "Equivalence partitioning divides test data into partitions where all values in a partition are expected to behave the same way, reducing test cases needed."
    }
  },
  locale: "en-us"
})
```

---

## 📝 Module: CI/CD for QA Engineers
**Existing**: NONE
**Need to create**: 3

### Create q-cicd-001
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "CI/CD Q1",
      quiz_id: "q-cicd-001",
      question: "What is Continuous Integration (CI)?",
      answer_options: "[\"Deploying to production continuously\", \"Integrating code changes frequently and running automated tests\", \"Manual integration testing\", \"Continuous user feedback\"]",
      correct_answer: 1,
      explanation: "CI is the practice of frequently integrating code changes into a shared repository, with automated builds and tests to detect issues early."
    }
  },
  locale: "en-us"
})
```

### Create q-cicd-002
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "CI/CD Q2",
      quiz_id: "q-cicd-002",
      question: "What should happen when a CI/CD pipeline test fails?",
      answer_options: "[\"Skip the test and continue\", \"Block the deployment and notify the team\", \"Deploy anyway and fix later\", \"Disable the test\"]",
      correct_answer: 1,
      explanation: "Failed tests should block the deployment pipeline and alert the team so issues can be fixed before reaching production."
    }
  },
  locale: "en-us"
})
```

### Create q-cicd-003
```javascript
mcp_cma_create_an_entry({
  branch: "main",
  content_type_uid: "quiz_item",
  entry_data: {
    entry: {
      title: "CI/CD Q3",
      quiz_id: "q-cicd-003",
      question: "What is the benefit of running tests in a CI/CD pipeline?",
      answer_options: "[\"Tests run faster\", \"Automated feedback on every code change\", \"Reduces need for QA team\", \"Tests are easier to write\"]",
      correct_answer: 1,
      explanation: "CI/CD pipelines provide immediate automated feedback on every code change, catching bugs early before they reach production."
    }
  },
  locale: "en-us"
})
```

---

## 📊 Total Summary

**Modules already complete (no new quizzes needed)**:
- Introduction to Contentstack Launch ✅
- Visual Builder Fundamentals ✅
- Digital Asset Management Basics ✅
- API Testing Fundamentals ✅
- QA Tools Overview ✅
- Advanced Launch Personalization ✅
- Test Strategy and Planning ✅
- Advanced Automation with Playwright ✅

**Need to create 20 new quiz items for**:
- 8 modules need 1 quiz each = 8 quizzes
- 4 modules need 2-3 quizzes each = 12 quizzes

**Total: 20 new quiz items to create**

---

## 🚀 After Creating Quiz Items

### Update Module References
After creating all quiz items, update each module's `quiz_items` field to include the new quiz IDs.

### Publish to Dev
Publish all new quiz items and updated modules to the dev environment.

---

**Ready to create all 20 missing quiz items when MCP connection is stable!** 🎯


