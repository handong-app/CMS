import { useParams } from "react-router";
import AdminProgramEdit from "../components/AdminProgramEdit";

// 더미 전체 코스 목록
const allCourses = [
  "리눅스 해킹 입문",
  "시스템 해킹",
  "네트워크 보안",
  "React 마스터",
  "Node.js 실전",
  "UI/UX 디자인",
];

// 더미 프로그램 데이터 (실제 환경에서는 API 등으로 불러와야 함)
const dummyPrograms = [
  {
    id: "camp2025",
    name: "2025 해킹캠프",
    description: "시스템 해킹과 보안, 실습 중심의 해킹 캠프 프로그램입니다.",
    courses: ["리눅스 해킹 입문", "시스템 해킹", "네트워크 보안"],
  },
  {
    id: "webboot",
    name: "웹 개발 부트캠프",
    description: "프론트엔드와 백엔드, 실전 웹 개발을 배우는 부트캠프.",
    courses: ["React 마스터", "Node.js 실전", "UI/UX 디자인"],
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
