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
  accessType: string;
  groupIds: GroupOwnership[];
  setlistIds: SetlistOwnership[];
  isDeleted: boolean;
};
