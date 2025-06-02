package com.dailycodework.quizonline.model;

    import jakarta.persistence.*;
    import lombok.Data;

    import java.time.LocalDateTime;
    import java.util.List;

    @Entity
    @Table(name = "`account`")
    @Data
    public class Account {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "user_id")
        private Long userId;

        @Column(name = "username", nullable = false)
        private String username;

        @Column(name = "email", nullable = false, unique = true)
        private String email;

        @Column(name = "password", nullable = false)
        private String password;

        @Column(name = "role", nullable = false)
        private String role;

        @Column(name = "is_enabled", nullable = false)
        private boolean isEnabled = false;

        @Column(name = "verification_token")
        private String verificationToken;

        @Column(name = "token_expiry_date")
        private LocalDateTime tokenExpiryDate;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Attempt> attempts;
    }