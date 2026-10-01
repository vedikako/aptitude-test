export type Depth = "high" | "mid" | "low";

export function depthFor(rating: string): Depth {
  if (["Very good", "Good", "Excellent", "Above average"].includes(rating)) return "high";
  if (rating === "Average") return "mid";
  return "low";
}

export function intelligenceDepth(score: number, max: number): Depth {
  const ratio = max === 0 ? 0 : score / max;
  if (ratio >= 0.7) return "high";
  if (ratio >= 0.45) return "mid";
  return "low";
}

export function depthWord(depth: Depth) {
  if (depth === "high") return "Strong";
  if (depth === "mid") return "Steady";
  return "Quieter";
}

type AreaCopy = {
  meaning: string;
  reads: Record<Depth, string>;
  tips: Record<Depth, string[]>;
};

export const studyCopy: Record<string, AreaCopy> = {
  learning: {
    meaning:
      "Learning technique is the way a student prepares, reads, and keeps hold of a lesson. It is less about sitting for longer and more about whether the time spent actually sticks.",
    reads: {
      high: "The answers show a student who already has a workable way of studying. The next step is to keep that routine when the syllabus gets heavier, not to invent a new one.",
      mid: "Some useful methods are in place, and some days still depend on mood or a last-minute push. A short written plan would make the good days more repeatable.",
      low: "Studying is happening, but the method is costing more effort than it needs to. A smaller daily target will help more than a longer evening at the desk.",
    },
    tips: {
      high: [
        "Keep a short list of what must be finished today, and stop when that list is done.",
        "Teach one idea aloud after reading it. If it can be explained, it has been learned.",
        "Protect the routine that already works, including sleep before a heavy school day.",
      ],
      mid: [
        "Write three study tasks the night before, and begin with the hardest of the three.",
        "Read a section, close the book, and note the main point in one sentence.",
        "Review yesterday's notes for ten minutes before starting new work.",
      ],
      low: [
        "Study in a 25-minute block, then stand up for five minutes, then return.",
        "Keep the desk clear of the phone and of other subjects.",
        "Ask a teacher which one topic is worth repairing first, and stay with that topic for a week.",
      ],
    },
  },
  memory: {
    meaning:
      "Memory here means being able to store a fact or a method and bring it back when a class, a homework question, or a test asks for it.",
    reads: {
      high: "Recall looks reliable. The student can use revision to connect ideas, rather than to rescue forgotten ones.",
      mid: "Some material returns easily and some fades after a day. Spaced revision, not more first-time reading, is the useful change.",
      low: "A lot of what is read is not available later. Short, repeated recall will do more than rereading the same page.",
    },
    tips: {
      high: [
        "Turn notes into questions and answer them without looking.",
        "Link a new fact to one example from class so it has a place to live.",
        "Revisit a topic after two days, then after a week.",
      ],
      mid: [
        "Close the book and write five things you remember before checking.",
        "Use a small card for formulas or dates, and shuffle the cards.",
        "Explain the lesson to a classmate in your own words.",
      ],
      low: [
        "Learn one small set of facts, recall it the same evening, and again the next morning.",
        "Say the steps of a method out loud while doing one example.",
        "Do not highlight whole paragraphs. Mark only the line you must be able to say back.",
      ],
    },
  },
  examination: {
    meaning:
      "Examination technique is how a student uses the paper itself: reading the questions, choosing an order, dividing time, and checking answers before the sheet is given in.",
    reads: {
      high: "The student already treats an exam as a plan, not only as a memory test. Keep that calm order when the paper looks unfamiliar.",
      mid: "Preparation and performance do not always match. Time, question choice, or a rushed first reading is the likely gap.",
      low: "Marks may be lost in the way the paper is attempted, even when the student knows more than the answer sheet shows.",
    },
    tips: {
      high: [
        "Spend the first few minutes reading the whole paper and marking the questions to attempt first.",
        "Leave a few minutes at the end to check units, signs, and unfinished lines.",
        "After a paper, note which marks were lost to method rather than to knowledge.",
      ],
      mid: [
        "Attempt the questions you can finish cleanly before the ones that feel impressive.",
        "If a question stalls, leave a mark in the margin and move on.",
        "Practise one old paper with a clock, not only with the answer key.",
      ],
      low: [
        "Read the instruction line of every question before writing.",
        "Give each section a rough time limit and stick to it.",
        "Write the method even when the final number is unsure. Partial work can still earn marks.",
      ],
    },
  },
  concentration: {
    meaning:
      "Concentration is the ability to stay with one task and set aside the thoughts, noises, and devices that pull attention away.",
    reads: {
      high: "Attention holds for a normal study stretch. The useful habit is to notice the first drift and return, instead of starting the page again.",
      mid: "Focus comes and goes. The student can work well in a quiet stretch and lose the thread when the setting is busy.",
      low: "Attention is breaking up the study session. Shorter, cleaner blocks will beat a long sitting that keeps restarting.",
    },
    tips: {
      high: [
        "Work on one subject at a time, and put the other books out of sight.",
        "If attention slips, mark the line and restart from there rather than from the top.",
        "Keep a fixed place for study so the room itself becomes a cue to begin.",
      ],
      mid: [
        "Put the phone in another room for the length of one chapter.",
        "Study the hardest subject when the house is quietest.",
        "Use a simple timer and stop when it rings, even if you want to continue.",
      ],
      low: [
        "Start with ten focused minutes. Increase the block only after three days of keeping it.",
        "Tell the family the start and end time so interruptions have a boundary.",
        "If the mind is too restless to read, copy one worked example slowly before trying a new one.",
      ],
    },
  },
};

export const styleCopy: Record<
  string,
  { meaning: string; traits: string[]; tips: string[] }
> = {
  visual: {
    meaning:
      "A visual learner holds an idea more firmly when it can be seen: a diagram, a layout on the page, a colour, or a picture of how the parts fit.",
    traits: [
      "Notices layout, diagrams, and small differences on a page.",
      "Remembers a chart or a board more easily than a long spoken explanation.",
      "Likes to see the whole topic before filling in the details.",
    ],
    tips: [
      "Turn a chapter into a one-page map with arrows between the main ideas.",
      "Use a consistent colour for definitions and another for examples.",
      "Cover the labels on a diagram and try to put them back from memory.",
    ],
  },
  auditory: {
    meaning:
      "An auditory learner holds an idea more firmly when it is heard or said: a teacher's explanation, a discussion, or the student's own voice repeating the point.",
    traits: [
      "Follows a spoken explanation more easily than a silent page.",
      "Remembers discussions, rhymes, and things said aloud.",
      "Often sorts a problem out by talking it through.",
    ],
    tips: [
      "Read important lines aloud, then say them again with the book closed.",
      "Study with one classmate and take turns asking the questions.",
      "Record a two-minute summary of a topic and listen to it the next day.",
    ],
  },
  kinesthetic: {
    meaning:
      "A kinesthetic learner holds an idea more firmly by doing it: writing, building, moving, or working an example by hand rather than only watching it.",
    traits: [
      "Learns faster from a worked example than from a definition alone.",
      "Uses movement or hands-on practice to stay with a task.",
      "Remembers what was tried, not only what was read.",
    ],
    tips: [
      "Write the steps of a method while saying them, then do two examples.",
      "Stand or walk for the short break, then sit and finish the next question.",
      "Make small cards or a model when a topic stays abstract on the page.",
    ],
  },
};

export const intelligenceCopy: Record<
  string,
  { meaning: string; traits: string[]; practice: string[] }
> = {
  people: {
    meaning:
      "People intelligence is the ease of reading another person's mood, working in a group, and explaining an idea so that someone else can use it.",
    traits: [
      "Comfortable starting a conversation or helping a classmate along.",
      "Notices when a group is stuck and often steps in.",
      "Learns well by teaching, discussing, or planning with others.",
    ],
    practice: [
      "Explain today's class to a younger student or a parent in plain language.",
      "Take a small role in a group task, such as keeping the group on the question.",
      "After a disagreement, name what the other person seemed to want.",
    ],
  },
  picture: {
    meaning:
      "Picture intelligence is the ease of thinking in images: seeing how something looks, how it changes, and how the parts sit in space.",
    traits: [
      "Can picture a description instead of needing every detail written out.",
      "Drawn to drawing, design, maps, or geometry.",
      "Spots a pattern on a page before reading every word.",
    ],
    practice: [
      "Sketch a process before writing the paragraph about it.",
      "Use a map, a timeline, or a labelled figure in revision.",
      "Look at one object and describe it from another side.",
    ],
  },
  music: {
    meaning:
      "Music intelligence is the ease of noticing pitch, rhythm, and pattern in sound, and of using that sense while learning.",
    traits: [
      "Sensitive to tune, beat, and the sound of language.",
      "May remember a fact more easily when it has a rhythm.",
      "Often notices background sound that others filter out.",
    ],
    practice: [
      "Put a short list of facts into a simple rhythm and repeat it.",
      "Study with quiet instrumental sound if silence is distracting, and with silence if the sound takes over.",
      "Listen for the pattern in a poem, a language drill, or a number sequence.",
    ],
  },
  self: {
    meaning:
      "Self intelligence is the ease of knowing one's own effort, mood, and limits, and of using that knowledge to choose the next step.",
    traits: [
      "Has a clear sense of what feels interesting and what feels forced.",
      "Can work alone without needing constant direction.",
      "Notices when tiredness or worry is changing the quality of the work.",
    ],
    practice: [
      "End the day by writing one thing that went well and one thing to repeat tomorrow.",
      "Set a target you can actually finish, then notice how it felt.",
      "When work stalls, name the feeling first, then choose a ten-minute task.",
    ],
  },
  word: {
    meaning:
      "Word intelligence is the ease of using language: reading closely, choosing words, and putting a thought in an order someone else can follow.",
    traits: [
      "Enjoys stories, precise words, or a well-made argument.",
      "Can retell a lesson in sentences rather than only in keywords.",
      "Notices wording in a question, not only the numbers in it.",
    ],
    practice: [
      "Write a five-line summary after each chapter.",
      "Learn one new word from the day's lesson and use it once.",
      "Read a question twice and underline the word that tells you what to do.",
    ],
  },
  logic: {
    meaning:
      "Logic intelligence is the ease of seeing a rule, a sequence, or a cause, and of checking whether a conclusion actually follows.",
    traits: [
      "Likes to know why a method works, not only the final answer.",
      "Spots what does not fit in a set of facts or numbers.",
      "Comfortable breaking a problem into steps.",
    ],
    practice: [
      "Solve one puzzle or number pattern a few times a week.",
      "Write the reason for each step in a maths or science answer.",
      "Ask what would change the result after a worked example.",
    ],
  },
  nature: {
    meaning:
      "Nature intelligence is the ease of noticing living things, outdoor patterns, and how one change in an environment leads to another.",
    traits: [
      "Pays attention to animals, plants, weather, or how a place is organised.",
      "Remembers classification and real examples more than abstract lists.",
      "Learns well when a topic is tied to something observed.",
    ],
    practice: [
      "Connect a science lesson to one thing you can see at home or outside.",
      "Sort examples into groups and say what the groups have in common.",
      "Keep a short note of one observation each week and what it might mean.",
    ],
  },
  body: {
    meaning:
      "Body intelligence is the ease of using movement, balance, and hands-on coordination, and of learning while physically doing the task.",
    traits: [
      "Learns a skill faster by trying it than by watching it described.",
      "Uses gesture, sport, craft, or making to stay engaged.",
      "Remembers a procedure that the hands have practised.",
    ],
    practice: [
      "Build, act out, or physically arrange the parts of a topic.",
      "Take the break as a short walk, then return to the same question.",
      "Practise a lab step or a diagram by drawing it from scratch.",
    ],
  },
};

export const aptitudeCopy: Record<string, AreaCopy> = {
  verbal: {
    meaning:
      "Verbal reasoning is the ability to work with words: to see how ideas relate, to choose the sense of a pair of words, and to follow a written argument.",
    reads: {
      high: "Word-based questions were handled with confidence. Reading, languages, and subjects that depend on precise wording are a comfortable route for this student.",
      mid: "Word-based questions were manageable, with room to be more exact. Slowing down on the meaning of the question will lift the score more than reading faster.",
      low: "Word-based questions were the harder set. The student will gain more from short daily practice with meanings and relationships than from long, rare sessions.",
    },
    tips: {
      high: [
        "Read one editorial or story and write the argument in three sentences.",
        "Collect pairs of words that are similar and pairs that are opposite.",
        "When a question feels easy, still check the option that is almost right.",
      ],
      mid: [
        "Underline the two words that carry the question before looking at the options.",
        "Keep a notebook of words met in class, with a plain meaning beside each.",
        "Do a small set of analogy or odd-one-out items and review every miss.",
      ],
      low: [
        "Start with single-word meanings before attempting long comparisons.",
        "Say each option aloud and ask whether it really matches the clue.",
        "Practise ten items, check them the same day, and repeat the ones that were wrong.",
      ],
    },
  },
  numerical: {
    meaning:
      "Numerical reasoning is the ability to work with quantities, patterns, and the steps of a calculation, and to see which number should come next.",
    reads: {
      high: "Number questions were a clear strength. The student can trust the method and still check the arithmetic, because small slips are the usual way a strong score falls.",
      mid: "Number questions were within reach. Accuracy and choosing the right operation matter more, at this stage, than speed.",
      low: "Number questions need a calmer base. Tables, signs, and one-step problems should come before longer word problems.",
    },
    tips: {
      high: [
        "After solving, estimate whether the size of the answer is sensible.",
        "Try a pattern question by saying the rule before writing the next term.",
        "Keep one mixed practice set each week so the skill stays sharp.",
      ],
      mid: [
        "Write the operation you intend before calculating.",
        "Practise tables out of order, not only as a chant from 1.",
        "Redo every incorrect sum until the step that failed is obvious.",
      ],
      low: [
        "Spend ten minutes a day on addition, subtraction, multiplication, and division.",
        "Read a word problem and write only what is asked, before any calculation.",
        "Use one worked example as a model, then change the numbers and solve it again.",
      ],
    },
  },
};

export const adjustmentCopy: Record<string, AreaCopy & { rangeNote: string }> = {
  emotional: {
    meaning:
      "Emotional adjustment looks at how steadily a student handles worry, anger, sadness, and the ordinary ups and downs of this age. On this test a lower score is the more settled picture, because the score counts answers that signal difficulty.",
    rangeNote: "Above average is a score of 0 to 4. Average is 5 to 8. A higher score is read as below average.",
    reads: {
      high: "Few answers pointed to emotional strain. The student seems able to settle after a hard moment. That is a strength to protect, not a reason to ignore a bad week.",
      mid: "Some answers pointed to strain and many did not. This is a common picture at class 9. It is worth noticing which situations cost the most energy.",
      low: "More answers pointed to worry, guilt, or a quick emotional reaction. This is a signal for a calm conversation with a parent or counsellor. It is not a label, and it is not a measure of character.",
    },
    tips: {
      high: [
        "Keep one adult who hears the ordinary day, not only the crisis.",
        "When something stings, pause before answering.",
        "Treat a poor mark as information about the work, not about the person.",
      ],
      mid: [
        "Name the feeling in one word before trying to fix the problem.",
        "Keep sleep and meals steady in exam weeks. Mood follows the body.",
        "If the same worry returns for several days, tell a parent or teacher early.",
      ],
      low: [
        "Choose one trusted adult and one regular time to talk, rather than holding it all in.",
        "Reduce one pressure at a time. A smaller homework target is better than a speech about toughness.",
        "If sadness, fear, or anger is getting in the way of school or sleep, ask the school counsellor for support.",
      ],
    },
  },
  educational: {
    meaning:
      "Educational adjustment looks at how the student is living with school: homework, teachers, marks, and the feeling of being able to cope with the work. A lower score means fewer answers that signal strain in school.",
    rangeNote: "Above average is a score of 0 to 3. Average is 4 to 6. A higher score is read as below average.",
    reads: {
      high: "School currently looks manageable. The student is meeting the work without the answers showing a strong wish to withdraw from it.",
      mid: "School is mostly workable, with some friction around load, marks, or interest. A small change in routine will help more than a complete new plan.",
      low: "Several answers suggest the school load feels heavy or discouraging. Look at sleep, the hardest subject, and whether help has actually been asked for.",
    },
    tips: {
      high: [
        "Keep the subjects that feel easy from crowding out the one that needs practice.",
        "Ask a question in class when a step is unclear. Waiting usually makes the gap wider.",
        "Use the current ease to build a revision habit before the next exam.",
      ],
      mid: [
        "Pick the subject that causes the most avoidance and schedule it first.",
        "Show a teacher one piece of work and ask what to improve, not only what mark it would get.",
        "Break homework into a start time and a stop time.",
      ],
      low: [
        "Tell a parent which subject feels heaviest, and arrange one extra explanation this week.",
        "Do not add tuition for every subject at once. Repair the weakest one.",
        "If school refusal, tears, or stomach aches are appearing on school mornings, treat that as a reason to talk to the school.",
      ],
    },
  },
  social: {
    meaning:
      "Social adjustment looks at how the student fits with classmates, friendship, and the ordinary rules of getting along. A lower score means fewer answers that signal difficulty with other people.",
    rangeNote: "Above average is a score of 0 to 4. Average is 5 to 9. A higher score is read as below average.",
    reads: {
      high: "Friendship and classroom company look reasonably comfortable. The student can join in without the answers showing a strong sense of being on the outside.",
      mid: "Social life is mixed, which is ordinary. Some settings feel easy and some take more effort. Manners and one reliable friendship matter more than being popular.",
      low: "More answers suggest friction, loneliness, or trouble reading the group. This deserves a private conversation. It should not be answered with a request to just be confident.",
    },
    tips: {
      high: [
        "Keep a habit of including someone who is standing at the edge of a group.",
        "Confidence is useful. Speaking over others is not the same thing.",
        "Notice the difference between a joke and a remark that leaves someone smaller.",
      ],
      mid: [
        "Practise one polite start: a greeting, a question, or an offer to share a task.",
        "Stay with friends who are steady, even if they are not the loudest group.",
        "If a comment online would not be said in the room, leave it unsent.",
      ],
      low: [
        "Identify one classmate or club where the student does not have to perform.",
        "Ask a teacher to watch the specific situation, if unkindness is repeating.",
        "Parents can help by listening to the story before advising the student to ignore it.",
      ],
    },
  },
};

export const studentTips = [
  "You are at an age when school, friends, and your own body are all changing at once. A hard week does not decide the next five years.",
  "Use the stronger areas in this report as the way you study. Use the quieter areas as practice, not as a verdict.",
  "Sleep, food, and a phone that is not on the desk will change your marks more reliably than a new timetable poster.",
  "Ask a teacher or a parent when a subject stops making sense. Waiting until the exam makes the gap look like a lack of ability.",
  "Choose one activity outside class that you actually like. It teaches you to stay with something that is not only for a mark.",
  "Be careful with dares that involve tobacco, alcohol, or anything else that is sold as a shortcut to confidence. They cost more than they give.",
  "Compare today's work with last month's work. The useful contest is with your own previous paper.",
];

export const parentNotes = {
  do: [
    "Ask what the student understood, not only what mark came home.",
    "Set a target the student can reach this week, then raise it after it is met.",
    "Stay available during exams without taking over the revision.",
    "Let the student try, fail a small task, and correct it. That is how judgement grows.",
    "Keep basics in place: sleep, breakfast, and a predictable start to the school day.",
  ],
  avoid: [
    "Do not call the student lazy, average, or brilliant as if the word were a fact.",
    "Do not compare this child with a cousin, a neighbour, or the topper of the class.",
    "Do not complete the homework yourself. Sit nearby if help is needed, and let the student hold the pen.",
    "Do not add classes for every subject in the same month.",
    "Do not treat one test, including this one, as a final picture of the child.",
  ],
};
