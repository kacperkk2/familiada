package com.kk.familiada.session.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SessionInitializeCommand(
        @NotNull
        UUID gameUuid,
        @NotBlank
        String sessionPassword
) {

}
