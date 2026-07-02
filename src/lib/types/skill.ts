// Mirrors: dto/request/SkillRequest.java, dto/response/SkillResponse.java,
// dto/response/SkillMatchResponse.java

export const PROFICIENCY_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const;
export type Proficiency = (typeof PROFICIENCY_LEVELS)[number];

export interface SkillRequest {
  skillName: string;
  proficiency?: Proficiency;
}

// As of the SkillController fix, this is the DTO shape — never the raw
// UserSkill entity (which risked a circular-reference 500, see prior review).
export interface SkillResponse {
  id: number;
  skillName: string;
  proficiency: Proficiency | null;
}

export interface SkillMatchResponse {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}
