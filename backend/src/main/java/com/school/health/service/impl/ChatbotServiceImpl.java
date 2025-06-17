package com.school.health.service.impl;

import com.school.health.entity.QuestionAnswer;
import com.school.health.repository.QuestionAnswerRepository;
import com.school.health.service.ChatbotService;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ChatbotServiceImpl implements ChatbotService {
    private final QuestionAnswerRepository questionAnswerRepository;

    @Autowired
    public ChatbotServiceImpl(QuestionAnswerRepository questionAnswerRepository) {
        this.questionAnswerRepository = questionAnswerRepository;
    }

    @Override
    public String handleInput(String input) {
        List<QuestionAnswer> allQuestions = questionAnswerRepository.findAll();

        LevenshteinDistance levenshtein = new LevenshteinDistance();

        double maxSimilarity = 0.0;
        String bestAnswer = null;

        for (QuestionAnswer qa : allQuestions) {
            String storedQuestion = qa.getQuestion().toLowerCase();
            String userInput = input.toLowerCase();

            int distance = levenshtein.apply(storedQuestion, userInput);
            int maxLength = Math.max(storedQuestion.length(), userInput.length());

            double similarity = 1.0 - ((double) distance / maxLength);

            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestAnswer = qa.getAnswer();
            }
        }

        if (maxSimilarity >= 0.5) {
            return bestAnswer;
        }

        return "Tôi không hiểu câu hỏi của bạn. Vui lòng thử lại với câu hỏi khác hoặc liên hệ với giáo viên để được hỗ trợ.";
    }
}
