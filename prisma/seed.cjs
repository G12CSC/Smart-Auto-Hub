const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {

    console.log("🌱 Seeding database...");

    // ADMIN — unique email, so upsert is safe to re-run.
    const adminPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.upsert({
        where: { email: "admin@smartauto.com" },
        update: {},
        create: {
            name: "Main Admin",
            email: "admin@smartauto.com",
            passwordHash: adminPassword,
            role: "superadmin"
        }
    });

    // USERS — unique email, so upsert is safe to re-run.
    const user1Password = await bcrypt.hash("password123", 10);
    const user2Password = await bcrypt.hash("password456", 10);

    await prisma.user.upsert({
        where: { email: "john@example.com" },
        update: {},
        create: {
            name: "John Doe",
            email: "john@example.com",
            passwordHash: user1Password,
            phone: "0767771234"
        }
    });

    await prisma.user.upsert({
        where: { email: "sarah@example.com" },
        update: {},
        create: {
            name: "Sarah Lee",
            email: "sarah@example.com",
            passwordHash: user2Password
        }
    });

    // BRANCHES — no unique column, so find-or-create by name.
    const colomboBranch =
        (await prisma.branch.findFirst({ where: { name: "Colombo Branch" } })) ??
        (await prisma.branch.create({
            data: {
                name: "Colombo Branch",
                location: "Colombo 07",
                contactNumber: "0112233111",
            }
        }));

    const kandyBranch =
        (await prisma.branch.findFirst({ where: { name: "Kandy Branch" } })) ??
        (await prisma.branch.create({
            data: {
                name: "Kandy Branch",
                location: "Kandy City",
                contactNumber: "0812222333",
            }
        }));

    // CARS — no unique column, so find-or-create by brand/model/year.
    const car1 =
        (await prisma.car.findFirst({ where: { brand: "Toyota", model: "Aqua", year: 2018 } })) ??
        (await prisma.car.create({
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
        }));

    const existingVezel = await prisma.car.findFirst({
        where: { brand: "Honda", model: "Vezel", year: 2017 }
    });
    if (!existingVezel) {
        await prisma.car.create({
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
    }

    // AVAILABILITY — guard so repeated seeds don't pile up duplicate rows.
    const existingAvailability = await prisma.availability.count({
        where: { carId: car1.id }
    });
    if (existingAvailability === 0) {
        await prisma.availability.createMany({
            data: [
                { carId: car1.id, branchId: colomboBranch.id, quantity: 4 },
                { carId: car1.id, branchId: kandyBranch.id, quantity: 2 },
            ]
        });
    }

}

main()
    .then(() => console.log('Seed complete'))
    .catch(err => console.error(err))
    .finally(() => prisma.$disconnect());