package com.cognitype.backend.domain.document;

import org.springframework.stereotype.Service;

import java.time.Instant;

@Service // logic layer
public class DocumentService {
    private final DocumentRepository repo;

    // constructor injection
    public DocumentService(DocumentRepository repo) {
        this.repo = repo;
    }

    // method to save a document
    public Document create(String title, String content) {
        var doc = new Document();
        doc.setTitle(title);
        doc.setContent(content);
        doc.setCreatedAt(Instant.now());
        return repo.save(doc);
    }

    public Document get(Long id) {
        return repo.findById(id).orElseThrow(
                () -> new RuntimeException("Document not found: " + id)
        );
    }

    public Document updateTitle(Long id, String newTitle) {
        if (newTitle == null || newTitle.isBlank()) {
            throw new RuntimeException("Title cannot be empty");
        }

        Document doc = repo.findById(id).orElseThrow(
                () -> new RuntimeException("Document not found: " + id)
        );

        doc.setTitle(newTitle.trim());
        return repo.save(doc);
    }

}
