package com.youtrack.backend.exception

import com.youtrack.backend.controller.ProjectController
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(ProjectController::class.java)

    @ExceptionHandler(Exception::class)
    fun handleGeneralException(ex: Exception): ResponseEntity<String> {
        logger.warn(ex.message)

        return ResponseEntity
            .status(ErrorCode.GENERAL_ERROR.status)
            .body(ErrorCode.GENERAL_ERROR.message)
    }
}
