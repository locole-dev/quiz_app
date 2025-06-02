package com.dailycodework.quizonline.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import java.time.LocalDateTime;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;

@Entity
@Table(name = "attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user", "quiz"}) // Loại trừ user và quiz để tránh lỗi StackOverflow trong toString
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attemptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Account user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(columnDefinition = "TEXT")
    private String answers;

    private Integer score;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Helper methods to convert answers to/from Map<Long, String>
    // Bạn vẫn cần thư viện Jackson và các phương thức này
    @Transient
    public Map<Long, String> getAnswersAsMap() {
        if (this.answers == null || this.answers.isEmpty()) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(this.answers, new TypeReference<Map<Long, String>>() {});
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Transient
    public void setAnswersFromMap(Map<Long, String> answersMap) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.answers = mapper.writeValueAsString(answersMap);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
