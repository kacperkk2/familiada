package com.kk.familiada.game;

import com.kk.familiada.game.dto.PhraseUpdateCommand;
import com.kk.familiada.game.dto.RoundDto;
import com.kk.familiada.game.dto.RoundPersistCommand;
import com.kk.familiada.game.dto.RoundUpdateCommand;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Builder
@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "round")
class RoundEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private final UUID uuid = UUID.randomUUID();

    @NotNull
    private int roundOrder;

    @NotBlank
    private String question;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "round_id")
    @NotEmpty
    @Builder.Default
    private List<PhraseEntity> phrases = new ArrayList<>();

    RoundDto toDto() {
        return new RoundDto(
                uuid,
                roundOrder,
                question,
                phrases.stream().map(PhraseEntity::toDto).toList()
        );
    }

    static RoundEntity from(RoundPersistCommand command) {
        return RoundEntity.builder()
                .roundOrder(command.roundOrder())
                .question(command.question())
                .phrases(command.phrases().stream().map(PhraseEntity::from).toList())
                .build();
    }

    void update(RoundUpdateCommand command) {
        roundOrder = command.roundOrder();
        question = command.question();
        Map<UUID, PhraseUpdateCommand> phraseUuidToCommand = command.phrases().stream()
                .collect(Collectors.toMap(PhraseUpdateCommand::uuid, Function.identity()));
        phrases.forEach(phrase -> phrase.update(phraseUuidToCommand.get(phrase.getUuid())));
    }
}
