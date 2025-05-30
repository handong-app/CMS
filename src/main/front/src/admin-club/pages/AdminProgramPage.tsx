import { useParams } from "react-router";
import AdminProgramEdit from "../components/AdminProgramEdit";
import { ClubMember } from "../components/AdminClubMemberTable";

// 더미 전체 코스 목록
const allCourses = [
  "리눅스 해킹 입문",
  "시스템 해킹",
  "네트워크 보안",
  "React 마스터",
  "Node.js 실전",
  "UI/UX 디자인",
];

// 더미 회원 데이터 (프로그램별 수강 회원)
const dummyMembers: Record<string, ClubMember[]> = {
  camp2025: [
    {
      userId: "u123456",
      name: "홍길동",
      studentId: "20231234",
      email: "hong@handong.edu",
      phone: "010-1234-5678",
      profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      userId: "u234567",
      name: "김영희",
      studentId: "20231235",
      email: "kim@handong.edu",
      phone: "010-2345-6789",
      profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ],
  webboot: [
    {
      userId: "u345678",
      name: "이철수",
      studentId: "20231236",
      email: "lee@handong.edu",
      phone: "010-3456-7890",
      profileImageUrl: "https://randomuser.me/api/portraits/men/65.jpg",
    },
  ],
};

// 더미 프로그램 데이터 (실제 환경에서는 API 등으로 불러와야 함)
const dummyPrograms = [
  {
    id: "camp2025",
    name: "2025 해킹캠프",
    description: "시스템 해킹과 보안, 실습 중심의 해킹 캠프 프로그램입니다.",
    courses: ["리눅스 해킹 입문", "시스템 해킹", "네트워크 보안"],
    enrolledMembers: dummyMembers.camp2025,
  },
  {
    id: "webboot",
    name: "웹 개발 부트캠프",
    description: "프론트엔드와 백엔드, 실전 웹 개발을 배우는 부트캠프.",
    courses: ["React 마스터", "Node.js 실전", "UI/UX 디자인"],
    enrolledMembers: dummyMembers.webboot,
  },
];

function AdminProgramPage() {
  const { programId } = useParams<{ programId?: string }>();

  // 수정 모드: programId가 있으면 해당 데이터, 없으면 추가 모드
  const program = programId
    ? dummyPrograms.find((p) => p.id === programId)
    : undefined;

  return (
    <AdminProgramEdit
      allCourses={allCourses}
      initialName={program?.name}
      initialDescription={program?.description}
      initialCourses={program?.courses}
      enrolledMembers={program?.enrolledMembers}
      onSave={(data) => {
        if (programId) {
          alert("수정 완료: " + JSON.stringify(data));
        } else {
          alert("생성 완료: " + JSON.stringify(data));
        }
      }}
    />
  );
}

export default AdminProgramPage;
