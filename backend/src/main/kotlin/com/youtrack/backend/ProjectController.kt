package com.youtrack.backend

import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
class ProjectController(
    private val repo: ProjectRepository
) {
    private val logger = LoggerFactory.getLogger(ProjectController::class.java)

    // List all projects
    @GetMapping fun getProjects(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Any> {
        return try {
            logger.info("Getting projects")

            val pageable: Pageable = PageRequest.of(page, size)
            val projectsPage = repo.findAll(pageable)

            ResponseEntity(projectsPage, HttpStatus.OK)
        } catch (ex: Exception) {
            logger.warn("Error getting projects: {}", ex.message)
            ResponseEntity
                .status(ErrorCode.GENERAL_ERROR.status)
                .body(ErrorCode.GENERAL_ERROR.message)
        }
    }

    // Add new project
    @PostMapping
    fun addProject(@RequestBody newProject: Project): ResponseEntity<Any> {
        logger.info("Backend adding new project: {}", newProject)

        if (repo.existsById(newProject.id)) {
            logger.warn("Duplicate project ID: {}", newProject.id)
            return ResponseEntity
                .status(ErrorCode.DUPLICATE_PROJECT.status)
                .body(ErrorCode.DUPLICATE_PROJECT.message)
        }

        val savedProject = repo.save(newProject)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject)
    }

    // Update only the "finished" flag
    @PatchMapping("/{id}/finished")
    fun setFlag(
        @PathVariable id: String,
        @RequestBody body: Map<String, Boolean>
    ): ResponseEntity<Any> {
        logger.info("Backend: updating finished flag for {} with {}", id, body)

        val project = repo.findById(id).orElse(null)
            ?: return ResponseEntity
                .status(ErrorCode.PROJECT_NOT_FOUND.status)
                .body(ErrorCode.PROJECT_NOT_FOUND.message)

        val finished = body["finished"] ?: project.finished

        val updated = repo.save(project.copy(finished = finished))
        logger.info("Updated project: {}", updated)

        return ResponseEntity.ok(updated)
    }

}

