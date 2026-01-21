import 'dotenv/config';
import { db } from './index';
import { muscleGroupsTable, exerciseCatalogTable } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed muscle groups
    console.log('📦 Seeding muscle groups...');
    await db.insert(muscleGroupsTable).values([
      { name: 'Chest', category: 'Upper', description: 'Pectoral muscles' },
      { name: 'Back', category: 'Upper', description: 'Latissimus dorsi, rhomboids, traps' },
      { name: 'Shoulders', category: 'Upper', description: 'Deltoids' },
      { name: 'Biceps', category: 'Upper', description: 'Biceps brachii' },
      { name: 'Triceps', category: 'Upper', description: 'Triceps brachii' },
      { name: 'Forearms', category: 'Upper', description: 'Forearm muscles' },
      { name: 'Quadriceps', category: 'Lower', description: 'Front thigh muscles' },
      { name: 'Hamstrings', category: 'Lower', description: 'Back thigh muscles' },
      { name: 'Glutes', category: 'Lower', description: 'Gluteal muscles' },
      { name: 'Calves', category: 'Lower', description: 'Calf muscles' },
      { name: 'Abs', category: 'Core', description: 'Abdominal muscles' },
      { name: 'Obliques', category: 'Core', description: 'Side abdominal muscles' },
      { name: 'Lower Back', category: 'Core', description: 'Erector spinae' },
    ]);
    console.log('✅ Muscle groups seeded');

    // Seed common exercises
    console.log('📦 Seeding exercises...');
    await db.insert(exerciseCatalogTable).values([
      // Chest exercises
      { name: 'Bench Press' },
      { name: 'Incline Bench Press' },
      { name: 'Decline Bench Press' },
      { name: 'Dumbbell Press' },
      { name: 'Chest Fly' },
      { name: 'Push-ups' },
      { name: 'Cable Crossover' },

      // Back exercises
      { name: 'Deadlift' },
      { name: 'Barbell Row' },
      { name: 'Dumbbell Row' },
      { name: 'Pull-ups' },
      { name: 'Chin-ups' },
      { name: 'Lat Pulldown' },
      { name: 'Seated Cable Row' },
      { name: 'T-Bar Row' },

      // Shoulder exercises
      { name: 'Overhead Press' },
      { name: 'Military Press' },
      { name: 'Dumbbell Shoulder Press' },
      { name: 'Lateral Raise' },
      { name: 'Front Raise' },
      { name: 'Rear Delt Fly' },
      { name: 'Face Pull' },

      // Leg exercises
      { name: 'Squat' },
      { name: 'Front Squat' },
      { name: 'Leg Press' },
      { name: 'Leg Extension' },
      { name: 'Leg Curl' },
      { name: 'Romanian Deadlift' },
      { name: 'Lunges' },
      { name: 'Bulgarian Split Squat' },
      { name: 'Calf Raise' },

      // Arm exercises
      { name: 'Barbell Curl' },
      { name: 'Dumbbell Curl' },
      { name: 'Hammer Curl' },
      { name: 'Preacher Curl' },
      { name: 'Tricep Dip' },
      { name: 'Close-Grip Bench Press' },
      { name: 'Tricep Pushdown' },
      { name: 'Skull Crusher' },
      { name: 'Overhead Tricep Extension' },

      // Core exercises
      { name: 'Plank' },
      { name: 'Crunches' },
      { name: 'Sit-ups' },
      { name: 'Russian Twist' },
      { name: 'Leg Raise' },
      { name: 'Mountain Climbers' },
      { name: 'Ab Wheel Rollout' },
      { name: 'Cable Crunch' },
    ]);
    console.log('✅ Exercises seeded');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
