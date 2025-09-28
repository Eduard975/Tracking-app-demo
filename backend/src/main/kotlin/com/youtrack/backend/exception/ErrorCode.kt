package com.youtrack.backend.exception

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val message: String,
    val status: HttpStatus
) {
    DUPLICATE_PROJECT("Project ID already exists", HttpStatus.CONFLICT),
    PROJECT_NOT_FOUND("Project not found", HttpStatus.NOT_FOUND),
    GENERAL_ERROR("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
}
