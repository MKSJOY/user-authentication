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
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID for id
  company_id CHAR(36) NOT NULL, -- Matches UUID from companies table
  project_name VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  project_start_date DATE NOT NULL,
  approx_handover_date DATE NOT NULL,
  project_code VARCHAR(50) NOT NULL,
  stage VARCHAR(150) NOT NULL,
  project_type VARCHAR(150) NOT NULL,
  status VARCHAR(50) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  architect_drawing_file VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);


CREATE TABLE buildings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID for id
  company_id CHAR(36) NOT NULL, -- Matches UUID from companies table
  project_id CHAR(36) NOT NULL, -- Matches UUID from projects table
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
  architect_file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ReceiptVoucher --
CREATE TABLE receipt_vouchers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    voucher_number VARCHAR(50),
    date DATE,
    due_amount DECIMAL(12, 2),
    pay_amount DECIMAL(12, 2),
    amount_paid_by VARCHAR(255),
    payment_type VARCHAR(50),
    remaining_due DECIMAL(12, 2),
    product_name VARCHAR(255),
    product_details TEXT,
    supplier_id CHAR(36),
    upload_file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES clients(id)
);
CREATE TABLE payment_schedules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    receipt_voucher_id CHAR(36),
    installment_no INT,
    installment_amount DECIMAL(12, 2),
    due_date DATE,
    amount DECIMAL(12, 2),
    money_receipt_no VARCHAR(50),
    received_amount DECIMAL(12, 2),
    FOREIGN KEY (receipt_voucher_id) REFERENCES receipt_vouchers(id)
        ON DELETE CASCADE
);


-- Property --
CREATE TABLE properties (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID for id
  company_id CHAR(36) NOT NULL, -- Matches UUID from companies table
  land_property_name VARCHAR(255) NOT NULL,
  land_property_id VARCHAR(255) NOT NULL UNIQUE,
  upazila VARCHAR(255),
  district VARCHAR(255),
  mouza_number VARCHAR(50),
  survey_category VARCHAR(100),
  khatian_number VARCHAR(100),
  cs_khatian VARCHAR(100),
  rs_khatian VARCHAR(100),
  sa_khatian VARCHAR(100),
  bs_khatian VARCHAR(100),
  mutation_khatian VARCHAR(100),
  city_survey_khatian VARCHAR(100),
  survey_location TEXT,
  additional_documents TEXT,
  owner_name VARCHAR(255),
  phone_number VARCHAR(50),
  present_address TEXT,
  nid VARCHAR(50),
  nid_file VARCHAR(255),
  owner_photo VARCHAR(255),
  tin_number VARCHAR(50),
  tin_file VARCHAR(255),
  land_area DECIMAL(10, 2),
  unit VARCHAR(50),
  note TEXT,
  reminder TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

--expense--
CREATE TABLE expenses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    date DATE NOT NULL,
    type ENUM('Flat/Apartment', 'Other') NOT NULL,
    project_id CHAR(36),
    building_site_id CHAR(36),
    category_name VARCHAR(100),
    category_id INT,
    payment_type ENUM('Cash', 'Bank', 'Other') NOT NULL,
    cost_purpose TEXT,
    manual_inv_no VARCHAR(100),
    expense_by VARCHAR(100) NOT NULL,
    note TEXT,
    attachment_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (building_site_id) REFERENCES buildings(id)
);
CREATE TABLE expense_costs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    expense_id CHAR(36) NOT NULL,
    cost_name VARCHAR(100) NOT NULL,
    cost_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);

--plot--

CREATE TABLE plots (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID for id
  company_id CHAR(36) NOT NULL, -- Matches UUID from companies table
  plot_name VARCHAR(255) NOT NULL,
  plot_shape VARCHAR(50) NOT NULL,
  plot_area DECIMAL(10,2) NOT NULL,
  inventory_for_sale ENUM('Yes', 'No') NOT NULL,
  note TEXT,
  property_id VARCHAR(100) NOT NULL,
  property_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(land_property_id) ON DELETE CASCADE
);

--suppliers table--
CREATE TABLE suppliers (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id CHAR(36),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  nid VARCHAR(50),
  tin_no VARCHAR(50),
  email VARCHAR(100),
  brand VARCHAR(100),
  product VARCHAR(100),
  status ENUM('active', 'inactive'),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

--work--
CREATE TABLE work_heads (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE work_details (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    work_head_id CHAR(36) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_head_id) REFERENCES work_heads(id) ON DELETE CASCADE
);

-- budget--
-- 1. Budgets Table
CREATE TABLE budgets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    building_id CHAR(36) NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    is_initial_budget BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Floors Table
CREATE TABLE floors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    budget_id CHAR(36) NOT NULL,
    floor_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);

-- 3. Work Types Table
CREATE TABLE work_types (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    floor_id CHAR(36) NOT NULL,
    budget_id CHAR(36) NOT NULL, -- Add budget_id here
    work_type VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);

-- 4. Budget Heads Table
CREATE TABLE budget_heads (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    work_type_id CHAR(36) NOT NULL,
    budget_id CHAR(36) NOT NULL, -- Add budget_id here
    budget_head VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    dia VARCHAR(50),
    quantity DECIMAL(10,2),
    rate DECIMAL(10,2),
    amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * rate) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_type_id) REFERENCES work_types(id) ON DELETE CASCADE,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);

--schedule--
CREATE TABLE work_schedules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    building_id CHAR(36) NOT NULL,
    description TEXT,
    schedule_month INT,
    schedule_year INT,
    schedule_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE schedule_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    schedule_id CHAR(36) NOT NULL,
    work_head_id CHAR(36) NOT NULL,
    work_detail_id CHAR(36) NOT NULL,
    start_date DATE,
    end_date DATE,
    work_volume DECIMAL(10,2),
    FOREIGN KEY (schedule_id) REFERENCES work_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (work_head_id) REFERENCES work_heads(id),
    FOREIGN KEY (work_detail_id) REFERENCES work_details(id)
);
