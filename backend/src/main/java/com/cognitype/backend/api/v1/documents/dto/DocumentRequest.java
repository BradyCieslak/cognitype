package com.cognitype.backend.api.v1.documents.dto;

public record DocumentRequest (
    String title,
    String text
) { }
