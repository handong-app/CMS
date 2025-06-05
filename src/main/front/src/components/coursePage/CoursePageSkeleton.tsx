import { Box, Skeleton } from "@mui/material";

export default function CoursePageSkeleton() {
  return (
    <Box maxWidth={980} margin="auto" mb={10}>
      {/* 상단 배너 스켈레톤 */}
      <Box
        height={300}
        width="100%"
        position="relative"
        sx={{ background: "rgba(255,255,255,0.05)" }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
        />
        <Box position="absolute" bottom={100} left={40} width="50%">
          <Skeleton
            variant="text"
            width="20%"
            height={40}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={60}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={30}
            sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.08)" }}
          />
        </Box>
      </Box>

      <Box display="flex" mt={2}>
        {/* 왼쪽 진도 리스트 스켈레톤 */}
        <Box
          width={260}
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            borderRadius: 2,
            p: 2,
          }}
        >
          {/* 코스 제목 */}
          <Skeleton
            variant="text"
            height={32}
            width="70%"
            sx={{
              mb: 2,
              bgcolor: "rgba(255,255,255,0.08)",
              borderRadius: 1,
            }}
          />

          {/* 섹션들 */}
          {[1, 2, 3].map((sectionIndex) => (
            <Box key={sectionIndex} sx={{ mb: 2 }}>
              {/* 섹션 제목 */}
              <Skeleton
                variant="text"
                height={24}
                width="90%"
                sx={{
                  mb: 1,
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderRadius: 1,
                }}
              />

              {/* 노드 그룹들 */}
              {[1, 2, 3].map((nodeIndex) => (
                <Box
                  key={nodeIndex}
                  display="flex"
                  alignItems="center"
                  sx={{
                    pl: 1,
                    mb: 1,
                  }}
                >
                  {/* 상태 아이콘 */}
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{
                      mr: 1,
                      bgcolor: "rgba(255,255,255,0.08)",
                    }}
                  />
                  {/* 노드 그룹 제목 */}
                  <Skeleton
                    variant="text"
                    height={20}
                    width="85%"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.08)",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box width="100%" pl={2}>
          {/* 상단 카드 스켈레톤 */}
          <Box display="flex" justifyContent="space-between">
            <Box
              width={270}
              height={200}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Skeleton
                variant="text"
                width="50%"
                height={30}
                sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.08)" }}
              />
              <Box display="flex" mt={3} gap={2}>
                <Skeleton
                  variant="circular"
                  width={80}
                  height={80}
                  sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                />
                <Box flex={1}>
                  <Skeleton
                    variant="rectangular"
                    height={30}
                    sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={30}
                    sx={{
                      mt: 1,
                      bgcolor: "rgba(255,255,255,0.08)",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box
              width={470}
              height={200}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Skeleton
                  variant="text"
                  width={100}
                  sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                />
              </Box>
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                  />
                  <Skeleton
                    variant="text"
                    width="20%"
                    sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* 섹션 리스트 스켈레톤 */}
          <Box mt={3}>
            {[1, 2, 3].map((i) => (
              <Box key={i} mt={3}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    width: "100%",
                    background: "rgba(250, 250, 250, 0.14)",
                    borderRadius: 2,
                    mt: 1,
                    px: 1.5,
                    py: 0.5,
                    minHeight: 48,
                    boxSizing: "border-box",
                  }}
                >
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={26}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.08)",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Box mt={2}>
                  {[1, 2].map((j) => (
                    <Box
                      key={j}
                      mt={2}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={25}
                        sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                      />
                      <Box display="flex" gap={2} mt={2}>
                        {[1, 2, 3].map((k) => (
                          <Skeleton
                            key={k}
                            variant="rectangular"
                            width={100}
                            height={60}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.08)",
                              borderRadius: 1,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
