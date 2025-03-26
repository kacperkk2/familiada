package com.kk.familiada.game.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PhrasePersistCommand(
        @NotBlank
        String answer,
        @NotNull
        Integer points
) {

}
