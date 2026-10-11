const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {

    console.log("🌱 Seeding database...");

    // ADMIN
    const adminPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.upsert({
        data: {
            name: "Main Admin",
            email: "admin@smartauto.com",
            passwordHash: adminPassword,
            role: "superadmin"
        }
    });

    // USERS
    const user1Password = await bcrypt.hash("password123", 10);
    const user2Password = await bcrypt.hash("password456", 10);

    const user1 = await prisma.user.upsert({
        data: {
            name: "John Doe",
            email: "john@example.com",
            passwordHash: user1Password,
            phone: "0767771234"
        }
    });

    const user2 = await prisma.user.upsert({
        data: {
            name: "Sarah Lee",
            email: "sarah@example.com",
            passwordHash: user2Password
        }
    });

    const colomboBranch = await prisma.branch.upsert({
        data: {
            name: "Colombo Branch",
            location: "Colombo 07",
            contactNumber: "0112233111",
        }
    });

    const kandyBranch = await prisma.branch.upsert({
        data: {
            name: "Kandy Branch",
            location: "Kandy City",
            contactNumber: "0812222333",
        }
    });

    const car1 = await prisma.car.upsert({
        data: {
            brand: "Toyota",
            model: "Aqua",
            year: 2018,
            price: 4500000,
            mileage: 55000,
            images: [],
            fuelType: "Hybrid",
            transmission: "Automatic",
            bodyType: "Hatchback",
            condition: "Used",
            location: "Colombo 07",
            engineCapacity: 1500,
            createdById: admin.id
        }
    });

    const car2 = await prisma.car.upsert({
        data: {
            brand: "Honda",
            model: "Vezel",
            year: 2017,
            price: 7200000,
            mileage: 65000,
            images: [],
            fuelType: "Hybrid",
            transmission: "Automatic",
            bodyType: "SUV",
            condition: "Used",
            location: "Kandy City",
            engineCapacity: 1500,
            createdById: admin.id
        }
    });

    await prisma.availability.createMany({
        data: [
            {
                carId: car1.id,
                branchId: colomboBranch.id,
                quantity: 4
            },
            {
                carId: car1.id,
                branchId: kandyBranch.id,
                quantity: 2
            },
        ]
    });

}

main()
    .then(() => console.log('Seed complete'))
    .catch(err => console.error(err))
    .finally(() => prisma.$disconnect());