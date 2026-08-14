export interface Comfort {
  /** Punchy headline, e.g. "Warm & Muggy". */
  label: string;
  /** Short, fun one-liner. */
  blurb: string;
}

interface ComfortBand {
  label: string;
  /** A few variations so the description freshens on each refresh. */
  blurbs: string[];
}

// Dew point (°F) is the best proxy for how the air actually feels.
type Humidity =
  | "dry"
  | "comfortable"
  | "pleasant"
  | "sticky"
  | "humid"
  | "oppressive"
  | "miserable";

function getHumidity(dewPoint: number): Humidity {
  if (dewPoint >= 76) return "miserable";
  if (dewPoint >= 71) return "oppressive";
  if (dewPoint >= 66) return "humid";
  if (dewPoint >= 61) return "sticky";
  if (dewPoint >= 56) return "pleasant";
  if (dewPoint >= 50) return "comfortable";
  return "dry";
}

// Notably humid enough to affect how a temperature feels (dew point 61+).
const isHumid = (h: Humidity) =>
  h === "sticky" || h === "humid" || h === "oppressive" || h === "miserable";

// The more severe half of the humid range (dew point 71+), vs. the merely
// "moderate" sticky/humid tiers just above the isHumid cutoff.
const isSeverelyHumid = (h: Humidity) =>
  h === "oppressive" || h === "miserable";

function getBand(temperature: number, humidity: Humidity): ComfortBand {
  // Bitterly cold
  if (temperature < 20) {
    return {
      label: "Bitterly Cold",
      blurbs: [
        "Brutal out there — bundle up.",
        "Face-numbing cold. Layer everything.",
        "Arctic vibes. Stay inside if you can.",
      ],
    };
  }

  // Freezing
  if (temperature < 34) {
    return {
      label: "Freezing",
      blurbs: [
        "Frosty and sharp. Grab a coat.",
        "Below freezing — hat and gloves time.",
        "Crisp and icy. Watch your step.",
      ],
    };
  }

  // Chilly
  if (temperature < 50) {
    return humidity === "dry"
      ? {
          label: "Crisp & Cold",
          blurbs: [
            "Bright, cool, and refreshing.",
            "Sweater weather at its finest.",
            "Cold but clear — kinda lovely.",
          ],
        }
      : {
          label: "Raw & Damp",
          blurbs: [
            "Cold with a bone-chilling dampness.",
            "Damp chill that cuts right through.",
            "Grey, raw, and clammy out.",
          ],
        };
  }

  // Cool
  if (temperature < 62) {
    return {
      label: "Cool & Crisp",
      blurbs: [
        "Light-jacket weather. Lovely.",
        "Cool and comfy — perfect for a walk.",
        "Fresh and breezy. Grab a hoodie.",
      ],
    };
  }

  // Pleasant sweet spot
  if (temperature < 75) {
    if (!isHumid(humidity)) {
      return {
        label: "Chef's Kiss",
        blurbs: [
          "Just about perfect out.",
          "Peak weather. Go enjoy it.",
          "Goldilocks conditions — not too much of anything.",
          "Practically perfect."
        ],
      };
    }
    return !isSeverelyHumid(humidity)
      ? {
          label: "Warm & Muggy",
          blurbs: [
            "Nice temps, but the air is thick.",
            "Pleasant warmth with a humid edge.",
            "Comfy heat, a little clammy.",
          ],
        }
      : {
          label: "Sticky Warmth",
          blurbs: [
            "Pleasant heat with clingy air.",
            "Warm and a touch sweaty.",
            "Nice out, but the air's holding on.",
          ],
        };
  }

  // Warm
  if (temperature < 85) {
    if (!isHumid(humidity)) {
      return {
        label: "Warm & Comfy",
        blurbs: [
          "Easy, summery vibes.",
          "Classic warm day. Enjoy it.",
          "T-shirt weather done right.",
        ],
      };
    }
    if (!isSeverelyHumid(humidity)) {
      return {
        label: "Warm & Sticky",
        blurbs: [
          "Toasty with a sweaty edge.",
          "Warm and a bit swampy.",
          "Nice heat, clingy air.",
        ],
      };
    }
    return {
      label: "Hot & Heavy",
      blurbs: [
        "Warm, soupy, sweat-in-the-shade air.",
        "Thick, muggy heat. Stay cool.",
        "Heavy air — you'll feel it.",
      ],
    };
  }

  // Hot
  if (temperature < 95) {
    if (humidity === "dry") {
      return {
        label: "Dry Heat",
        blurbs: [
          "Hot, but at least it's not sticky.",
          "Baking heat with dry air.",
          "Scorcher, minus the humidity.",
        ],
      };
    }
    if (!isHumid(humidity)) {
      return {
        label: "Hot",
        blurbs: [
          "Proper hot out. Find some shade.",
          "Real heat today. Hydrate.",
          "Hot one — take it easy.",
        ],
      };
    }
    return {
      label: "Oppressive",
      blurbs: [
        "Heavy, sweaty heat. Hydrate up.",
        "Thick, smothering heat. Seek AC.",
        "Brutal, muggy heat. Slow down.",
      ],
    };
  }

  // Scorching
  return humidity === "dry"
    ? {
        label: "Scorching",
        blurbs: [
          "Furnace mode. Drink water.",
          "Blistering heat. Stay shaded.",
          "Dangerously hot and dry.",
        ],
      }
    : {
        label: "Dangerously Hot",
        blurbs: [
          "Brutal, soupy heat — take it easy.",
          "Extreme muggy heat. Stay cool.",
          "Punishing heat and humidity.",
        ],
      };
}

/**
 * @param seed Optional value (e.g. reading timestamp) used to rotate the blurb
 *   so the description freshens on each refresh but stays stable between renders.
 */
export function getComfort(
  temperature: number,
  dewPoint: number,
  seed = 0,
): Comfort {
  const humidity = getHumidity(dewPoint);
  const band = getBand(temperature, humidity);
  const index = Math.abs(Math.floor(seed)) % band.blurbs.length;

  return { label: band.label, blurb: band.blurbs[index] };
}
