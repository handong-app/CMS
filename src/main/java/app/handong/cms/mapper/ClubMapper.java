package app.handong.cms.mapper;

import org.apache.ibatis.annotations.Param;

public interface ClubMapper {
    String getCoursesByClubSlugAsJson(@Param("clubSlug") String clubSlug);
}
