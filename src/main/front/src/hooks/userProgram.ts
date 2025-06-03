import { useEffect } from "react";
import useProgramStore from "../store/programStore";
import { useFetchBe } from "../tools/api";

const useUserProgram = (club?: string) => {
  const { programs, addProgram } = useProgramStore();
  const fetchBe = useFetchBe();

  const fetchAllPrograms = async () => {
    try {
      const response = await fetchBe("/v1/user/programs");
      if (!response.ok) {
        console.error("Failed to fetch programs:", response.statusText);
        return;
      }
      const data = await response.json();
      data.forEach((program: any) => addProgram(program));
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    if (programs.length === 0) {
      fetchAllPrograms();
    }
  }, [programs]);

  return {
    programs: club ? programs.filter((p) => p.clubSlug === club) : programs,
    fetchAllPrograms,
  };
};

export default useUserProgram;
