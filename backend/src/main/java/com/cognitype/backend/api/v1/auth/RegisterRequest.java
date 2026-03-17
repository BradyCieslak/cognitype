package com.cognitype.backend.api.v1.auth;

public record RegisterRequest(
        String email,
        String password
) {}