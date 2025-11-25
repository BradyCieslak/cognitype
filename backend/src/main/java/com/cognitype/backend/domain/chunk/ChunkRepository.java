package com.cognitype.backend.domain.chunk;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChunkRepository extends JpaRepository<Chunk, Long> {
    List<Chunk> findByDocument_IdOrderByIndexNumber(Long documentId);
}
