package com.cognitype.backend.domain.chunk;

import com.cognitype.backend.domain.document.Document;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chunks")
public class Chunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    @Getter @Setter
    private Document document;

    @Column(length = 2000)
    @Getter @Setter
    private String text;

    @Getter @Setter
    private int indexNumber;

}
