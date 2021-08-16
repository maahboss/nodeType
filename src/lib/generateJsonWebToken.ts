import jsonwebtoken from "jsonwebtoken";

const generateJsonWebToken = (payload: string, expiresIn: string = "15d") => {
  return new Promise((resolve, reject) => {
    return jsonwebtoken.sign(
      { payload },
      process.env.TOKEN_SECRET as string,
      { expiresIn },
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
};
export default generateJsonWebToken;
