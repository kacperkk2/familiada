package com.kk.familiada.game;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface GameEntityRepository extends JpaRepository<GameEntity, Long> {

    default GameEntity getByUuidOrThrowEntityNotFound(UUID uuid) {
        return findByUuid(uuid)
                .orElseThrow(() -> new EntityNotFoundException("No game entity with uuid " + uuid));
    }

    Optional<GameEntity> findByUuid(UUID uuid);
}
