package app.handong.cms.controller.v1;

import app.handong.cms.dto.v1.ClubDto;
import app.handong.cms.service.ClubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.Collections;
import java.util.List; // Added
import java.util.Map;


@RestController
@RequestMapping("api/v1/clubs")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }


    @PostMapping
    public ResponseEntity<ClubDto.ClubProfileResDto> createClub(@RequestBody ClubDto.ClubProfileReqDto clubProfileReqDto) {
        ClubDto.ClubProfileResDto createdClub = clubService.createClub(clubProfileReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClub);
    }

    @GetMapping("/{clubSlug}")
    public ResponseEntity<ClubDto.ClubProfileResDto> getClubProfile(@PathVariable String clubSlug) {
        ClubDto.ClubProfileResDto clubProfile = clubService.getClubProfile(clubSlug);
        return ResponseEntity.ok().body(clubProfile);
    }

    @PatchMapping("/{clubSlug}")
    public ResponseEntity<Map<String, String>> updateClubProfile(@PathVariable String clubSlug, @RequestBody ClubDto.ClubProfileReqDto clubProfileReqDto) {
        clubService.updateClubProfile(clubSlug, clubProfileReqDto);
        return ResponseEntity.ok().body(Collections.singletonMap("message", "클럽 '" + clubSlug + "'이(가) 성공적으로 수정되었습니다."));
    }

    @DeleteMapping("/{clubSlug}")
    public ResponseEntity<Map<String, String>> deleteClub(@PathVariable String clubSlug) {
        clubService.deleteClub(clubSlug);
        return ResponseEntity.ok().body(Collections.singletonMap("message", "클럽 '" + clubSlug + "'이(가) 성공적으로 삭제되었습니다."));
    }

    @GetMapping
    public ResponseEntity<List<ClubDto.ClubListInfoResponseDto>> getAllClubs(Authentication authentication) {
        // 'authentication' will be null if the user is not authenticated and the endpoint is permitAll
        List<ClubDto.ClubListInfoResponseDto> clubs = clubService.getAllClubs(authentication);
        return ResponseEntity.ok(clubs);
    }

    @PostMapping("/{clubSlug}/join")
    @Operation(summary = "동아리 가입", description = "인증된 사용자가 특정 동아리에 가입하고 기수를 등록합니다.")
    public ResponseEntity<Map<String, String>> joinClub(
            @Parameter(description = "가입할 동아리의 slug") @PathVariable String clubSlug,
            @RequestBody @Valid ClubDto.ClubJoinRequestDto joinRequestDto,
            Authentication authentication) {
        clubService.joinClub(clubSlug, joinRequestDto, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", "동아리 '" + clubSlug + "'에 성공적으로 가입되었습니다."));
    }
}
