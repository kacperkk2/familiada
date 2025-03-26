package com.kk.familiada.game;

import com.kk.familiada.session.MockSessionDataService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MockGameDataService {

    private final GameEntityRepository gameRepository;
    private final MockSessionDataService mockSessionDataService;

    @PostConstruct
    public void init() {
        PhraseEntity phrase1 = PhraseEntity.builder()
                .answer("lama")
                .points(20)
                .build();
        PhraseEntity phrase2 = PhraseEntity.builder()
                .answer("stado")
                .points(10)
                .build();
        RoundEntity round1 = RoundEntity.builder()
                .roundOrder(1)
                .question("wiecej niz jedno zwierze to?")
                .phrases(List.of(phrase1, phrase2))
                .build();
        GameEntity game = GameEntity.builder()
                .name("gra1")
                .rounds(List.of(round1))
                .build();

        gameRepository.save(game);

        mockSessionDataService.init(game.getUuid());
    }
}
