import { fields, userName } from './constants';

export const getFields = (isLogin: boolean) =>
	isLogin ? fields : [userName, ...fields];
