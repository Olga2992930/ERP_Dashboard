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

    public record CurrentUserDto(String name, String email) {
    }
}
