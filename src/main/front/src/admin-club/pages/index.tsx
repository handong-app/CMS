import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";
import CommentIcon from "@mui/icons-material/Comment";
import AdminTestPage from "./AdminTestPage";
import AdminClubSettingPage from "./AdminClubSettingPage";
import AdminClubMemberPage from "./AdminClubMemberPage";
import AdminClubMemberListPage from "./AdminClubMemberListPage";
import AdminCoursePage from "./AdminCoursePage";
import AdminProgramListPage from "./AdminProgramListPage";
import AdminProgramPage from "./AdminProgramPage";
import AdminCommentListPage from "./AdminCommentListPage";

export const CLUB_ADMINMENU = [
  {
    title: "동아리 설정",
    icon: <GroupIcon />,
    id: "setting",
    comp: AdminClubSettingPage,
  },
  {
    title: "회원 관리",
    icon: <PeopleIcon />,
    id: "member",
    children: [
      {
        index: true,
        element: <AdminClubMemberListPage />,
      },
      {
        path: ":memberId",
        element: <AdminClubMemberPage />,
      },
    ],
  },
  {
    title: "코스 관리",
    icon: <MenuBookIcon />,
    id: "course",
    children: [
      {
        index: true,
        element: <AdminCoursePage />,
      },
      {
        path: "get/:courseId",
        element: <div>코스 상세 정보</div>,
      },
    ],
  },
  {
    title: "프로그램 관리",
    icon: <EventIcon />,
    id: "program",
    children: [
      {
        index: true,
        element: <AdminProgramListPage />,
      },
      {
        path: "edit/:programSlug",
        element: <AdminProgramPage />,
      },
      {
        path: "add",
        element: <AdminProgramPage />,
      },
    ],
  },
  {
    title: "댓글 관리",
    icon: <CommentIcon />,
    id: "comment",
    comp: AdminCommentListPage,
  },
];
