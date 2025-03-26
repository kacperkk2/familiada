package com.kk.familiada.game.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RoundPersistCommand(
        @NotNull
        Integer roundOrder,
        @NotBlank
        String question,
        @NotEmpty @Valid
        List<PhrasePersistCommand> phrases
) {

}
