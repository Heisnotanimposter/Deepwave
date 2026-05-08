---
title: "CUDA-ParticleFilter"
date: 2026-05-08
tags: ["C++", "CUDA", "Bayesian Statistics"]
---

**GPU-Accelerated Monte Carlo Localization Engine.**

Implemented shared-memory tiling to bypass global memory bandwidth bottlenecks, dropping latency from 80ms to 1.2ms.

## Performance Benchmark

```text
Baseline (CPU)  : 80.0 ms
Optimized (GPU) :  1.2 ms
Speedup         : 66.6x
```

*Note: Achieved zero shared memory bank conflicts.*
