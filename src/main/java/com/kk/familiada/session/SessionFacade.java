package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
import com.kk.familiada.session.dto.SessionInitializeCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionFacade {

    private final SessionService sessionService;
    private final SessionPersistService sessionPersistService;

    public SessionDto getGameSessionBySessionUuid(UUID gameUuid, UUID sessionUuid) {
        return sessionService.getGameSessionBySessionUuid(gameUuid, sessionUuid);
    }

    public SessionDto getGameSessionBySessionPassword(UUID gameUuid, String sessionPassword) {
        return sessionService.getGameSessionBySessionPassword(gameUuid, sessionPassword);
    }

    public List<SessionDto> getAllGameSessionsByGameUuid(UUID gameUuid) {
        return sessionService.getAllGameSessionsByGameUuid(gameUuid);
    }

    public SessionDto initializeGameSession(SessionInitializeCommand command) {
        return sessionPersistService.initializeGameSession(command);
    }
}
