import { UseFormGetValues, UseFormRegister } from 'react-hook-form';

export enum UserAccessType {
  ADMIN = 'admin',
  USER = 'user',
}
export type User = {
  fullName: string;
  email: string;
  accessType?: UserAccessType;
  id: string;
  isDeleted: boolean;
  emailStatus: string;
  countryOfOrigin: string;
  address: string;
  birthday: string;
  campus: string;
  lifestage: string;
  lifeGroup: string;
  isMember: boolean;
  isBaptised: boolean;
  ministryTeam: string;
  phoneNumber: number;
  hasFilledProfileForm: boolean;
};

export type UserEditorProps = {
  onSubmit: (e: User) => void;
  register: UseFormRegister<User>;
  getFormValues: UseFormGetValues<User>;
  onClickEdit: () => void;
  onClickChange: () => void;
  user?: User;
  _doc?: User;
  token?: string;
};

export type otherProfileProps = Omit<UserEditorProps, 'onClickEdit' | 'onClickChange'> & {
  open: boolean;
  handleClose: () => void;
};
