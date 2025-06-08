---
description: 
---

name: feature-dev
trigger:
  on_message: "feature:"
phases:
  - id: ask
    agent: "Cascade:Ask"
    output: requirements.md
  - id: architect
    agent: "Cascade:Architect"
    tools: [SequentialThinking, Puppeter]
    input: [requirements.md]
    output: design/
  - id: coder
    agent: "Cascade:Coder"
    tools: [Filesystem, DesktopCommander]
    input: [design/]
    output: src/
  - id: tester
    agent: "Cascade:Tester"
    tools: [DesktopCommander]
    output: reports/tests.xml
  - id: critic
    agent: "Cascade:Critic"
    retry_on_fail: 2
  - id: docs
    agent: "Cascade:Docs"
    output: docs/feature-${DATE}.md
