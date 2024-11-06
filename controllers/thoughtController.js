const { User, Thought } = require("../models");

module.exports = {
    // Get all thoughts
    async getAllThoughts(req, res) {
      try {
        const thoughts = await Thought.find();
  
        res.json(thoughts);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get a single thought by ID
    async getSingleThought(req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID' })
        }
  
        res.json(thought);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Create a new thought
    async createThought(req, res) {
      try {
        const newThought = await Thought.create(req.body);
        await User.findByIdAndUpdate(
          req.body.userId,
          {$push: {thoughts: newThought._id}},
          {new: true}
        );
        res.json(newThought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Udate a thought by its ID
    async updateThought(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!thought) {
            res.status(404).json({ message: 'No thought found with that ID' });
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },

    // Remove a thought by its ID
    async deleteThought(req, res) {
      try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }
        res.json({message: 'Thought has been deleted'});

      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    async addReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res
            .status(404)
            .json({ message: 'No thought found with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    async removeReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res
            .status(404)
            .json({ message: 'No thought found with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

}