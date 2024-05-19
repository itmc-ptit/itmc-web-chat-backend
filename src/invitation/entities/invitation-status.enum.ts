export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export function toInvitationStatus(status: string): InvitationStatus {
  return InvitationStatus[status as keyof typeof InvitationStatus];
}
