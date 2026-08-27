output "vpc_id" {
  description = "Reference VPC identifier."
  value       = alicloud_vpc.this.id
}

output "application_vswitch_ids" {
  description = "Three-zone application vSwitch identifiers."
  value       = alicloud_vswitch.application[*].id
}

output "log_project" {
  description = "SLS project for audit and application telemetry."
  value       = alicloud_log_project.this.project_name
}

output "kms_key_id" {
  description = "KMS key used for envelope encryption."
  value       = alicloud_kms_key.secrets.id
}

output "ack_cluster_id" {
  description = "ACK cluster ID when create_ack=true."
  value       = try(alicloud_cs_managed_kubernetes.this[0].id, null)
}
