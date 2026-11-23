# LLM on Kubernetes — Engineering Lab

**Status:** In progress · personal engineering lab

## Objective
Explore the infrastructure and operational patterns required to serve language models reliably on Kubernetes.

## Areas of investigation
- Containerized model serving and inference API boundaries
- GPU-aware scheduling and resource isolation
- Scaling strategies for inference workloads
- Latency, throughput, token, and resource observability
- Cost visibility for accelerator-backed workloads
- Workload identity and least-privilege access
- Secret management, network policies, TLS, and controlled API exposure
- Image provenance and deployment supply-chain controls

## Non-goals
This repository does not claim a production deployment or measured performance results. Findings and implementation details will be added as the lab develops.

## Planned architecture
Model-serving workload → inference API/service → Kubernetes scheduling and autoscaling → telemetry and security controls.
