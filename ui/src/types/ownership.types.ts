export type SetlistOwnership = {
  id: string;
  name: string;
  createdAt: string;
};

export type GroupOwnership = {
  id: string;
  name: string;
  createdAt: string;
};

export type Ownership = {
  userId: string;
  fullName: string;
  email: string;
  groupIds: GroupOwnership[];
  setlistIds: SetlistOwnership[];
  isDeleted: boolean;
};
