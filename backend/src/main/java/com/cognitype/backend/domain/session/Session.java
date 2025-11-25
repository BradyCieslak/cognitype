/*package com.cognitype.backend.domain.session;

import com.cognitype.backend.domain.document.Document;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter @Setter
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Getter @Setter
    private int currentChunk;

    @Getter @Setter
    private int typedChars;

    @Getter @Setter
    private double accuracy;

    @Getter @Setter
    private boolean completed;

}
*/