import { useParams } from "react-router";
import { useFetchBe } from "../../tools/api";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import Section from "../../components/coursePage/Section";
import SectionCourses from "../../components/coursePage/SectionCourses";

function AdminCourseDetailPage() {
  const { club: clubId, courseSlug } = useParams<{
    club: string;
    courseSlug: string;
  }>();

  const fetchBe = useFetchBe();

  const { data: courseData, isLoading: clubCourseLoading } = useQuery({
    queryKey: ["clubCourses", clubId, courseSlug],
    queryFn: () => fetchBe(`/v1/clubs/${clubId}/courses/${courseSlug}`),
  });

  if (clubCourseLoading) return <div>Loading...</div>;
  return (
    <div>
      <div>
        <h1>AdminCourseDetailPage</h1>
        <p>Club ID: {clubId}</p>
        <p>Course Slug: {courseSlug}</p>
      </div>
      <div>
        <Box ml={2}>
          <Box>
            {(courseData?.sections ?? []).map((section: any) => (
              <Box key={section.id} mt={1}>
                <Section text={section.title} />
                {section.nodeGroups.map((group: any) => (
                  <Box mt={1.6} key={group.id}>
                    <SectionCourses
                      title={group.title}
                      description={section.description}
                      nodes={
                        Array.isArray(group.nodes)
                          ? group.nodes.map((node: any) => {
                              let title = "";
                              switch (node.type) {
                                case "VIDEO":
                                case "IMAGE":
                                case "FILE":
                                case "TEXT":
                                  title = node.data?.title ?? "";
                                  break;
                                case "QUIZ":
                                  title = node.data?.question ?? "";
                                  break;
                                default:
                                  title = "";
                              }
                              return {
                                id: node.id,
                                type:
                                  node.type === "FILE"
                                    ? "doc"
                                    : (node.type.toLowerCase() as
                                        | "video"
                                        | "image"
                                        | "quiz"
                                        | "doc"
                                        | "file"
                                        | "text"),
                                title,
                              };
                            })
                          : []
                      }
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default AdminCourseDetailPage;
