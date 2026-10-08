package eu.navima.scheduler2_be.job;

import java.time.temporal.ChronoUnit;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import eu.navima.scheduler2_be.repository.UserDayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupJob {
    
    private final UserDayRepository userDayRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        cleanup();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanup() {
        var deletedCount = userDayRepository.deleteAllByDateBefore(java.time.LocalDate.now().minus(10, ChronoUnit.DAYS).toString());
        log.info("CleanupJob: Deleted {} old UserDay entries.", deletedCount);
    }
}
