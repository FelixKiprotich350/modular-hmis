import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default privileges
  const privileges = [
    'manage_users',
    'manage_roles',
    'view_patients',
    'create_patients',
    'edit_patients',
    'delete_patients',
    'view_encounters',
    'create_encounters',
    'edit_encounters',
    'view_appointments',
    'create_appointments',
    'edit_appointments'
  ];

  for (const privilegeName of privileges) {
    await prisma.privilege.upsert({
      where: { name: privilegeName },
      update: {},
      create: { name: privilegeName }
    });
  }

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });

  const doctorRole = await prisma.role.upsert({
    where: { name: 'doctor' },
    update: {},
    create: { name: 'doctor' }
  });

  const nurseRole = await prisma.role.upsert({
    where: { name: 'nurse' },
    update: {},
    create: { name: 'nurse' }
  });

  // Assign privileges to admin role (all privileges)
  const allPrivileges = await prisma.privilege.findMany();
  for (const privilege of allPrivileges) {
    await prisma.rolePrivilege.upsert({
      where: {
        roleId_privilegeId: {
          roleId: adminRole.id,
          privilegeId: privilege.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        privilegeId: privilege.id
      }
    });
  }

  // Assign privileges to doctor role
  const doctorPrivileges = ['view_patients', 'create_patients', 'edit_patients', 'view_encounters', 'create_encounters', 'edit_encounters'];
  for (const privilegeName of doctorPrivileges) {
    const privilege = await prisma.privilege.findUnique({ where: { name: privilegeName } });
    if (privilege) {
      await prisma.rolePrivilege.upsert({
        where: {
          roleId_privilegeId: {
            roleId: doctorRole.id,
            privilegeId: privilege.id
          }
        },
        update: {},
        create: {
          roleId: doctorRole.id,
          privilegeId: privilege.id
        }
      });
    }
  }

  // Assign privileges to nurse role
  const nursePrivileges = ['view_patients', 'view_encounters', 'view_appointments', 'create_appointments', 'edit_appointments'];
  for (const privilegeName of nursePrivileges) {
    const privilege = await prisma.privilege.findUnique({ where: { name: privilegeName } });
    if (privilege) {
      await prisma.rolePrivilege.upsert({
        where: {
          roleId_privilegeId: {
            roleId: nurseRole.id,
            privilegeId: privilege.id
          }
        },
        update: {},
        create: {
          roleId: nurseRole.id,
          privilegeId: privilege.id
        }
      });
    }
  }

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@hospital.com',
      password: hashedPassword
    }
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });