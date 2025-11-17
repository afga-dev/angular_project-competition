export interface Competition {
    competitionId: number,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
    status: string
}
export interface CompetitionCreate {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}
export interface CompetitionResponse {
  message: string;
}
