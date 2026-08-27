# FinCloud Sentinel Helm chart

```bash
helm lint infra/helm/fincloud-sentinel
helm template sentinel infra/helm/fincloud-sentinel \
  --set global.revision=$(git rev-parse --short HEAD)
```

Production values must pin images by immutable digest, supply an ALB ingress and certificate,
attach RRSA/RAM annotations to the service account, and replace demo endpoints with private
OceanBase, Tair, RocketMQ, SLS, ARMS, and PAI-EAS endpoints.
