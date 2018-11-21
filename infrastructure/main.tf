locals {
  app_full_name = "${var.product}-${var.component}"

  // Specifies the type of environment. var.env is replaced by pipline
  // to i.e. pr-102-snl so then we need just aat used here
  envInUse = "${(var.env == "preview" || var.env == "spreview") ? "aat" : var.env}"

  aat_api_url = "https://snl-api-aat.service.core-compute-aat.internal"
  local_api_url = "https://snl-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
  api_url = "${var.env == "preview" ? local.aat_api_url : local.local_api_url}"

  aat_notes_url = "http://snl-notes-aat.service.core-compute-aat.internal"
  local_notes_url = "http://snl-notes-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
  notes_url = "${var.env == "preview" ? local.aat_notes_url : local.local_notes_url}"

  sharedAspName = "${var.raw_product}-${local.envInUse}"
  sharedAspRg = "${var.raw_product}-shared-infrastructure-${local.envInUse}"
  asp_name = "${(var.env == "preview" || var.env == "spreview") ? "null" : local.sharedAspName}"
  asp_rg = "${(var.env == "preview" || var.env == "spreview") ? "null" : local.sharedAspRg}"
}
module "snl-frontend" {
  source               = "git@github.com:hmcts/cnp-module-webapp"
  product              = "${var.product}-${var.component}"
  location             = "${var.location}"
  env                  = "${var.env}"
  ilbIp                = "${var.ilbIp}"
  is_frontend          = "${var.external_host_name != "" ? "1" : "0"}"
  https_only           = "true"
  additional_host_name = "${var.external_host_name != "" ? var.external_host_name : "null"}"
  capacity             = "1"
  instance_size        = "I1"
  subscription         = "${var.subscription}"
  asp_rg               = "${local.asp_rg}"
  asp_name             = "${local.asp_name}"
  common_tags          = "${var.common_tags}"

  app_settings = {
    # REDIS_HOST                   = "${module.redis-cache.host_name}"
    # REDIS_PORT                   = "${module.redis-cache.redis_port}"
    # REDIS_PASSWORD               = "${module.redis-cache.access_key}"
    # RECIPE_BACKEND_URL = "http://snl-recipe-backend-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"

    SNL_API_URL = "${local.api_url}"
    SNL_NOTES_URL = "${local.notes_url}"
  }
}
