export type SetlistOwnership = {
  id: string;
  name: string;
  createdAt: string;
};

export type GroupOwnership = {
  id: string;
  name: string;
  createdAt: string;
  setlists: SetlistOwnership[];
};

export type Ownership = {
  userId: string;
  groupIds: GroupOwnership[];
  setlists: SetlistOwnership[];
  isDeleted: boolean;
};
