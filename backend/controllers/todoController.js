const Todo = require('../models/Todo');

// @desc    Get user's todos
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    console.error(`Error in getTodos: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the todo',
      });
    }

    const todo = await Todo.create({
      title,
      description,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error(`Error in createTodo: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized to update this todo',
      });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTodo,
    });
  } catch (error) {
    console.error(`Error in updateTodo: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized to delete this todo',
      });
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Todo removed successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error(`Error in deleteTodo: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
