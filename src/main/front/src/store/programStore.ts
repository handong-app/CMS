import { create } from "zustand";
import { ProgramItemProps } from "../types/program.types";

interface ProgramState {
  programs: ProgramItemProps[];
  addProgram: (program: ProgramItemProps) => void;
}

const useProgramStore = create<ProgramState>((set) => ({
  programs: [],
  addProgram: (program) =>
    set((state) => {
      // programId가 이미 존재하면 추가하지 않음
      const exists = state.programs.some(
        (p) => p.programId === program.programId
      );
      if (exists) return state;
      return { programs: [...state.programs, program] };
    }),
}));

export default useProgramStore;
