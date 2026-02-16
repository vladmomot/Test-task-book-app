import type { SetOptional } from 'type-fest';
import type { LiteralUnion } from 'type-fest';

export type UserName = LiteralUnion<'karolinka' | 'vladik', string>;

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type EditableUser = SetOptional<User, 'phone'>;
