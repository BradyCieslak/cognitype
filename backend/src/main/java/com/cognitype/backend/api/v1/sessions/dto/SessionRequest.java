package com.cognitype.backend.api.v1.sessions.dto;

import com.cognitype.backend.domain.session.enums.Difficulty;
import com.cognitype.backend.domain.session.enums.SessionMode;

public record SessionRequest (
    Long documentId,
    SessionMode mode,
    Integer chunkSize,
    Integer timeSeconds,
    Difficulty difficulty
) { }
