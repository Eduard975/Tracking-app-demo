package com.youtrack.backend.model

import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
data class Project(
    @Id val id: String = " ",
    var finished: Boolean = false
)