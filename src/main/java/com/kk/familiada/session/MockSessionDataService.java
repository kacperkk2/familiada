package com.kk.familiada.session;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MockSessionDataService {

    private final SessionEntityRepository sessionRepository;

    public void init(UUID gameUuid) {
        RoundSessionEntity roundSession1 = RoundSessionEntity.builder()
                .isQuestionRevealed(false)
                .missesFamilyA(1)
                .missesFamilyB(1)
                .pointsFamilyA(1)
                .pointsFamilyB(1)
                .build();
        SessionEntity session = SessionEntity.builder()
                .gameUuidFk(gameUuid)
                .nameFamilyA("nameA")
                .nameFamilyB("nameB")
                .pointsFamilyA(1)
                .pointsFamilyB(1)
                .roundIndex(1)
                .sessionPassword("pass")
                .roundSessions(List.of(roundSession1))
                .build();

        sessionRepository.save(session);
    }
}
