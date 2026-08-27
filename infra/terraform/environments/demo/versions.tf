terraform {
  required_version = ">= 1.8.0"
  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "~> 1.285"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }
}

provider "alicloud" {
  region = var.region
}
