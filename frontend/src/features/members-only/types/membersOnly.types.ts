export type MembersOnly = {
  _id: string;
  name: string;
  duration: number;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type MembersOnlyResult = {
  membersOnly: MembersOnly[];
  total: number;
};
