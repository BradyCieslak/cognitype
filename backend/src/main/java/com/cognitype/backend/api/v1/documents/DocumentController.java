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

    // GET: get a document by id
    @GetMapping("/{id}")
    public Document get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public CreateDocumentResponse create(@RequestBody CreateDocumentRequest req) {
        if (req.getText() == null || req.getText().isBlank()) {
            throw new RuntimeException("Text is required");
        }

        Document doc = service.create("Untitled", req.getText());
        return new CreateDocumentResponse(doc.getId());
    }

    @PatchMapping("/{id}/title")
    public Document rename(@PathVariable Long id,
                           @RequestBody UpdateTitleRequest req) {
        return service.updateTitle(id, req.getTitle());
    }
}
