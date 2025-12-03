# 📝 Missing Quiz Items for Training Modules

## 🎯 Overview

4 training modules are missing quiz items. This document provides all the quiz questions ready to be created.

---

## 📋 Modules Missing Quiz Items

| Module | Module ID | Current Quiz Items | Needed |
|--------|-----------|-------------------|---------|
| Understanding Test Coverage | mod-testing-002 | None | 2-3 questions |
| Performance Testing Essentials | mod-testing-004 | None | 2-3 questions |
| Remedial Testing Fundamentals | mod-remedial-001 | None | 2-3 questions |
| CI/CD for QA Engineers | mod-automation-003 | None | 2-3 questions |

---

## ✅ Quiz Items to Create

### Module 1: Understanding Test Coverage (mod-testing-002)

#### Quiz Item 1
```json
{
  "title": "Test Coverage Q1",
  "quiz_id": "q-coverage-001",
  "question": "What does code coverage measure?",
  "answer_options": "[\"Number of tests written\", \"Percentage of code executed by tests\", \"Number of bugs found\", \"Test execution time\"]",
  "correct_answer": 1,
  "explanation": "Code coverage measures the percentage of your codebase that is executed when your test suite runs."
}
```

#### Quiz Item 2
```json
{
  "title": "Test Coverage Q2",
  "quiz_id": "q-coverage-002",
  "question": "What is a realistic code coverage target for most projects?",
  "answer_options": "[\"100% always\", \"70-80% with focus on critical paths\", \"Less than 50% is fine\", \"Coverage doesn't matter\"]",
  "correct_answer": 1,
  "explanation": "While 100% coverage is ideal, 70-80% coverage focusing on critical business logic and high-risk areas is more realistic and practical."
}
```

---

### Module 2: Performance Testing Essentials (mod-testing-004)

#### Quiz Item 1
```json
{
  "title": "Performance Testing Q1",
  "quiz_id": "q-performance-001",
  "question": "What is the difference between load testing and stress testing?",
  "answer_options": "[\"They are the same thing\", \"Load tests expected traffic, stress tests beyond capacity\", \"Load is automated, stress is manual\", \"Load is for APIs, stress is for UI\"]",
  "correct_answer": 1,
  "explanation": "Load testing validates performance under expected traffic, while stress testing pushes the system beyond normal capacity to find breaking points."
}
```

#### Quiz Item 2
```json
{
  "title": "Performance Testing Q2",
  "quiz_id": "q-performance-002",
  "question": "Which metric indicates how many users a system can handle?",
  "answer_options": "[\"Response time\", \"Throughput\", \"Error rate\", \"CPU usage\"]",
  "correct_answer": 1,
  "explanation": "Throughput measures the number of requests or transactions the system can process in a given time period, indicating capacity."
}
```

#### Quiz Item 3
```json
{
  "title": "Performance Testing Q3",
  "quiz_id": "q-performance-003",
  "question": "What is the recommended response time for a good user experience?",
  "answer_options": "[\"Under 100ms\", \"Under 1 second\", \"Under 5 seconds\", \"Under 10 seconds\"]",
  "correct_answer": 1,
  "explanation": "Response times under 1 second provide a good user experience, while anything over 3 seconds can lead to user frustration and abandonment."
}
```

---

### Module 3: Remedial Testing Fundamentals (mod-remedial-001)

#### Quiz Item 1
```json
{
  "title": "Testing Fundamentals Q1",
  "quiz_id": "q-fundamentals-001",
  "question": "What are the main phases of the Software Testing Life Cycle (STLC)?",
  "answer_options": "[\"Plan, Design, Execute, Report\", \"Code, Test, Deploy\", \"Write tests, Run tests\", \"Manual then Automated\"]",
  "correct_answer": 0,
  "explanation": "STLC consists of planning, test design, environment setup, test execution, and reporting/closure phases."
}
```

#### Quiz Item 2
```json
{
  "title": "Testing Fundamentals Q2",
  "quiz_id": "q-fundamentals-002",
  "question": "What is boundary value analysis?",
  "answer_options": "[\"Testing at the edges of input ranges\", \"Testing country borders in maps\", \"Testing UI boundaries\", \"Testing time zones\"]",
  "correct_answer": 0,
  "explanation": "Boundary value analysis is a test design technique that focuses on testing at the boundaries between partitions, where defects often occur."
}
```

#### Quiz Item 3
```json
{
  "title": "Testing Fundamentals Q3",
  "quiz_id": "q-fundamentals-003",
  "question": "What is the purpose of equivalence partitioning?",
  "answer_options": "[\"Dividing inputs into groups that should behave similarly\", \"Splitting test team equally\", \"Organizing test cases by module\", \"Balancing test coverage\"]",
  "correct_answer": 0,
  "explanation": "Equivalence partitioning divides test data into partitions where all values in a partition are expected to behave the same way, reducing test cases needed."
}
```

---

### Module 4: CI/CD for QA Engineers (mod-automation-003)

#### Quiz Item 1
```json
{
  "title": "CI/CD Q1",
  "quiz_id": "q-cicd-001",
  "question": "What is Continuous Integration (CI)?",
  "answer_options": "[\"Deploying to production continuously\", \"Integrating code changes frequently and running automated tests\", \"Manual integration testing\", \"Continuous user feedback\"]",
  "correct_answer": 1,
  "explanation": "CI is the practice of frequently integrating code changes into a shared repository, with automated builds and tests to detect issues early."
}
```

#### Quiz Item 2
```json
{
  "title": "CI/CD Q2",
  "quiz_id": "q-cicd-002",
  "question": "What should happen when a CI/CD pipeline test fails?",
  "answer_options": "[\"Skip the test and continue\", \"Block the deployment and notify the team\", \"Deploy anyway and fix later\", \"Disable the test\"]",
  "correct_answer": 1,
  "explanation": "Failed tests should block the deployment pipeline and alert the team so issues can be fixed before reaching production."
}
```

#### Quiz Item 3
```json
{
  "title": "CI/CD Q3",
  "quiz_id": "q-cicd-003",
  "question": "What is the benefit of running tests in a CI/CD pipeline?",
  "answer_options": "[\"Tests run faster\", \"Automated feedback on every code change\", \"Reduces need for QA team\", \"Tests are easier to write\"]",
  "correct_answer": 1,
  "explanation": "CI/CD pipelines provide immediate automated feedback on every code change, catching bugs early before they reach production."
}
```

---

## 🔗 Module Update Instructions

After creating the quiz items, update each module's `quiz_items` field:

### Module: Understanding Test Coverage (UID: bltaa011bad732bdc92)
```json
{
  "quiz_items": "[\"q-coverage-001\", \"q-coverage-002\"]"
}
```

### Module: Performance Testing Essentials (UID: bltaa0906a400bad173)
```json
{
  "quiz_items": "[\"q-performance-001\", \"q-performance-002\", \"q-performance-003\"]"
}
```

### Module: Remedial Testing Fundamentals (UID: blt5c7072f231080039)
```json
{
  "quiz_items": "[\"q-fundamentals-001\", \"q-fundamentals-002\", \"q-fundamentals-003\"]"
}
```

### Module: CI/CD for QA Engineers (UID: bltef5a9e2ea37d27a9)
```json
{
  "quiz_items": "[\"q-cicd-001\", \"q-cicd-002\", \"q-cicd-003\"]"
}
```

---

## 📊 Summary

- **Total Quiz Items to Create**: 11
- **Understanding Test Coverage**: 2 questions
- **Performance Testing Essentials**: 3 questions
- **Remedial Testing Fundamentals**: 3 questions
- **CI/CD for QA Engineers**: 3 questions

---

## 🚀 How to Create These

### Option 1: Via MCP (When Connection Restored)
Use the MCP `create_an_entry` tool with the JSON data above.

### Option 2: Via Contentstack UI
1. Go to Contentstack → Entries → quiz_item
2. Click "+ New Entry"
3. Fill in fields from the JSON above
4. Save and Publish to dev

### Option 3: Via Management API
Use Contentstack's Content Management API to bulk create these entries.

---

**After creating these quiz items, all 20 training modules will have proper quiz assessments!** ✅


