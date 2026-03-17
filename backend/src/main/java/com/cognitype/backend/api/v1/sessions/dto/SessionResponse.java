package com.cognitype.backend.api.v1.sessions.dto;

import java.time.Instant;

public record SessionResponse(
        Long sessionId,
        Long documentId,
        String documentTitle,
        int currentChunkIndex,
        int typedChars,
        long elapsedMs,
        double accuracy,
        boolean completed,
        Instant createdAt,
        Instant completedAt
) { }
