package com.cognitype.backend.api.v1.chunks;

import com.cognitype.backend.domain.chunk.Chunk;
import com.cognitype.backend.domain.chunk.ChunkService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/v1/api/documents/{documentId}/chunks")
public class ChunkController {

    private final ChunkService service;

    public ChunkController(ChunkService service) {
        this.service = service;
    }

    @PostMapping
    public List<ChunkResponse> generate(@PathVariable Long documentId,
                                @RequestParam(defaultValue = "200") int size) {
        return service.createChunksForDocument(documentId, size)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping
    public List<ChunkResponse> list(@PathVariable Long documentId) {
        return service.getChunks(documentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ChunkResponse toResponse(Chunk chunk) {
        ChunkResponse resp = new ChunkResponse();
        resp.setId(chunk.getId());
        resp.setIndex(chunk.getIndexNumber());
        resp.setText(chunk.getText());
        return resp;
    }
}
