import { useParams } from "react-router";
import AdminProgramEdit from "../components/AdminProgramEdit";
import { useQuery } from "@tanstack/react-query";
import { useFetchBe } from "../../tools/api";

function AdminProgramPage() {
  const { club, programSlug } = useParams<{
    club?: string;
    programSlug?: string;
  }>();
  const fetchBe = useFetchBe();

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
  return (
    <AdminProgramEdit
      allCourses={[]}
      initialName={programs?.name}
      initialDescription={programs?.description}
      initialCourses={programs?.courses}
      enrolledMembers={members?.participants?.map((m: any) => ({
        userId: m.userId,
        name: m.participantName,
        studentId: "", // studentId 정보가 없으므로 빈 문자열로 설정
        email: m.participantEmail,
        phone: "", // phone 정보가 없으므로 빈 문자열로 설정
        profileImageUrl: m.participantPictureUrl,
      }))}
      onSave={(data) => {
        if (programSlug) {
          alert("수정 완료: " + JSON.stringify(data));
        } else {
          alert("생성 완료: " + JSON.stringify(data));
        }
      }}
    />
  );
}

export default AdminProgramPage;
