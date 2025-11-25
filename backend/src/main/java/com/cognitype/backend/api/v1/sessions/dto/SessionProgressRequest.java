package com.cognitype.backend.api.v1.sessions.dto;

public record SessionProgressRequest (
        int typedCharsDelta,
        long elapsedMsDelta
) { }
