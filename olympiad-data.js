// =====================================================
// OLYMPIAD PREP — procedurally generated SOF-style practice questions
// for Reasoning, English, Living Science (Class 1-2 level) and
// Mathematics (Class 1 level). Each function returns a fresh, randomized
// { text, options, correctIndex } (optionally { passage }) every time it
// is called. script.js additionally tracks recently-shown question text
// per subject and skips repeats (see nextOlympiadQuestion).
// =====================================================

function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    let j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildMC(correct, distractors) {
  correct = String(correct);
  let uniq = [...new Set(distractors.map(String))].filter(d => d !== correct);
  let chosen = shuffle(uniq).slice(0, 3);
  let opts = shuffle([correct, ...chosen]);
  return { options: opts, correctIndex: opts.indexOf(correct) };
}

/* ---------------- MATH ---------------- */
function genAddition() {
  let a = randInt(2, 12), b = randInt(1, Math.max(1, 18 - a));
  let sum = a + b;
  let distractors = [sum - 1, sum + 1, sum + 2, sum - 2].filter(x => x >= 0);
  let { options, correctIndex } = buildMC(sum, distractors);
  return { text: `${a} + ${b} = ___`, options, correctIndex };
}
function genSubtraction() {
  let a = randInt(6, 20), b = randInt(1, a - 1);
  let diff = a - b;
  let distractors = [diff + 1, diff - 1, diff + 2, diff - 2].filter(x => x >= 0);
  let { options, correctIndex } = buildMC(diff, distractors);
  return { text: `${a} − ${b} = ___`, options, correctIndex };
}
function genCompare() {
  let x = randInt(1, 20), y = randInt(1, 20);
  while (y === x) y = randInt(1, 20);
  let askBigger = Math.random() < 0.5;
  let correct = askBigger ? Math.max(x, y) : Math.min(x, y);
  let options = shuffle([String(x), String(y), "Both are equal", "Cannot say"]);
  return { text: `Which number is ${askBigger ? "greater" : "smaller"} — ${x} or ${y}?`, options, correctIndex: options.indexOf(String(correct)) };
}
function genBeforeAfter() {
  let n = randInt(2, 19);
  let askAfter = Math.random() < 0.5;
  let correct = askAfter ? n + 1 : n - 1;
  let distractors = [n, correct + 1, correct - 1, correct + 2].filter(x => x >= 0);
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `What number comes just ${askAfter ? "after" : "before"} ${n}?`, options, correctIndex };
}
function genShapeSides() {
  let shapes = [["Triangle", 3], ["Square", 4], ["Rectangle", 4], ["Pentagon", 5], ["Hexagon", 6]];
  let [name, sides] = pick(shapes);
  let { options, correctIndex } = buildMC(sides, [2, 3, 4, 5, 6]);
  return { text: `How many sides does a ${name} have?`, options, correctIndex };
}
function genWordProblemAdd() {
  let names = ["Riya", "Aman", "Zara", "Kabir", "Meera", "Dev"];
  let objs = ["balloons", "apples", "pencils", "marbles", "candies", "stickers"];
  let name = pick(names), obj = pick(objs);
  let a = randInt(2, 9), b = randInt(1, 8);
  let total = a + b;
  let { options, correctIndex } = buildMC(total, [total - 1, total + 1, total + 2, total - 2].filter(x => x >= 0));
  return { text: `${name} has ${a} ${obj}. ${name} gets ${b} more. How many ${obj} does ${name} have now?`, options, correctIndex };
}
function genWordProblemSub() {
  let names = ["Riya", "Aman", "Zara", "Kabir", "Meera", "Dev"];
  let objs = ["balloons", "apples", "pencils", "marbles", "candies", "stickers"];
  let name = pick(names), obj = pick(objs);
  let a = randInt(8, 15), b = randInt(1, a - 2);
  let diff = a - b;
  let { options, correctIndex } = buildMC(diff, [diff - 1, diff + 1, diff + 2, diff - 2].filter(x => x >= 0));
  return { text: `${name} has ${a} ${obj}. ${name} gives away ${b}. How many ${obj} does ${name} have left?`, options, correctIndex };
}
function genSkipCounting() {
  let step = pick([2, 3, 5, 10]);
  let start = step * randInt(0, 3);
  let seq = [start, start + step, start + 2 * step];
  let next = start + 3 * step;
  let { options, correctIndex } = buildMC(next, [next + step, next - step, next + 1, next - 1].filter(x => x >= 0));
  return { text: `Count forward: ${seq.join(", ")}, ___`, options, correctIndex };
}
function genRanking() {
  let names = shuffle(["Ram", "Sam", "Tom", "Jai", "Leo", "Ana"]).slice(0, 4);
  let pos = pick([2, 3]);
  let askBefore = Math.random() < 0.5;
  let idx = pos - 1;
  let target = names[idx];
  let answer = names[askBefore ? idx - 1 : idx + 1];
  let { options, correctIndex } = buildMC(answer, [...names.filter(n => n !== answer), "Cannot say"]);
  return { text: `${names.join(", ")} are standing in a line. ${target} is ${pos === 2 ? "2nd" : "3rd"}. Who is standing right ${askBefore ? "before" : "after"} ${target}?`, options, correctIndex };
}

/* ---------------- ENGLISH ---------------- */
function genLetterSeq() {
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let askAfter = Math.random() < 0.5;
  let idx = askAfter ? randInt(0, 24) : randInt(1, 25);
  let letter = alphabet[idx];
  let correct = askAfter ? alphabet[idx + 1] : alphabet[idx - 1];
  let distractors = [alphabet[idx], alphabet[(idx + 2) % 26], alphabet[(idx - 2 + 26) % 26]];
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `Which letter comes right ${askAfter ? "after" : "before"} ${letter}?`, options, correctIndex };
}
function genArticle() {
  let nouns = [["apple", true], ["umbrella", true], ["orange", true], ["elephant", true], ["egg", true], ["ball", false], ["cat", false], ["dog", false], ["house", false], ["pencil", false], ["star", false], ["tree", false]];
  let [noun, vowel] = pick(nouns);
  let correct = vowel ? "An" : "A";
  let options = ["A", "An", "The", "Is"];
  return { text: `Choose the correct word: ___ ${noun}`, options, correctIndex: options.indexOf(correct) };
}
function genOpposite() {
  let pairs = [["Big", "Small"], ["Hot", "Cold"], ["Up", "Down"], ["Fast", "Slow"], ["Happy", "Sad"], ["Day", "Night"], ["Open", "Shut"], ["Wet", "Dry"], ["Full", "Empty"], ["Near", "Far"], ["Old", "New"], ["Tall", "Short"]];
  let pair = pick(pairs);
  let reverse = Math.random() < 0.5;
  let word = reverse ? pair[1] : pair[0];
  let correct = reverse ? pair[0] : pair[1];
  let others = shuffle(pairs.filter(p => p !== pair).flat());
  let { options, correctIndex } = buildMC(correct, others);
  return { text: `What is the opposite of "${word}"?`, options, correctIndex };
}
function genRhyme() {
  let families = [["Cat", ["Hat", "Bat", "Mat", "Rat"]], ["Dog", ["Log", "Fog", "Jog"]], ["Sun", ["Fun", "Run", "Bun"]], ["Pen", ["Hen", "Ten", "Den"]], ["Bell", ["Well", "Sell", "Tell"]], ["Cake", ["Lake", "Make", "Bake"]], ["King", ["Ring", "Sing", "Wing"]], ["Star", ["Car", "Jar", "Far"]]];
  let [base, rhymes] = pick(families);
  let correct = pick(rhymes);
  let otherWords = families.filter(f => f[0] !== base).flatMap(f => f[1]);
  let { options, correctIndex } = buildMC(correct, otherWords);
  return { text: `Which word rhymes with "${base}"?`, options, correctIndex };
}
function genPlural() {
  let nouns = ["Book", "Cat", "Ball", "Toy", "Chair", "Flower", "Pencil", "Star", "Cup", "Bag"];
  let noun = pick(nouns);
  let low = noun.toLowerCase();
  let correct = low + "s";
  let { options, correctIndex } = buildMC(correct, [low, low + "es", low + "ies"]);
  options = options.map(o => o.charAt(0).toUpperCase() + o.slice(1));
  correctIndex = options.findIndex(o => o.toLowerCase() === correct);
  return { text: `What is the plural of "${noun}"?`, options, correctIndex };
}
function genVowel() {
  let words = [["c_t", "a"], ["d_g", "o"], ["p_n", "e"], ["s_n", "u"], ["b_g", "a"], ["p_g", "i"], ["h_t", "o"], ["m_p", "a"], ["r_g", "u"], ["n_t", "e"]];
  let [pattern, vowel] = pick(words);
  let { options, correctIndex } = buildMC(vowel, ["a", "e", "i", "o", "u"].filter(v => v !== vowel));
  options = options.map(o => o.toUpperCase());
  correctIndex = options.findIndex(o => o.toLowerCase() === vowel);
  return { text: `Fill in the missing vowel: ${pattern.toUpperCase()}`, options, correctIndex };
}
function genSpelling() {
  let words = [["School", ["Skool", "Scool", "Schol"]], ["House", ["Hows", "Howse", "Haus"]], ["Water", ["Watar", "Wather", "Woter"]], ["Apple", ["Aple", "Appel", "Apel"]], ["Flower", ["Flowar", "Flover", "Flowr"]], ["Garden", ["Gardan", "Gardin", "Gardn"]], ["Friend", ["Frend", "Freind", "Friand"]], ["Table", ["Tabel", "Tabl", "Taible"]], ["Yellow", ["Yelow", "Yello", "Yellou"]]];
  let [correct, wrongs] = pick(words);
  let { options, correctIndex } = buildMC(correct, wrongs);
  return { text: `Which word is spelled correctly?`, options, correctIndex };
}
function genPassage() {
  let passages = [
    { p: "Mia has a pet dog. The dog is brown and small. It likes to play in the garden every evening.", q: "Where does the dog like to play?", correct: "In the garden", wrong: ["In the kitchen", "In the car", "At school"] },
    { p: "Raj went to the zoo with his family. He saw a big elephant and a tall giraffe. He liked the giraffe the most.", q: "Which animal did Raj like the most?", correct: "Giraffe", wrong: ["Elephant", "Lion", "Monkey"] },
    { p: "Priya woke up early in the morning. She brushed her teeth and then had breakfast. After that she went to school.", q: "What did Priya do right after brushing her teeth?", correct: "Had breakfast", wrong: ["Went to the zoo", "Slept again", "Played outside"] },
    { p: "Sam has a red ball. He plays with it in the park with his friends after school.", q: "What color is Sam's ball?", correct: "Red", wrong: ["Blue", "Green", "Yellow"] },
    { p: "The sun gives us light and heat. Plants need sunlight to grow well and stay healthy.", q: "What do plants need to grow well?", correct: "Sunlight", wrong: ["Darkness", "Moonlight", "Snow"] },
    { p: "Arjun's kite got stuck in a tall tree. He asked his father for help. His father used a long stick to bring it down.", q: "Who helped Arjun get his kite down?", correct: "His father", wrong: ["His mother", "His teacher", "His friend"] },
    { p: "It rained heavily all night. In the morning, Neha saw puddles of water everywhere and the trees looked fresh and green.", q: "What did Neha see in the morning?", correct: "Puddles of water", wrong: ["Falling leaves", "Snow", "A rainbow only"] },
    { p: "Grandmother told Tina a story about a clever fox before bedtime. Tina loved the story and asked for one more.", q: "What kind of story did grandmother tell?", correct: "A story about a clever fox", wrong: ["A story about a lazy dog", "A story about the moon", "A story about a king"] }
  ];
  let pas = pick(passages);
  let { options, correctIndex } = buildMC(pas.correct, pas.wrong);
  return { text: pas.q, passage: pas.p, options, correctIndex };
}

/* ---------------- LIVING SCIENCE ---------------- */
function genLivingNonliving() {
  let items = [["Stone", false], ["Tree", true], ["Chair", false], ["Table", false], ["Dog", true], ["Car", false], ["Flower", true], ["Book", false], ["Cat", true], ["Cloud", false], ["Fish", true], ["Ball", false]];
  let askLiving = Math.random() < 0.5;
  let correct = pick(items.filter(i => i[1] === askLiving))[0];
  let distractors = shuffle(items.filter(i => i[1] !== askLiving)).slice(0, 3).map(i => i[0]);
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `Which of these is a ${askLiving ? "living" : "non-living"} thing?`, options, correctIndex };
}
function genSenses() {
  let senses = [["Eyes", "See"], ["Ears", "Hear"], ["Nose", "Smell"], ["Tongue", "Taste"], ["Skin", "Feel"]];
  let [organ, verb] = pick(senses);
  if (Math.random() < 0.5) {
    let { options, correctIndex } = buildMC(organ, senses.filter(s => s[0] !== organ).map(s => s[0]));
    return { text: `Which body part do we use to ${verb.toLowerCase()}?`, options, correctIndex };
  } else {
    let { options, correctIndex } = buildMC(verb, senses.filter(s => s[1] !== verb).map(s => s[1]));
    return { text: `What can we do with our ${organ.toLowerCase()}?`, options, correctIndex };
  }
}
function genPlantParts() {
  let parts = [["Root", "grows under the soil and takes in water"], ["Stem", "holds the plant up and carries water"], ["Leaf", "makes food for the plant using sunlight"], ["Flower", "makes seeds and smells nice"], ["Seed", "grows into a new plant"], ["Fruit", "protects the seeds and can be eaten"]];
  let [name, desc] = pick(parts);
  let { options, correctIndex } = buildMC(name, parts.filter(p => p[0] !== name).map(p => p[0]));
  return { text: `Which part of the plant ${desc}?`, options, correctIndex };
}
function genBabyAnimal() {
  let pairs = [["Dog", "Puppy"], ["Cat", "Kitten"], ["Cow", "Calf"], ["Hen", "Chick"], ["Sheep", "Lamb"], ["Horse", "Foal"], ["Duck", "Duckling"], ["Lion", "Cub"], ["Frog", "Tadpole"]];
  let [animal, baby] = pick(pairs);
  let { options, correctIndex } = buildMC(baby, pairs.filter(p => p[0] !== animal).map(p => p[1]));
  return { text: `A baby ${animal.toLowerCase()} is called a ___.`, options, correctIndex };
}
function genAnimalProduce() {
  let pairs = [["Cow", "Milk"], ["Hen", "Eggs"], ["Sheep", "Wool"], ["Bee", "Honey"], ["Silkworm", "Silk"]];
  let [animal, produce] = pick(pairs);
  if (Math.random() < 0.5) {
    let { options, correctIndex } = buildMC(animal, pairs.filter(p => p[1] !== produce).map(p => p[0]));
    return { text: `Which animal gives us ${produce.toLowerCase()}?`, options, correctIndex };
  } else {
    let { options, correctIndex } = buildMC(produce, pairs.filter(p => p[0] !== animal).map(p => p[1]));
    return { text: `What does a ${animal.toLowerCase()} give us?`, options, correctIndex };
  }
}
function genHabitat() {
  let pairs = [["Fish", "Water"], ["Bird", "A nest"], ["Lion", "The forest"], ["Rabbit", "A burrow"], ["Bee", "A hive"], ["Camel", "The desert"], ["Frog", "A pond"], ["Ant", "An anthill"], ["Squirrel", "A tree"]];
  let [animal, place] = pick(pairs);
  let { options, correctIndex } = buildMC(place, pairs.filter(p => p[0] !== animal).map(p => p[1]));
  return { text: `Where does a ${animal.toLowerCase()} live?`, options, correctIndex };
}
function genFruitVeg() {
  let items = [["Apple", "fruit"], ["Mango", "fruit"], ["Banana", "fruit"], ["Grapes", "fruit"], ["Orange", "fruit"], ["Watermelon", "fruit"], ["Potato", "vegetable"], ["Onion", "vegetable"], ["Carrot", "vegetable"], ["Brinjal", "vegetable"], ["Peas", "vegetable"], ["Spinach", "vegetable"]];
  let askFruit = Math.random() < 0.5;
  let category = askFruit ? "fruit" : "vegetable";
  let opposite = askFruit ? "vegetable" : "fruit";
  let correct = pick(items.filter(i => i[1] === opposite))[0];
  let distractors = shuffle(items.filter(i => i[1] === category)).slice(0, 3).map(i => i[0]);
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `Which of these is NOT a ${category}?`, options, correctIndex };
}
function genBodyFunction() {
  let pairs = [["Nose", "breathe"], ["Legs", "walk"], ["Hands", "hold things"], ["Mouth", "eat"], ["Ears", "hear"], ["Eyes", "see"], ["Teeth", "chew food"], ["Brain", "think and remember"], ["Heart", "pump blood"], ["Lungs", "help us breathe"]];
  let [part, func] = pick(pairs);
  if (Math.random() < 0.5) {
    let { options, correctIndex } = buildMC(part, pairs.filter(p => p[0] !== part).map(p => p[0]));
    return { text: `Which body part do we use to ${func}?`, options, correctIndex };
  } else {
    let { options, correctIndex } = buildMC(func, pairs.filter(p => p[1] !== func).map(p => p[1]));
    return { text: `What do we do with our ${part.toLowerCase()}?`, options, correctIndex };
  }
}
// ---- Class 2 level ----
function genLifeCycle() {
  let sequences = [
    { name: "a frog", stages: ["Egg", "Tadpole", "Adult frog"] },
    { name: "a butterfly", stages: ["Egg", "Caterpillar", "Cocoon", "Butterfly"] },
    { name: "a hen", stages: ["Egg", "Chick", "Hen"] },
    { name: "a plant", stages: ["Seed", "Sapling", "Tree"] }
  ];
  let seq = pick(sequences);
  let idx = randInt(0, seq.stages.length - 2);
  let stage = seq.stages[idx];
  let correct = seq.stages[idx + 1];
  let allStages = sequences.flatMap(s => s.stages).filter(s => s !== correct);
  let { options, correctIndex } = buildMC(correct, allStages);
  return { text: `In the life cycle of ${seq.name}, what comes right after "${stage}"?`, options, correctIndex };
}
function genAnimalGroups() {
  let groups = {
    Mammal: ["Dog", "Cat", "Cow", "Elephant", "Horse"],
    Bird: ["Sparrow", "Crow", "Duck", "Peacock", "Parrot"],
    Fish: ["Rohu", "Shark", "Goldfish", "Catfish"],
    Insect: ["Ant", "Bee", "Butterfly", "Housefly"]
  };
  let groupNames = Object.keys(groups);
  let groupName = pick(groupNames);
  let animal = pick(groups[groupName]);
  let { options, correctIndex } = buildMC(groupName, groupNames.filter(g => g !== groupName));
  return { text: `Which group does a ${animal.toLowerCase()} belong to?`, options, correctIndex };
}
function genHerbivoreCarnivore() {
  let animals = [
    ["Cow", "Herbivore"], ["Deer", "Herbivore"], ["Goat", "Herbivore"], ["Rabbit", "Herbivore"], ["Elephant", "Herbivore"],
    ["Lion", "Carnivore"], ["Tiger", "Carnivore"], ["Wolf", "Carnivore"], ["Eagle", "Carnivore"],
    ["Bear", "Omnivore"], ["Human", "Omnivore"], ["Pig", "Omnivore"]
  ];
  let type = pick(["Herbivore", "Carnivore", "Omnivore"]);
  let hint = type === "Herbivore" ? "eats only plants" : type === "Carnivore" ? "eats only meat" : "eats both plants and meat";
  let correct = pick(animals.filter(a => a[1] === type))[0];
  let distractors = shuffle(animals.filter(a => a[1] !== type)).slice(0, 3).map(a => a[0]);
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `Which of these is a ${type.toLowerCase()} (${hint})?`, options, correctIndex };
}
function genStatesOfMatter() {
  let items = [["Water", "Liquid"], ["Milk", "Liquid"], ["Juice", "Liquid"], ["Ice", "Solid"], ["Stone", "Solid"], ["Wood", "Solid"], ["Book", "Solid"], ["Steam", "Gas"], ["Air", "Gas"], ["Smoke", "Gas"]];
  let state = pick(["Liquid", "Solid", "Gas"]);
  let correct = pick(items.filter(i => i[1] === state))[0];
  let distractors = shuffle(items.filter(i => i[1] !== state)).slice(0, 3).map(i => i[0]);
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `Which of these is a ${state.toLowerCase()}?`, options, correctIndex };
}

/* ---------------- REASONING ---------------- */
function genOddOneOut() {
  let groups = [
    ["Dog", "Cat", "Cow", "Car"], ["Apple", "Mango", "Banana", "Potato"], ["2", "4", "6", "B"],
    ["Circle", "Square", "Triangle", "Red"], ["Sparrow", "Crow", "Parrot", "Fish"], ["Chair", "Table", "Bed", "Dog"],
    ["Red", "Blue", "Green", "Ball"], ["Monday", "Tuesday", "Wednesday", "Apple"],
    ["Piano", "Guitar", "Drum", "Elephant"], ["Doctor", "Teacher", "Farmer", "Pencil"],
    ["Summer", "Winter", "Autumn", "Book"], ["January", "February", "March", "Monday"],
    ["Triangle", "Square", "Rectangle", "Sun"], ["Ant", "Bee", "Butterfly", "Lion"],
    ["Rose", "Lily", "Sunflower", "Carrot"], ["Red", "Yellow", "Blue", "Seven"]
  ];
  let group = pick(groups);
  let odd = group[group.length - 1];
  let options = shuffle(group);
  return { text: `Which one is different from the rest?`, options, correctIndex: options.indexOf(odd) };
}
function genPattern() {
  let allSymbols = ["★", "▲", "●", "■", "♦", "♥"];
  let cycleLen = pick([2, 3]);
  let symbols = shuffle(allSymbols).slice(0, cycleLen);
  let seqLen = 6;
  let seqArr = [];
  for (let i = 0; i < seqLen; i++) seqArr.push(symbols[i % cycleLen]);
  let next = symbols[seqLen % cycleLen];
  let withinSetWrong = symbols.filter(s => s !== next);
  let outsidePool = allSymbols.filter(s => !symbols.includes(s));
  let { options, correctIndex } = buildMC(next, [...withinSetWrong, ...outsidePool]);
  return { text: `Find the missing shape: ${seqArr.join(" ")}  ___`, options, correctIndex };
}
function genAnalogy() {
  let sets = [
    ["Bird", "Sky", "Fish", "Water"], ["Sun", "Day", "Moon", "Night"], ["Cow", "Grass", "Lion", "Meat"],
    ["Hand", "Glove", "Foot", "Shoe"], ["Dog", "Puppy", "Cat", "Kitten"], ["Fish", "Swim", "Bird", "Fly"],
    ["Eye", "See", "Ear", "Hear"], ["Tree", "Leaves", "Bird", "Feathers"], ["Water", "Drink", "Food", "Eat"],
    ["Teacher", "School", "Doctor", "Hospital"], ["Egg", "Hen", "Seed", "Plant"], ["Ant", "Insect", "Cow", "Mammal"]
  ];
  let set = pick(sets);
  let others = sets.filter(s => s !== set);
  let distractors = others.map(s => s[3]).concat(others.map(s => s[1]));
  let { options, correctIndex } = buildMC(set[3], distractors);
  return { text: `${set[0]} is to ${set[1]} as ${set[2]} is to ___.`, options, correctIndex };
}
function genShapeName() {
  let shapes = [["Triangle", 3], ["Square", 4], ["Rectangle", 4], ["Pentagon", 5], ["Hexagon", 6], ["Heptagon", 7], ["Octagon", 8]];
  let [name, sides] = pick(shapes);
  let { options, correctIndex } = buildMC(name, shapes.filter(s => s[0] !== name).map(s => s[0]));
  return { text: `Which shape has ${sides} sides?`, options, correctIndex };
}
function genNumberSeq() {
  let start = randInt(1, 15);
  let seq = [start, start + 1, start + 2, start + 3, start + 4];
  let blankPos = randInt(1, 3);
  let missing = seq[blankPos];
  let display = seq.map((n, i) => (i === blankPos ? "__" : n));
  let { options, correctIndex } = buildMC(missing, [missing - 1, missing + 1, missing + 2, missing - 2].filter(x => x >= 0));
  return { text: `Fill in the missing number: ${display.join(", ")}`, options, correctIndex };
}
function genRankingCompare() {
  let names = shuffle(["Ravi", "Sam", "Tom", "Neha", "Isha", "Karan"]).slice(0, 3);
  let [comp, lowWord, highWord] = pick([["taller", "shortest", "tallest"], ["older", "youngest", "oldest"], ["faster", "slowest", "fastest"], ["bigger", "smallest", "biggest"], ["heavier", "lightest", "heaviest"]]);
  let askLow = Math.random() < 0.5;
  let correct = askLow ? names[2] : names[0];
  let { options, correctIndex } = buildMC(correct, [...names.filter(n => n !== correct), "Cannot say"]);
  return { text: `${names[0]} is ${comp} than ${names[1]}. ${names[1]} is ${comp} than ${names[2]}. Who is the ${askLow ? lowWord : highWord}?`, options, correctIndex };
}
function genGrouping() {
  let groups = [
    { cat: "fruits", correct: ["Mango", "Banana", "Grapes"], wrongSets: [["Mango", "Potato", "Apple"], ["Mango", "Onion", "Grapes"], ["Potato", "Onion", "Carrot"]] },
    { cat: "animals", correct: ["Dog", "Cat", "Cow"], wrongSets: [["Dog", "Car", "Cat"], ["Table", "Cat", "Cow"], ["Dog", "Chair", "Cow"]] },
    { cat: "vehicles", correct: ["Car", "Bus", "Bike"], wrongSets: [["Car", "Dog", "Bike"], ["Car", "Bus", "Tree"], ["Table", "Bus", "Bike"]] },
    { cat: "shapes", correct: ["Circle", "Square", "Triangle"], wrongSets: [["Circle", "Red", "Triangle"], ["Circle", "Square", "Dog"], ["Square", "Triangle", "Blue"]] },
    { cat: "birds", correct: ["Sparrow", "Crow", "Peacock"], wrongSets: [["Sparrow", "Dog", "Crow"], ["Sparrow", "Crow", "Fish"], ["Cat", "Crow", "Peacock"]] },
    { cat: "musical instruments", correct: ["Guitar", "Piano", "Drum"], wrongSets: [["Guitar", "Chair", "Drum"], ["Guitar", "Piano", "Ball"], ["Table", "Piano", "Drum"]] },
    { cat: "seasons", correct: ["Summer", "Winter", "Autumn"], wrongSets: [["Summer", "Winter", "Monday"], ["Summer", "Book", "Autumn"], ["Chair", "Winter", "Autumn"]] },
    { cat: "days of the week", correct: ["Monday", "Tuesday", "Friday"], wrongSets: [["Monday", "Tuesday", "January"], ["Monday", "Apple", "Friday"], ["Summer", "Tuesday", "Friday"]] }
  ];
  let g = pick(groups);
  let correctStr = g.correct.join(", ");
  let { options, correctIndex } = buildMC(correctStr, g.wrongSets.map(s => s.join(", ")));
  return { text: `Which group has things that are all ${g.cat}?`, options, correctIndex };
}
function genDaySeq() {
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let askAfter = Math.random() < 0.5;
  let idx = askAfter ? randInt(0, 5) : randInt(1, 6);
  let day = days[idx];
  let correct = askAfter ? days[idx + 1] : days[idx - 1];
  let distractors = shuffle(days.filter(d => d !== correct && d !== day)).slice(0, 3);
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `Which day comes just ${askAfter ? "after" : "before"} ${day}?`, options, correctIndex };
}
// ---- Class 2 level ----
function shiftWord(word, shift) {
  return word.split("").map(ch => {
    let code = (ch.charCodeAt(0) - 65 + shift + 260) % 26;
    return String.fromCharCode(code + 65);
  }).join("");
}
function genCodingDecoding() {
  let words = ["CAT", "DOG", "SUN", "PEN", "CUP", "BAT", "HAT", "MAP", "BUS", "BOX", "BED", "FAN", "BIG", "RUN", "TOP"];
  let [w1, w2] = shuffle(words).slice(0, 2);
  let shift = pick([1, 2]);
  let code1 = shiftWord(w1, shift);
  let correct = shiftWord(w2, shift);
  let distractors = [shiftWord(w2, shift + 1), shiftWord(w2, shift - 1), shiftWord(w2, shift + 2)];
  let { options, correctIndex } = buildMC(correct, distractors);
  return { text: `If ${w1} is written as ${code1}, how is ${w2} written in the same code?`, options, correctIndex };
}
function genDirectionOpposite() {
  let pairs = [["Left", "Right"], ["Up", "Down"], ["North", "South"], ["East", "West"], ["Front", "Back"], ["Inside", "Outside"], ["Above", "Below"], ["Forward", "Backward"]];
  let pair = pick(pairs);
  let reverse = Math.random() < 0.5;
  let word = reverse ? pair[1] : pair[0];
  let correct = reverse ? pair[0] : pair[1];
  let others = shuffle(pairs.filter(p => p !== pair).flat());
  let { options, correctIndex } = buildMC(correct, others);
  return { text: `Which direction is opposite to "${word}"?`, options, correctIndex };
}
function genEvenOdd() {
  let parity = pick(["even", "odd"]);
  let isEven = n => n % 2 === 0;
  let sameGroup = [];
  while (sameGroup.length < 3) {
    let n = randInt(1, 20);
    if ((parity === "even") === isEven(n) && !sameGroup.includes(n)) sameGroup.push(n);
  }
  let diffNum;
  do { diffNum = randInt(1, 20); } while ((parity === "even") === isEven(diffNum) || sameGroup.includes(diffNum));
  let group = shuffle([...sameGroup, diffNum].map(String));
  return { text: `Which number is NOT ${parity}?`, options: group, correctIndex: group.indexOf(String(diffNum)) };
}
function genSeriesTwoStep() {
  let step = pick([2, 3, 4, 5]);
  let start = randInt(step * 4, step * 4 + 20);
  let seq = [start, start - step, start - 2 * step, start - 3 * step];
  let next = start - 4 * step;
  let distractors = [next + step, next - step, next + 1, next - 1].filter(x => x >= 0);
  let { options, correctIndex } = buildMC(next, distractors);
  return { text: `Find the next number in the series: ${seq.join(", ")}, ___`, options, correctIndex };
}

const OLYMPIAD_GENERATORS = {
  reasoning: [genOddOneOut, genPattern, genAnalogy, genShapeName, genNumberSeq, genRankingCompare, genGrouping, genDaySeq, genCodingDecoding, genDirectionOpposite, genEvenOdd, genSeriesTwoStep],
  english: [genLetterSeq, genArticle, genOpposite, genRhyme, genPlural, genVowel, genSpelling, genPassage],
  science: [genLivingNonliving, genSenses, genPlantParts, genBabyAnimal, genAnimalProduce, genHabitat, genFruitVeg, genBodyFunction, genLifeCycle, genAnimalGroups, genHerbivoreCarnivore, genStatesOfMatter],
  math: [genAddition, genSubtraction, genCompare, genBeforeAfter, genShapeSides, genWordProblemAdd, genWordProblemSub, genSkipCounting, genRanking]
};

const OLYMPIAD_SUBJECT_META = {
  reasoning: { label: "Reasoning", color: "var(--reasoning)" },
  english: { label: "English", color: "var(--english)" },
  science: { label: "Living Science", color: "var(--science)" },
  math: { label: "Mathematics", color: "var(--math)" }
};
