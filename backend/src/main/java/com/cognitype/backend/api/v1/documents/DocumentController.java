package com.cognitype.backend.api.v1.documents;

import com.cognitype.backend.domain.document.Document;
import com.cognitype.backend.domain.document.DocumentService;
import org.springframework.web.bind.annotation.*;

@RestController // handles web requests
@RequestMapping("/v1/api/documents")
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    // POST: create a document
    @PostMapping
    public Document create(@RequestBody Document doc) {
        return service.create(doc.getTitle(), doc.getContent());
    }

    // GET: get a document by id
    @GetMapping("/{id}")
    public Document get(@PathVariable Long id) {
        return service.get(id);
    }
}
