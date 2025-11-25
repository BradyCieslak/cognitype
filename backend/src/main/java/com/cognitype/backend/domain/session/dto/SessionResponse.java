package com.cognitype.backend.domain.session.dto;

import java.time.Instant;

public record SessionResponse(
        Long id,
        Long documentId,
        int currentChunkIndex,
        int typedChars,
        long elapsedMs,
        double accuracy,
        boolean completed,
        Instant createdAt,
        Instant completedAt
) { }
