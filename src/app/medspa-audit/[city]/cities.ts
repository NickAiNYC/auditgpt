export type CityData = {
  slug: string;
  name: string;
  state: string;
  marketSaturation: 'Extreme' | 'High' | 'Moderate';
  stateComplianceRisk: string;
  topLocalClaim: string;
};

// State-specific compliance profiles for realistic programmatic generation
const stateProfiles: Record<string, { risk: string; claim: string }> = {
  CA: {
    risk: 'California Medical Board strict enforcement of corporate practice of medicine (CPOM) and physician oversight rules (Business and Professions Code Section 2052). Delegated treatments without clear, documented standing orders carry severe license suspension risk.',
    claim: 'FDA-cleared "Zero-Downtime" Lasers with implicit guaranteed results.',
  },
  NY: {
    risk: 'New York State Department of Health and Office of the Professions mandate strict adherence to Article 131. High scrutiny on RN and Esthetician delegation without on-site physician or NP supervision.',
    claim: '"Painless" body contouring and fat-melting injections without clinical substantiation.',
  },
  TX: {
    risk: 'Texas Medical Board Rule 193.17 outlines stringent requirements for nonsurgical medical cosmetic procedures. Proper prescriptive delegation and initial physician/mid-level examination are highly audited.',
    claim: 'Non-surgical facelifts and "lunchtime" PDO thread lifts promising surgical equivalence.',
  },
  FL: {
    risk: 'Florida Board of Medicine imposes strict regulations on who can fire a laser and inject neurotoxins. Heavy enforcement against "rogue" medspas operating under absentee medical directors.',
    claim: 'Permanent "ageless" skin rejuvenation and unverified stem cell/PRP regenerative therapies.',
  },
  IL: {
    risk: 'Illinois Medical Practice Act strictly prohibits the corporate practice of medicine. Non-physician ownership structures and improper delegation of ablative devices are key audit triggers.',
    claim: 'Immediate, permanent acne scar removal utilizing combined RF microneedling without risk disclosure.',
  },
  DEFAULT: {
    risk: 'General state medical board enforcement regarding unauthorized practice of medicine, absent medical directors, and improper delegation of prescriptive devices (lasers, injectables) to unlicensed personnel.',
    claim: 'Exaggerated "clinical grade" anti-aging treatments guaranteeing specific quantitative outcomes.',
  }
};

const enrichCity = (slug: string, name: string, state: string, saturation: 'Extreme' | 'High' | 'Moderate' = 'High'): CityData => {
  const profile = stateProfiles[state] || stateProfiles.DEFAULT;
  return {
    slug,
    name,
    state,
    marketSaturation: saturation,
    stateComplianceRisk: profile.risk,
    topLocalClaim: profile.claim,
  };
};

export const topCities: CityData[] = [
  enrichCity('new-york', 'New York', 'NY', 'Extreme'),
  enrichCity('los-angeles', 'Los Angeles', 'CA', 'Extreme'),
  enrichCity('chicago', 'Chicago', 'IL', 'High'),
  enrichCity('houston', 'Houston', 'TX', 'High'),
  enrichCity('phoenix', 'Phoenix', 'AZ', 'High'),
  enrichCity('philadelphia', 'Philadelphia', 'PA', 'High'),
  enrichCity('san-antonio', 'San Antonio', 'TX', 'High'),
  enrichCity('san-diego', 'San Diego', 'CA', 'Extreme'),
  enrichCity('dallas', 'Dallas', 'TX', 'Extreme'),
  enrichCity('san-jose', 'San Jose', 'CA', 'High'),
  enrichCity('austin', 'Austin', 'TX', 'Extreme'),
  enrichCity('jacksonville', 'Jacksonville', 'FL', 'Moderate'),
  enrichCity('fort-worth', 'Fort Worth', 'TX', 'High'),
  enrichCity('columbus', 'Columbus', 'OH', 'Moderate'),
  enrichCity('indianapolis', 'Indianapolis', 'IN', 'Moderate'),
  enrichCity('charlotte', 'Charlotte', 'NC', 'High'),
  enrichCity('san-francisco', 'San Francisco', 'CA', 'Extreme'),
  enrichCity('seattle', 'Seattle', 'WA', 'High'),
  enrichCity('denver', 'Denver', 'CO', 'High'),
  enrichCity('washington', 'Washington', 'DC', 'Extreme'),
  enrichCity('nashville', 'Nashville', 'TN', 'High'),
  enrichCity('oklahoma-city', 'Oklahoma City', 'OK', 'Moderate'),
  enrichCity('el-paso', 'El Paso', 'TX', 'Moderate'),
  enrichCity('boston', 'Boston', 'MA', 'High'),
  enrichCity('portland', 'Portland', 'OR', 'High'),
  enrichCity('las-vegas', 'Las Vegas', 'NV', 'Extreme'),
  enrichCity('detroit', 'Detroit', 'MI', 'Moderate'),
  enrichCity('memphis', 'Memphis', 'TN', 'Moderate'),
  enrichCity('louisville', 'Louisville', 'KY', 'Moderate'),
  enrichCity('baltimore', 'Baltimore', 'MD', 'Moderate'),
  enrichCity('milwaukee', 'Milwaukee', 'WI', 'Moderate'),
  enrichCity('albuquerque', 'Albuquerque', 'NM', 'Moderate'),
  enrichCity('tucson', 'Tucson', 'AZ', 'Moderate'),
  enrichCity('fresno', 'Fresno', 'CA', 'Moderate'),
  enrichCity('sacramento', 'Sacramento', 'CA', 'High'),
  enrichCity('mesa', 'Mesa', 'AZ', 'Moderate'),
  enrichCity('kansas-city', 'Kansas City', 'MO', 'Moderate'),
  enrichCity('atlanta', 'Atlanta', 'GA', 'Extreme'),
  enrichCity('omaha', 'Omaha', 'NE', 'Moderate'),
  enrichCity('colorado-springs', 'Colorado Springs', 'CO', 'Moderate'),
  enrichCity('raleigh', 'Raleigh', 'NC', 'High'),
  enrichCity('miami', 'Miami', 'FL', 'Extreme'),
  enrichCity('virginia-beach', 'Virginia Beach', 'VA', 'Moderate'),
  enrichCity('oakland', 'Oakland', 'CA', 'High'),
  enrichCity('minneapolis', 'Minneapolis', 'MN', 'Moderate'),
  enrichCity('tulsa', 'Tulsa', 'OK', 'Moderate'),
  enrichCity('arlington', 'Arlington', 'TX', 'Moderate'),
  enrichCity('new-orleans', 'New Orleans', 'LA', 'Moderate'),
  enrichCity('wichita', 'Wichita', 'KS', 'Moderate'),
  enrichCity('cleveland', 'Cleveland', 'OH', 'Moderate'),
];
