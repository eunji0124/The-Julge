export type ApplicationStatus =
  | 'none'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'canceled';

export interface ApplicationState {
  status: ApplicationStatus;
  applicationId: string | null;
}
