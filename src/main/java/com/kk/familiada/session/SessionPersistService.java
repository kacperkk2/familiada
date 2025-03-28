package com.kk.familiada.session;

import com.kk.familiada.session.dto.SessionDto;
import com.kk.familiada.session.dto.SessionInitializeCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class SessionPersistService {

    private final SessionEntityRepository sessionRepository;

    SessionDto initializeGameSession(SessionInitializeCommand command) {
        SessionEntity session = SessionEntity.initialize(command);
        return sessionRepository.save(session).toDto();
    }
}
