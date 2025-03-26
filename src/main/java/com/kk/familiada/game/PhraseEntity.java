package com.kk.familiada.game;

import com.kk.familiada.game.dto.PhraseDto;
import com.kk.familiada.game.dto.PhrasePersistCommand;
import com.kk.familiada.game.dto.PhraseUpdateCommand;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Builder
@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "phrase")
class PhraseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private final UUID uuid = UUID.randomUUID();

    @NotBlank
    private String answer;

    @NotNull
    private Integer points;

    PhraseDto toDto() {
        return new PhraseDto(
                uuid,
                answer,
                points
        );
    }

    static PhraseEntity from(PhrasePersistCommand command) {
        return PhraseEntity.builder()
                .answer(command.answer())
                .points(command.points())
                .build();
    }

    void update(PhraseUpdateCommand command) {
        answer = command.answer();
        points = command.points();
    }
}
