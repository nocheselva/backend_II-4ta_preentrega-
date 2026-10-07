export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['currentUser'];
  }
  return token;
};