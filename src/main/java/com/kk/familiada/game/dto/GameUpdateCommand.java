package com.kk.familiada.game.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record GameUpdateCommand(
        @NotNull
        UUID uuid,
        @NotBlank
        String name,
        @NotEmpty @Valid
        List<RoundUpdateCommand> rounds
) {

}
