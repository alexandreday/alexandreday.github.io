---
title: "From Clicks to Intent: cross-platform session embeddings"
date: June 2026
publications:
  - title: "From Clicks to Intent: Cross-Platform Session Embeddings with LLM-Distilled Taxonomy for Financial Services Recommendations"
    link: https://arxiv.org/abs/2606.26277
    journal: arXiv preprint
figureCaption: "<b>Figure 1:</b> System architecture overview. Left: multi-modal clickstream events are fused and encoded into a compact session embedding by a self-supervised Transformer. Right: a clustering-based sampling, iterative LLM taxonomy generation, label assignment, and distillation pipeline turns the same sessions into interpretable intent labels at low latency."
figureImage: /images/session-embeddings-fig1.png
---

In financial services, the way people behave before and after they log in is very different. Pre-login web visitors are usually exploring &mdash; comparing products and shopping around &mdash; while logged-in app users are mostly servicing an existing account. That mismatch, combined with the difficulty of matching an anonymous web session to an authenticated mobile account (cross-channel entity resolution), means the rich intent signal in web clickstreams is often left on the table when it comes to in-app personalization.

This work proposes a single framework that turns raw web clickstreams into two complementary outputs. A self-supervised Transformer fuses multi-modal clickstream events into a compact **session embedding** that feeds quantitative downstream tasks. In parallel, an **LLM-based taxonomy generation and distillation pipeline** produces interpretable intent labels &mdash; useful for qualitative understanding and for stakeholders who need to know *why* a recommendation was made, not just what it was. Crucially, the distilled labels run at ultra-low latency, so the interpretability comes cheap in production.

We evaluate the framework on two real production tasks:

- **Mobile homepage tile ranking:** the session embedding improves macro Recall@1 by **1.88%** and reduces Log Loss by **13.38%** over production baselines.
- **User conversion prediction:** the embedding outperforms the LLM intent labels by **4.3%** on micro F1, while the distillation layer still delivers interpretable labels with only a **7%** performance drop.

The takeaway is that self-supervised clickstream representations and LLM-distilled taxonomies are not competing approaches &mdash; used together they let one system serve both the quantitative recommendation tasks and the qualitative, human-readable understanding that an enterprise setting demands. The full paper is available on [arXiv](https://arxiv.org/abs/2606.26277).
