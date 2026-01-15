export type DinoType = "carnivore" | "herbivore"

export interface Dinosaur {
  id: string
  name: string
  emoji: string
  image: string
  type: DinoType
  description: string
}

export const dinosaurs: Dinosaur[] = [
  { id: "trex", name: "Tyrannosaure (T-Rex)", emoji: "🦖", image: "/illustration/t-rex.png", type: "carnivore", description: "Le roi des dinosaures avec ses grandes dents !" },
  { id: "bronto", name: "Brontosaure", emoji: "🦕", image: "/illustration/brontosaure.png", type: "herbivore", description: "Un gentil géant qui mange des plantes." },
  { id: "spino", name: "Spinosaure", emoji: "🐊", image: "/illustration/spinosaure.png", type: "carnivore", description: "Un chasseur avec une grande voile sur le dos." },
  { id: "veloci", name: "Raptor", emoji: "🦎", image: "/illustration/raptor.png", type: "carnivore", description: "Petit mais très rapide et malin !" },
  { id: "ankylo", name: "Ankylosaure", emoji: "🐢", image: "/illustration/ankylosaure.png", type: "herbivore", description: "Une armure sur le dos pour se protéger." },
  { id: "ptero", name: "Ptérodactyle", emoji: "🦅", image: "/illustration/pterodactile.png", type: "carnivore", description: "Il vole dans le ciel et mange du poisson." },
  { id: "trice", name: "Tricératops", emoji: "🐉", image: "/illustration/triceratops.png", type: "herbivore", description: "Trois cornes pour se défendre !" },
  { id: "stego", name: "Stégosaure", emoji: "🦔", image: "/illustration/stegosaure.png", type: "herbivore", description: "Des plaques sur le dos comme un hérisson." },
  { id: "diplo", name: "Diplodocus", emoji: "🦒", image: "/illustration/diplodocus.png", type: "herbivore", description: "Un très long cou pour manger les arbres." },
  { id: "allo", name: "Allosaure", emoji: "🐲", image: "/illustration/allosaurus.png", type: "carnivore", description: "Un grand chasseur avant le T-Rex." },
]

export const dinoForQuiz = dinosaurs.filter((d) => d.id !== "os")

export function getDinosForLevel(level: number): Dinosaur[] {
  const pairsCount = level === 1 ? 4 : level === 2 ? 6 : 8
  return dinosaurs.slice(0, pairsCount)
}

export function getGridSize(level: number): { cols: number; rows: number } {
  switch (level) {
    case 1:
      return { cols: 4, rows: 2 }
    case 2:
      return { cols: 4, rows: 3 }
    case 3:
      return { cols: 4, rows: 4 }
    default:
      return { cols: 4, rows: 2 }
  }
}
