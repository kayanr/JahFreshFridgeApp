# JahFresh Fridge - Food Expiration Tracker

A Spring Boot REST API application with a Vanilla JS frontend that helps you track food items in your refrigerator, monitor expiration dates, and reduce food waste. Includes JWT-based user authentication so each user manages their own fridge.

## Features

- Track food items with name, notes, category, quantity, and expiration dates
- Categorise items as Dairy, Produce, Meat, Leftovers, Drinks, or Other
- Auto-updates item statuses daily based on expiry date (Fresh, Expiring Soon, Expired)
- Expiring soon alert banner on all pages — links directly to filtered view
- Dashboard with live stats showing counts per status
- Real-time search and filter by name, status, and category
- Sort table columns by name, expiry date, quantity or status
- Paginated food items table (5 items per page)
- Recipe suggestions — click any item name to search Google recipes
- Mark items as Consumed or Discarded
- **Expiration Status Report** — summary cards, Items Requiring Attention table sorted by urgency with Days Left column, and a Food Status Distribution doughnut chart
- **Waste & Savings Report** — consumed vs discarded counts, Waste Rate (Consumption) %, most wasted category, month-over-month trend indicator, and a Consumption vs Waste doughnut chart
- **Category Breakdown Report** — per-category totals with Fresh / Expiring Soon / Expired counts and a colour-coded progress bar
- **Monthly Activity Report** — items added, consumed, and expired for the current month
- CSV export of Items Requiring Attention table with branded filename
- Graceful empty states on all charts and tables when no data is available
- **User Authentication** — register and login with JWT tokens, protected API endpoints, logout from any page
- Responsive web interface

## Tech Stack

- **Backend:** Java 17, Spring Boot 3
- **API:** RESTful JSON API
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Validation (spring-boot-starter-validation)
- **Scheduling:** Spring Task Scheduling
- **Authentication:** Spring Security, JWT (JJWT 0.11.5), BCrypt
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Bootstrap 5
- **Charts:** Chart.js
- **Build Tool:** Maven

## Pages

| Page | URL | Description | Auth Required |
|---|---|---|---|
| Home | `/` | Landing page | No |
| Login | `/login.html` | Sign in and receive JWT token | No |
| Register | `/register.html` | Create a new account | No |
| My Fridge | `/fooditems.html` | CRUD, search, filter, sort, pagination | Yes |
| Dashboard | `/dashboard.html` | Live stats cards per status | Yes |
| Reports | `/reports.html` | Expiration, Waste & Savings, Category Breakdown, and Monthly Activity reports | Yes |

## Getting Started

### Prerequisites
- Java 17+
- MySQL
- Maven

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/kayanr/JahFreshFridgeApp.git
   ```

2. Create the database
   ```sql
   CREATE DATABASE refrigeratordb;
   ```

3. Copy the example properties file and update with your database credentials
   ```bash
   cp passionprojrest/src/main/resources/application.properties.example \
      passionprojrest/src/main/resources/application.properties
   ```
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. Run the application
   ```bash
   mvn spring-boot:run
   ```

5. Visit `http://localhost:8080`

## API Endpoints

### Food Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fooditems?page=0&size=5` | Get all food items (paginated) |
| GET | `/api/fooditems/{id}` | Get a food item by ID |
| POST | `/api/fooditems` | Create a food item |
| PUT | `/api/fooditems/{id}` | Update a food item |
| DELETE | `/api/fooditems/{id}` | Delete a food item |
| GET | `/api/fooditems/expiring-soon` | Get items expiring within 3 days |
| GET | `/api/fooditems/stats` | Get counts by status |
| GET | `/api/fooditems/categories` | Get all available categories |
| POST | `/api/fooditems/refresh-statuses` | Manually trigger expiry status update |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Login and receive a JWT token |

> All food item and report endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/expiration-summary` | Expiration counts and top items requiring attention |
| GET | `/api/reports/waste-summary` | Consumed vs discarded, waste rate, and month-over-month trend |
| GET | `/api/reports/category-summary` | Per-category breakdown of item statuses |
| GET | `/api/reports/monthly-activity` | Items added, consumed, and expired in the current month |

## Future Enhancements

- [ ] Scope food items per user — each user sees only their own fridge
- [ ] Email notifications for expiring items
- [ ] Grocery shopping list
- [ ] Deploy to cloud (Railway / Render)
