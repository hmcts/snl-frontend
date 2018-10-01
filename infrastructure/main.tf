locals {
  app_full_name = "${var.product}-${var.component}"

  aat_api_url = "http://snl-api-aat.service.core-compute-aat.internal"
  local_api_url = "http://snl-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
  api_url = "${var.env == "preview" ? local.aat_api_url : local.local_api_url}"

  aat_notes_url = "http://snl-notes-aat.service.core-compute-aat.internal"
  local_notes_url = "http://snl-notes-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
  notes_url = "${var.env == "preview" ? local.aat_notes_url : local.local_notes_url}"
}
module "snl-frontend" {
  source               = "git@github.com:hmcts/moj-module-webapp"
  product              = "${var.product}-${var.component}"
  location             = "${var.location}"
  env                  = "${var.env}"
  ilbIp                = "${var.ilbIp}"
  is_frontend          = "${var.env != "preview" ? 1: 0}"
  subscription         = "${var.subscription}"
  additional_host_name = "${var.external_host_name}"
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
