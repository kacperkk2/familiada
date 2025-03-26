package com.kk.familiada.session;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface SessionEntityRepository extends JpaRepository<SessionEntity, Long> {

    default SessionEntity getByGameUuidFkAndUuidOrThrowEntityNotFound(UUID gameUuid, UUID sessionUuid) {
        return findByGameUuidFkAndUuid(gameUuid, sessionUuid)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No session entity with uuid " + sessionUuid + " for gameUuid " + gameUuid)
                );
    }

    Optional<SessionEntity> findByGameUuidFkAndUuid(UUID gameUuid, UUID sessionUuid);
}
