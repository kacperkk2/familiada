package com.kk.familiada.game.dto;

import java.util.List;
import java.util.UUID;

public record RoundDto(
        UUID uuid,
        Integer roundOrder,
        String question,
        List<PhraseDto> phrases
) {
}
