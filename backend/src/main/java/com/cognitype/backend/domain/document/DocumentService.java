package com.cognitype.backend.domain.document;

import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public Document createDocumentFromText(String title, String text) {
        var doc = new Document();
        doc.setTitle(title);
        doc.setText(text);
        doc.setCreatedAt(Instant.now());
        return documentRepository.save(doc);
    }

    public Document createDocumentFromPdf(MultipartFile file) {
        String extractedText = extractTextFromPdf(file);

        Document doc = new Document();
        doc.setText(extractedText);

        return documentRepository.save(doc);
    }

    public Document get(Long id) {
        return documentRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Document not found: " + id)
        );
    }

    public Document updateTitle(Long id, String newTitle) {
        if (newTitle == null || newTitle.isBlank()) {
            throw new RuntimeException("Title cannot be empty");
        }

        Document doc = documentRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Document not found: " + id)
        );

        doc.setTitle(newTitle.trim());
        return documentRepository.save(doc);
    }

    private String extractTextFromPdf(MultipartFile file) {
        try (PDDocument pdf = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(pdf);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse PDF", e);
        }
    }

}
