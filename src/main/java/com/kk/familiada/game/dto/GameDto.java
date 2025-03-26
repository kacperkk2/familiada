package com.kk.familiada.game.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record GameDto(
        UUID uuid,
        String name,
        LocalDateTime creationDateTime,
        LocalDateTime modificationDateTime,
        List<RoundDto> rounds
) {
}
