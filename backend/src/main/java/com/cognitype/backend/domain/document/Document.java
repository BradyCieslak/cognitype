package com.cognitype.backend.domain.document;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(nullable = false, length = 200)
    @Getter @Setter
    private String title;

    @Column(nullable = false, length = 100000)
    @Getter @Setter
    private String text;

    @Column(nullable = false)
    @Getter @Setter
    private Instant createdAt;

}
