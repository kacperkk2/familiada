package com.kk.familiada.game.dto;

import java.util.UUID;

public record PhraseDto(
        UUID uuid,
        String answer,
        Integer points
) {
}
