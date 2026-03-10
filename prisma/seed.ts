import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Data Science",
  "Machine Learning",
  "Product Management",
  "UX Design",
  "DevOps",
  "AWS",
  "Leadership",
  "Career Development",
  "Public Speaking",
  "Entrepreneurship",
  "Finance",
  "Marketing",
  "Cybersecurity",
  "Mobile Development",
];

const PROGRAMMES = [
  {
    title: "12-Week Engineering Mentorship",
    description:
      "A structured programme pairing junior engineers with experienced engineers. Covers code quality, system design, and career growth.",
    durationWeeks: 12,
    maxMentees: 20,
  },
  {
    title: "Product & Design Accelerator",
    description:
      "For aspiring product managers and designers. Learn product strategy, user research, and cross-functional collaboration.",
    durationWeeks: 8,
    maxMentees: 15,
  },
  {
    title: "Career Pivot Programme",
    description:
      "Helping professionals transition into tech. Covers skill assessment, networking, and job search strategy.",
    durationWeeks: 10,
    maxMentees: 25,
  },
  {
    title: "Leadership & Management Track",
    description:
      "For senior ICs moving into management. Covers people management, OKRs, stakeholder communication, and team culture.",
    durationWeeks: 16,
    maxMentees: 10,
  },
];

async function main() {
  console.log("Seeding database...");

  // Upsert skills
  for (const name of SKILLS) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${SKILLS.length} skills`);

  // Upsert programmes
  for (const prog of PROGRAMMES) {
    await prisma.programme.upsert({
      where: { id: prog.title },
      update: {},
      create: prog,
    });
  }
  console.log(`Seeded ${PROGRAMMES.length} programmes`);

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
