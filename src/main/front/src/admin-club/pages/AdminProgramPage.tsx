import { useNavigate, useParams } from "react-router";
import AdminProgramEdit from "../components/AdminProgramEdit";
import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../tools/api";

function AdminProgramPage() {
  const { club, programSlug } = useParams<{
    club?: string;
    programSlug?: string;
  }>();
  const fetchBe = useFetchBe();
  const navigate = useNavigate();

  // 수정 모드: programSlug가 있으면 해당 데이터, 없으면 추가 모드
  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ["clubPrograms", club, programSlug],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs/${programSlug}`),
    enabled: !!programSlug, // programSlug가 있을 때만 호출
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["programMembers", club, programSlug],
    queryFn: () => fetchBe(`/v1/clubs/${club}/programs/${programSlug}/users`),
    enabled: !!programSlug, // programSlug가 있을 때만 호출
  });

  if (programSlug && (programsLoading || membersLoading))
    return <div>로딩 중...</div>;
  const isCreateMode = !programSlug;

  return (
    <AdminProgramEdit
      allCourses={[]}
      initialName={programs?.name}
      initialDescription={programs?.description}
      initialCourses={programs?.courses}
      enrolledMembers={members?.participants?.map((m: any) => ({
        userId: m.userId,
        name: m.participantName,
        studentId: "",
        email: m.participantEmail,
        phone: "",
        profileImageUrl: m.participantPictureUrl,
      }))}
      initialSlug={programs?.slug}
      initialStartDate={programs?.startDate}
      initialEndDate={programs?.endDate}
      isEditMode={!isCreateMode}
      onSave={async (data) => {
        if (programSlug) {
          alert("수정 완료: " + JSON.stringify(data));
        } else {
          try {
            const output = await fetchBe(`/v1/clubs/${club}/programs`, {
              method: "POST",
              body: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                // 필요시 courses 등 추가
              },
            });
            navigate(`/club/${club}/admin/program/edit/${output.slug}`);
          } catch (e: any) {
            alert("생성 실패: " + (e?.errorMsg || e?.message || e));
          }
        }
      }}
    />
  );
}

export default AdminProgramPage;
