package com.school.health.controller;

import com.school.health.dto.request.ChatbotRequest;
import com.school.health.dto.response.ChatbotResponse;
import com.school.health.service.ChatbotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Tag(name = "Chatbot", description = "Chatbot APIs")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private final ChatbotService chatbotService;

    @PostMapping("/query")
    public ResponseEntity<ChatbotResponse> query(
            @Valid @RequestBody ChatbotRequest request) {
        String answer = chatbotService.handleInput(request.getMessage());
        return ResponseEntity.ok(new ChatbotResponse(answer));
    }
}
