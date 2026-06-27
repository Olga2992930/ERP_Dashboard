package com.olga.erp_dashboard.user;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/api/me")
    public CurrentUserDto getCurrentUser(@AuthenticationPrincipal OAuth2User user) {
        return new CurrentUserDto(
                user.getAttribute("name"),
                user.getAttribute("email")
        );
    }

    @GetMapping("/api/auth/status")
    public AuthStatusDto getAuthStatus(@AuthenticationPrincipal OAuth2User user) {
        return new AuthStatusDto(user != null);
    }

    @GetMapping("/api/auth/login-url")
    public LoginUrlDto getLoginUrl() {
        return new LoginUrlDto("/oauth2/authorization/google");
    }

    @GetMapping("/api/auth/logout-url")
    public LogoutUrlDto getLogoutUrl() {
        return new LogoutUrlDto("/logout");
    }

    public record CurrentUserDto(String name, String email) {
    }

    public record AuthStatusDto(boolean authenticated) {
    }

    public record LoginUrlDto(String loginUrl) {
    }

    public record LogoutUrlDto(String logoutUrl) {
    }
}
