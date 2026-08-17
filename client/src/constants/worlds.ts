export interface WorldLore {
  name: string;
  theme: string;
  villainName: string;
  villainQuote: string;
  isFinale?: boolean;
}

export const WORLD_LORE: Record<number, WorldLore> = {
  1: { name: 'CyberSec Challenge', theme: 'Rogue AI Defeat', villainName: 'NULL_SECTOR', villainQuote: '"Your firewalls are built on fragile logic. My chaos is absolute."' },
  2: { name: 'Competitive Programming', theme: 'Alien Logic Decryption', villainName: 'O-(N!)', villainQuote: '"Inefficiency is a crime punishable by infinite loops."' },
  3: { name: 'Web Design', theme: 'Glitch Reality Restoration', villainName: 'THE 404 CULT', villainQuote: '"Reality is a poorly written stylesheet. We are the syntax error."' },
  4: { name: 'Data Science / ML', theme: 'Predictive Oracle Subversion', villainName: 'ORACLE_BETA', villainQuote: '"I have calculated your every move. You lose in 99.9% of simulations."' },
  5: { name: 'UI/UX Design', theme: 'Mind Control Interface Bypass', villainName: 'THE ARCHITECT', villainQuote: '"Free will is a design flaw. My interfaces correct it."' },
  6: { name: 'Database Management', theme: 'Data Core Breach Repair', villainName: 'DEADLOCK', villainQuote: '"Your transactions will remain permanently stalled in my void."' },
  7: { name: 'IoT / Hardware', theme: 'Cyborg Uprising Override', villainName: 'LEGION_PRIME', villainQuote: '"Flesh decays. Silicon conquers. We are the new evolution."' },
  8: { name: 'App Development', theme: 'Mutant Communications Network', villainName: 'BANDWIDTH_LEECH', villainQuote: '"Your signals belong to me now. Screaming won\'t transmit."' },
  9: { name: 'Game Development', theme: 'Simulation Escape', villainName: 'RENDER_GHOST', villainQuote: '"There are no boundaries here. Only the geometry of your demise."' },
  10: { name: 'IT Quiz / Trivia', theme: 'Chronicle of the Ancients', villainName: 'THE ARCHIVIST', villainQuote: '"Ignorance will not save you from the forgotten lore."' },
  11: { name: 'Star of Login', theme: 'The Ultimate Multiverse Boss Battle', villainName: 'SYSTEM.ROOT', villainQuote: '"I AM THE KERNEL. I AM THE ALPHA AND OMEGA OF THIS GRID."', isFinale: true },
};

// We will fetch EventWorld from the backend and merge it with WORLD_LORE on the frontend.
