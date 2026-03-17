package com.cognitype.backend.api.v1.auth;

public record AuthResponse(
        String token,
        Long userId,
        String email
) {}