package com.cognitype.backend.domain.document;

import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public Document createFromText(String title, String text) {
        var doc = new Document();
        doc.setTitle(title);
        doc.setText(text);
        doc.setCreatedAt(Instant.now());
        return documentRepository.save(doc);
    }

    public Document createFromUpload(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if(filename == null) {
            throw new RuntimeException("File must have a name");
        }

        String lower = filename.toLowerCase();

        String text;

        if(lower.endsWith(".pdf")) {
            text = extractTextFromPdf(file);
        } else if (lower.endsWith(".txt")) {
            text = extractTextFromTxt(file);
        } else if (lower.endsWith(".docx")) {
            text = extractTextFromDocx(file);
        } else {
            throw new RuntimeException("File type not supported: " + filename);
        }

        Document doc = new Document();
        doc.setTitle(filename);
        doc.setText(text);
        doc.setCreatedAt(Instant.now());
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
            throw new RuntimeException("Failed to read PDF", e);
        }
    }

    private String extractTextFromTxt(MultipartFile file) {
        try {
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read txt file", e);
        }
    }

    private String extractTextFromDocx(MultipartFile file) {
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
            return extractor.getText();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read docx file", e);
        }
    }

}
