package com.kk.familiada.game;

import com.kk.familiada.game.dto.GameDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class GameService {

    private final GameEntityRepository gameRepository;

    GameDto getGameByGameUuid(UUID uuid) {
        return Optional.of(gameRepository.getByUuidOrThrowEntityNotFound(uuid))
                .map(GameEntity::toDto)
                .orElse(null);
    }
}
