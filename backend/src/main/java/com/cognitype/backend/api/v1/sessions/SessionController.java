package com.cognitype.backend.api.v1.sessions;


import com.cognitype.backend.api.v1.sessions.dto.CreateSessionRequest;
import com.cognitype.backend.api.v1.sessions.dto.SessionCompleteRequest;
import com.cognitype.backend.api.v1.sessions.dto.SessionProgressRequest;
import com.cognitype.backend.api.v1.sessions.dto.SessionResponse;
import com.cognitype.backend.domain.session.Session;
import com.cognitype.backend.domain.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(@RequestBody CreateSessionRequest req) {
        Session session = sessionService.createSession(req);
        return ResponseEntity.ok(toResponse(session));
    }

    @PostMapping("/{sessionId}/progress")
    public ResponseEntity<SessionResponse> updateProgress( @PathVariable Long sessionId,
                                                           @RequestBody SessionProgressRequest req ) {
        Session updated = sessionService.updateProgress(sessionId, req);
        return ResponseEntity.ok(toResponse(updated));
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<SessionResponse> complete ( @PathVariable Long sessionId,
                                                      @RequestBody SessionCompleteRequest req ) {
        Session completed = sessionService.completeSession(sessionId, req);
        return ResponseEntity.ok(toResponse(completed));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionResponse> get(@PathVariable Long sessionId) {
        return ResponseEntity.ok(toResponse(sessionService.getSession(sessionId)));
    }

    private SessionResponse toResponse(Session s) {
        return new SessionResponse(
                s.getId(),
                s.getDocument().getId(),
                s.getCurrentChunkIndex(),
                s.getTypedChars(),
                s.getElapsedMs(),
                s.getAccuracy(),
                s.isCompleted(),
                s.getCreatedAt(),
                s.getCompletedAt()
        );
    }
}
