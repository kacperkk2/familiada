package com.kk.familiada.game;

import com.kk.familiada.game.dto.GameDto;
import com.kk.familiada.game.dto.GamePersistCommand;
import com.kk.familiada.game.dto.GameUpdateCommand;
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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "game")
class GameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private final UUID uuid = UUID.randomUUID();

    @NotBlank
    private String name;

    @NotNull
    @CreationTimestamp
    private LocalDateTime creationDateTime;

    @NotNull
    @UpdateTimestamp
    private LocalDateTime modificationDateTime;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "game_id")
    @NotEmpty
    @Builder.Default
    private List<RoundEntity> rounds = new ArrayList<>();

    GameDto toDto() {
        return new GameDto(
                uuid,
                name,
                creationDateTime,
                modificationDateTime,
                rounds.stream().map(RoundEntity::toDto).toList()
        );
    }

    static GameEntity from(GamePersistCommand command) {
        return GameEntity.builder()
                .name(command.name())
                .rounds(command.rounds().stream().map(RoundEntity::from).toList())
                .build();
    }

    void update(GameUpdateCommand command) {
        name = command.name();
        Map<UUID, RoundUpdateCommand> roundUuidToCommand = command.rounds().stream()
                .collect(Collectors.toMap(RoundUpdateCommand::uuid, Function.identity()));
        rounds.forEach(round -> round.update(roundUuidToCommand.get(round.getUuid())));
    }
}
