//package com.school.health.security.jwt;
//
//import com.school.health.entity.User;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class JwtService {
//    @Value("${jwt.secret}")
//    private String secretKey;
//    @Value("${jwt.expiration}")
//    private int JWT_EXPIRATION; // 1 day in milliseconds
//
//    // TẠO TOKEN KHI LOGIN THÀNH CÔNG
//    public String generateToken(User user) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("userId", user.getUserId());
//        claims.put("role", user.getRole().getDisplayName());
//        claims.put("fullName", user.getFullName());
//
//        return Jwts.builder()
//                .setClaims(claims)
//                .setSubject(user.getFullName())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
//                .signWith(SignatureAlgorithm.HS256, secretKey)
//                .compact();
//    }
//
//
//
//
//
//}
