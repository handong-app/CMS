import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ImagePreviewWithDownload from "../../../components/NodeGroupPage/ImagePreviewWithDownload";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import FileUploadBox from "./FileUploadBox";

export interface NodeImageProps {
  node: any;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

const NodeImage: React.FC<NodeImageProps> = ({ node, refetch }) => {
  const [editing, setEditing] = React.useState(false);

  // 파일이 없거나, 수정 버튼을 누르면 업로드 UI 노출
  if (!node?.data?.file?.presignedUrl || editing) {
    return (
      <Box my={2}>
        <FileUploadBox
          node={node}
          onComplete={() => {
            refetch && refetch();
            setEditing(false);
          }}
        />
        {!!node?.data?.file?.presignedUrl && (
          <Button
            sx={{ mt: 2 }}
            size="small"
            variant="outlined"
            onClick={() => setEditing(false)}
          >
            취소
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box my={2}>
      <ImagePreviewWithDownload
        src={node.data.file.presignedUrl}
        filename={node.data?.file?.originalFileName || node.data?.title}
      />
      <Typography mt={1}>{node.data?.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {node.data?.description}
      </Typography>
      <Button
        sx={{ mt: 2 }}
        size="small"
        variant="outlined"
        onClick={() => setEditing(true)}
      >
        이미지 변경
      </Button>
    </Box>
  );
};

export default NodeImage;
