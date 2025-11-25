package com.cognitype.backend.domain.session.dto;

public record SessionProgressRequest (
        int typedCharsDelta,
        long elapsedMsDelta
) { }
