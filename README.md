# JahFresh Fridge - Food Expiration Tracker

A Spring Boot REST API application with a Vanilla JS frontend that helps you track food items in your refrigerator, monitor expiration dates, and reduce food waste.

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
- **Expiration Status Report** — summary cards, Items Requiring Attention table with Days Left column, and a Chart.js status breakdown chart
- **Waste & Savings Report** — consumed vs discarded counts, waste rate %, most wasted category, and a Chart.js doughnut chart
- Responsive web interface

## Tech Stack

- **Backend:** Java 17, Spring Boot 3
- **API:** RESTful JSON API
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Validation (spring-boot-starter-validation)
- **Scheduling:** Spring Task Scheduling
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Bootstrap 5
- **Build Tool:** Maven

## Pages

| Page | URL | Description |
|---|---|---|
| Home | `/` | Landing page |
| My Fridge | `/fooditems.html` | CRUD, search, filter, sort, pagination |
| Dashboard | `/dashboard.html` | Live stats cards per status |
| Reports | `/reports.html` | Expiration report and waste summary with charts |

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

3. Update `application.properties` with your database credentials
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
| GET | `/api/reports/expiration-summary` | Get expiration report with items requiring attention |
| GET | `/api/reports/waste-summary` | Get waste and savings report |

## Future Enhancements

- [ ] User authentication and personal fridge per user
- [ ] Email notifications for expiring items
- [ ] Grocery shopping list
