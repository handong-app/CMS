import TopCourseBanner from "../components/coursePage/TopCourseBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import InfoCard from "../components/coursePage/InfoCard";
import CourseProgressList from "../components/coursePage/CourseProgressList";
import { courseDummyData } from "../components/coursePage/CourseDummyData";
import Section from "../components/coursePage/Section";
import SectionCourses from "../components/coursePage/SectionCourses";

function CoursePage() {
  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <TopCourseBanner
        title="시스템 해킹과 보안"
        producer="20학번 이승현"
        courseDiscription="이 강의는 시스템 해킹과 보안에 대한 기초부터 심화까지 다룹니다. 다양한 해킹 기법과 방어 전략을 배우며, 실제 사례를 통해 실력을 향상시킬 수 있습니다."
        image="https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_1280.jpg"
        onContinue={() => alert("Continue to last lesson!")}
      />

      <Box display="flex" mt={2}>
        <CourseProgressList
          courseTitle={courseDummyData.courseTitle}
          sections={courseDummyData.sections}
          width={260}
        />

        <Box width="100%">
          <Box display="flex" justifyContent="space-between" ml={2}>
            <InfoCard
              title="학습 현황"
              content={
                <>
                  <Typography variant="body2">
                    지금까지 학습한 내용과 진도율을 확인하세요.
                  </Typography>
                </>
              }
              width={340}
              height={200}
            />

            <InfoCard
              title="최신 반응"
              content={
                <>
                  <Typography variant="body2">
                    이 강의를 들은다른 수강생들의 반응
                  </Typography>
                </>
              }
              width={400}
              height={200}
            />
          </Box>

          <Box ml={2}>
            <Box>
              {courseDummyData.sections.map((section) => (
                <Box key={section.id} mt={1}>
                  <Section text={section.title} />
                  {section.nodeGroups.map((group) => (
                    <Box mt={1.6} key={group.id}>
                      <SectionCourses
                        title={group.title}
                        description={group.description}
                        nodes={group.nodes}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CoursePage;
