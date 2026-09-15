package eu.navima.scheduler2_be.controller;

import eu.navima.scheduler2_be.model.CreateRoomRequest;
import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.UserDay;
import eu.navima.scheduler2_be.repository.RoomRepository;
import eu.navima.scheduler2_be.service.RoomService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class RoomController {

	private final RoomRepository roomRepository;
	private final RoomService roomService;

	@GetMapping("/{roomId}")
	private RoomData getRoomData(@PathVariable UUID roomId) {
		return roomRepository.findById(roomId).orElseThrow();
	}

	@PostMapping
	private RoomData makeRoom(@RequestBody CreateRoomRequest createRoomDTO) {
		var room = new RoomData();
		room.setName(createRoomDTO.getName());
		return roomRepository.saveAndFlush(room);
	}


	@PutMapping("/{roomId}/user/{username}")
	private void updateRoomUserData(@PathVariable UUID roomId, @PathVariable String username, @RequestBody List<UserDay> data) {
		roomService.updateRoomUserData(roomId, username, data);
	}
}
