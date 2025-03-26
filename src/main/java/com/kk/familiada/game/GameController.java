package com.kk.familiada.game;

import com.kk.familiada.game.dto.GameDto;
import com.kk.familiada.game.dto.GamePersistCommand;
import com.kk.familiada.game.dto.GameUpdateCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/games")
@RequiredArgsConstructor
class GameController {

    private final GameFacade gameFacade;

    @GetMapping("{gameUuid}")
    GameDto getGameByGameUuid(@PathVariable UUID gameUuid) {
        return gameFacade.getGameByGameUuid(gameUuid);
    }

    @DeleteMapping("{gameUuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteGameByGameUuid(@PathVariable UUID gameUuid) {
        gameFacade.deleteGameByGameUuid(gameUuid);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    GameDto createGame(@RequestBody @Valid GamePersistCommand gamePersistCommand) {
        return gameFacade.createGame(gamePersistCommand);
    }

    @PutMapping
    GameDto updateGame(@RequestBody @Valid GameUpdateCommand gameUpdateCommand) {
        return gameFacade.updateGame(gameUpdateCommand);
    }
}
