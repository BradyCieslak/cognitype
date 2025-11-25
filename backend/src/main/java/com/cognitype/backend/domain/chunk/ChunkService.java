package com.cognitype.backend.domain.chunk;

import com.cognitype.backend.domain.document.Document;
import com.cognitype.backend.domain.document.DocumentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class ChunkService {
    private final ChunkRepository chunkRepo;
    private final DocumentRepository docRepo;

    public ChunkService(ChunkRepository chunkRepo, DocumentRepository docRepo) {
        this.chunkRepo = chunkRepo;
        this.docRepo = docRepo;
    }

    public List<Chunk> createChunksForDocument(Long documentId, int chunkSize) {
        Document doc = docRepo.findById(documentId).orElseThrow(
                () -> new RuntimeException("Document not found")
        );

        String text = doc.getContent();
        if(text == null || text.isBlank()) {
            return List.of();
        }

        List<Chunk> chunks = new ArrayList<>();
        int index = 0;
        int length = text.length();

        while (index < length) {
            index = skipLeadingWhitespace(text, index, length);
            if (index >= length) break;

            int target = index + chunkSize;

            // take rest of text if last chunk
            if (target >= length) {
                String finalChunk = text.substring(index);
                Chunk c = new Chunk();
                c.setDocument(doc);
                c.setIndexNumber(chunks.size());
                c.setText(finalChunk.trim());
                chunks.add(c);
                break;
            }

            int breakPos = findBreakPosition(text, index, chunkSize, length);
            String chunkStr = text.substring(index, breakPos).trim();
            if(!chunkStr.isEmpty()) addChunk(doc, chunks, chunkStr);

            // move index past break and whitespace
            index = breakPos;
            while (index < length && Character.isWhitespace(text.charAt(index)))
                index++;

        }

        return chunkRepo.saveAll(chunks);
    }

    public List<Chunk> getChunks(Long documentId) {
        return chunkRepo.findByDocument_IdOrderByIndexNumber(documentId);
    }

    private int skipLeadingWhitespace(String text, int index, int length) {
        while (index < length && Character.isWhitespace(text.charAt(index))) index++;
        return index;
    }

    private int findLastWhitespace(String text, int start, int end) {
        for (int i = end; i >= start; i--) {
            if (Character.isWhitespace(text.charAt(i))) return i;
        }
        return -1;
    }

    private int findNextWhitespace(String text, int start, int length) {
        for (int i = start; i < length; i++) {
            if (Character.isWhitespace(text.charAt(i))) return i;
        }
        return -1;
    }

    private void addChunk(Document doc, List<Chunk> chunks, String chunkStr) {
        Chunk c = new Chunk();
        c.setDocument(doc);
        c.setIndexNumber(chunks.size());
        c.setText(chunkStr);
        chunks.add(c);
    }

    private int findBreakPosition(String text, int start, int chunkSize, int length) {
        int target = start + chunkSize;
        if (target >= length) {
            return length;
        }

        int clampedTarget = Math.min(target, length - 1);

        int lastSpace = findLastWhitespace(text, start, clampedTarget);
        int nextSpace = findNextWhitespace(text, clampedTarget + 1, length);

        int breakPos;

        if (lastSpace == -1 && nextSpace == -1) {
            breakPos = Math.min(target, length);
        } else if (lastSpace != -1 && nextSpace == -1) {
            breakPos = lastSpace;
        } else if (lastSpace == -1) {
            breakPos = nextSpace;
        } else {
            int distBefore = target - lastSpace;
            int distAfter  = nextSpace - target;
            breakPos = (distBefore <= distAfter) ? lastSpace : nextSpace;
        }

        // make sure breakPos doesn't go backwards
        if (breakPos <= start) {
            breakPos = Math.min(start + chunkSize, length);
        }

        return breakPos;

    }
}
