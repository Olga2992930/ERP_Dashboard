package com.olga.erp_dashboard.user;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class UserControllerTest {

    @Test
    void shouldReturnCurrentUser() throws Exception {
        // Given
        OAuth2User user = new DefaultOAuth2User(
                List.of(),
                Map.of(
                        "name", "User Name",
                        "email", "user@example.com"
                ),
                "email"
        );

        UserController userController = new UserController();

        MockMvc mockMvc = standaloneSetup(userController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();

        SecurityContextHolder.getContext()
                .setAuthentication(new TestingAuthenticationToken(user, null));

        try {
            // When / Then
            mockMvc.perform(get("/api/me"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("User Name"))
                    .andExpect(jsonPath("$.email").value("user@example.com"));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    void shouldReturnAuthenticatedStatus() throws Exception {
        // Given
        OAuth2User user = new DefaultOAuth2User(
                List.of(),
                Map.of(
                        "name", "User Name",
                        "email", "user@example.com"
                ),
                "email"
        );

        UserController userController = new UserController();

        MockMvc mockMvc = standaloneSetup(userController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();

        SecurityContextHolder.getContext()
                .setAuthentication(new TestingAuthenticationToken(user, null));

        try {
            // When / Then
            mockMvc.perform(get("/api/auth/status"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.authenticated").value(true));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    void shouldReturnUnauthenticatedStatus() throws Exception {
        // Given
        UserController userController = new UserController();

        MockMvc mockMvc = standaloneSetup(userController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();

        // When / Then
        mockMvc.perform(get("/api/auth/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false));
    }

    @Test
    void shouldReturnLoginUrl() throws Exception {
        // Given
        UserController userController = new UserController();

        MockMvc mockMvc = standaloneSetup(userController).build();

        // When / Then
        mockMvc.perform(get("/api/auth/login-url"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loginUrl").value("/oauth2/authorization/google"));
    }

    @Test
    void shouldReturnLogoutUrl() throws Exception {
        // Given
        UserController userController = new UserController();

        MockMvc mockMvc = standaloneSetup(userController).build();

        // When / Then
        mockMvc.perform(get("/api/auth/logout-url"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.logoutUrl").value("/logout"));
    }
}
