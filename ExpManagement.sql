-- Expense Management System - MySQL Schema
-- Created on: 2025-10-04

-- This script creates all the necessary tables for the expense management application.
-- The tables are ordered to ensure that foreign key dependencies are met.

-- Disabling foreign key checks to avoid errors during table creation.
CREATE DATABASE ExpManagement;
use ExpManagement;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for Companies
-- ----------------------------
DROP TABLE IF EXISTS Companies;
CREATE TABLE Companies (
  company_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email varchar(225) NOT NULL,
  password varchar(100) unique not null,
  default_currency VARCHAR(3) COMMENT 'e.g., USD, INR',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='Stores information about each company.';

-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS Roles;
CREATE TABLE Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g., Admin, Manager, Employee'
) COMMENT='Defines the user roles within the system.';

-- ----------------------------
-- Table structure for Users
-- ----------------------------
-- ----------------------------
-- Table structure for Expenses
-- ----------------------------
DROP TABLE IF EXISTS Expenses;
CREATE TABLE Expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL COMMENT 'Currency of the expense amount',
  category VARCHAR(100) NOT NULL,
  expense_date DATE NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'In Review') NOT NULL DEFAULT 'Pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_employee_id (employee_id),
  FOREIGN KEY (employee_id) REFERENCES Users(id) ON DELETE CASCADE
) COMMENT='Central table for tracking all expense claims.';

-- ----------------------------
-- Table structure for ApprovalWorkflows
-- ----------------------------
DROP TABLE IF EXISTS ApprovalWorkflows;
CREATE TABLE ApprovalWorkflows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  manager_first_approval BOOLEAN DEFAULT TRUE COMMENT 'If true, the employee''s manager must approve first',
  FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE CASCADE
) COMMENT='Defines different approval flows for a company.';

-- ----------------------------
-- Table structure for ApprovalSteps
-- ----------------------------
DROP TABLE IF EXISTS ApprovalSteps;
CREATE TABLE ApprovalSteps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  step_sequence INT NOT NULL COMMENT 'The order of this step (e.g., 1, 2, 3)',
  approver_role_id INT NULL COMMENT 'Role required for this step',
  approver_user_id INT NULL COMMENT 'A specific user assigned to this step',
  INDEX idx_workflow_id (workflow_id),
  FOREIGN KEY (workflow_id) REFERENCES ApprovalWorkflows(id) ON DELETE CASCADE,
  FOREIGN KEY (approver_role_id) REFERENCES Roles(id) ON DELETE SET NULL,
  FOREIGN KEY (approver_user_id) REFERENCES Users(id) ON DELETE SET NULL,
  UNIQUE (workflow_id, step_sequence)
) COMMENT='Defines each sequential step within an ApprovalWorkflow.';

-- ----------------------------
-- Table structure for ExpenseApprovals
-- ----------------------------
DROP TABLE IF EXISTS ExpenseApprovals;
CREATE TABLE ExpenseApprovals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  step_id INT NOT NULL,
  approver_id INT NOT NULL,
  status ENUM('Approved', 'Rejected') NOT NULL,
  comments TEXT,
  action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expense_id (expense_id),
  FOREIGN KEY (expense_id) REFERENCES Expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES ApprovalSteps(id) ON DELETE CASCADE,
  FOREIGN KEY (approver_id) REFERENCES Users(id) ON DELETE CASCADE
) COMMENT='Tracks the approval progress of an expense.';

-- ----------------------------
-- Table structure for ConditionalApprovalRules
-- ----------------------------
DROP TABLE IF EXISTS ConditionalApprovalRules;
CREATE TABLE ConditionalApprovalRules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  rule_type ENUM('Percentage', 'SpecificApprover', 'Hybrid') NOT NULL,
  percentage_threshold INT NULL COMMENT 'e.g., 60 for 60%',
  specific_approver_id INT NULL COMMENT 'User whose approval auto-approves the expense',
  FOREIGN KEY (workflow_id) REFERENCES ApprovalWorkflows(id) ON DELETE CASCADE,
  FOREIGN KEY (specific_approver_id) REFERENCES Users(id) ON DELETE SET NULL
) COMMENT='Stores conditional rules for an approval workflow.';

-- Re-enabling foreign key checks.
SET FOREIGN_KEY_CHECKS=1;

-- Pre-populating the Roles table with default values.
INSERT INTO Roles (id, name) VALUES
(1, 'Admin'),
(2, 'Manager'),
(3, 'Employee');

select * from companies;