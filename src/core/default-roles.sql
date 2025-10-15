-- Insert default roles
INSERT INTO "Role" (id, name) VALUES 
  (gen_random_uuid(), 'Administrator'),
  (gen_random_uuid(), 'Doctor'),
  (gen_random_uuid(), 'Nurse'),
  (gen_random_uuid(), 'Receptionist'),
  (gen_random_uuid(), 'Pharmacist'),
  (gen_random_uuid(), 'Lab Technician')
ON CONFLICT (name) DO NOTHING;

-- Insert default privileges (these will be populated by modules)
INSERT INTO "Privilege" (id, name) VALUES 
  (gen_random_uuid(), 'System Administration'),
  (gen_random_uuid(), 'Manage Users'),
  (gen_random_uuid(), 'View Users'),
  (gen_random_uuid(), 'Create Users'),
  (gen_random_uuid(), 'Edit Users'),
  (gen_random_uuid(), 'Delete Users'),
  (gen_random_uuid(), 'View Patients'),
  (gen_random_uuid(), 'Create Patients'),
  (gen_random_uuid(), 'Edit Patients'),
  (gen_random_uuid(), 'Delete Patients')
ON CONFLICT (name) DO NOTHING;

-- Assign privileges to Administrator role
INSERT INTO "RolePrivilege" ("roleId", "privilegeId")
SELECT r.id, p.id
FROM "Role" r, "Privilege" p
WHERE r.name = 'Administrator'
ON CONFLICT DO NOTHING;

-- Assign basic privileges to Doctor role
INSERT INTO "RolePrivilege" ("roleId", "privilegeId")
SELECT r.id, p.id
FROM "Role" r, "Privilege" p
WHERE r.name = 'Doctor' AND p.name IN ('View Patients', 'Create Patients', 'Edit Patients', 'View Users')
ON CONFLICT DO NOTHING;

-- Assign basic privileges to Nurse role
INSERT INTO "RolePrivilege" ("roleId", "privilegeId")
SELECT r.id, p.id
FROM "Role" r, "Privilege" p
WHERE r.name = 'Nurse' AND p.name IN ('View Patients', 'Edit Patients')
ON CONFLICT DO NOTHING;