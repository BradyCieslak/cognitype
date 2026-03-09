package com.cognitype.backend.api.v1.documents;

import com.cognitype.backend.api.v1.documents.dto.DocumentRequest;
import com.cognitype.backend.api.v1.documents.dto.DocumentResponse;
import com.cognitype.backend.api.v1.documents.dto.UpdateTitleRequest;
import com.cognitype.backend.domain.document.Document;
import com.cognitype.backend.domain.document.DocumentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController // handles web requests
@RequestMapping("/v1/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService service) {
        this.documentService = service;
    }

    // GET: get a document by id
    @GetMapping("/{id}")
    public Document get(@PathVariable Long id) {
        return documentService.get(id);
    }

    @PostMapping
    public DocumentResponse createFromText(@RequestBody DocumentRequest req) {
        if (req.text() == null || req.text().isBlank()) {
            throw new RuntimeException("Text is required");
        }

        String title = req.title();
        if (title == null || title.isBlank()) {
            title = deriveTitleFromText(req.text());
        }

        Document doc = documentService.createFromText(title, req.text());
        return new DocumentResponse(doc.getId());
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse uploadPdf(@RequestPart("file") MultipartFile file) {
        Document doc = documentService.createFromUpload(file);
        return new DocumentResponse(doc.getId());
    }

    @PatchMapping("/{id}/title")
    public Document rename(@PathVariable Long id,
                           @RequestBody UpdateTitleRequest req) {
        return documentService.updateTitle(id, req.title());
    }

    private String deriveTitleFromText(String text) {
        if (text == null) return "Untitled";

        String[] lines = text.split("\\R");

        String candidate = null;
        for (String line: lines) {
            if (line != null) {
                String trimmed = line.trim();
                if(!trimmed.isBlank()) {
                    candidate = trimmed;
                    break;
                }
            }
        }

        if (candidate == null) return "Untitled";

        candidate = candidate.replaceAll("\\s", " ");

        int maxLen = 60;
        if (candidate.length() > maxLen) {
            candidate = candidate.substring(0, maxLen).trim();
        }

        return candidate.isBlank() ? "untitled" : candidate;
    }
}


