import jwt, { Secret, GetPublicKeyOrSecret } from 'jsonwebtoken';

const verifyToken = (token: string) => {
  if (token == null || token === '') return null;
  return jwt.verify(token, process.env.JWT_KEY as Secret | GetPublicKeyOrSecret);
};

export default verifyToken;
