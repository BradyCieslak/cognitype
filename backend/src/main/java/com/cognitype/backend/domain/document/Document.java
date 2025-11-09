package com.cognitype.backend.domain.document;

import jakarta.persistence.*;
import java.time.Instant;

@Entity                     // database table
@Table(name = "documents")  // table name in database
public class Document {

    @Id                                     // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100000)
    private String content;

    @Column(nullable = false)
    private Instant createdAt;

    // Getters & setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
