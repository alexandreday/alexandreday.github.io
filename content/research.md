---
title: Reinforcement learning in different phases of quantum control
date: January 2019
publications:
  - title: Reinforcement learning in different phase of quantum control
    link: https://journals.aps.org/prx/abstract/10.1103/PhysRevX.8.031086
    journal: Physical Review X
  - title: Glassy Phase of Optimal Quantum Control
    link: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.122.020601
    journal: Physical Review Letters
  - title: Broken symmetry in a two-qubit quantum control landscape
    link: https://journals.aps.org/pra/abstract/10.1103/PhysRevA.97.052114
    journal: Physical Review A
figureCaption: "<b>Figure 1:</b> The optimization landscape of quantum control: Depending on the constraints imposed in the optimization of the quantum control task, the geometry and \"ruggeness\" of the optimization landscape can undergo phase transitons, from smooth and convex landscapes to extremely intricate and rugged landscapes."
figureImage: /images/rugged-landscape2.jpg
---

Quantum control consists in tuning in real-time a set of knobs which set the intensity of some interactions or couplings of a control Hamiltonian. The control Hamiltonian dictates the dynamical state of a quantum state and, as the controls are changed, the quantum state evolves following Schrödinger's dynamic. Ultimately, the goal of quantum control is to prepare certain quantum states with desirable properties (an entangled state for instance). This is of fundamental interest for cold-atom systems, quantum computing and many "hot" fields of quantum sciences. Below is an artistic impression of a non-convex optimization landscape that may be encountered when optimizing quantum control. In our work we explore the different geometry that this landscape can take as different constraints are impose on the system. We show in particular that quantum control undergoes multiple phase transitions from smooth phases to rugged and glassy phases. Our exploration is guided by reinforcement learning methods along with stochastic descent optimization.
