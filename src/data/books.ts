export interface Chapter {
  number: number;
  title: string;
  subtitle?: string;
  content: string;
  takeaway: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  progress?: number;
  currentPage?: number;
  totalPages: number;
  cover: string;
  category: string;
  year: number;
  rating: string;
  readTime: string;
  synopsis: string;
  tags: string[];
  badge?: string;
  isMemberExclusive?: boolean; // Requires free account to unlock beyond Ch 1
  chapters: Chapter[];
}

export const ALL_BOOKS: BookItem[] = [
  {
    id: 'subtle-art',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    totalPages: 224,
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
    category: 'Self-Growth',
    year: 2016,
    rating: '4.9',
    readTime: '4.5 hrs',
    badge: '🔥 #1 Trending',
    isMemberExclusive: true,
    synopsis:
      'A counterintuitive guide to living a good life. Manson argues that improving our lives hinges not on turning lemons into lemonade, but on learning to stomach lemons better, accepting human limitations, and choosing what truly matters.',
    tags: ['Mindset', 'Bestseller', 'Self-Growth', 'Real Talk'],
    chapters: [
      {
        number: 1,
        title: "Don't Try",
        subtitle: 'The Feedback Loop from Hell',
        content:
          'Charles Bukowski was an alcoholic, a womanizer, a chronic gambler, a lout, a deadbeat, and on his worst days, a poet. When he finally succeeded, his tombstone read simply: "Don\'t try."\n\nSee, Bukowski didn\'t give a f*ck about being successful in the conventional sense. His genius wasn\'t overcoming insurmountable odds; it was knowing he was a mess, accepting it, and writing about it anyway.\n\nOur culture today is obsessively focused on unrealistically positive expectations: Be happier. Be healthier. Be the absolute best. But when you care too much about everything, you constantly feel entitled to be comfortable and happy all the time, which turns every minor inconvenience into a psychological crisis.\n\nThis is the Feedback Loop from Hell: getting anxious about being anxious, or feeling guilty for feeling angry. The moment you stop giving a f*ck about feeling bad, the feedback loop short-circuits. You say: "I feel like shit, but who cares?" And suddenly, the struggle softens.',
        takeaway:
          'Desiring a positive experience is itself a negative experience. Accepting your negative experience is itself a positive experience. Stop fighting reality.',
      },
      {
        number: 2,
        title: 'Happiness Is a Problem',
        subtitle: 'Choosing Which Struggles You Want',
        content:
          'If I were to ask you, "What do you want out of life?" you would probably say something generic like: "I want to be happy and have a great family and a job I like." But that is so common it doesn\'t mean anything.\n\nA far more interesting question that nobody ever asks is: "What pain do you want in your life? What are you willing to struggle for?"\n\nBecause happiness requires struggle. It grows from solving problems. If you want the athletic body, you have to want the sore muscles, early mornings, and boring meals. If you want the thriving business, you have to want the 60-hour weeks, the financial risk, and the repeated rejections.\n\nTrue happiness occurs only when you find problems you enjoy having and enjoy solving.',
        takeaway:
          'Don’t ask what rewards you want. Ask what struggles and sacrifices you are willing to endure. The results are defined by the costs you embrace.',
      },
      {
        number: 3,
        title: 'You Are Not Special',
        subtitle: 'The Tyranny of Exceptionalism',
        content:
          'Most of us are pretty average at most things we do. Even if you\'re exceptional at one thing—say, playing guitar or doing math—you\'re probably mediocre or worse at almost everything else.\n\nYet the internet and modern media show us only the top 0.0001% of human extremes: the billionaire teenagers, the Olympic champions, the supermodels. This constant barrage makes us feel that being average is a failure.\n\nWhen we believe we must be exceptional, we either become delusional and entitled ("I\'m destined for greatness without doing the work") or depressed and cynical ("I\'m useless because I\'m not famous").\n\nThe quiet acceptance of being ordinary frees you to enjoy the simple pleasures: cooking a meal with friends, reading a good book, helping someone out, and mastering a craft without needing the world’s validation.',
        takeaway:
          'The ticket to emotional health comes from accepting that the vast majority of your life is ordinary—and that is completely fine.',
      },
      {
        number: 4,
        title: 'The Value of Suffering',
        subtitle: 'Good Values vs. Bad Values',
        content:
          'Self-improvement boils down to one question: What are your values? If your values are poor—like pleasure, material success, always being right, or constant positivity—your life will be full of anxiety.\n\nGood values are: 1) Reality-based, 2) Socially constructive, and 3) Immediate and controllable (like honesty, curiosity, and vulnerability).\n\nWhen you prioritize values you can control right now, your problems transform from existential threats into meaningful challenges.',
        takeaway:
          'Upgrade what you measure your life by. When your metrics are internal and honest, no external chaos can shake you.',
      },
    ],
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    totalPages: 320,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
    category: 'Self-Growth',
    year: 2018,
    rating: '4.9',
    readTime: '5.5 hrs',
    badge: '⚡ Bestseller',
    isMemberExclusive: true,
    synopsis:
      'An extremely practical framework for improving every day. James Clear reveals how tiny changes can lead to remarkable results by mastering the four laws of behavior change.',
    tags: ['Productivity', 'Habits', 'Psychology'],
    chapters: [
      {
        number: 1,
        title: 'The Surprising Power of Atomic Habits',
        subtitle: '1% Better Every Day',
        content:
          'It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Improving by 1% isn\'t particularly notable—sometimes it isn\'t even noticeable—but it can be far more meaningful in the long run.\n\nIf you get 1% better each day for one year, you’ll end up thirty-seven times better by the time you’re done. Conversely, if you get 1% worse each day for one year, you’ll decline nearly down to zero.\n\nHabits are the compound interest of self-improvement. You get what you repeat.',
        takeaway:
          'You do not rise to the level of your goals. You fall to the level of your systems.',
      },
      {
        number: 2,
        title: 'How Habits Shape Your Identity',
        subtitle: 'The 2-Step Identity Shift',
        content:
          'The ultimate form of intrinsic motivation is when a habit becomes part of your identity. It’s one thing to say, "I’m the type of person who wants this." It’s something very different to say, "I’m the type of person who IS this."\n\nThe goal is not to read a book, the goal is to become a reader. The goal is not to run a marathon, the goal is to become a runner.\n\nEvery action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, the evidence of your new identity grows.',
        takeaway:
          'Decide the person you want to be, then prove it to yourself with small wins.',
      },
      {
        number: 3,
        title: 'The Four Laws of Behavior Change',
        subtitle: 'Make It Inevitable',
        content:
          'To build good habits:\n1. Make it Obvious (design your environment)\n2. Make it Attractive (pair it with things you love)\n3. Make it Easy (reduce friction, 2-minute rule)\n4. Make it Satisfying (immediate reinforcement)\n\nInvert these laws to break bad habits: Make it invisible, unattractive, difficult, and unsatisfying.',
        takeaway:
          'Environment is the invisible hand that shapes human behavior. Redesign your space to make good habits effortless.',
      },
    ],
  },
  {
    id: 'psych-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    totalPages: 256,
    cover: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400&auto=format&fit=crop',
    category: 'Finance',
    year: 2020,
    rating: '4.8',
    readTime: '4.5 hrs',
    badge: '💎 Finance Pick',
    isMemberExclusive: true,
    synopsis:
      'Doing well with money isn’t necessarily about what you know. It’s about how you behave. Housel shares 19 short stories exploring the strange ways people think about money.',
    tags: ['Finance', 'Psychology', 'Wealth', 'Wisdom'],
    chapters: [
      {
        number: 1,
        title: "No One's Crazy",
        subtitle: 'Your Personal History Shapes Your Choices',
        content:
          'People from different generations, raised by different parents who earned different incomes in different parts of the world, learn vastly different lessons.\n\nSomeone who grew up during the Great Depression thinks about risk and reward in ways that someone raised during a tech boom cannot fathom. Neither is crazy—they just have different lived experiences.\n\nWhen judging other people’s financial decisions, remember: everyone is operating with their own unique mental model of the world.',
        takeaway:
          'Every decision people make with money makes sense to them in that moment based on their unique life story.',
      },
      {
        number: 2,
        title: 'Luck & Risk',
        subtitle: 'The Invisible Forces of Life',
        content:
          'Luck and risk are siblings. They are both the reality that every outcome in life is guided by forces other than individual effort alone.\n\nWhen evaluating success—whether your own or someone else\'s—never assume that 100% of the outcome was skill, and never assume failure was 100% laziness. Respect the power of random variance.',
        takeaway:
          'Be humble when things go well, and be forgiving when things go wrong.',
      },
    ],
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    totalPages: 180,
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop',
    category: 'Philosophy',
    year: 180,
    rating: '4.9',
    readTime: '3.5 hrs',
    badge: '🏛️ Stoic Classic',
    isMemberExclusive: false,
    synopsis:
      'Private journal of the Roman Emperor Marcus Aurelius recorded as personal reminders of humility, duty, resilience, and stoic philosophy.',
    tags: ['Stoicism', 'Philosophy', 'Ancient Rome'],
    chapters: [
      {
        number: 1,
        title: 'At Dawn',
        subtitle: 'Dealing with Difficult People',
        content:
          'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.\n\nBut I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me.',
        takeaway:
          'You have power over your mind—not outside events. Realize this, and you will find strength.',
      },
      {
        number: 2,
        title: 'The Inner Citadel',
        subtitle: 'Finding Serenity Within',
        content:
          'People look for retreats for themselves, in the country, by the coast, or in the hills. There is nowhere that a person can find a more peaceful and trouble-free retreat than in his own mind. So constantly give yourself this retreat, and renew yourself.',
        takeaway:
          'Peace is an internal state, not a geographic destination.',
      },
    ],
  },
  {
    id: 'gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    totalPages: 180,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
    category: 'Classics',
    year: 1925,
    rating: '4.8',
    readTime: '3.5 hrs',
    isMemberExclusive: false,
    synopsis:
      'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway’s interactions with mysterious millionaire Jay Gatsby and Gatsby’s obsession to reunite with his former lover, Daisy Buchanan.',
    tags: ['Jazz Age', 'Tragedy', 'American Dream'],
    chapters: [
      {
        number: 1,
        title: 'In My Younger Years',
        subtitle: 'Advice from a Father',
        content:
          'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. "Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven’t had the advantages that you’ve had."',
        takeaway:
          'Reserving judgements is a matter of infinite hope.',
      },
      {
        number: 2,
        title: 'The Valley of Ashes',
        subtitle: 'Between West Egg and New York',
        content:
          'About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills.',
        takeaway:
          'Behind the glitz of wealth lies the silent machinery of consequence.',
      },
    ],
  },
  {
    id: 'pride',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    totalPages: 279,
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop',
    category: 'Classics',
    year: 1813,
    rating: '4.9',
    readTime: '6.0 hrs',
    isMemberExclusive: false,
    synopsis:
      'The romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Fitzwilliam Darcy, set against the Regency society of rural England.',
    tags: ['Romance', 'Regency', 'Satire'],
    chapters: [
      {
        number: 1,
        title: 'A Truth Universally Acknowledged',
        content:
          'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of someone or other of their daughters.',
        takeaway:
          'First impressions often reveal our own preconceptions rather than the truth of another.',
      },
    ],
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    totalPages: 220,
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3dd44?q=80&w=400&auto=format&fit=crop',
    category: 'Sci-Fi',
    year: 1818,
    rating: '4.7',
    readTime: '4.5 hrs',
    isMemberExclusive: false,
    synopsis:
      'Victor Frankenstein creates a sapient creature in an unorthodox scientific experiment, only to abandon it in horror, with catastrophic results.',
    tags: ['Gothic', 'Sci-Fi Genesis', 'Classic'],
    chapters: [
      {
        number: 1,
        title: 'Letter to Mrs. Saville',
        content:
          'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.',
        takeaway:
          'Ambition unchecked by responsibility invites unforeseen tragedy.',
      },
    ],
  },
  {
    id: 'art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    totalPages: 124,
    cover: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop',
    category: 'Philosophy',
    year: -500,
    rating: '4.9',
    readTime: '2.5 hrs',
    isMemberExclusive: false,
    synopsis:
      'Ancient military treatise detailing strategies, tactics, psychological warfare, and leadership.',
    tags: ['Strategy', 'Leadership', 'Ancient'],
    chapters: [
      {
        number: 1,
        title: 'Laying Plans',
        content:
          'The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.',
        takeaway:
          'The supreme art of war is to subdue the enemy without fighting.',
      },
    ],
  },
];

export const CATEGORIES = ['All', 'Trending', 'Self-Growth', 'Finance', 'Classics', 'Philosophy', 'Sci-Fi'];
