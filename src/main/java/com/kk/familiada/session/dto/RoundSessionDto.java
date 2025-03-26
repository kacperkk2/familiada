package com.kk.familiada.session.dto;

import java.util.List;
import java.util.UUID;

public record RoundSessionDto(
        UUID uuid,
        Boolean isQuestionRevealed,
        List<UUID> phrasesRevealed,
        List<UUID> phrasesFamilyA,
        List<UUID> phrasesFamilyB,
        Integer missesFamilyA,
        Integer missesFamilyB,
        Integer pointsFamilyA,
        Integer pointsFamilyB
) {

}
