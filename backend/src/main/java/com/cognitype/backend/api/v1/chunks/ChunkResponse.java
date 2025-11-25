package com.cognitype.backend.api.v1.chunks;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChunkResponse {
    private Long id;
    private int index;
    private String text;
}
