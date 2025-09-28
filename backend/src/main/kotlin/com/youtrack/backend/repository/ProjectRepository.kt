package com.youtrack.backend.repository

import com.youtrack.backend.model.Project
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepository : JpaRepository<Project, String>