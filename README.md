# GitHub Readme Preview for a Bakery Web App

## Project Title: Clara's Cake - A Bakery Web Application

Welcome to `Clara's Cake` - a comprehensive bakery web application built during my academic journey. This platform aims to streamline the online bakery shopping experience by enabling users to explore, order, and enjoy their favorite bakery treats.

### Core Features

- User Registration & Authentication: Register and log in to access our bakery shop and its features.
- Browse and Order Products: Enjoy seamless navigation and ordering of our delightful bakery items.
- Real-time Order Status Updates for Admins: The application provides real-time updates on order status changes, enhancing the administrative experience.
- Admin Dashboard for Order Management: Manage and view orders conveniently from a dedicated admin panel.
- Middleware for HTTPS Redirection: The application ensures all traffic uses HTTPS, maintaining a secure platform.

### Tech Stack

- SQLite: For data persistence, SQLite is employed to handle user data, product listings, and orders.
- Handlebars: The application's dynamic and interactive user interface was built using Handlebars, a robust templating engine.
- Node.js & Express: The server-side logic is grounded on Node.js and Express, a lightweight and flexible Node.js web application framework.
- Server Sent Events (SSE): Enables real-time communication between the server and the admin dashboard for instant order status updates.
- Middleware for HTTPS Redirection: Custom middleware implemented to redirect all traffic over HTTPS for enhanced application security.

### Prerequisites

Ensure that you have Node.js (version 10.0 or above) and SQLite installed on your machine. You will also need a pair of SSL certificate files (localhost.key and localhost.cert) for local HTTPS setup.

### Getting Started

1. **Clone the Repository**:

   Use `https://github.com/Abena94/Clara-cake.git` to clone the repository.

2. **Install Dependencies**:

   Navigate to the root directory and run `npm install`.

3. **SSL Setup**:

   Place your localhost.key and localhost.cert files in the root directory. These files are necessary for running the app in a secure (HTTPS) mode in the local environment.

4. **Setup Environment Variables**:

   Create a `.env` file in the root directory. You can use the `.env.example` file as a template.

5. **Start the Application**:

   Run `npm start` to start the Express server.

### Project Structure

- `./models` - Contains the SQLite database models.
- `./routes` - Houses all the route definitions.
- `./controllers` - Contains the business logic for handling incoming requests and sending responses.
- `./views` - Houses the Handlebars templates.
- `./public` - Contains the public assets (CSS, JavaScript, Images).
- `./middleware` - Contains the middleware for HTTPS redirection.

### Live demo

here is the demo of the project  

https://github.com/Abena94/Clara-cake/assets/82619246/5fc40c2c-8726-4a24-adc4-17f9c7abc728

### Contributing

I always welcome constructive feedback, bug reports, and pull requests. 


---

As an ambitious student transitioning into the professional sphere, I am open to opportunities and collaborations. If my project piques your interest, or if you think my skills could be a good fit for your team, please feel free to get in touch.

Created with passion, dedication, and a whole lot of JavaScript. Enjoy coding!


