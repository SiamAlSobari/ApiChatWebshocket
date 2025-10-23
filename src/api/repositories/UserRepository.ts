import { db } from "../../common/utils/db";

/**
 * Class untuk repository user
 */
export class UserRepository {

  /**
   * Fungsi untuk mendapatkan user
   * 
   * @param userName - parameter userName yang dikirm
   * @returns {Promise<User | null>} - return user berupa object
   */
  public async getUserByUserName(userName: string) {
    return db.user.findUnique({
      where: {
        user_name: userName,
      },
    });
  }

  /**
   * Fungsi untuk membuat user
   * 
   * @param userName - parameter userName yang dikirm
   * @param hashPassword - parameter hashPassword yang dikirm
   * @returns {Promise<User>} - return user berupa object
   */
  public async createUser(userName: string, hashPassword: string) {
    return db.user.create({
      data: {
        user_name: userName,
        hash_password: hashPassword,
      },
    });
  }
}
