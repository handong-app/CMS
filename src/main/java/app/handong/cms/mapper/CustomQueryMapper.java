package app.handong.cms.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CustomQueryMapper {

    String findCourseIdBySlug(@Param("slug") String slug);

    String findCourseIdByName(@Param("name") String name);

    String findUserIdByUsername(@Param("username") String username);

    List<String> findTargetIdsByCourseId(@Param("courseId") String courseId);
    // 이 메소드는 주어진 courseId에 속하는 모든 Section, NodeGroup, Node의 ID를
    // 계층적으로 탐색하여 List<String> 형태로 반환해야 합니다.
    // 댓글의 targetId가 nodeId 또는 nodeGroupId일 수 있으므로, 이들을 모두 포함해야 합니다.
    
    List<String> findTargetIdsByNodeGroupId(@Param("nodeGroupId") String nodeGroupId);
    // 이 메소드는 주어진 nodeGroupId에 속하는 모든 Node의 ID와 nodeGroupId 자체를
    // List<String> 형태로 반환합니다.

}
