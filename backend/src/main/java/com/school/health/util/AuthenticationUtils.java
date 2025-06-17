package com.school.health.util;

import com.school.health.exception.AccessDeniedException;
import com.school.health.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationUtils {

    public Integer getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }

        try {
            UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
            Integer userId = userPrincipal.getId();
            return userId;
        } catch (NumberFormatException e) {
            throw new AccessDeniedException("Invalid user ID format");
        }
    }

    public boolean hasRole(Authentication authentication, String role) {
        if (authentication == null) return false;

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_" + role));
    }

    public boolean hasAnyRole(Authentication authentication, String... roles) {
        for (String role : roles) {
            if (hasRole(authentication, role)) {
                return true;
            }
        }
        return false;
    }

    public void checkOwnership(Integer currentUserId, Integer resourceOwnerId, String resourceType) {
        if (!currentUserId.equals(resourceOwnerId)) {
            throw new AccessDeniedException("You don't have permission to access this " + resourceType);
        }
    }

    public String getCurrentRole(Authentication authentication) {
        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .map(auth -> auth.substring(5)) // Remove "ROLE_" prefix
                .findFirst()
                .orElse("UNKNOWN");
    }

    public String getCurrentUsername(Authentication authentication) {
        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }
        return authentication.getName();
    }

    // Method để check multiple ownership
    public void checkMultipleOwnership(Integer currentUserId, Integer... resourceOwnerIds) {
        for (Integer ownerId : resourceOwnerIds) {
            if (currentUserId.equals(ownerId)) {
                return; // Found match, access granted
            }
        }
        throw new AccessDeniedException("You don't have permission to access this resource");
    }
}
