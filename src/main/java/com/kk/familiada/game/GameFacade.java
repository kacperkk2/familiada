package com.kk.familiada.game;

import com.kk.familiada.game.dto.GameDto;
import com.kk.familiada.game.dto.GamePersistCommand;
import com.kk.familiada.game.dto.GameUpdateCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameFacade {

    private final GameService gameService;
    private final GamePersistService gamePersistService;

    public GameDto getGameByGameUuid(UUID uuid) {
        return gameService.getGameByGameUuid(uuid);
    }

    public GameDto createGame(GamePersistCommand gamePersistCommand) {
        return gamePersistService.createGame(gamePersistCommand);
    }

    public GameDto updateGame(GameUpdateCommand gameUpdateCommand) {
        return gamePersistService.updateGame(gameUpdateCommand);
    }

    public void deleteGameByGameUuid(UUID gameUuid) {
        gamePersistService.deleteGameByGameUuid(gameUuid);
    }
}
