---
applyTo: "**"
---

Coding standards, domain knowledge, and preferences that AI should follow.

// Copilot Rule: All test names must be written in English.
// This includes all 'describe', 'it', and 'test' blocks in test files.
// Example: it('returns correct value', ...) // GOOD
// it('올바른 값을 반환한다', ...) // BAD

// Copilot Rule: Each test (each 'it' block) should contain only one expect statement whenever possible.
// This encourages atomic, focused tests and improves readability and maintainability.
// Example: it('renders the title', () => { expect(...).to.exist }) // GOOD
// it('renders title and subtitle', () => { expect(...); expect(...); }) // BAD
