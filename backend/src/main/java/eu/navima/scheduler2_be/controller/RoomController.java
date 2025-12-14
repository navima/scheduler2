package eu.navima.scheduler2_be.controller;

import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.UserData;
import eu.navima.scheduler2_be.model.UserDayModificationRequest;
import eu.navima.scheduler2_be.repository.RoomRepository;
import eu.navima.scheduler2_be.repository.UserDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("room")
@RequiredArgsConstructor
public class RoomController {

	private final RoomRepository roomRepository;
	private final UserDayRepository userDayRepository;

	@GetMapping("/{roomId}")
	private Optional<RoomData> getRoomData(@PathVariable UUID roomId) {
		return roomRepository.findById(roomId);
	}

	@PostMapping
	private UUID makeRoom() {
		return roomRepository.saveAndFlush(new RoomData()).getId();
	}

}
