package com.cognitype.backend.api.v1.sessions.dto;

import com.cognitype.backend.domain.session.Difficulty;
import com.cognitype.backend.domain.session.SessionMode;

public record CreateSessionRequest (
    Long documentId,
    SessionMode mode,
    Integer chunkSize,
    Integer timeSeconds,
    Difficulty difficulty
) { }
