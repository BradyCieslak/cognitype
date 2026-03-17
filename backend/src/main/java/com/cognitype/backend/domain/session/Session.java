package com.cognitype.backend.domain.session;

import com.cognitype.backend.domain.chunk.Chunk;
import com.cognitype.backend.domain.document.Document;
import com.cognitype.backend.domain.session.enums.Difficulty;
import com.cognitype.backend.domain.session.enums.SessionMode;
import com.cognitype.backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "sessions")
@Getter @Setter
@NoArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode", nullable = false, length = 16)
    private SessionMode mode;

    @Column(name = "chunk_size")
    private Integer chunkSize;

    @Column(name = "time_seconds")
    private Integer timeSeconds;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 16)
    private Difficulty difficulty;

    @Column(name = "current_chunk_index", nullable = false)
    private int currentChunkIndex = 0;

    @Column(name = "typed_chars", nullable = false)
    private int typedChars = 0;

    @Column(name = "elapsed_ms", nullable = false)
    private long elapsedMs = 0L;

    @Column(name = "accuracy", nullable = false)
    private double accuracy = 0.0;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany
    @JoinColumn(name = "session_id")
    private List<Chunk> chunks;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public void applyProgress(int typedCharsDelta, long elapsedMsDelta) {
        this.typedChars += typedCharsDelta;
        this.elapsedMs += elapsedMsDelta;
    }

    public void markCompleted(double finalAccuracy) {
        this.completed = true;
        this.accuracy = finalAccuracy;
        this.completedAt = Instant.now();
    }



}
