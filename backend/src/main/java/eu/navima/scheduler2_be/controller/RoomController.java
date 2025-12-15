package eu.navima.scheduler2_be.controller;

import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.Status;
import eu.navima.scheduler2_be.model.UserDay;
import eu.navima.scheduler2_be.repository.RoomRepository;
import eu.navima.scheduler2_be.repository.UserDayRepository;
import eu.navima.scheduler2_be.service.RoomService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("room")
@RequiredArgsConstructor
public class RoomController {

	private final RoomRepository roomRepository;
	private final RoomService roomService;

	@GetMapping("/{roomId}")
	private Optional<RoomData> getRoomData(@PathVariable UUID roomId) {
		return roomRepository.findById(roomId);
	}

	@PostMapping
	private UUID makeRoom() {
		return roomRepository.saveAndFlush(new RoomData()).getId();
	}


	@PutMapping("/{roomId}/user/{username}")
	private void updateRoomUserData(@PathVariable UUID roomId, @PathVariable String username, @RequestBody List<UserDay> data) {
		roomService.updateRoomUserData(roomId, username, data);
	}
}
