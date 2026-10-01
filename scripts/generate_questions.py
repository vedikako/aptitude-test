"""Build the five test JSON files from the counsellor's question documents."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "data" / "tests"
ROOT.mkdir(parents=True, exist_ok=True)

YES_NO = [{"id": "yes", "label": "Yes"}, {"id": "no", "label": "No"}]
OFTEN = [
    {"id": "often", "label": "Always/Often"},
    {"id": "rarely", "label": "Rarely/Never"},
]
LIKERT = [
    {"id": "agree", "label": "Agree"},
    {"id": "neutral", "label": "Neutral"},
    {"id": "disagree", "label": "Disagree"},
]
SAME = [
    {"id": "same", "label": "Same"},
    {"id": "opposite", "label": "Opposite"},
    {"id": "neither", "label": "Neither"},
]


def opts(labels):
    ids = "abcde"
    return [{"id": ids[i], "label": label} for i, label in enumerate(labels)]


def inv(prefix, prompts):
    questions = []
    for i, item in enumerate(prompts, start=1):
        prompt, scale, reverse = item
        questions.append(
            {
                "id": f"{prefix}-{i:02d}",
                "prompt": prompt,
                "scale": scale,
                "reverse": reverse,
                "options": YES_NO if prefix != "sh" and prefix != "mi" else (OFTEN if prefix == "sh" else LIKERT),
            }
        )
    return questions


# Study habits. reverse=True means Always/Often is the weaker habit.
STUDY = [
    ("I usually spend hours studying the night before an exam.", "examination", True),
    ("I go to class, but I usually doodle, daydream, or fall asleep.", "concentration", True),
    ("I don't know how to select what is important in the text.", "learning", True),
    ("I study whenever I get free time in school.", "learning", False),
    ("I study enough for my test, but when I get there my mind goes blank.", "examination", True),
    ("I rarely change my reading speed in response to the difficulty level of the content.", "learning", True),
    ("I can't express my thoughts on a paper.", "examination", True),
    ("I worry so much about doing well on tests that it hampers with my studying.", "examination", True),
    ("I try to recall the matter after reading it.", "memory", False),
    ("I need to improve my time management.", "learning", True),
    ("I can't sit and study for long periods of time without becoming tired or distracted.", "concentration", True),
    ("I often find myself getting lost in the details of reading, and I have trouble identifying the main ideas.", "memory", True),
    ("I need to improve how I am preparing for and taking tests.", "examination", True),
    ("I need to improve my reading speed.", "learning", True),
    ("I need to improve my writing skills.", "examination", True),
    ("I have scored poorly on a test because I was afraid about the test when I took it.", "examination", True),
    ("I continue my reading in spite of difficulties in understanding the meaning of some words.", "learning", True),
    ("If I spend as much time on my other activities as I want to, I don't have enough time left to study, or when I study enough, I don't have time for other activities.", "learning", True),
    ("I rarely try to study without the radio or TV turned on.", "concentration", True),
    ("When I get to the end of a chapter, I can't remember what I've just read.", "memory", True),
    ("I get less mark on tests even when I think I know the study material well.", "examination", True),
    ("I often wish that I could read faster.", "learning", True),
    ("I usually complete my homework the night before they are due.", "learning", True),
    ("I need to reduce my nervousness about taking tests.", "examination", True),
    ("I do not read silently.", "learning", True),
    ("I spend too much time studying.", "learning", True),
    ("I need to improve my concentration when I am studying.", "concentration", True),
    ("I need to improve my reading comprehension.", "memory", True),
    ("I often study in a disorganized way before the test.", "examination", True),
    ("I can't keep up with my assignments, and then I have to finish them the night before submission.", "learning", True),
    ("When I am asked to write an essay I feel so excited to start writing it.", "learning", False),
    ("I get nervous when test dates are announced.", "examination", True),
    ("In the examination, I read the entire question paper carefully in the beginning.", "examination", False),
]

# Learning style. reverse=True means Yes does not indicate that style.
LEARNING = [
    ("I remember things better if I hear them", "auditory", False),
    ("I remember things better if I write them down", "kinesthetic", False),
    ("I hate listening to instructions – I'd rather have a go", "kinesthetic", False),
    ("I work better if I'm not alone", "auditory", False),
    ("When I think of spellings I picture them in my head", "visual", False),
    ("I sometimes take notes but I never use them", "kinesthetic", False),
    ("I like to discuss things before I start to work", "auditory", False),
    ("I have to look at someone when they speak to me", "visual", False),
    ("I use my hands to describe things", "kinesthetic", False),
    ("I find it difficult to concentrate when there's a noise", "auditory", False),
    ("I would rather hear new things than read about them", "auditory", False),
    ("I like to act and do drama", "kinesthetic", False),
    ("I like reading out loud", "auditory", False),
    ("I like looking at maps and pictures", "visual", False),
    ("I don't like sitting still", "kinesthetic", False),
    ("I sometimes look out of the window even though I am listening", "visual", False),
    ("I am not very good at remembering jokes", "auditory", True),
    ("I like to walk around when I'm working", "kinesthetic", False),
    ("I like to doodle and make notes when I learn something new", "visual", False),
    ("I love doing crosswords and word searches", "visual", False),
    ("I don't like working on more than one task at a time", "visual", False),
    ("My desk looks messy to everyone else but I know where things are", "kinesthetic", False),
    ("I am good at thinking of ideas in my head", "visual", False),
    ("I don't mind noise when I work", "auditory", True),
    ("I remember people's faces", "visual", False),
    ("I remember people's voices", "auditory", False),
    ("I like to talk out loud when I'm working", "auditory", False),
    ("I like to make lists", "visual", False),
    ("I love telling jokes", "auditory", False),
    ("When I get a new idea I like to write it down or draw a picture", "visual", False),
    ("I like to plan my work in my head before I begin", "visual", False),
    ("I like learning the words of songs and rhymes", "auditory", False),
    ("I like reading and writing poetry", "visual", False),
    ("I like to work on projects and designing things", "kinesthetic", False),
    ("It sometimes takes me a while to get started on a new project", "kinesthetic", False),
    ("I remember things by hearing them in my head", "auditory", False),
    ("I learn a practical skill best by watching someone do it", "visual", False),
    ("I hate checking my work after I have finished", "kinesthetic", False),
    ("I find it hard to picture things in my head", "visual", True),
]

# Adjustment. reverse=True means Yes is a sign of comfort, so it does not add a difficulty point.
ADJUST = [
    ("Do you day-dream frequently?", "emotional", False),
    ("Do you enjoy social gatherings just to be with people?", "social", True),
    ("Do you like to talk to people at a party?", "social", True),
    ("Do you often have much difficulty in thinking of an appropriate remark to make in group conversation?", "social", False),
    ("Does criticism disturb you greatly?", "emotional", False),
    ("Do you often feel lonesome, even when you are with people?", "emotional", False),
    ("In school is it difficult for you to give an oral presentation before the class?", "educational", False),
    ("Have you lost weight recently?", "emotional", False),
    ("Do you find it easy to ask others for help?", "social", True),
    ("Are you easily moved to tears?", "emotional", False),
    ("Are you troubled with shyness?", "emotional", False),
    ("Would you feel very self-conscious if you had to volunteer an idea to start a discussion in the classroom?", "educational", False),
    ("Have you frequently been depressed because of low marks in school?", "educational", False),
    ("Have you frequently known the answer to a question in class but failed when called upon because you were afraid to speak out before the class?", "educational", False),
    ("Do you get discouraged easily?", "emotional", False),
    ("Have you frequently quarreled with your brothers or sisters?", "emotional", False),
    ("Do you get angry easily?", "emotional", False),
    ("Do you find it very difficult to speak in public?", "educational", False),
    ("Are you troubled with feelings of inferiority?", "emotional", False),
    ("Do you enjoy social dancing a great deal?", "social", True),
    ("Do you often feel self-conscious because of your personal appearance?", "emotional", False),
    ("Are you sometimes the leader in your friend circle?", "social", True),
    ("Are your feelings easily hurt?", "emotional", False),
    ("Do you ever cross the street to avoid meeting some body?", "social", False),
    ("Do you make friends readily?", "social", True),
    ("Are you often the centre of favorable attention at a party?", "social", True),
    ("Do you find that you tend to have a few very close friends rather than many casual acquaintances?", "social", False),
    ("Do you keep in the background on social occasions?", "social", False),
    ("Does it upset you considerably to have a teacher call on you unexpectedly?", "educational", False),
    ("Do you find it difficult to start a conversation with stranger?", "social", False),
    ("Have you frequently been absent from school because any reason there than illness?", "educational", False),
    ("Do you like to participate in festival gatherings and make \"whoopee\"?", "social", True),
    ("Do you feel self-conscious when you recite in class?", "educational", False),
    ("Do you hesitate to volunteer in a class recitation?", "educational", False),
    ("Does it frighten you to be alone in the dark?", "emotional", False),
    ("Does other activities like sports or drama are more interesting that studies?", "educational", False),
]

# Multiple intelligence. (scale, reverse) for questions 1-80 in order.
MI_META = [
    ("word", False), ("logic", False), ("picture", False), ("body", False), ("music", False),
    ("body", False), ("self", False), ("nature", False), ("word", False), ("logic", False),
    ("picture", False), ("body", False), ("music", False), ("people", False), ("self", False),
    ("nature", False), ("word", False), ("logic", False), ("picture", False), ("body", False),
    ("music", False), ("people", False), ("self", False), ("picture", False), ("word", False),
    ("logic", False), ("picture", False), ("nature", False), ("music", False), ("people", False),
    ("people", False), ("nature", False), ("word", False), ("logic", False), ("logic", False),
    ("body", False), ("music", False), ("people", False), ("self", False), ("nature", False),
    ("word", False), ("logic", False), ("picture", True), ("body", False), ("music", True),
    ("self", False), ("people", False), ("nature", False), ("word", False), ("logic", False),
    ("picture", False), ("body", False), ("music", False), ("people", False), ("self", False),
    ("nature", True), ("word", True), ("logic", False), ("picture", False), ("body", True),
    ("music", False), ("people", False), ("self", False), ("nature", False), ("word", False),
    ("logic", True), ("picture", False), ("body", False), ("music", True), ("people", False),
    ("people", False), ("nature", False), ("word", True), ("self", False), ("picture", False),
    ("body", True), ("music", False), ("self", False), ("self", False), ("nature", True),
]
MI_PROMPTS = [
    "I am good at word games, like scrabble and crossword.",
    "Numbers are really interesting for me.",
    "I like drawing and painting.",
    "I play at least one sport or physical activity on a regular basis.",
    "I like to sing.",
    "I prefer team sports rather than individual sport.",
    "I keep a personal diary to write down my thoughts and feelings.",
    "I really like to go backpacking and hiking.",
    "I enjoy playing tongue twisters and rhymes with my friends.",
    "I like to do science experiments.",
    "I prefer to read when there are pictures.",
    "I like working with my hands to build or make things (like sewing, model building etc).",
    "I play a musical instrument.",
    "I like to get involved in social activities at my school or in the society.",
    "I have hobbies or play sports that involve only me.",
    "My pet is one of my best friends.",
    "English and social studies are my favorite subjects.",
    "Maths and science are my favorite subjects.",
    "I like taking pictures.",
    "I enjoy amusement rides and other thrilling experiences.",
    "I have an impressive collection of music.",
    "I would rather go to a party or social gathering than sit at home by myself.",
    "I am ambitious and confident in my own abilities.",
    "I like watching nature documentaries.",
    "I like using fancy words.",
    "I easily remember facts, figures and formulas.",
    "I can visualize how things could look from a different angle.",
    "I like to spend my free time outdoors.",
    "Singing and music make me happy.",
    "I am a very social person.",
    "On a holiday, I like to go out and meet my friends.",
    "As a kid I really enjoyed catching butterflies and watching insects.",
    "I have a collection of my favorite books.",
    "I like to compare and contrast.",
    "At school, I find algebra easier than geometry.",
    "I learn best by practicing skills, rather than reading about them or having someone show me.",
    "I can sing in tune and can tell when a note is off key.",
    "I learn best by interacting with others.",
    "I prefer quiet, serene places.",
    "I enjoy caring for my house plants.",
    "I have a good vocabulary.",
    "I am good at puzzles, checkers and sudoku.",
    "I prefer to read only text without the distractions of pictures.",
    "I can work out mechanical things and how to fix them.",
    "I will prefer to go to an adventure park than to a musical concert.",
    "I like to spend time alone.",
    "I like to work in a group.",
    "I enjoy working in a garden.",
    "I write for pleasure.",
    "I like to know how things work.",
    "I enjoy jigsaw puzzles and other visual puzzles.",
    "I enjoy challenging experiences and activities.",
    "I am usually singing, whistling or tapping a song.",
    "I like to make new friends.",
    "Social justice issues interest me.",
    "I don't like pets as they make the house dirty.",
    "My vocabulary is very limited.",
    "I enjoy troubleshooting something that isn't working properly.",
    "I can read and interpret maps easily.",
    "I prefer to sit and read rather than spending time outdoors.",
    "Remembering song lyrics is easy for me.",
    "Study groups are very productive for me.",
    "I enjoy individual sports best.",
    "I enjoy visiting national parks and the zoo.",
    "I enjoy reading books and magazines.",
    "I find strategy based games like chess very boring.",
    "If someone reads a story I can vividly imagine the scenes in my head.",
    "I love to dance.",
    "I am not interested in music.",
    "Being the centre of attention makes me happy.",
    "I like to be around people rather than being alone.",
    "It is sad that the number of wild animals is decreasing day by day.",
    "I don't like reading books.",
    "I dislike following a schedule.",
    "I like to make scrapbooks and photo albums.",
    "I do not like outdoor sports.",
    "I remember things by putting them in rhyme.",
    "I prefer to study alone.",
    "When around other people, I keep to myself.",
    "I like to stay indoors rather than outdoors.",
]


def choice_q(qid, prompt, labels, correct, ability, group):
    options = opts(labels)
    return {
        "id": qid,
        "prompt": prompt,
        "ability": ability,
        "correctOptionId": correct,
        "group": group,
        "options": options,
    }


def build_aptitude():
    questions = []
    jumbles = [
        ("Arrange the letters to make a word: E – T – R – A – S – N – T – R – A – U", ["Recommendation", "Reluctant", "Region", "Restaurant", "Relocation"], "d"),
        ("Arrange the letters to make a word: C – S – E – R – U – I – Y – T", ["Security", "Substitute", "Selective", "Sensitive", "Submissive"], "a"),
        ("Arrange the letters to make a word: G – A – L – A – U – G – E – N", ["Luggage", "Longitude", "Language", "Length", "Ligament"], "c"),
        ("Arrange the letters to make a word: O – R – E – P – E – C – U – D – R", ["Procedure", "Precaution", "Pyramid", "Primary", "Preliminary"], "a"),
        ("Arrange the letters to make a word: N – R – I – M – L – I – A – C", ["Criterion", "Criticism", "Crystal", "Criminal", "Commodity"], "d"),
        ("Arrange the letters to make a word: L – O – U – B – N – W – G – A", ["Bundle", "Banquet", "Bungalow", "Bangles", "Bonding"], "c"),
        ("Arrange the letters to make a word: R – O – C – E – T – N – C – E", ["Cement", "Circuit", "Credit", "Concrete", "Constant"], "d"),
        ("Arrange the letters to make a word: U – I – M – Y – A – R – T – T", ["Mercury", "Memory", "Mastery", "Margin", "Maturity"], "e"),
        ("Arrange the letters to make a word: E – D – E – I – N – D – E – N – P – T – N", ["Dependant", "Development", "Independent", "Implement", "Introduction"], "c"),
    ]
    for i, (prompt, labels, correct) in enumerate(jumbles, start=1):
        questions.append(choice_q(f"ap-j-{i:02d}", prompt, labels, correct, "verbal", "Letter jumbles"))

    odds = [
        (["Sun", "Moon", "Venus", "Mars", "Earth"], "b"),
        (["Basket", "Barrel", "Bag", "Bucket", "Barrow"], "e"),
        (["Ink", "Pen", "Pencil", "Brush", "Chalkstick"], "a"),
        (["Asia", "Australia", "America", "Africa", "England"], "e"),
        (["Needle", "Pencil", "Spade", "Candle", "Spoon"], "d"),
        (["Cricket", "Baseball", "Football", "Billiards", "Badminton"], "d"),
        (["Violin", "Guitar", "Sitar", "Veena", "Piano"], "e"),
        (["Camel", "Goat", "Cow", "Sheep", "Dog"], "e"),
        (["House", "Cottage", "School", "Palace", "Hut"], "c"),
        (["Physics", "Chemistry", "Geography", "Botany", "Zoology"], "c"),
        (["Hostel", "Hotel", "Inn", "Club", "Motel"], "d"),
        (["Pineapple", "Orange", "Malta", "Banana", "Lemon"], "d"),
        (["Knife", "Sword", "Gun", "Dagger", "Razor"], "c"),
        (["Explain", "Relate", "Speak", "Sing", "Reveal"], "d"),
        (["Ear", "Lung", "Eye", "Heart", "Kidney"], "a"),
        (["Tailor", "Carpenter", "Blacksmith", "Barber", "Engineer"], "e"),
        (["Photo", "Snap", "Reflection", "Portrait", "Picture"], "c"),
        (["Island", "Coast", "Harbour", "Oasis", "Peninsula"], "d"),
        (["Classfellow", "Colleague", "Companion", "Co-worker", "Neighbour"], "e"),
        (["X-ray", "Telephone", "Radio", "Computer", "Television"], "a"),
    ]
    for i, (labels, correct) in enumerate(odds, start=1):
        questions.append(choice_q(f"ap-o-{i:02d}", "Which one does not belong with the others?", labels, correct, "verbal", "Odd one out"))

    analogies = [
        ("Sailor is to Ship, as Lawyer is to:", ["Legal", "Law", "Court", "Ruling", "Case"], "c"),
        ("Love is to Hate, as Create is to:", ["Make", "Destroy", "Renovate", "Building", "Do"], "b"),
        ("Cow is to Bull, as Mare is to:", ["Animal", "Dog", "Horse", "Meat", "Goat"], "c"),
        ("Camera is to Photo, as Tap is to:", ["Pipe", "Metal", "Height", "Water", "Children"], "d"),
        ("Blood is to Veins, as Pencil is to:", ["Lead", "Write", "Rubber", "Pen", "Eye"], "a"),
        ("Moon is to Satellite, as Earth is to:", ["Sun", "Planet", "Solar System", "Asteroid", "Galaxy"], "b"),
        ("Clock is to Time, as Thermometer is to:", ["Heat", "Radiation", "Energy", "Temperature", "Humidity"], "d"),
        ("Paw is to Cat, as Hoof is to:", ["Horse", "Lion", "Lamb", "Elephant", "Mouse"], "a"),
        ("Scribble is to Write, as Stammer is to:", ["Walk", "Play", "Speak", "Dance", "Run"], "c"),
        ("Gun is to Bullet, as Chimney is to:", ["Ground", "House", "Roof", "Smoke", "Floor"], "d"),
        ("Breeze is to Cyclone, as Drizzle is to:", ["Earthquake", "Storm", "Flood", "Downpour", "Wind"], "d"),
        ("Car is to Garage, as Aeroplane is to:", ["Port", "Depot", "Hangar", "Harbour", "Road"], "c"),
        ("Acting is to Theatre, as Gambling is to:", ["Casino", "Club", "Bar", "Gym", "Pool"], "a"),
        ("Former is to Later, as Elder is to:", ["Older", "Aged", "Younger", "Next", "Tailor"], "c"),
        ("Ocean is to Water, as Glacier is to:", ["Refrigerator", "Ice", "Mountain", "Cave", "Mixer"], "b"),
        ("King is to Throne, as Rider is to:", ["Seat", "Horse", "Saddle", "Chair", "Table"], "c"),
        ("Entry is to Exit, as Permit is to:", ["Prohibit", "Allow", "Plan", "Make", "Hate"], "a"),
        ("Snow is to White, as Coal is to:", ["Train", "Red", "Word", "Black", "Green"], "d"),
        ("Painting is to Artist, as Symphony is to:", ["Novelist", "Poet", "Essayist", "Composer", "Author"], "d"),
        ("Dawn is to Dusk, as Inauguration is to:", ["Invitation", "Farewell", "Repetition", "Organization", "Action"], "b"),
    ]
    for i, (prompt, labels, correct) in enumerate(analogies, start=1):
        questions.append(choice_q(f"ap-a-{i:02d}", prompt, labels, correct, "verbal", "Analogies"))

    numbers = [
        ("There are 30 white balls in the basket. Now 30% of them are replaced by red balls. How many white balls remain?", ["10", "12", "9", "21", "6"], "d"),
        ("Two numbers were added and the square of that sum came to 81. Which pair are those numbers?", ["6 and 3", "4 and 6", "1 and 5", "2 and 6", "3 and 5"], "a"),
        ("A rubber sheet of 4 metres gets stretched to 5 metres when pulled. A pulled rubber sheet measures 25 metres. What was the original size?", ["20", "17", "30", "22", "10"], "a"),
        ("A box of one dozen pencils costs Rs. 12. A set of 3 pens costs Rs. 15. How many pencils can be bought at the cost of one pen?", ["8", "2", "10", "4", "5"], "e"),
        ("In which of the following ways could 182 books be packed?", ["12 boxes with 12 books", "15 boxes with 10 books", "14 boxes with 13 books", "25 boxes with 5 books", "10 boxes with 9 books"], "c"),
        ("In a test, a student attempted 4 questions and secured 40 percent marks. How many questions did he miss?", ["4", "3", "6", "12", "2"], "c"),
        ("A board 11 ft 3 inches long is divided into five equal parts. What is the length of each part?", ["2 ft 3 inches", "3 ft 4 inches", "6 ft 2 inches", "2 ft 4 inches", "4 ft 3 inches"], "a"),
        ("6389 − 1212 − 2828 = ?", ["2493", "2349", "2934", "2394", "2244"], "b"),
        ("Find the average of all prime numbers between 12 and 20.", ["15.33", "17.33", "13.33", "14.33", "16.33"], "e"),
        ("A man buys a toy for Rs. 100 and sells it for Rs. 150. His gain percent is:", ["40%", "50%", "45%", "15%", "25%"], "b"),
    ]
    for i, (prompt, labels, correct) in enumerate(numbers, start=1):
        questions.append(choice_q(f"ap-n-{i:02d}", prompt, labels, correct, "numerical", "Numerical problems"))

    pairs = [
        ("Omit …… Exit", "neither"),
        ("Victory …… Defeat", "opposite"),
        ("Calm …… Peaceful", "same"),
        ("Diminish …… Lesson", "neither"),
        ("Harsh …… Severe", "same"),
        ("Candid …… Frank", "same"),
        ("Relate …… Narrate", "same"),
        ("Mingle …… Mix", "same"),
        ("Obvious …… Evident", "same"),
        ("Dynamic …… Apathetic", "opposite"),
        ("Bliss …… Happiness", "same"),
        ("Check …… Mend", "neither"),
        ("Damage …… Harm", "same"),
        ("Attack …… Defend", "opposite"),
        ("Misery …… Sorrow", "same"),
        ("Kind …… Neat", "neither"),
        ("Pardon …… Forgive", "same"),
        ("Accept …… Reject", "opposite"),
        ("Static …… Near", "neither"),
        ("Familiar …… Strange", "opposite"),
        ("Generous …… Liberal", "same"),
        ("Conceal …… Reveal", "opposite"),
        ("Bright …… Close", "neither"),
        ("Splendid …… Grand", "same"),
        ("Major …… Minor", "opposite"),
        ("Elegant …… Graceful", "same"),
        ("Lively …… Active", "same"),
        ("Divine …… Famous", "neither"),
        ("Humble …… Proud", "opposite"),
        ("Lead …… Follow", "opposite"),
        ("Liberty …… Freedom", "same"),
        ("Plentiful …… Ample", "same"),
        ("Loyal …… Faithful", "same"),
        ("Quick …… Nice", "neither"),
        ("Rigid …… Flexible", "opposite"),
        ("Special …… Sad", "neither"),
        ("Natural …… Artificial", "opposite"),
        ("Optimism …… Pessimism", "opposite"),
        ("Pleasure …… Pain", "opposite"),
        ("Pure …… Great", "neither"),
    ]
    for i, (prompt, correct) in enumerate(pairs, start=1):
        questions.append(
            {
                "id": f"ap-s-{i:02d}",
                "prompt": prompt,
                "ability": "verbal",
                "correctOptionId": correct,
                "group": "Same, opposite, or neither",
                "options": SAME,
            }
        )

    series = [
        ("25, 20, 15, 10, (?)", ["30", "12", "5", "35", "40"], "c"),
        ("A10, C30, (?), G70, I90", ["E50", "D50", "D60", "E60", "F50"], "a"),
        ("Z-A, Y-B, X-C, W-D, (?)", ["E-V", "V-E", "Y-D", "A-W", "V-B"], "b"),
        ("11.9, 10.8, 9.7, 8.6, (?)", ["10.7", "6.8", "5.7", "4.5", "7.5"], "e"),
        ("201, (?), 221, 231, 241", ["234", "211", "311", "111", "223"], "b"),
        ("H, J, M, (?), V", ["P", "S", "Q", "K", "W"], "c"),
        ("(?), 18, 27, 36, 45", ["9", "12", "5", "2", "11"], "a"),
        ("B, E, H, K, (?)", ["L", "E", "D", "N", "P"], "d"),
        ("60, 52, 44, (?), 28", ["32", "36", "42", "30", "26"], "b"),
        ("9, 16, 25, 36, (?), 64", ["49", "56", "34", "12", "81"], "a"),
        ("120, 135, 150, 165, (?), 195", ["280", "180", "185", "175", "160"], "b"),
        ("3, 5, 8, 11, 14, 17, (?), 23", ["22", "21", "18", "24", "20"], "e"),
        ("7, 10, 9, 12, 11, (?), (?)", ["14, 13", "13, 12", "12, 11", "15, 14", "12, 14"], "a"),
        ("3, 7, 16, 35, (?)", ["70", "71", "73", "74", "72"], "d"),
        ("DG, HK, LO, PS, TW, (?)", ["ZA", "XB", "XA", "WA", "YA"], "c"),
        ("121, 144, 169, 196, 225, 256, (?)", ["389", "269", "279", "349", "289"], "e"),
        ("A3C, F5H, K8M, P11R, (?)", ["S12T", "U14W", "T14S", "R14S", "U12V"], "b"),
        ("10, 22, 28, 42, 48, 62, (?)", ["68", "72", "70", "74", "64"], "a"),
    ]
    for i, (prompt, labels, correct) in enumerate(series, start=1):
        questions.append(choice_q(f"ap-r-{i:02d}", f"What comes next? {prompt}", labels, correct, "numerical", "Number and letter series"))
    return questions


def dump(name, payload):
    path = ROOT / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(name, sum(len(g["questions"]) for g in payload["groups"]))


def main():
    assert len(MI_PROMPTS) == 80 and len(MI_META) == 80
    counts = {}
    for scale, _ in MI_META:
        counts[scale] = counts.get(scale, 0) + 1
    print("mi counts", counts)
    if any(v != 10 for v in counts.values()) or len(counts) != 8:
        raise SystemExit(f"MI scales must be 10 each, got {counts}")

    dump(
        "study-habits.json",
        {
            "key": "study_habits",
            "title": "Study habits",
            "minutes": 15,
            "instructions": "These statements are about how you study. For each one, choose Always/Often or Rarely/Never. There is no right or wrong answer. You have 15 minutes.",
            "groups": [{"title": "Statements", "questions": inv("sh", STUDY)}],
        },
    )
    dump(
        "learning-style.json",
        {
            "key": "learning_style",
            "title": "Learning style",
            "minutes": 15,
            "instructions": "Every question is a statement. Choose Yes or No. There is no right or wrong answer. Your honest answer is the useful one. You have 15 minutes.",
            "groups": [{"title": "Statements", "questions": inv("ls", LEARNING)}],
        },
    )
    dump(
        "aptitude.json",
        {
            "key": "aptitude",
            "title": "Aptitude",
            "minutes": 45,
            "instructions": "This test measures how you work with words and numbers. Choose the best answer. If you are unsure, mark your best guess. Reading passages from the source paper had no recoverable questions, so that set is not included. You have 45 minutes for the whole test.",
            "groups": [],
        },
    )
    aptitude = json.loads((ROOT / "aptitude.json").read_text(encoding="utf-8"))
    grouped = {}
    for q in build_aptitude():
        grouped.setdefault(q.pop("group"), []).append(q)
    aptitude["groups"] = [{"title": title, "questions": qs} for title, qs in grouped.items()]
    (ROOT / "aptitude.json").write_text(json.dumps(aptitude, ensure_ascii=False, indent=2), encoding="utf-8")
    print("aptitude", sum(len(g["questions"]) for g in aptitude["groups"]))

    dump(
        "adjustment.json",
        {
            "key": "adjustment",
            "title": "Adjustment",
            "minutes": 25,
            "instructions": "Answer Yes or No from your own experience. This looks at feelings, school life, and getting along with people. You have 25 minutes.",
            "groups": [{"title": "Statements", "questions": inv("ad", ADJUST)}],
        },
    )
    mi_items = []
    for i, prompt in enumerate(MI_PROMPTS):
        scale, reverse = MI_META[i]
        mi_items.append((prompt, scale, reverse))
    dump(
        "multiple-intelligence.json",
        {
            "key": "multiple_intelligence",
            "title": "Multiple intelligence",
            "minutes": 20,
            "instructions": "Each question is a statement. Choose Agree, Neutral, or Disagree based on what you actually think, not what you wish were true. You have 20 minutes.",
            "groups": [{"title": "Statements", "questions": inv("mi", mi_items)}],
        },
    )


if __name__ == "__main__":
    main()
