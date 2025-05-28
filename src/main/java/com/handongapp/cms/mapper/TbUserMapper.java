package com.handongapp.cms.mapper;

import com.handongapp.cms.dto.TbUserDto;

import java.util.List;

public interface TbUserMapper {
    List<TbUserDto.LastProgramResDto> findLastNodeGroupByCourseForUser(String userId);
}
