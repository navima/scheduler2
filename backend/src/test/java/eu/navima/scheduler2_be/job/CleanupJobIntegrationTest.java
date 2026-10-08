package eu.navima.scheduler2_be.job;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import eu.navima.scheduler2_be.model.UserDay;
import eu.navima.scheduler2_be.repository.UserDayRepository;

@SpringBootTest
class CleanupJobIntegrationTest {

    @Autowired
    private CleanupJob cleanupJob;

    @Autowired
    private UserDayRepository userDayRepository;

    @BeforeEach
    void clearUserDays() {
        userDayRepository.deleteAll();
    }

    @Test
    void cleanupDeletesOnlyEntriesOlderThanTenDays() {
        // Given
        LocalDate cutoffDate = LocalDate.now().minusDays(10);
        UserDay oldEntry = userDay(cutoffDate.minusDays(1));
        UserDay cutoffEntry = userDay(cutoffDate);
        UserDay recentEntry = userDay(cutoffDate.plusDays(1));
        userDayRepository.saveAll(List.of(oldEntry, cutoffEntry, recentEntry));

        // When
        cleanupJob.cleanup();

        // Then
        List<UserDay> remainingEntries = userDayRepository.findAll();
        assertEquals(2, remainingEntries.size());
        assertFalse(remainingEntries.contains(oldEntry));
        assertTrue(remainingEntries.contains(cutoffEntry));
        assertTrue(remainingEntries.contains(recentEntry));
    }

    private UserDay userDay(LocalDate date) {
        UserDay userDay = new UserDay();
        userDay.setDate(date.toString());
        return userDay;
    }
}