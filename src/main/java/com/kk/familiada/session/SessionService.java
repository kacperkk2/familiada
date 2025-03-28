package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public SessionDto getGameSessionBySessionPassword(UUID gameUuid, String sessionPassword) {
        return sessionRepository.findByGameUuidFkAndSessionPassword(gameUuid, sessionPassword)
                .map(SessionEntity::toDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No session entity with password " + sessionPassword + " for gameUuid " + gameUuid)
                );
    }

    public List<SessionDto> getAllGameSessionsByGameUuid(UUID gameUuid) {
        return sessionRepository.findAllByGameUuidFk(gameUuid).stream()
                .map(SessionEntity::toDto)
                .toList();
    }
}
