export interface WorldLore {
  name: string;
  theme: string;
  villainName: string;
  villainQuote: string;
  isFinale?: boolean;
}

export const WORLD_LORE: Record<number, WorldLore> = {
  1: { name: 'NOSTOS: The Journey Home', theme: 'Non-Technical', villainName: 'HELMSMAN', villainQuote: '"Navigate Odysseus\'s trials across logic and patterns."' },
  2: { name: 'Code Relay', theme: 'Technical', villainName: 'TANDEM', villainQuote: '"Swap coders every five minutes. One mind in two bodies."' },
  3: { name: 'IN THE SLOT!!', theme: 'Non-Technical', villainName: 'GAVELON', villainQuote: '"Cricket wisdom, fast math, and high-stakes bidding."' },
  4: { name: 'Debug Arena', theme: 'Technical', villainName: 'FRACTURE', villainQuote: '"Corrupted memory. Broken pointers. Fix it before failure."' },
  5: { name: 'CodeXcape', theme: 'Technical', villainName: 'VAULTWARDEN', villainQuote: '"A six-digit code stands between you and freedom."' },
  6: { name: 'Blind Coding', theme: 'Technical', villainName: 'VEIL', villainQuote: '"Code in the dark. Your eyes lie; your logic does not."' },
  7: { name: 'The Extraction', theme: 'Technical – Cybersecurity & CTF', villainName: 'BLACKOUT-9', villainQuote: '"Operation BLACKOUT is active. Extract the payload."' },
  8: { name: 'Pixel Paradox: AI or Reality?', theme: 'Technical', villainName: 'SIMULACRA', villainQuote: '"Can you tell AI from reality? Look closely at artifacts."' },
  9: { name: 'Project Phoenix: System Recovery', theme: 'Technical', villainName: 'PYRE-01', villainQuote: '"Catastrophic failure in progress. Rebuild from ashes."' },
  10: { name: 'Hunt your Treasure — QR Escape Challenge', theme: 'Non-Technical', villainName: 'QRUX', villainQuote: '"Decipher the grid. Scan hidden marks across campus."' },
  11: { name: 'Star of LOGIN', theme: 'Technical Flagship', villainName: 'THE LAST STANDING', villainQuote: '"The headline event of LOGIN 2026. The last mind standing."', isFinale: true },
};

// We will fetch EventWorld from the backend and merge it with WORLD_LORE on the frontend.
