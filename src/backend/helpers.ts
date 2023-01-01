import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';

export const isAuthenticated = async (
  req: NextApiRequest
): Promise<string | null> => {
  const token = await getToken({ req });
  return token ? token.id! : null;
};

export const isEmpty = (s: string) => !s?.length || s?.trim()?.length <= 0;

export const hasKey = <T extends Record<string, any>>(object: T, key: string) =>
  object.hasOwnProperty(key);
