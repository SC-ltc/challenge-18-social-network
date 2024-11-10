const { User, Thought } = require("../models");

module.exports = {
    // Get all users
    async getAllUsers(req, res) {
      try {
        const users = await User.find();
  
        res.json(users);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get a single user by ID and populated thought and friend data
    async getSingleUser(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID' })
        }
  
        res.json(user);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Create a new user
    async createUser(req, res) {
      try {
        const newUser = await User.create(req.body);
        res.json(newUser);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Udate a user by its ID
    async updateUser(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!user) {
            res.status(404).json({ message: 'No user found with that ID' });
          }
    
          res.json(user);
        } catch (err) {
          res.status(500).json(err);
        }
      },

    // Remove a user by its ID
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID' });
        }
  
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'Deleted the user and their thoughts' });

      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // Add a new friend to a user's friend list
    async addFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        );
  
        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found with that ID' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Remove a friend from a user's friend list
    async removeFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: { friendId: req.params.friendId } } },
          { runValidators: true, new: true }
        );
  
        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found with that ID' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

}