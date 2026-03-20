variable "repository_names" {
  description = "List of ECR repository names to create"
  type        = list(string)
}

variable "images_to_keep" {
  description = "Number of images to retain per repository (older ones are expired)"
  type        = number
  default     = 10
}
