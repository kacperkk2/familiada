package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
import com.kk.familiada.session.dto.SessionInitializeCommand;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/games/{gameUuid}/sessions")
@RequiredArgsConstructor
class SessionController {

    private final SessionFacade sessionFacade;

    @GetMapping
    List<SessionDto> getAllGameSessionsByGameUuid(@PathVariable UUID gameUuid) {
        return sessionFacade.getAllGameSessionsByGameUuid(gameUuid);
    }

    @GetMapping("{sessionUuid}")
    SessionDto getGameSessionBySessionUuid(@PathVariable UUID gameUuid, @PathVariable UUID sessionUuid) {
        return sessionFacade.getGameSessionBySessionUuid(gameUuid, sessionUuid);
    }

    @GetMapping(params = "sessionPassword")
    SessionDto getGameSessionBySessionPassword(
            @PathVariable UUID gameUuid,
            @RequestParam @NotBlank String sessionPassword) {
        return sessionFacade.getGameSessionBySessionPassword(gameUuid, sessionPassword);
    }

    @DeleteMapping("{sessionUuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteGameSessionBySessionUuid(@PathVariable UUID gameUuid, @PathVariable UUID sessionUuid) {
        // todo
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    SessionDto initializeGameSession(@RequestBody @Valid SessionInitializeCommand sessionInitializeCommand) {
        return sessionFacade.initializeGameSession(sessionInitializeCommand);
    }

    @PutMapping
    SessionDto updateGameSession() {
        // todo
        return null;
    }
}
