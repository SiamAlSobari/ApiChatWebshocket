import { db } from "../../common/utils/db";

export class UserRepository {
  public async getUserByUserName(userName: string) {
    return db.user.findUnique({
      where: {
        user_name: userName,
      },
    });
  }

  public async createUser(userName: string, hashPassword: string) {
    return db.user.create({
      data: {
        user_name: userName,
        hash_password: hashPassword,
      },
    });
  }
}
