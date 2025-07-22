# Backend Assignment

> ⚠️ **Note:** This project is implemented using **Node.js and Express.js** (not FastAPI/Django) as per the assignment's flexibility.  
> Please ensure **Node.js (v18+)** and **npm** are installed on your system before running the project.  

You can install Node.js from: https://nodejs.org/

This is a backend implementation of the KPA ERP Form Submission APIs using Node.js, Express.js, and PostgreSQL with `pg-promise`. The APIs handle form submissions and retrieval for both wheel specifications and bogie checksheets.

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/mdvasim988/backend_api_assignment.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root with the following content:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASS=your_postgres_password
DB_NAME=kpa_db
PORT=3000
HOST=localhost
```

### 4. Run the Server
```bash
node app.js
```

> Server will start on `http://localhost:3000`

---

## 🛠️ Tech Stack Used

- **Runtime:** Node.js (ESM)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM/DB Client:** pg-promise
- **Other Tools:** dotenv, cors

---

## 📌 Implemented API Endpoints

### 1. `POST /api/forms/wheel-specifications`

- Submits a new wheel specification form.
- Validates required fields and checks for duplicates.
- Data is saved into `wheel_specification` and `wheel_measurements`.

### 2. `GET /api/forms/wheel-specifications`

- Returns all or filtered wheel forms based on `formNumber`, `submittedBy`, or `submittedDate`.
- Uses a JOIN to return both core form info and its associated measurement fields.

---

### 3. `POST /api/forms/bogie-checksheet`

- Submits a new bogie checksheet form.
- Validates required fields and checks for duplicates.
- Validates nested fields for `bogieDetails`, `bogieChecksheet`, and `bmbcChecksheet`.
- Data is inserted into `bogie_forms`, `bogie_details`, `bogie_checksheet`, and `bmbc_checksheet`.

---

## 📊 Database Schema

- Wheel_specification table stores the form data with `id` as primary key with auto-increment.
- Wheel_measurements table stores the fields of wheel measurements with `id` as primary key with auto-increment and with `wheel_id` as foreign key with references from `id` of Wheel_specification table.
- Bogie_forms table stores the form data with `id` as primary key with auto-increment.
- Bogie_details table stores the data of bogie details with `id` as primary key with auto-increment and with `form_id` as foreign key with references from `id` of Bogie_forms table.
- Bogie_checksheet table stores the data of bogie checksheet data with `id` as primary key with auto-increment and with `form_id` as foreign key with references from `id` of Bogie_forms table.
- bmbc_checksheet table stores the data of bmbc checksheet data with `id` as primary key with auto-increment and with `form_id` as foreign key with references from `id` of Bogie_forms table.

#### `wheel_specification`

| Column Name     | Data Type | Nullable | Default Value                                           | Primary Key |
|------------------|------------|----------|----------------------------------------------------------|--------------|
| `id`             | INTEGER    | NO       | `nextval('wheel_specification_id_seq'::regclass)`        | ✅           |
| `form_number`    | TEXT       | NO       | —                                                        |              |
| `submitted_by`   | TEXT       | NO       | —                                                        |              |
| `submitted_date` | DATE       | NO       | —                                                        |              |

#### `wheel_measurements`

| Column Name                    | Data Type | Nullable | Default Value | Primary Key |
|--------------------------------|-----------|----------|----------------|--------------|
| `id`                           | INTEGER   | NO       | —              | ✅           |
| `wheel_id`                     | INTEGER   | YES      | —              |              |
| `tread_diameter_new`           | TEXT      | YES      | —              |              |
| `last_shop_issue_size`         | TEXT      | YES      | —              |              |
| `condemning_diameter`          | TEXT      | YES      | —              |              |
| `wheel_gauge`                  | TEXT      | YES      | —              |              |
| `variation_same_axle_mm`       | TEXT      | YES      | —              |              |
| `variation_same_bogie_mm`      | TEXT      | YES      | —              |              |
| `variation_same_coach_mm`      | TEXT      | YES      | —              |              |
| `flange_thickness`             | TEXT      | YES      | —              |              |
| `intermediate_wwp_range`       | TEXT      | YES      | —              |              |
| `bearing_seat_diameter_range`  | TEXT      | YES      | —              |              |
| `roller_bearing_outer_diameter`| TEXT      | YES      | —              |              |
| `roller_bearing_bore_diameter` | TEXT      | YES      | —              |              |
| `roller_bearing_width`         | TEXT      | YES      | —              |              |
| `axle_box_housing_bore_diameter`| TEXT     | YES      | —              |              |
| `wheel_disc_width`             | TEXT      | YES      | —              |              |

---

#### `bogie_forms`

| Column Name       | Data Type | Nullable | Default Value | Primary Key |
|-------------------|-----------|----------|----------------|--------------|
| `id`              | INTEGER   | NO       | —              | ✅           |
| `form_number`     | TEXT      | NO       | —              |              |
| `inspection_by`   | TEXT      | NO       | —              |              |
| `inspection_date` | DATE      | NO       | —              |              |

#### `bogie_details`

| Column Name             | Data Type | Nullable | Default Value | Primary Key |
|--------------------------|-----------|----------|----------------|--------------|
| `id`                     | INTEGER   | NO       | —              | ✅           |
| `form_id`                | INTEGER   | YES      | —              |              |
| `bogie_no`               | TEXT      | YES      | —              |              |
| `date_of_ioh`            | DATE      | YES      | —              |              |
| `deficit_components`     | TEXT      | YES      | —              |              |
| `incoming_div_and_date`  | TEXT      | YES      | —              |              |
| `maker_year_built`       | TEXT      | YES      | —              |              |

#### `bogie_checksheet`

| Column Name                | Data Type | Nullable | Default Value | Primary Key |
|-----------------------------|-----------|----------|----------------|--------------|
| `id`                        | INTEGER   | NO       | —              | ✅           |
| `form_id`                   | INTEGER   | YES      | —              |              |
| `axle_guide`                | TEXT      | YES      | —              |              |
| `bogie_frame_condition`     | TEXT      | YES      | —              |              |
| `bolster`                   | TEXT      | YES      | —              |              |
| `bolster_suspension_bracket`| TEXT      | YES      | —              |              |
| `lower_spring_seat`         | TEXT      | YES      | —              |              |

#### `bmbc_checksheet`

| Column Name        | Data Type | Nullable | Default Value | Primary Key |
|---------------------|-----------|----------|----------------|--------------|
| `id`                | INTEGER   | NO       | —              | ✅           |
| `form_id`           | INTEGER   | YES      | —              |              |
| `adjusting_tube`    | TEXT      | YES      | —              |              |
| `cylinder_body`     | TEXT      | YES      | —              |              |
| `piston_trunnion`   | TEXT      | YES      | —              |              |
| `plunger_spring`    | TEXT      | YES      | —              |              |

## ⚠️ Limitations / Assumptions

- Assumes `formNumber` must be unique for both form types.
- PostgreSQL schema must be created manually (schema SQL not included here).

---
