import type { Score } from '@/types'
import * as spotService from './spotService'
import { supabase } from './supabaseClient'

interface SeedSpot {
  name: string
  neighborhood: string
}

interface SeedLog {
  spotName: string
  dishName: string
  price: number
  score: Score
  note?: string
  tags: string[]
  photoUrl: string
  createdAt: string
}

const SEED_SPOTS: SeedSpot[] = [
  { name: "Lou Malnati's Pizzeria", neighborhood: 'Lincoln Park' },
  { name: "Al's Beef", neighborhood: 'Little Italy' },
  { name: "Portillo's", neighborhood: 'River North' },
  { name: 'Strings Ramen Shop', neighborhood: 'Wicker Park' },
  { name: 'Big Star', neighborhood: 'Wicker Park' },
  { name: 'Sunrise Cafe', neighborhood: 'Lakeview' },
  { name: 'Tank Noodle', neighborhood: 'Uptown' },
  { name: 'Au Cheval', neighborhood: 'West Loop' },
  { name: 'Wildberry Pancakes', neighborhood: 'River North' },
  { name: 'Juno', neighborhood: 'Lincoln Park' },
  { name: 'Thai Village', neighborhood: 'Andersonville' },
  { name: 'Band of Bakers', neighborhood: 'Logan Square' },
]

const SEED_LOGS: SeedLog[] = [
  {
    spotName: "Lou Malnati's Pizzeria",
    dishName: 'Deep Dish Pizza',
    price: 24,
    score: 'hail-mary-touchdown',
    note: 'Worth the 45 minute wait. Butter crust is unreal.',
    tags: ['pizza', 'date-night'],
    photoUrl: '/seed-photos/deep-dish-pizza.svg',
    createdAt: '2026-10-07T19:30:00.000Z',
  },
  {
    spotName: "Al's Beef",
    dishName: 'Italian Beef, Dipped',
    price: 11.5,
    score: 'touchdown',
    note: 'Extra giardiniera is non-negotiable.',
    tags: ['classic', 'quick'],
    photoUrl: '/seed-photos/italian-beef.svg',
    createdAt: '2026-10-05T13:15:00.000Z',
  },
  {
    spotName: "Portillo's",
    dishName: 'Chicago Hot Dog',
    price: 4.25,
    score: 'touchdown',
    tags: ['classic', 'budget'],
    photoUrl: '/seed-photos/chicago-hot-dog.svg',
    createdAt: '2026-10-03T18:45:00.000Z',
  },
  {
    spotName: 'Strings Ramen Shop',
    dishName: 'Tonkotsu Ramen',
    price: 16,
    score: 'first-down',
    note: 'Solid but broth could be richer.',
    tags: ['ramen'],
    photoUrl: '/seed-photos/ramen-bowl.svg',
    createdAt: '2026-09-30T20:10:00.000Z',
  },
  {
    spotName: 'Big Star',
    dishName: 'Al Pastor Tacos',
    price: 14.5,
    score: 'hail-mary-touchdown',
    note: 'Patio + tacos + margs = perfect night.',
    tags: ['tacos', 'patio'],
    photoUrl: '/seed-photos/tacos.svg',
    createdAt: '2026-09-27T21:00:00.000Z',
  },
  {
    spotName: 'Sunrise Cafe',
    dishName: 'Avocado Toast',
    price: 12,
    score: 'punt',
    note: 'Fine, but overpriced for the portion.',
    tags: ['brunch'],
    photoUrl: '/seed-photos/avocado-toast.svg',
    createdAt: '2026-09-24T09:30:00.000Z',
  },
  {
    spotName: 'Tank Noodle',
    dishName: 'Pho Tai',
    price: 13.75,
    score: 'first-down',
    tags: ['soup', 'budget'],
    photoUrl: '/seed-photos/pho.svg',
    createdAt: '2026-09-20T12:40:00.000Z',
  },
  {
    spotName: 'Au Cheval',
    dishName: 'Cheeseburger',
    price: 19,
    score: 'hail-mary-touchdown',
    note: 'Best burger in Chicago, full stop.',
    tags: ['burger', 'splurge'],
    photoUrl: '/seed-photos/burger.svg',
    createdAt: '2026-09-16T19:00:00.000Z',
  },
  {
    spotName: 'Wildberry Pancakes',
    dishName: 'Red Velvet Pancakes',
    price: 15.5,
    score: 'touchdown',
    tags: ['brunch', 'sweet'],
    photoUrl: '/seed-photos/pancakes.svg',
    createdAt: '2026-09-12T10:20:00.000Z',
  },
  {
    spotName: 'Juno',
    dishName: 'Omakase Nigiri',
    price: 28,
    score: 'first-down',
    note: 'Great fish, slow service.',
    tags: ['sushi', 'splurge'],
    photoUrl: '/seed-photos/sushi.svg',
    createdAt: '2026-09-08T19:50:00.000Z',
  },
  {
    spotName: 'Thai Village',
    dishName: 'Pad Thai',
    price: 13,
    score: 'fumble',
    note: 'Way too sweet, sending back next time.',
    tags: ['thai'],
    photoUrl: '/seed-photos/pad-thai.svg',
    createdAt: '2026-09-03T18:15:00.000Z',
  },
  {
    spotName: 'Band of Bakers',
    dishName: 'Everything Bagel Sandwich',
    price: 9.5,
    score: 'punt',
    tags: ['breakfast', 'quick'],
    photoUrl: '/seed-photos/bagel-sandwich.svg',
    createdAt: '2026-08-29T08:45:00.000Z',
  },
]

/** Seeds demo spots + logs for a brand-new account, exactly once (skipped if the user already has any logs). */
export async function ensureSeeded(userId: string): Promise<void> {
  const { count, error } = await supabase
    .from('logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  if (count && count > 0) return

  const spotIdByName = new Map<string, string>()
  for (const seedSpot of SEED_SPOTS) {
    const spot = await spotService.createSpot(seedSpot.name)
    spotIdByName.set(seedSpot.name, spot.id)
  }

  const rows = SEED_LOGS.map((log) => ({
    user_id: userId,
    spot_id: spotIdByName.get(log.spotName),
    spot_name: log.spotName,
    dish_name: log.dishName,
    price: log.price,
    score: log.score,
    note: log.note ?? null,
    tags: log.tags,
    photo_url: log.photoUrl,
    created_at: log.createdAt,
    updated_at: log.createdAt,
  }))

  const { error: insertError } = await supabase.from('logs').insert(rows)
  if (insertError) throw new Error(insertError.message)
}
