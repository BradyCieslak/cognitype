package com.cognitype.backend.api.v1.auth;

import com.cognitype.backend.domain.user.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.cognitype.backend.domain.user.User;

@RestController
@RequestMapping("/v1/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserInfo> register(@RequestBody RegisterRequest req,
                                             HttpServletResponse response) {
        AuthResponse auth = authService.register(req);
        addAuthCookie(response, auth.token());
        return ResponseEntity.ok(new UserInfo(auth.userId(), auth.email()));
    }

    @PostMapping("/login")
    public ResponseEntity<UserInfo> login(@RequestBody LoginRequest req,
                                          HttpServletResponse response) {
        AuthResponse auth = authService.login(req);
        addAuthCookie(response, auth.token());
        return ResponseEntity.ok(new UserInfo(auth.userId(), auth.email()));
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("auth_token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7 days
        response.addCookie(cookie);
    }

    public record UserInfo(Long userId, String email) {}

    @GetMapping("/profile")
    public ResponseEntity<UserInfo> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserInfo(user.getId(), user.getEmail()));
    }
}