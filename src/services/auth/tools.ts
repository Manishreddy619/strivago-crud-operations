import jwt from "jsonwebtoken";
const generateJwt = (payload) =>
  new Promise((resove, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resove(token);
      }
    )
  );
interface token {
  name: string;
}
export const verifyJWT = (token: any) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedToken) => {
      if (err) rej(err);
      else res(decodedToken);
    })
  );
export const JWTAuthenticate = async (user) => {
  // given the user the function gives us back the access token
  const accessToken = await generateJwt({ _id: user._id });
  console.log(accessToken);
  return accessToken;
};
