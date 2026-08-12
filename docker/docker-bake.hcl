variable "BAKE_OUTPUT" {}
variable "DOCKER_REGISTRY" {}
variable "DOCKER_TAG" {}
variable "GIT_COMMIT" {}
variable "NODE_VERSION" {}
variable "PNPM_VERSION" {}

group "default" {
  targets = ["gtk-node"]
}

target "_common" {
  context = ".."
  output  = ["type=${BAKE_OUTPUT}"]
}

target "gtk-node" {
  inherits   = ["_common"]
  dockerfile = "docker/Dockerfile"
  args = {
    NODE_VERSION = "${NODE_VERSION}"
    PNPM_VERSION = "${PNPM_VERSION}"
  }
  tags = [
    "${DOCKER_REGISTRY}/gtk-node:${DOCKER_TAG}",
    "${DOCKER_REGISTRY}/gtk-node:${GIT_COMMIT}",
  ]
}
