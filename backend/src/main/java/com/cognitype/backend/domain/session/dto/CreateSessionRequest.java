package com.cognitype.backend.domain.session.dto;

import com.cognitype.backend.domain.session.Difficulty;
import com.cognitype.backend.domain.session.SessionMode;

public record CreateSessionRequest (
    Long documentId,
    SessionMode mode,
    Integer chunkSize,
    Integer timeSeconds,
    Difficulty difficulty
) { }
