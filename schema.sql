-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  size VARCHAR(50),
  website VARCHAR(255),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- User-Company relationship table
CREATE TABLE user_companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_id INT NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'member', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_company (user_id, company_id)
);


--projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    project_start_date DATE NOT NULL,
    approx_handover_date DATE NOT NULL,
    project_code VARCHAR(50) NOT NULL,
    stage INT NOT NULL,
    project_type INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    architect_drawing_file VARCHAR(255) NOT NULL
);


--buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    site_no VARCHAR(50) NOT NULL,
    avg_flat_size FLOAT NOT NULL,
    floor_area_size FLOAT NOT NULL,
    building_height FLOAT NOT NULL,
    flat_per_floor INT NOT NULL,
    piling_type VARCHAR(50) NOT NULL,
    facing_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    handover_date DATE NOT NULL,
    stage VARCHAR(50) NOT NULL,
    status VARCHAR(255) NOT NULL,
    architect_file VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key reference to the projects table using project_name
    CONSTRAINT fk_building_project FOREIGN KEY (project_name) REFERENCES projects(project_name) ON DELETE CASCADE
)ENGINE=InnoDB;

--Plot tables

CREATE TABLE plots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plot_name VARCHAR(255) NOT NULL,
    plot_shape VARCHAR(50) NOT NULL,
    plot_area DECIMAL(10,2) NOT NULL,
    inventory_for_sale ENUM('Yes', 'No') NOT NULL,
    note TEXT,
    property_id VARCHAR(50) NOT NULL,
    property_name VARCHAR(255) NOT NULL
);




