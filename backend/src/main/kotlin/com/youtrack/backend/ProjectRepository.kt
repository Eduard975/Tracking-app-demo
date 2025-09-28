package com.youtrack.backend

import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepository : JpaRepository<Project, String>