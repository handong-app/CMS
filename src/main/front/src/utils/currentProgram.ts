// today 날짜를 기준으로 현재 진행중인 프로그램만 반환
// programs: Program[]
// 반환: Program[]
export function currentProgram(programs: any[]): any[] {
  const now = new Date();
  return programs.filter((program) => {
    const start = new Date(program.startDate);
    const end = new Date(program.endDate);
    return start <= now && now <= end;
  });
}
