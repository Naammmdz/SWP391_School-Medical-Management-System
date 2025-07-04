package com.school.health.security.jwt;

import com.school.health.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Sẽ sử dụng để tạo và xác thực JWT
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${school.health.jwtSecret}")
    private String jwtSecretString;

    @Value("${school.health.jwtExpirationMs}")

    private Long jwtExpiryTime;


    @Value("${school.health.jwtRefreshExpirationMs}")
    private Long jwtRefreshExpiryTime;

    private SecretKey secretKey;

    @PostConstruct

    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecretString.getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiryTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
        // giải thích từng thành phần:
        // setSubject: đặt tên người dùng làm chủ đề của token
        // setIssuedAt: đặt thời điểm token được phát hành
        // setExpiration: đặt thời gian hết hạn cho token
        // signWith: sử dụng khóa bí mật để ký token
        // compact: tạo ra token dưới dạng chuỗi
    }

    public String generateRefreshToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(String.valueOf(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtRefreshExpiryTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiryTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Integer getUserIdFromJwtToken(String token) {
        return Integer.valueOf(Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject());
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}

