package com.dailycodework.quizonline.form.login;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class LoginForm {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}

