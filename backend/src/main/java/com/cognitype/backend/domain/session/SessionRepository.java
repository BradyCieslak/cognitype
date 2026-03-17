package com.cognitype.backend.domain.session;

import com.cognitype.backend.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserOrderByCreatedAtDesc(User user);
}

