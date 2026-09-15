package eu.navima.scheduler2_be.service;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.Status;
import eu.navima.scheduler2_be.model.UserDayUpdateRequest;
import eu.navima.scheduler2_be.repository.RoomRepository;

@SpringBootTest
public class RoomServiceTest {
    private final String username = "testuser";

    @Autowired
    private RoomService roomService;
    @Autowired 
    private RoomRepository roomRepository;

    @Test
    public void testUpdateRoomUserData() {
        // given
        roomRepository.deleteAll();
        var room = roomRepository.save(new RoomData());

        // when
        var req1 = new UserDayUpdateRequest();
        req1.setDate("2024-06-01");
        req1.setStatus(Status.yes);
        req1.setNote("note");
        roomService.updateRoomUserData(room.getId(), username, List.of(req1));

        var req2 = new UserDayUpdateRequest();
        req2.setDate("2024-06-01");
        req2.setStatus(Status.no);
        req2.setNote("note");
        roomService.updateRoomUserData(room.getId(), username, List.of(req2));

        // then
    }
}
