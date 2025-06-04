import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Paper,
} from "@mui/material";
import { Link } from "react-router";
import { ClubMember } from "../../types/clubmember.types";

export interface AdminClubMemberTableProps {
  members: ClubMember[];
  basePath?: string; // 상세 페이지 링크 prefix (ex: ./ or /club/clubA/admin/member/)
}

const AdminClubMemberTable: React.FC<AdminClubMemberTableProps> = ({
  members,
  basePath = "./",
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ background: "transparent", boxShadow: 0 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>프로필</TableCell>
            <TableCell>이름</TableCell>
            <TableCell>학번</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>전화번호</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.userId}
              hover
              sx={{ cursor: "pointer", textDecoration: "none" }}
              component={Link}
              to={`${basePath}${member.userId}`}
            >
              <TableCell>
                <Avatar src={member.profileImageUrl} alt={member.name} />
              </TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.studentId}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminClubMemberTable;
