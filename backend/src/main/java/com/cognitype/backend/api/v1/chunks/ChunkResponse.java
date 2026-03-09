package com.cognitype.backend.api.v1.chunks;

import com.cognitype.backend.domain.chunk.Chunk;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChunkResponse {
    private Long id;
    private String text;

    public ChunkResponse(Chunk chunk) {
        this.id = chunk.getId();
        this.text = chunk.getText();
    }
}
