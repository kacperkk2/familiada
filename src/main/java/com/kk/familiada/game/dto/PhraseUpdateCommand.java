package com.kk.familiada.game.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PhraseUpdateCommand(
        @NotNull
        UUID uuid,
        @NotBlank
        String answer,
        @NotNull
        Integer points
) {

}
