package app.handong.cms.mapper;

import app.handong.cms.dto.v1.UserDto;

import java.util.List;

public interface UserMapper {
    List<UserDto.LastProgramResDto> findLastNodeGroupByCourseForUser(String userId);
}
