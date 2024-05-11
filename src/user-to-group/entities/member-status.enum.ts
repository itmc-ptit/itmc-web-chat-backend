export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export function toMemberStatus(status: string): MemberStatus {
  return MemberStatus[status as keyof typeof MemberStatus];
}
