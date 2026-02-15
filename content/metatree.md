---
title: Scalable meta-learning of interpretable decision trees
date: November 2025
publications:
  - title: Towards Scalable Meta-Learning of near-optimal Interpretable Models via Synthetic Model Generations
    link: https://arxiv.org/abs/2511.04000
    journal: NeurIPS 2025 Workshop on Generative AI in Finance
figureCaption: "<b>Figure 1:</b> Meta-learning workflow for generating look-ahead trees using synthetic data. The workflow can be divided into two parts: (1) meta-learning step where labeled synthetic datasets are fed into MetaTree along with the optimal decision trees for each dataset as the training targets, and (2) inference step where the pre-trained model is used to predict the look-ahead trees on an unseen, real-world datasets."
figureImage: /images/metatree-fig1.png
---

Decision trees are widely used in high-stakes fields like finance and healthcare because they offer interpretability, but training optimal decision trees is NP-hard and computationally expensive. Existing meta-learning approaches like MetaTree use transformer architectures to predict near-optimal trees, but they rely on real-world datasets or expensive optimal tree solvers for pre-training, which limits scalability.

In this work, we propose a scalable synthetic data generation pipeline based on Structural Causal Models (SCMs) that enables meta-learning of near-optimal decision trees without these bottlenecks. Our approach has four steps: (1) sample synthetic features and labels from an SCM ensuring causal relationships, (2) generate CART baseline trees, (3) apply quality filters to remove datasets with severe class imbalance or poor separability, and (4) create datasets aligned with CART decision boundaries with controlled label noise.

We show that MetaTree pre-trained on our synthetic data achieves performance comparable to pre-training on real-world datasets or with computationally expensive optimal decision tree solvers, while substantially reducing computational cost and offering greater flexibility in data generation.
