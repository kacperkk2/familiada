package com.kk.familiada.game;

import com.kk.familiada.game.dto.GameDto;
import com.kk.familiada.game.dto.GamePersistCommand;
import com.kk.familiada.game.dto.GameUpdateCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
class GamePersistService {

    private final GameEntityRepository gameRepository;

    GameDto createGame(GamePersistCommand gamePersistCommand) {
        GameEntity game = GameEntity.from(gamePersistCommand);
        return gameRepository.save(game).toDto();
    }

    @Transactional
    GameDto updateGame(GameUpdateCommand gameUpdateCommand) {
        GameEntity game = gameRepository.getByUuidOrThrowEntityNotFound(gameUpdateCommand.uuid());
        game.update(gameUpdateCommand);
        return game.toDto();
    }

    @Transactional
    void deleteGameByGameUuid(UUID gameUuid) {
        GameEntity game = gameRepository.getByUuidOrThrowEntityNotFound(gameUuid);
        gameRepository.delete(game);
    }
}
