locals {
  tags = merge({
    Project     = "FinCloudSentinel"
    Environment = var.environment
    ManagedBy   = "Terraform"
    DataClass   = "SyntheticOnly"
  }, var.tags)
}

data "alicloud_zones" "available" {
  available_resource_creation = "VSwitch"
}

resource "alicloud_vpc" "this" {
  vpc_name   = "${var.name}-${var.environment}"
  cidr_block = "10.42.0.0/16"
  tags       = local.tags
}

resource "alicloud_vswitch" "application" {
  count        = 3
  vpc_id       = alicloud_vpc.this.id
  cidr_block   = cidrsubnet(alicloud_vpc.this.cidr_block, 4, count.index)
  zone_id      = data.alicloud_zones.available.zones[count.index].id
  vswitch_name = "${var.name}-${var.environment}-az${count.index + 1}"
  tags         = local.tags
}

resource "alicloud_security_group" "ack" {
  security_group_name = "${var.name}-${var.environment}-ack"
  description         = "Private-only ACK worker security group for FinCloud Sentinel"
  vpc_id              = alicloud_vpc.this.id
  tags                = local.tags
}

resource "alicloud_log_project" "this" {
  project_name = "${replace(var.name, "-", "")}-${var.environment}-${random_id.suffix.hex}"
  description  = "FinCloud Sentinel security and application logs"
  tags         = local.tags
}

resource "random_id" "suffix" {
  byte_length = 3
}

resource "alicloud_kms_key" "secrets" {
  description            = "Envelope encryption for FinCloud Sentinel secrets"
  key_usage              = "ENCRYPT/DECRYPT"
  automatic_rotation     = "Enabled"
  rotation_interval      = "30d"
  pending_window_in_days = 30
  status                 = "Enabled"
  tags                   = local.tags
}

resource "alicloud_cs_managed_kubernetes" "this" {
  count                   = var.create_ack ? 1 : 0
  name_prefix             = "${var.name}-${var.environment}"
  cluster_spec            = var.cluster_spec
  vswitch_ids             = alicloud_vswitch.application[*].id
  new_nat_gateway         = true
  pod_cidr                = "10.44.0.0/16"
  service_cidr            = "10.45.0.0/20"
  slb_internet_enabled    = false
  security_group_id       = alicloud_security_group.ack.id
  encryption_provider_key = alicloud_kms_key.secrets.id
  enable_rrsa             = true
  tags                    = local.tags

  addons {
    name = "terway-eniip"
  }
  addons {
    name = "csi-plugin"
  }
  addons {
    name = "csi-provisioner"
  }
  addons {
    name   = "logtail-ds"
    config = jsonencode({ sls_project_name = alicloud_log_project.this.project_name })
  }

  timeouts {
    create = "90m"
    update = "60m"
    delete = "60m"
  }
}
