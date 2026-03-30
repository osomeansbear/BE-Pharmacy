const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const DEMO_PATIENT_EMAIL =
  process.env.DEMO_PATIENT_EMAIL || "patient@demo.local";
const DEMO_PATIENT_PASSWORD =
  process.env.DEMO_PATIENT_PASSWORD || "Patient@123";
const DEMO_ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || "admin@demo.local";
const DEMO_ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "Admin@123";

async function upsertUserWithAccount({
  email,
  fullName,
  phone,
  role,
  password,
  dob,
}) {
  const existing = await prisma.user.findFirst({ where: { email } });

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { fullName, phone, role, isActive: true },
      })
    : await prisma.user.create({
        data: { email, fullName, phone, role, isActive: true, dob: new Date(dob) },
      });

  const hash = await bcrypt.hash(password, 10);
  await prisma.account.upsert({
    where: { userId: user.id },
    update: { password: hash },
    create: { userId: user.id, password: hash },
  });

  return user;
}

async function ensureDefaultAddress(userId) {
  const addresses = await prisma.address.findMany({ where: { userId } });
  if (addresses.length === 0) {
    await prisma.address.create({
      data: {
        userId,
        province: "Ho Chi Minh City",
        district: "District 1",
        ward: "Ben Nghe",
        detail: "123 Nguyen Hue Boulevard",
        isDefault: true,
      },
    });
    return;
  }

  const hasDefault = addresses.some((addr) => addr.isDefault);
  if (!hasDefault) {
    await prisma.address.update({
      where: { id: addresses[0].id },
      data: { isDefault: true },
    });
  }
}

async function ensureProductDetailAndUnits() {
  const activeProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, shortDesc: true },
  });

  for (const product of activeProducts) {
    await prisma.productDetail.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        description:
          product.shortDesc || `${product.name} demo product description.`,
        ingredients: "Demo ingredients",
        usage: "Use as directed by healthcare professional.",
        storageCondition: "Store in a cool, dry place below 30C.",
        warnings: "Keep out of reach of children.",
        registrationNumber: `DEMO-${product.id}`,
        manufacturer: "Demo Pharma Co.",
        origin: "Vietnam",
        dosageForm: "ORAL",
        packaging: "Standard package",
        activeIngredients: "Demo active ingredient",
        indications: "General symptom relief",
      },
    });

    const existingUnits = await prisma.productUnit.findMany({
      where: { productId: product.id },
      select: { id: true, isDefault: true },
    });

    if (existingUnits.length === 0) {
      await prisma.productUnit.create({
        data: {
          productId: product.id,
          unitType: "BOX",
          price: "120000",
          conversionFactor: "1",
          isDefault: true,
        },
      });

      await prisma.productUnit.create({
        data: {
          productId: product.id,
          unitType: "TABLET",
          price: "15000",
          conversionFactor: "1",
          isDefault: false,
        },
      });
    } else if (!existingUnits.some((unit) => unit.isDefault)) {
      await prisma.productUnit.update({
        where: { id: existingUnits[0].id },
        data: { isDefault: true },
      });
    }
  }
}

async function ensureCartAndOrder(patientId) {
  const defaultAddress = await prisma.address.findFirst({
    where: { userId: patientId, isDefault: true },
  });

  if (!defaultAddress) {
    return;
  }

  const unit = await prisma.productUnit.findFirst({
    where: { product: { isActive: true } },
    include: { product: true },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });

  if (!unit) {
    return;
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      userId: patientId,
      productId: unit.productId,
      unitType: unit.unitType,
    },
  });

  if (!existingCartItem) {
    await prisma.cartItem.create({
      data: {
        userId: patientId,
        productId: unit.productId,
        unitType: unit.unitType,
        quantity: "2",
      },
    });
  }

  const existingOrder = await prisma.order.findFirst({
    where: { userId: patientId },
  });

  if (!existingOrder) {
    const quantity = 1;
    const unitPrice = Number(unit.price);
    const conversionFactor = Number(unit.conversionFactor);
    const totalAmount = (quantity * unitPrice).toString();

    await prisma.order.create({
      data: {
        userId: patientId,
        userEmail: DEMO_PATIENT_EMAIL,
        shippingAddress: {
          province: defaultAddress.province,
          district: defaultAddress.district,
          ward: defaultAddress.ward,
          detail: defaultAddress.detail,
          isDefault: defaultAddress.isDefault,
        },
        paymentMethod: "CASH",
        status: "PENDING",
        totalAmount,
        items: {
          create: {
            productId: unit.productId,
            productName: unit.product.name,
            unitType: unit.unitType,
            quantity: quantity.toString(),
            baseQty: (quantity * conversionFactor).toString(),
            unitPrice: unitPrice.toString(),
          },
        },
      },
    });
  }
}

async function printAudit() {
  const [
    productsWithoutDetail,
    productsWithoutUnits,
    patientsWithoutAddress,
    usersWithoutAccount,
  ] = await Promise.all([
    prisma.product.count({ where: { detail: null } }),
    prisma.product.count({ where: { unit: { none: {} } } }),
    prisma.user.count({ where: { role: "PATIENT", address: { none: {} } } }),
    prisma.user.count({ where: { accounts: null } }),
  ]);

  console.log("\nDemo Data Audit");
  console.log(`- Products missing detail: ${productsWithoutDetail}`);
  console.log(`- Products missing units: ${productsWithoutUnits}`);
  console.log(`- Patients missing address: ${patientsWithoutAddress}`);
  console.log(`- Users missing account: ${usersWithoutAccount}`);
}

async function main() {
  console.log("Starting demo flow backfill...");
  await printAudit();

  const patient = await upsertUserWithAccount({
    email: DEMO_PATIENT_EMAIL,
    fullName: "Demo Patient",
    phone: "0912345678",
    role: "PATIENT",
    password: DEMO_PATIENT_PASSWORD,
    dob: "1995-06-15",
  });

  await upsertUserWithAccount({
    email: DEMO_ADMIN_EMAIL,
    fullName: "Demo Admin",
    phone: "0987654321",
    role: "ADMIN",
    password: DEMO_ADMIN_PASSWORD,
    dob: "1985-01-20",
  });

  await ensureDefaultAddress(patient.id);
  await ensureProductDetailAndUnits();
  await ensureCartAndOrder(patient.id);

  // Seed demo patient health profile for chatbot testing
  await prisma.patientProfile.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      allergies: "penicillin",
      chronicDiseases: "mild hypertension",
      context: "Demo patient profile for AI chatbot testing",
    },
  });

  await printAudit();
  console.log("Demo flow backfill completed.");
  console.log(
    `Patient login: ${DEMO_PATIENT_EMAIL} / ${DEMO_PATIENT_PASSWORD}`,
  );
  console.log(`Admin login: ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Demo flow backfill failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
