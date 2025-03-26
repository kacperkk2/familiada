package com.kk.familiada.session;

import com.kk.familiada.session.dto.RoundSessionDto;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "round_session")
class RoundSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private final UUID uuid = UUID.randomUUID();

    @NotNull
    private Boolean isQuestionRevealed;

    @ElementCollection
    @Builder.Default
    private List<UUID> phrasesRevealed = new ArrayList<>();

    @ElementCollection
    @Builder.Default
    private List<UUID> phrasesFamilyA = new ArrayList<>();

    @ElementCollection
    @Builder.Default
    private List<UUID> phrasesFamilyB = new ArrayList<>();

    @NotNull
    private Integer missesFamilyA;

    @NotNull
    private Integer missesFamilyB;

    @NotNull
    private Integer pointsFamilyA;

    @NotNull
    private Integer pointsFamilyB;

    RoundSessionDto toDto() {
        return new RoundSessionDto(
                uuid,
                isQuestionRevealed,
                phrasesRevealed,
                phrasesFamilyA,
                phrasesFamilyB,
                missesFamilyA,
                missesFamilyB,
                pointsFamilyA,
                pointsFamilyB
        );
    }
}
