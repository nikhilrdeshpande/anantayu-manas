export interface PrakritiInfo {
  name: string;
  archetype: string;
  traits: string[];
  description: string;
  whatIs: string;
  strengths: Array<{ title: string; description: string; icon: string }>;
  growthAreas: Array<{ title: string; description: string; icon: string }>;
  dailyPractices: Array<{ title: string; description: string; icon: string }>;
  aiInsight: string;
}

export const PRAKRITI_DATA: Record<string, PrakritiInfo> = {
  sattvika: {
    name: 'Sattvika',
    archetype: 'The Luminous Sage',
    traits: ['Serene', 'Wise', 'Compassionate'],
    description:
      'Your mind is predominantly governed by Sattva — the quality of clarity, harmony, and inner light. You naturally gravitate toward truth, self-discipline, and a deep reverence for all living beings.',
    whatIs:
      'Sattvika Prakriti represents the purest expression of mental constitution in Ayurveda. Individuals with this prakriti possess an innate clarity of thought, emotional stability, and spiritual inclination. The Charaka Samhita describes Sattvika individuals as those who are devoted to knowledge, truthful in speech, and naturally inclined toward self-control. They experience genuine happiness through service and contemplation rather than sensory pleasure. This constitution reflects a mind in its most balanced state — clear like still water, capable of reflecting reality without distortion.',
    strengths: [
      {
        title: 'Natural Equanimity',
        description:
          'You maintain composure in turbulent situations, serving as a calming presence for those around you.',
        icon: 'Sparkles',
      },
      {
        title: 'Deep Intuition',
        description:
          'Your clarity of mind allows you to perceive subtle truths that others may overlook.',
        icon: 'Brain',
      },
      {
        title: 'Selfless Service',
        description:
          'You are naturally drawn to uplift others without expectation of personal gain.',
        icon: 'Heart',
      },
    ],
    growthAreas: [
      {
        title: 'Worldly Engagement',
        description:
          'Your preference for inner peace may lead to detachment from necessary practical matters.',
        icon: 'Globe',
      },
      {
        title: 'Setting Boundaries',
        description:
          'Your compassion can be exploited if you struggle to say no when needed.',
        icon: 'Shield',
      },
      {
        title: 'Embracing Imperfection',
        description:
          'High ideals can create frustration when reality falls short of your vision.',
        icon: 'Sprout',
      },
    ],
    dailyPractices: [
      {
        title: 'Brahma Muhurta Meditation',
        description:
          'Rise before dawn for 20 minutes of silent meditation to deepen your natural clarity.',
        icon: 'Sun',
      },
      {
        title: 'Sattvic Nourishment',
        description:
          'Favor fresh, seasonal, and lightly cooked foods — milk, ghee, fruits, and whole grains.',
        icon: 'UtensilsCrossed',
      },
      {
        title: 'Sacred Study',
        description:
          'Dedicate 15 minutes to reading wisdom literature to keep your Sattva nourished.',
        icon: 'BookOpen',
      },
    ],
    aiInsight:
      'Your Sattvika constitution is a rare gift. The key to sustaining it lies not in withdrawing from the world, but in engaging with it fully while maintaining your inner stillness. Think of yourself as a lotus — rooted in the mud of daily life, yet untouched by it. Your greatest contribution is not what you do, but the quality of presence you bring to everything.',
  },

  rajasika: {
    name: 'Rajasika',
    archetype: 'The Dynamic Achiever',
    traits: ['Ambitious', 'Passionate', 'Energetic'],
    description:
      'Your mind is predominantly governed by Rajas — the quality of action, desire, and dynamic energy. You are naturally driven to create, compete, and transform the world around you.',
    whatIs:
      'Rajasika Prakriti reflects a mind dominated by the force of activity and passion. According to Ayurvedic texts, Rajasika individuals are characterized by intense ambition, restless energy, and a strong attachment to outcomes. They are natural leaders and doers, thriving in environments that demand quick decision-making and bold action. The Charaka Samhita notes that Rajas propels the mind toward external pursuits — wealth, status, and sensory pleasures. While this energy is essential for worldly achievement, unchecked Rajas can lead to anxiety, irritability, and chronic dissatisfaction.',
    strengths: [
      {
        title: 'Relentless Drive',
        description:
          'You possess an extraordinary capacity to pursue goals with unwavering determination.',
        icon: 'Zap',
      },
      {
        title: 'Charismatic Influence',
        description:
          'Your passionate energy naturally draws others to your vision and leadership.',
        icon: 'Flame',
      },
      {
        title: 'Rapid Adaptability',
        description:
          'You thrive in fast-paced environments and quickly pivot when circumstances change.',
        icon: 'RefreshCw',
      },
    ],
    growthAreas: [
      {
        title: 'Restlessness',
        description:
          'Your active mind may struggle with stillness, making deep rest and meditation challenging.',
        icon: 'Timer',
      },
      {
        title: 'Attachment to Outcomes',
        description:
          'Learning to act without fixating on results will bring greater inner freedom.',
        icon: 'Target',
      },
      {
        title: 'Emotional Reactivity',
        description:
          'Strong passions can sometimes manifest as anger or frustration when things don\'t go your way.',
        icon: 'Heart',
      },
    ],
    dailyPractices: [
      {
        title: 'Cooling Pranayama',
        description:
          'Practice Sheetali or Chandra Bhedana breathing for 10 minutes to calm your Rajas fire.',
        icon: 'Wind',
      },
      {
        title: 'Mindful Transitions',
        description:
          'Pause for 3 conscious breaths between activities to prevent the buildup of mental agitation.',
        icon: 'Clock',
      },
      {
        title: 'Digital Sunset',
        description:
          'Disconnect from screens 90 minutes before sleep to allow your active mind to wind down.',
        icon: 'Moon',
      },
    ],
    aiInsight:
      'Your Rajasika energy is a powerful engine. The ancient texts compare it to fire — essential for transformation, but destructive without containment. Your path to growth is not about suppressing your drive, but about channeling it with intention. When you learn to act from a place of inner clarity rather than restless desire, your achievements will carry a quality of fulfillment that ambition alone cannot provide.',
  },

  tamasika: {
    name: 'Tamasika',
    archetype: 'The Grounded Observer',
    traits: ['Steady', 'Reflective', 'Enduring'],
    description:
      'Your mind carries a strong influence of Tamas — the quality of stability, inertia, and deep rootedness. You possess a natural capacity for endurance and a contemplative relationship with life.',
    whatIs:
      'Tamasika Prakriti indicates a mental constitution where the quality of Tamas — stability, heaviness, and resistance to change — is predominant. Ayurveda recognizes that while Tamas in excess creates lethargy and confusion, in its balanced form it provides essential grounding, patience, and the ability to withstand difficulty. The Charaka Samhita describes various subtypes of Tamasika nature, noting that individuals with this constitution often have deep emotional reservoirs and a capacity for sustained effort once motivated. Understanding and gradually introducing Sattva through diet, routine, and spiritual practice is the recommended path.',
    strengths: [
      {
        title: 'Unshakeable Patience',
        description:
          'You have a remarkable capacity to wait, endure, and persist through prolonged challenges.',
        icon: 'Mountain',
      },
      {
        title: 'Emotional Depth',
        description:
          'You process experiences deeply, giving you rich inner understanding and empathy.',
        icon: 'Heart',
      },
      {
        title: 'Loyal Dependability',
        description:
          'Once committed, you are steadfast and reliable — a true anchor for those who depend on you.',
        icon: 'Anchor',
      },
    ],
    growthAreas: [
      {
        title: 'Initiating Action',
        description:
          'Overcoming the initial resistance to start new endeavors is your primary growth edge.',
        icon: 'Rocket',
      },
      {
        title: 'Mental Clarity',
        description:
          'Cultivating practices that sharpen focus and dispel mental fog will transform your experience.',
        icon: 'Brain',
      },
      {
        title: 'Embracing Change',
        description:
          'Learning to welcome transitions rather than resist them opens new possibilities.',
        icon: 'Sprout',
      },
    ],
    dailyPractices: [
      {
        title: 'Sunrise Movement',
        description:
          'Begin each day with 20 minutes of vigorous exercise — sun salutations or brisk walking — to counter heaviness.',
        icon: 'Sun',
      },
      {
        title: 'Light & Warm Diet',
        description:
          'Favor pungent, bitter, and light foods. Minimize heavy, oily, and processed items that increase Tamas.',
        icon: 'UtensilsCrossed',
      },
      {
        title: 'Accountability Partner',
        description:
          'Share one daily intention with a trusted friend to create positive momentum through external structure.',
        icon: 'Users',
      },
    ],
    aiInsight:
      'Your Tamasika nature is not a limitation — it is an invitation. The earth itself is Tamasika, and from it springs all life. Your journey is about gently introducing light and movement into your steady foundation. Small, consistent actions compound dramatically over time. You do not need to become someone else; you need to awaken the vitality that already sleeps within your remarkable capacity for depth and endurance.',
  },

  'sattvika-rajasika': {
    name: 'Sattvika-Rajasika',
    archetype: 'The Wise Leader',
    traits: ['Calm', 'Driven', 'Thoughtful'],
    description:
      'This unique combination suggests a personality that is fundamentally peaceful, pure, and oriented toward growth (Sattva), but powered by the active, ambitious, and passionate energy of Rajas.',
    whatIs:
      'Sattvika-Rajasika Prakriti is one of the most dynamic and effective mental constitutions described in Ayurveda. It combines the clarity, wisdom, and moral compass of Sattva with the energy, ambition, and executive capacity of Rajas. The Charaka Samhita recognizes that this combination produces individuals who can envision elevated ideals and possess the drive to manifest them in the world. Unlike pure Sattva, which may tend toward withdrawal, or pure Rajas, which can lack ethical grounding, this combination creates leaders, reformers, and visionaries who act with both purpose and principle.',
    strengths: [
      {
        title: 'Inspirational Leadership',
        description:
          'You lead with empathy and a vision that transcends mere material gain.',
        icon: 'Zap',
      },
      {
        title: 'Harmonious Productivity',
        description:
          'Ability to work intensely without losing your inner sense of calm.',
        icon: 'Sparkles',
      },
      {
        title: 'High Discernment',
        description:
          'Quick to separate truth from noise in complex situations.',
        icon: 'Brain',
      },
    ],
    growthAreas: [
      {
        title: 'Burnout Potential',
        description:
          "Your Rajas drive can sometimes override your body's signals for rest.",
        icon: 'Sprout',
      },
      {
        title: 'Impatience with Slowness',
        description:
          'Learning to sit with stillness without feeling frustrated.',
        icon: 'Timer',
      },
      {
        title: 'Over-Intellectualizing',
        description:
          'Using your Sattvic mind to avoid deep emotional work.',
        icon: 'Heart',
      },
    ],
    dailyPractices: [
      {
        title: 'Morning Stillness',
        description:
          '15 minutes of Pranayama before checking devices to anchor your Sattva.',
        icon: 'Sun',
      },
      {
        title: 'Cooling Nutrition',
        description:
          'Favor sweet, bitter, and astringent tastes to pacify the heat of Rajas.',
        icon: 'UtensilsCrossed',
      },
      {
        title: 'Evening Surrender',
        description:
          'Journaling three things you let go of to transition into restful sleep.',
        icon: 'Moon',
      },
    ],
    aiInsight:
      'You carry the rare combination of seeing clearly and acting boldly. The ancient Rishis would recognize you as an ideal Karma Yogi — one who works tirelessly in the world while remaining internally free. Your challenge is not about doing more, but about knowing when to stop. Cultivate the art of sacred pauses. The space between your actions is where your deepest wisdom lives.',
  },

  'sattvika-tamasika': {
    name: 'Sattvika-Tamasika',
    archetype: 'The Contemplative Mystic',
    traits: ['Introspective', 'Patient', 'Perceptive'],
    description:
      'Your constitution blends the luminous clarity of Sattva with the grounding depth of Tamas. You possess both profound inner vision and the patience to let understanding mature slowly.',
    whatIs:
      'Sattvika-Tamasika Prakriti is a contemplative constitution that combines spiritual clarity with deep grounding. In Ayurvedic psychology, this combination produces individuals with remarkable depth of understanding. The Sattvic quality provides clear perception and moral sensitivity, while the Tamasic element adds patience, endurance, and a capacity for solitude. This combination often manifests in philosophers, healers, and spiritual practitioners who need extended periods of stillness to access their deepest wisdom. The key to thriving lies in preventing Tamas from overshadowing Sattva through consistent practice and gentle discipline.',
    strengths: [
      {
        title: 'Profound Contemplation',
        description:
          'You can sit with complex ideas and arrive at insights that escape the hurried mind.',
        icon: 'Brain',
      },
      {
        title: 'Emotional Stability',
        description:
          'Your grounded nature provides a calm center even in emotional storms.',
        icon: 'Anchor',
      },
      {
        title: 'Healing Presence',
        description:
          'Others feel genuinely safe and understood in your company.',
        icon: 'Heart',
      },
    ],
    growthAreas: [
      {
        title: 'Taking Initiative',
        description:
          'Your contemplative nature may delay necessary action — practice starting before you feel fully ready.',
        icon: 'Rocket',
      },
      {
        title: 'Social Withdrawal',
        description:
          'Balancing your need for solitude with meaningful connection and community.',
        icon: 'Users',
      },
      {
        title: 'Physical Vitality',
        description:
          'Tamas can manifest as physical heaviness — regular movement keeps your clarity bright.',
        icon: 'Sprout',
      },
    ],
    dailyPractices: [
      {
        title: 'Active Morning Ritual',
        description:
          'Begin with 15 minutes of dynamic yoga or walking to activate your Sattvic energy before meditation.',
        icon: 'Sun',
      },
      {
        title: 'Structured Social Time',
        description:
          'Schedule one meaningful conversation daily to balance your contemplative tendency with connection.',
        icon: 'Users',
      },
      {
        title: 'Light Evening Meals',
        description:
          'Eat dinner early and keep it light to prevent Tamas from dominating your evening hours.',
        icon: 'UtensilsCrossed',
      },
    ],
    aiInsight:
      'You are like a deep mountain lake — still on the surface, with immeasurable depth below. Your gift is the ability to perceive what others cannot because you have the patience to look long enough. The growth edge for you is translation — turning your inner knowing into outer expression. The world needs your wisdom, not just as a silent presence, but as a voice. Speak what you see.',
  },

  'rajasika-tamasika': {
    name: 'Rajasika-Tamasika',
    archetype: 'The Resilient Warrior',
    traits: ['Tenacious', 'Strategic', 'Forceful'],
    description:
      'Your constitution combines the fierce energy of Rajas with the immovable strength of Tamas. You are built for sustained effort, endurance, and pushing through obstacles that stop others.',
    whatIs:
      'Rajasika-Tamasika Prakriti is described in the Charaka Samhita as a constitution where passionate drive meets deep-seated inertia. This creates a powerful internal tension that, when harnessed correctly, produces remarkable resilience and determination. Individuals with this constitution often experience intense periods of activity followed by deep withdrawal. The Rajasic element provides ambition and competitive fire, while the Tamasic quality adds stubbornness, endurance, and the capacity to absorb setbacks without breaking. The path to balance involves gradually introducing Sattvic qualities through mindful practices, cleaner diet, and cultivating self-awareness.',
    strengths: [
      {
        title: 'Unstoppable Determination',
        description:
          'When you commit to something, no obstacle is large enough to deter you.',
        icon: 'Shield',
      },
      {
        title: 'Strategic Thinking',
        description:
          'You instinctively understand power dynamics and how to navigate complex situations.',
        icon: 'Target',
      },
      {
        title: 'Crisis Performance',
        description:
          'You come alive under pressure and perform best when the stakes are highest.',
        icon: 'Zap',
      },
    ],
    growthAreas: [
      {
        title: 'Cultivating Lightness',
        description:
          'Introducing humor, play, and spontaneity to counter the heaviness of your constitution.',
        icon: 'Sparkles',
      },
      {
        title: 'Emotional Processing',
        description:
          'Learning to feel and express emotions rather than pushing through or suppressing them.',
        icon: 'Heart',
      },
      {
        title: 'Sattvic Practices',
        description:
          'Gradually building a meditation practice to create space between stimulus and reaction.',
        icon: 'Brain',
      },
    ],
    dailyPractices: [
      {
        title: 'Vigorous Morning Exercise',
        description:
          'Channel your Rajas into 30 minutes of intense physical activity to clear mental heaviness.',
        icon: 'Flame',
      },
      {
        title: 'Clean Eating Windows',
        description:
          'Eat only during a 10-hour window with predominantly plant-based, freshly prepared meals.',
        icon: 'UtensilsCrossed',
      },
      {
        title: 'Gratitude Before Sleep',
        description:
          'Write three genuine appreciations to soften the competitive edge and invite Sattva.',
        icon: 'Moon',
      },
    ],
    aiInsight:
      'You carry the energy of a storm — powerful, transformative, and sometimes destructive. Your constitution is not a flaw to fix but a force to master. The greatest warriors in Ayurvedic tradition were Rajasika-Tamasika by nature, but elevated by discipline and purpose. Your path is the warrior\'s path: channel your immense energy toward causes larger than yourself, and watch that very intensity become your liberation.',
  },

  trigunatmaka: {
    name: 'Trigunatmaka',
    archetype: 'The Balanced Seeker',
    traits: ['Adaptable', 'Versatile', 'Evolving'],
    description:
      'Your constitution reflects a relatively balanced interplay of all three Gunas — Sattva, Rajas, and Tamas. You are naturally versatile, experiencing the full spectrum of mental qualities.',
    whatIs:
      'Trigunatmaka Prakriti, or the tri-balanced constitution, occurs when no single Guna dominates decisively. Ayurveda describes this as an inherently adaptable state — you can draw upon the clarity of Sattva, the energy of Rajas, or the stability of Tamas as situations demand. However, this balance is also dynamic and easily tipped by diet, lifestyle, season, and company. The Charaka Samhita suggests that individuals with balanced constitutions have the greatest potential for conscious evolution, as they are not strongly pulled in any single direction. The key lies in intentionally cultivating Sattva to elevate the entire equilibrium.',
    strengths: [
      {
        title: 'Remarkable Adaptability',
        description:
          'You can adjust your energy and approach to match virtually any situation or environment.',
        icon: 'RefreshCw',
      },
      {
        title: 'Holistic Understanding',
        description:
          'You naturally see multiple perspectives, making you an excellent mediator and counselor.',
        icon: 'Brain',
      },
      {
        title: 'Growth Potential',
        description:
          'Without a dominant Guna pulling you, you have exceptional freedom to shape your own evolution.',
        icon: 'Sprout',
      },
    ],
    growthAreas: [
      {
        title: 'Decision Clarity',
        description:
          'Multiple perspectives can sometimes create analysis paralysis — practice decisive action.',
        icon: 'Target',
      },
      {
        title: 'Consistency',
        description:
          'Your adaptability may lead to inconsistency in habits and practices — build strong routines.',
        icon: 'Timer',
      },
      {
        title: 'Identity Anchoring',
        description:
          'With no dominant quality defining you, developing a strong sense of self is essential.',
        icon: 'Anchor',
      },
    ],
    dailyPractices: [
      {
        title: 'Fixed Morning Routine',
        description:
          'Establish a non-negotiable 30-minute morning sequence: movement, breath, and intention-setting.',
        icon: 'Sun',
      },
      {
        title: 'Sattvic Emphasis',
        description:
          'Consciously favor Sattvic foods, environments, and company to elevate your natural balance.',
        icon: 'UtensilsCrossed',
      },
      {
        title: 'Weekly Reflection',
        description:
          'Each Sunday, review which Guna dominated your week and set an intention to recalibrate.',
        icon: 'BookOpen',
      },
    ],
    aiInsight:
      'You stand at a unique crossroads in Ayurvedic psychology. While others work to overcome a dominant tendency, you have the rare freedom to consciously choose your direction. This is both a gift and a responsibility. The Bhagavad Gita teaches that Sattva, being luminous and healthy, binds through attachment to happiness and knowledge — even this highest quality must eventually be transcended. Use your balanced nature as a launchpad for conscious evolution, not as a reason for complacency.',
  },
};

/**
 * Determine the Manas Prakriti type key from guna percentages.
 */
export function determinePrakritiType(
  sattva: number,
  rajas: number,
  tamas: number,
): string {
  const threshold = 10; // percentage difference threshold for "dominant"
  const scores = [
    { guna: 'sattvika', value: sattva },
    { guna: 'rajasika', value: rajas },
    { guna: 'tamasika', value: tamas },
  ].sort((a, b) => b.value - a.value);

  const [first, second] = scores;

  // If top two are within threshold, it's a combo
  if (first.value - second.value < threshold) {
    const combo = [first.guna, second.guna].sort().join('-');
    // Normalize combo order
    const comboMap: Record<string, string> = {
      'rajasika-sattvika': 'sattvika-rajasika',
      'sattvika-tamasika': 'sattvika-tamasika',
      'rajasika-tamasika': 'rajasika-tamasika',
      'sattvika-rajasika': 'sattvika-rajasika',
      'tamasika-sattvika': 'sattvika-tamasika',
      'tamasika-rajasika': 'rajasika-tamasika',
    };
    const key = comboMap[combo] || combo;

    // If all three are close, it's trigunatmaka
    const third = scores[2];
    if (second.value - third.value < threshold) {
      return 'trigunatmaka';
    }
    return key;
  }

  return first.guna;
}
