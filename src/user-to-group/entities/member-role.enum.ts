export enum MemberRole {
  Host = 'host',
  Member = 'member',
}

export function toMemberRole(role: string): MemberRole {
  return MemberRole[role as keyof typeof MemberRole];
}
