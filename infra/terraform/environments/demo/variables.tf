variable "region" {
  description = "Alibaba Cloud region for the reference environment."
  type        = string
  default     = "cn-hangzhou"
}

variable "name" {
  description = "Resource name prefix."
  type        = string
  default     = "fincloud-sentinel"
}

variable "environment" {
  description = "Environment label."
  type        = string
  default     = "demo"
  validation {
    condition     = contains(["demo", "staging", "production"], var.environment)
    error_message = "environment must be demo, staging, or production."
  }
}

variable "create_ack" {
  description = "Actually create the cost-bearing ACK cluster. Keep false for documentation/validation."
  type        = bool
  default     = false
}

variable "cluster_spec" {
  description = "ACK control-plane edition."
  type        = string
  default     = "ack.pro.small"
}

variable "tags" {
  description = "Additional resource tags."
  type        = map(string)
  default     = {}
}
