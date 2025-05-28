package com.handongapp.cms.mapper;

import com.handongapp.cms.dto.v1.UserDto;

import java.util.List;

public interface TbUserMapper {
    List<UserDto.LastProgramResDto> findLastNodeGroupByCourseForUser(String userId);
}
