package com.kk.familiada.session;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class SessionPersistService {

    private final SessionEntityRepository sessionRepository;

}
