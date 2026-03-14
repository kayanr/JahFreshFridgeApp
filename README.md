# JahFresh Fridge - Food Expiration Tracker

A Spring Boot REST API application with a Vanilla JS frontend that helps you track food items in your refrigerator, monitor expiration dates, and reduce food waste.

## Features

- Track food items with name, description, quantity, and expiration dates
- Auto-updates item statuses daily based on expiry date (Fresh, Expiring Soon, Expired)
- Dashboard with live stats showing counts per status
- Real-time search and filter by name and status
- Mark items as Consumed or Discarded
- Responsive web interface

## Tech Stack

- **Backend:** Java 17, Spring Boot 3
- **API:** RESTful JSON API
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Bootstrap 5
- **Build Tool:** Maven

## Getting Started

### Prerequisites
- Java 17+
- MySQL
- Maven

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/JahFreshFridgeApp.git
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
| GET | `/api/fooditems` | Get all food items |
| GET | `/api/fooditems/{id}` | Get a food item by ID |
| POST | `/api/fooditems` | Create a food item |
| PUT | `/api/fooditems/{id}` | Update a food item |
| DELETE | `/api/fooditems/{id}` | Delete a food item |
| GET | `/api/fooditems/stats` | Get counts by status |
| POST | `/api/fooditems/refresh-statuses` | Manually trigger expiry status update |

## Future Enhancements

- [ ] User authentication and personal fridge per user
- [ ] Email/SMS notifications for expiring items
- [ ] Mobile app version
- [ ] Barcode scanning for easy item entry
- [ ] Recipe suggestions for expiring items
- [ ] Grocery shopping list integration
