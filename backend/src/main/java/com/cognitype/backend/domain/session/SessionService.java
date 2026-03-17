package com.cognitype.backend.domain.session;


import com.cognitype.backend.api.v1.sessions.dto.SessionRequest;
import com.cognitype.backend.domain.chunk.Chunk;
import com.cognitype.backend.domain.chunk.ChunkService;
import com.cognitype.backend.domain.document.Document;
import com.cognitype.backend.domain.document.DocumentRepository;
import com.cognitype.backend.api.v1.sessions.dto.SessionCompleteRequest;
import com.cognitype.backend.api.v1.sessions.dto.SessionProgressRequest;
import com.cognitype.backend.domain.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final DocumentRepository documentRepository;

    private final ChunkService chunkService;

    @Transactional
    public Session createSession(SessionRequest req, User user) {
        Document document = documentRepository.findById(req.documentId())
                .orElseThrow( () -> new EntityNotFoundException("Document not found: " + req.documentId()));

        Session session = new Session();
        initializeSession(session, document, req);
        session.setUser(user);

        return sessionRepository.save(session);
    }

    private void initializeSession(Session session, Document document, SessionRequest req) {
        session.setDocument(document);
        session.setMode(req.mode());
        session.setChunkSize(req.chunkSize());
        session.setTimeSeconds(req.timeSeconds());
        session.setDifficulty(req.difficulty());
        session.setCurrentChunkIndex(0);
        session.setTypedChars(0);
        session.setElapsedMs(0);
        session.setChunks(
                chunkService.createChunksForDocument(
                        document.getId(),
                        req.chunkSize()
                )
        );
    }

    @Transactional
    public Session updateProgress(Long sessionId, SessionProgressRequest req) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow( () -> new EntityNotFoundException("Session not found: " + sessionId) );

        session.applyProgress(req.typedCharsDelta(), req.elapsedMsDelta());
        return sessionRepository.save(session);
    }

    @Transactional
    public Session completeSession(Long sessionId, SessionCompleteRequest req) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow( () -> new EntityNotFoundException("Session not found: " + sessionId));

        session.markCompleted(req.finalAccuracy());
        return sessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public Session getSession(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow( () -> new EntityNotFoundException("Session not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Session> getSessionsForUser(User user) {
        return sessionRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Chunk getNextChunk(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow( () -> new EntityNotFoundException("Session not found: " + sessionId));

        List<Chunk> sessionChunks = session.getChunks();

        if (session.getCurrentChunkIndex() >= sessionChunks.size()) {
            throw new IllegalStateException("No more chunks");
        }

        Chunk nextChunk = sessionChunks.get(session.getCurrentChunkIndex());
        session.setCurrentChunkIndex(session.getCurrentChunkIndex() + 1);
        sessionRepository.save(session);
        return nextChunk;
    }


}
