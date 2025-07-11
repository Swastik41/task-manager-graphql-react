Task Manager Application


A robust, business-ready full-stack Task Management solution engineered with React, GraphQL, Node.js, and MongoDB.


This application demonstrates best practices in UI/UX, component-based architecture, GraphQL API development, and scalable backend integration.  

It features an intuitive, mobile-responsive interface, seamless CRUD operations, advanced filtering, priorities, and real-time updates.


------------------------------


✨ Key Features


•	- Full CRUD: Create, read, update, and delete tasks with instant UI feedback.

•	- Advanced Editing: Edit titles, descriptions, priorities (High/Medium/Low), and due dates.

•	- Status Tracking: Mark tasks as active or completed.

•	- Filtering: Instantly filter by All, Active, or Completed.

•	- Priority Badges: Visual indicators of task urgency.

•	- Date Insights: Display both "Created at" and due date for each task.

•	- Bulk Actions: Clear all completed tasks in one click.

•	- Responsive Design: Fully optimized for desktop and mobile devices.

•	- Polished UI: Gradient headers, modern color palette, card layouts, and accessible buttons.


------------------------------

🛠️ Tech Stack


•	- Frontend: React 19 (Vite), graphql-request, react-icons, CSS3

•	- Backend: Node.js, Express, GraphQL (express-graphql), Mongoose, MongoDB Atlas


------------------------------

📦 Getting Started


### 1. Clone the Repository


git clone https://github.com/YOUR_GITHUB_USERNAME/task-manager-graphql-react.git

cd task-manager-graphql-react


### 2. Backend Setup


cd backend

npm install

Add your MongoDB connection string to .env as MONGO_URI

npm start

•	- The GraphQL API will be available at: http://localhost:5000/graphql


### 3. Frontend Setup


cd ../frontend

npm install

npm run dev

•	- The frontend UI will be available at: http://localhost:5173


------------------------------

⚙️ Project Structure


task-manager-graphql-react/

  backend/
  
    server.js
    
    package.json
    
    .env
    
  frontend/
  
    src/
    
      components/
      
        TaskList.jsx
        
        TaskItem.jsx
        
      App.jsx
      
      App.css
      
      index.css
      
      main.jsx
      
    package.json
    
    vite.config.js
    
  README.md
  

------------------------------

🖼️ Screenshots

(Desktop View and Mobile View screenshots should be added here)

------------------------------

📝 Customization

•	- Theme and Colors: Easily update palettes and layout in App.css.

•	- Schema Extensions: Add new fields in the GraphQL schema (backend) and update forms/components in the frontend.

------------------------------

👤 Author & Contact

Built with attention to detail by Your Name

•	- LinkedIn: (https://www.linkedin.com/in/swastik-pathak-3306371ba/)

•	- GitHub: (https://github.com/Swastik41)

------------------------------

📄 License


This project is open source and available under the MIT License (LICENSE).

