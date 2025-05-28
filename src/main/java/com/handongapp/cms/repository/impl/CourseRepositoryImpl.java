package com.handongapp.cms.repository.impl;

import com.handongapp.cms.domain.*;
import com.handongapp.cms.dto.v1.ClubDto;
import com.handongapp.cms.repository.CourseRepositoryCustom;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.util.List;

public class CourseRepositoryImpl implements CourseRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public CourseRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    // clubName으로 tb_club 찾고,
    // club.id로 tb_program의 club_id로 연결하고,
    // programId로 tb_program에서 정보 가져오고,
    // programId로 tb_course랑 연결해서 picture_url 받아오기

    @Override
    public List<ClubDto.ClubCourseListResDto> findCoursesByClubIdAndProgramId(String clubName, String programId) {
        QTbClub club = QTbClub.tbClub;
        QTbProgram program = QTbProgram.tbProgram;
        QTbUser user = QTbUser.tbUser;
        QTbCourse course = QTbCourse.tbCourse;
        QTbProgramCourse programCourse = QTbProgramCourse.tbProgramCourse;

        return queryFactory
                .select(Projections.constructor(
                        ClubDto.ClubCourseListResDto.class,
                        course.title.as("courseTitle"),
                        user.name.as("programCreator"),
                        course.description.as("courseDescription"),
                        course.pictureUrl.as("coursePictureUrl")
                ))
                .from(club)
                .join(program).on(program.clubId.eq(club.id))
                .join(programCourse).on(programCourse.programId.eq(program.id))
                .join(course).on(course.id.eq(programCourse.courseId))
                .join(user).on(user.id.eq(program.userId))
                .where(
                        program.id.eq(programId)
                )
                .fetch();
    }
}