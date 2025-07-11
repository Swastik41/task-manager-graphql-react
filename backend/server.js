require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
    console.log('MongoDB connected');
});

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

const schema = buildSchema(`
    type Task {
        id: ID!
        title: String!
        description: String
        completed: Boolean!
        dueDate: String
        priority: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        tasks: [Task]
        task(id: ID!): Task
        taskStats: TaskStats
    }

    type Mutation {
        addTask(title: String!, description: String, dueDate: String, priority: String): Task
        updateTask(id: ID!, title: String, description: String, dueDate: String, priority: String): Task
        deleteTask(id: ID!): Task
        toggleTaskComplete(id: ID!): Task
        clearCompleted: Boolean
    }

    type TaskStats {
        total: Int
        completed: Int
        active: Int
    }
`);

function toTaskObj(task) {
  return {
    ...task._doc,
    id: task._id.toString(),
    createdAt: task.createdAt ? task.createdAt.toISOString() : null,
    updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  };
}

const root = {
    tasks: async () => (await Task.find().sort({createdAt: -1})).map(toTaskObj),
    task: async ({ id }) => {
      const task = await Task.findById(id);
      return task ? toTaskObj(task) : null;
    },
    taskStats: async () => {
      const total = await Task.countDocuments();
      const completed = await Task.countDocuments({ completed: true });
      return { total, completed, active: total - completed };
    },
    addTask: async ({ title, description, dueDate, priority }) => {
        const task = await new Task({ title, description, dueDate, priority }).save();
        return toTaskObj(task);
    },
    updateTask: async ({ id, title, description, dueDate, priority }) => {
        const updated = await Task.findByIdAndUpdate(
            id,
            { $set: { title, description, dueDate, priority } },
            { new: true }
        );
        return updated ? toTaskObj(updated) : null;
    },
    deleteTask: async ({ id }) => {
        const deleted = await Task.findByIdAndDelete(id);
        return deleted ? toTaskObj(deleted) : null;
    },
    toggleTaskComplete: async ({ id }) => {
        const task = await Task.findById(id);
        if (!task) return null;
        task.completed = !task.completed;
        await task.save();
        return toTaskObj(task);
    },
    clearCompleted: async () => {
        await Task.deleteMany({ completed: true });
        return true;
    }
};

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(5000, () => {
    console.log('SERVER READY AT 5000');
});
