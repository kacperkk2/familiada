package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
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
import java.util.UUID;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "session")
class SessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private final UUID uuid = UUID.randomUUID();

    @NotNull
    private UUID gameUuidFk;

    @NotBlank
    private String nameFamilyA;

    @NotBlank
    private String nameFamilyB;

    @NotNull
    private Integer pointsFamilyA;

    @NotNull
    private Integer pointsFamilyB;

    @NotNull
    private Integer roundIndex;

    @NotBlank
    private String sessionPassword;

    @NotNull
    @CreationTimestamp
    private LocalDateTime creationDateTime;

    @NotNull
    @UpdateTimestamp
    private LocalDateTime modificationDateTime;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "session_id")
    @NotEmpty
    @Builder.Default
    private List<RoundSessionEntity> roundSessions = new ArrayList<>();

    SessionDto toDto() {
        return new SessionDto(
                uuid,
                gameUuidFk,
                nameFamilyA,
                nameFamilyB,
                pointsFamilyA,
                pointsFamilyB,
                roundIndex,
                sessionPassword,
                roundSessions.stream().map(RoundSessionEntity::toDto).toList()
        );
    }
}
