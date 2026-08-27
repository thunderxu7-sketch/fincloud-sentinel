# Alibaba Cloud reference environment

This is a **cost-bearing production reference**, not required for the public demo. The default
`create_ack = false` provisions only the network, security group, SLS project, and KMS key when
applied; a normal documentation check runs only `terraform validate` and creates nothing.

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt -check
terraform validate
terraform plan -out=plan.tfplan
# Apply only after security, cost, quota, and architecture review.
terraform apply plan.tfplan
```

For production, place state in an encrypted remote backend, use a RAM role/OIDC identity rather
than static keys, pin the provider after a tested upgrade, enable deletion protection, and add
private endpoints for OceanBase, Tair, RocketMQ, Hologres, PAI-EAS, ARMS, and SLS.

References:
- [ACK managed clusters with Terraform](https://www.alibabacloud.com/help/en/terraform/create-a-managed-kubernetes-cluster)
- [Alibaba Cloud Terraform provider](https://registry.terraform.io/providers/aliyun/alicloud/latest/docs)
