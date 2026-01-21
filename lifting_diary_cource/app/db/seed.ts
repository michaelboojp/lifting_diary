import 'dotenv/config';
import { db } from './index';
import { exercises } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed common exercises
    console.log('📦 Seeding exercises...');
    await db.insert(exercises).values([
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
