// All domain constants — single source of truth on the frontend.
// Mirror of the backend enums; keep in sync if you extend them.

export const PHASES = [
  { id: 'unaware', label: 'Unaware', short: 'Unaware', cls: 'tag-phase-unaware', funnel: 'top' },
  { id: 'problem', label: 'Problem aware', short: 'Problem', cls: 'tag-phase-problem', funnel: 'top' },
  { id: 'solution', label: 'Solution aware', short: 'Solution', cls: 'tag-phase-solution', funnel: 'mid' },
  { id: 'product', label: 'Product aware', short: 'Product', cls: 'tag-phase-product', funnel: 'mid' },
  { id: 'most', label: 'Most aware', short: 'Most', cls: 'tag-phase-most', funnel: 'lower' },
  { id: 'caring', label: 'Caring', short: 'Caring', cls: 'tag-phase-caring', funnel: 'lower' }
];

export const FUNNELS = [
  { id: 'top', label: 'Top funnel', short: 'TOP', desc: 'Awareness & education' },
  { id: 'mid', label: 'Mid funnel', short: 'MID', desc: 'Consideration' },
  { id: 'lower', label: 'Lower funnel', short: 'LOWER', desc: 'Conversion & retention' }
];

export const ICPS = [
  { id: 'emma', label: 'Emma', desc: 'Overwhelmed mother' },
  { id: 'sophie', label: 'Sophie', desc: 'Ingredient-conscious' },
  { id: 'lisa', label: 'Lisa', desc: 'Premium aesthetics' },
  { id: 'noor', label: 'Noor', desc: 'Value-seeker' },
  { id: 'mila', label: 'Mila', desc: 'Social ambassador' }
];

export const CONTENT_TYPES = [
  { id: 'ugc', label: 'UGC' },
  { id: 'studio', label: 'Studio' },
  { id: 'animation', label: 'Animation' },
  { id: 'founder', label: 'Founder / talking head' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'testimonial', label: 'Testimonial' }
];

export const STATUSES = [
  { id: 'idea', label: 'Idea', short: 'Idea', pill: 'pill-idea', dot: 'col-dot-idea' },
  { id: 'review', label: 'In review', short: 'Review', pill: 'pill-review', dot: 'col-dot-review' },
  { id: 'feedback', label: 'Feedback requested', short: 'Feedback', pill: 'pill-feedback', dot: 'col-dot-feedback' },
  { id: 'production', label: 'In production', short: 'Production', pill: 'pill-production', dot: 'col-dot-production' },
  { id: 'ready', label: 'Ready for review', short: 'Ready', pill: 'pill-ready', dot: 'col-dot-ready' },
  { id: 'live', label: 'Live', short: 'Live', pill: 'pill-live', dot: 'col-dot-live' },
  { id: 'paused', label: 'Paused', short: 'Paused', pill: 'pill-paused', dot: 'col-dot-paused' },
  { id: 'archive', label: 'Archived', short: 'Archive', pill: 'pill-archive', dot: 'col-dot-archive' }
];

// Ad formats per phase — condensed version of the full library.
// Extend this object to add new format ideas; no schema change needed.
export const FORMATS = {
  unaware: [
    { id: 'chaos_to_calm', label: 'Chaos to calm — overwhelming moment with baby, product brings relief', priority: true },
    { id: 'ambient_routine', label: 'Ambient routine — beautiful, silent baby care moment. No voiceover, just visuals', priority: true },
    { id: 'product_beauty_shot', label: 'Product beauty shot — styled flatlay or close-up, no people, pure aesthetics', priority: true },
    { id: 'real_reaction', label: 'Real reaction — unscripted moment with baby responding to a product', priority: true },
    { id: 'relatable_problem', label: 'Relatable problem — shows a struggle every parent knows, no solution offered', priority: true },
    { id: 'partner_pov', label: 'Partner POV — dad or partner experiencing baby care for the first time', priority: false },
    { id: 'trend_native', label: 'Trend-native — uses a viral format or sound, product appears naturally', priority: false },
    { id: 'sensory_close_up', label: 'Sensory close-up — hands, textures, materials filmed macro', priority: false },
    { id: 'slow_morning', label: 'Slow morning — 60 seconds of a calm, unhurried baby morning', priority: true },
    { id: 'sleep_deprivation', label: 'Sleep deprivation — honest, dry humour about being a parent at night', priority: true },
    { id: 'what_i_wish_knew', label: 'What I wish I knew — one thing nobody told her before having a baby', priority: true },
    { id: 'week_in_life', label: 'Week in the life — 7 days of baby care compressed into 30 seconds', priority: true }
  ],
  problem: [
    { id: 'the_struggle', label: 'The struggle — shows the problem (rash, leak, running out) without solving it', priority: true },
    { id: 'ingredient_concern', label: 'Ingredient concern — turns a pack over, reads ingredients, reacts', priority: true },
    { id: 'waste_moment', label: 'Waste moment — money, time or diapers wasted due to the wrong product', priority: true },
    { id: 'skin_reaction', label: 'Skin reaction — what happens to sensitive baby skin with the wrong product', priority: true },
    { id: 'cost_realisation', label: 'Cost realisation — adds up what she\'s spent on diapers this month', priority: false },
    { id: 'the_math_problem', label: 'The maths problem — annual supermarket diaper cost live, the number shocks', priority: true },
    { id: 'invisible_load', label: 'Invisible load — everything a mum manages in one day', priority: true },
    { id: 'the_googling', label: 'The googling — recreates the 2am phone search spiral', priority: true },
    { id: 'subscription_fear', label: 'Subscription fear — voices every fear about subscribing', priority: true },
    { id: 'trial_and_error', label: 'Trial and error — shelf full of products that didn\'t work', priority: true }
  ],
  solution: [
    { id: 'side_by_side_test', label: 'Side-by-side test — Moise vs another brand, same conditions, visible result', priority: true },
    { id: 'ingredient_tour', label: 'Ingredient tour — walks through what\'s in the product and why it matters', priority: true },
    { id: 'founder_story', label: 'Founder story — why Moise Care was built, personal and honest', priority: true },
    { id: 'how_sub_works', label: 'How the subscription works — simple walkthrough, no surprises', priority: true },
    { id: 'cancel_demo', label: 'Cancel demo — cancels the subscription live on screen', priority: true },
    { id: 'real_mum_switch', label: 'Real mum switch — honest story of why she switched, in her own words', priority: true },
    { id: 'live_stress_test', label: 'Live stress test — product through a real challenge, no cuts', priority: true },
    { id: 'two_weeks_later', label: 'Two weeks later — creator switches for 2 weeks and reports back', priority: true },
    { id: 'morning_vs_night', label: 'Morning vs night — same diaper 8pm to 7am, condition in the morning', priority: true },
    { id: 'derma_real', label: 'Derma real — a parent with an eczema baby shares honest experience', priority: true }
  ],
  product: [
    { id: 'before_after', label: 'Before/after — a real visible change after using the product', priority: true },
    { id: 'objection_killer', label: 'Objection killer — dismantles the one reason she hasn\'t bought yet', priority: true },
    { id: 'real_review', label: 'Real review — reads or reacts to a genuine customer review', priority: true },
    { id: 'one_plus_one', label: '1+1 explained — shows it\'s permanent, not a promo', priority: true },
    { id: 'unboxing', label: 'Unboxing — first box, genuine reaction', priority: true },
    { id: 'cost_comparison', label: 'Cost comparison — real numbers, Moise vs supermarket', priority: true },
    { id: 'reassurance', label: 'Reassurance — "I was hesitant too. Here\'s what changed my mind."', priority: true },
    { id: 'skincare_moment', label: 'Skincare moment — lotion, shampoo or spray as part of a real routine', priority: true },
    { id: 'the_wait_was_wrong', label: 'The wait was wrong — creator admits they waited too long to switch', priority: true },
    { id: 'invisible_result', label: 'Invisible result — the rash that didn\'t happen, the leak that didn\'t', priority: true },
    { id: 'one_sentence_review', label: 'One sentence reviews — 10 customers, 1 sentence each, rapid cut', priority: true },
    { id: 'price_per_dry_night', label: 'Price per dry night — cost per use, changes the conversation', priority: true }
  ],
  most: [
    { id: 'still_on_the_fence', label: 'Still on the fence — speaks to someone 90% there', priority: true },
    { id: 'whats_in_the_box', label: 'What\'s in the box — shows exactly what arrives first', priority: true },
    { id: 'risk_removal', label: 'Risk removal — makes trying or cancelling feel completely safe', priority: true },
    { id: 'social_proof_stack', label: 'Social proof stack — multiple customers saying similar things, fast cut', priority: true },
    { id: 'permanent_deal', label: 'Permanent deal — makes clear the 1+1 is not a limited offer', priority: true },
    { id: 'personal_rec', label: 'Personal recommendation — feels like a friend texting, not an ad', priority: true },
    { id: 'last_mile', label: 'Last mile — one final nudge for someone who is almost there', priority: true },
    { id: 'price_anchoring', label: 'Price anchoring — compares monthly cost to one coffee a week', priority: true },
    { id: 'the_honest_ad', label: 'The honest ad — creator admits it\'s an ad, then explains why', priority: true },
    { id: 'framing_shift', label: 'Framing shift — diapers from a cost to an investment in sleep', priority: true }
  ],
  caring: [
    { id: 'upsell_skincare', label: 'Skincare upsell — subscriber has diapers, introduces the skincare range', priority: true },
    { id: 'refer_a_friend', label: 'Refer a friend — how the referral works, both sides benefit', priority: true },
    { id: 'brand_ambassador', label: 'Brand ambassador — subscriber recommends unprompted', priority: true },
    { id: 'ugc_prompt', label: 'UGC prompt — invites subscribers to share their own moment', priority: true },
    { id: 'next_chapter', label: 'Next chapter — baby moves to next size, Moise grows with you', priority: true },
    { id: 'mum_network', label: 'Mum network — how word spreads between mums', priority: true },
    { id: 'skincare_discovery', label: 'Skincare discovery — subscriber tries skincare for the first time', priority: true },
    { id: 'pass_it_on', label: 'Pass it on — recommending Moise to a pregnant friend', priority: true },
    { id: 'the_upgrade', label: 'The upgrade — discovers a new product in the range', priority: true },
    { id: 'two_kids', label: 'Two kids, same brand — second pregnancy, no doubt', priority: true }
  ]
};

export const getPhase = (id) => PHASES.find(p => p.id === id);
export const getIcp = (id) => ICPS.find(i => i.id === id);
export const getContentType = (id) => CONTENT_TYPES.find(c => c.id === id);
export const getStatus = (id) => STATUSES.find(s => s.id === id);
export const getFunnel = (id) => FUNNELS.find(f => f.id === id);
export const getFormat = (phaseId, formatId) => (FORMATS[phaseId] || []).find(f => f.id === formatId);
