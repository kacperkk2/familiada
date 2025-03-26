package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class SessionService {

    private final SessionEntityRepository sessionRepository;

    public SessionDto getGameSessionBySessionUuid(UUID gameUuid, UUID sessionUuid) {
        return Optional.of(sessionRepository.getByGameUuidFkAndUuidOrThrowEntityNotFound(gameUuid, sessionUuid))
                .map(SessionEntity::toDto)
                .orElse(null);
    }
}
