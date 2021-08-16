import User from "../models/User";
import { Register, Status } from "../types/user";

class MainRepository {
  public static async findUserByEmail(email: string) {
    return User.findOne({ email });
  }

  public static async findUserById(id: string) {
    return User.findById(id).select("-password");
  }

  public static async changeUserStatusById(id: string, status: Status) {
    const user = await User.findById(id).select("-password");
    if (user) {
      user.status = status;
      user.save();
      return user;
    } else {
      throw new Error("");
    }
  }

  public static async createNewUser(user: Register) {
    const newUser = await new User({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      agreeOnTerms: user.agreeOnTerms,
      password: user.password,
      email: user.email,
    });

    await newUser.save();
    return {
      _id: newUser._id,
      firstName: newUser.firstName,
      middleName: newUser.middleName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    };
  }
}

export default MainRepository;
