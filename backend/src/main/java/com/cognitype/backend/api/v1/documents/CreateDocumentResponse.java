package com.cognitype.backend.api.v1.documents;

import lombok.Getter;

@Getter
public class CreateDocumentResponse {
    private final Long documentId;

    public CreateDocumentResponse(Long documentId) {
        this.documentId = documentId;
    }
}
