package com.kk.familiada.game.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record GamePersistCommand(
        @NotBlank
        String name,
        @NotEmpty @Valid
        List<RoundPersistCommand> rounds
) {

}
