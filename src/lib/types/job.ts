// Mirrors: dto/request/ScrapeRequest.java, dto/response/JobResponse.java

export interface ScrapeRequest {
  url: string;
}

export interface JobResponse {
  id: number;
  title: string; // scraper falls back to "Unknown Title" on failed selector match — handle in UI
  company: string; // same — "Unknown Company" fallback
  location: string; // frequently empty string, not null
  salaryMin: number | null;
  salaryMax: number | null;
  requiredSkills: string; // comma-separated string, NOT an array — split client-side
  url: string;
}
