---
title: "Literature Review DB"
date: March 2026
figureCaption: "<b>Figure 1:</b> Literature Review DB fetches papers from arXiv, enriches them with citation and author data from OpenAlex, and ranks everything with a multi-factor relevance score into a local SQLite database with structured reading plans."
figureImage: /images/litreviewdb.svg
---

Keeping up with AI research is hard. ArXiv alone sees thousands of new ML papers every month, and none of the existing tools tell you *what to read first* for your specific topic. Literature Review DB is a local-first CLI tool that builds a scored, categorized, and searchable database of papers for any research area. Point it at a subject, and it pulls papers from arXiv, enriches them with citation data and author metrics from OpenAlex, fetches community signals from HuggingFace, and ranks everything with a multi-factor relevance score. Then it gives you a structured reading plan: foundational papers first, core work next, frontier research last.

Every paper gets a 0-to-1 relevance score combining citation velocity (30%), author reputation (20%), recency (15%), venue quality (15%), topic relevance (10%), and community upvotes (10%) — all configurable. Getting started takes just a few commands:

```bash
python cli.py init "Safe AI"               # generate a config prompt
python cli.py sync --full                   # fetch, enrich, score
python cli.py recommend --plan              # get a structured reading plan
python cli.py top --topic "red teaming"     # top papers for a subtopic
```

This project was also an experiment in using agentic coding tools for rapid development. The entire codebase — CLI, database layer, fetchers, scoring engine, recommendation system — was built collaboratively with [Claude Code](https://docs.anthropic.com/en/docs/claude-code). It was a way to test how effectively I could leverage an AI coding assistant to go from idea to working tool quickly, for an app I actually care about. The project is open source on [GitHub](https://github.com/alexandreday/LiteratureReviewDB).
