import User from '../daos/mongodb/models/user.model.js';

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async createUser(userData) {
    const user = new User(userData);
    return user.save();
  }
}

export default new UserRepository();
