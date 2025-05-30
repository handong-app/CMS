import TopCourseBanner from "../components/coursePage/TopCourseBanner";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import InfoCard from "../components/coursePage/InfoCard";
import CourseProgressList from "../components/coursePage/CourseProgressList";
import { courseDummyData } from "../components/coursePage/CourseDummyData";
import Section from "../components/coursePage/Section";
import SectionCourses from "../components/coursePage/SectionCourses";
import CourseProgress from "../components/course/CourseProgress";

function CoursePage() {
  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      <TopCourseBanner
        title={courseDummyData.courseTitle}
        producer={courseDummyData.instructor}
        courseDescription="이 강의는 시스템 해킹과 보안에 대한 기초부터 심화까지 다룹니다. 다양한 해킹 기법과 방어 전략을 배우며, 실제 사례를 통해 실력을 향상시킬 수 있습니다."
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
                    지금까지 학습한 진도율을 확인하세요.
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <Box width={86}>
                      <CourseProgress value={0.5} />
                    </Box>
                    <Box ml={2} bgcolor={"#f0f0f010"} p={1} borderRadius={1}>
                      <Typography variant="body2">진도율</Typography>
                      <Typography variant="body2">3/6</Typography>
                    </Box>
                    <Box ml={1} bgcolor={"#f0f0f010"} p={1} borderRadius={1}>
                      <Typography variant="body2">남은 강의</Typography>
                      <Typography variant="body2">3개</Typography>
                    </Box>
                  </Box>
                </>
              }
              width={270}
              height={200}
            />
            <InfoCard
              title={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <span>최신 반응</span>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#7da0fa",
                      cursor: "pointer",
                      fontWeight: 500,
                      userSelect: "none",
                      ml: 2,
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => alert("댓글 페이지로 이동!")}
                    data-testid="more-comments"
                  >
                    댓글 더보기
                  </Typography>
                </Box>
              }
              content={
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={0.2}
                  sx={{
                    maxHeight: 140,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.08) transparent",
                  }}
                >
                  {courseDummyData.latestComments.map((comment, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        transition: "background 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(255,255,255,0.08)",
                        },
                      }}
                    >
                      <Typography variant="body2">
                        {comment.studentId} {comment.author} {comment.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: "gray",
                          ml: 1,
                          minWidth: 70,
                          textAlign: "right",
                        }}
                      >
                        {comment.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              }
              width={470}
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
