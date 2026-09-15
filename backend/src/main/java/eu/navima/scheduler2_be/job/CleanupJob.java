package eu.navima.scheduler2_be.job;

import java.time.temporal.ChronoUnit;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import eu.navima.scheduler2_be.repository.UserDayRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupJob {
    
    private final UserDayRepository userDayRepository;

    @PostConstruct
    public void init() {
        cleanup();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanup() {
        var deletedCount = userDayRepository.deleteAllByDateBefore(java.time.LocalDate.now().minus(10, ChronoUnit.DAYS).toString());
        log.info("CleanupJob: Deleted {} old UserDay entries.", deletedCount);
    }
}
