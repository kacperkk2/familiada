package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionFacade {

    private final SessionService sessionService;
    private final SessionPersistService sessionPersistService;

    public SessionDto getGameSessionBySessionUuid(UUID gameUuid, UUID sessionUuid) {
        return sessionService.getGameSessionBySessionUuid(gameUuid, sessionUuid);
    }
}
