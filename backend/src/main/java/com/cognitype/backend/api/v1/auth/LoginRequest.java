package com.cognitype.backend.api.v1.auth;

public record LoginRequest(
        String email,
        String password
) {}