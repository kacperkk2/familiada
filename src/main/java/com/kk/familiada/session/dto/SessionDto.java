package com.kk.familiada.session.dto;

import java.util.List;
import java.util.UUID;

public record SessionDto(
        UUID uuid,
        UUID gameUuid,
        String nameFamilyA,
        String nameFamilyB,
        Integer pointsFamilyA,
        Integer pointsFamilyB,
        Integer roundIndex,
        String sessionPassword,
        List<RoundSessionDto> roundSessions
) {
}
