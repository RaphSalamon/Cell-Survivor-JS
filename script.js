/* ADD FEATURE THAT FORCES A RANDOM ENCOUNTER WITHOUT THE ABILITY TO DODGE IF YOU RUN OUT OF HOST CELLS */

let virulence = 0;
let phages = 100;
let hostCells = 5;
let current = 0;
let fighting = 0;
let biofilmIntegrity;
let adaptations = ["base form"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const virulenceText = document.querySelector("#virulenceText");
const phagesText = document.querySelector("#phagesText");
const hostsText = document.querySelector("#hostsText");
const colonyStats = document.querySelector("#colonyStats");
const colonyName = document.querySelector("#colonyName");
const colonyIntegrityText = document.querySelector("#colonyIntegrity");
const adaptationsList = [
  { name: 'base form', power: 5 },
  { name: 'improved receptor binding', power: 30 },
  { name: 'upgraded tailspike proteins', power: 50 },
  { name: 'biofilm-degrading enzymes', power: 100 }
];
const monsters = [
  {
    name: "S. Aureus Colony",
    level: 2,
    biofilmIntegrity: 15
  },
  {
    name: "A. Baumannii Colony",
    level: 8,
    biofilmIntegrity: 60
  },
  {
    name: "K. Pneumoniae Biofilm",
    level: 20,
    biofilmIntegrity: 300
  }

]
const locations = [
  {
    name: "Choose Next Move",
    "button text": ["Maintenance & Upgrades", "Seek Hosts", "Attack K. Pneumoniae Biofilm"],
    "button functions": [getUpgrades, seekHosts, attackBoss],
    text: "Choose your next move."
  },
  {
    name: "upgrade",
    "button text": ["Produce 10 phages (lyse 1 host)", "Recombine Genes (sacrifice 3 hosts)", "Cancel"],
    "button functions": [lyseHosts, recombination, cancel],
    text: "Your hosts' cellular machinery awaits your command."
  },
  {
    name: "seekingHosts",
    "button text": ["Attack S. Aureus Colony", "Attack A. Baumannii Colony", "Cancel"],
    "button functions": [attackSA, attackAB, cancel],
    text: "Your host cells encounter colonies of S. Aureus and A. Baumannii. Engage?"
  },
  {
    name: "attackingColony",
    "button text": ["Infect", "Camouflage", "Disengage"],
    "button functions": [infect, camouflage, disengage],
    text: "You are attempting to attack a bacterial colony.\nOptions:\n- Infect: infect individual cells to weaken the colony.\n- Camouflage: hide phages in your host cells to avoid destruction by colony defenses. (Requires hosts.)"
  },
  {
    name: "Eradicate Colony",
    "button text": ["Plan Next Move", "Plan Next Move", "Plan Next Move"],
    "button functions": [nextMove, nextMove, easterEgg],
    text: 'You have defeated the colony. You gain experience points and new host cells.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You have been eradicated. Your failure disappoints the scientists."
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeated K. Pneumoniae! The scientists are pleased. (Maybe now they can get some sleep...)\n\nYOU WIN!" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Cancel"],
    "button functions": [pickTwo, pickEight, nextMove],
    text: "One of your new hosts is carrying a strange gene, and inserting your viral genome has disabled the supressor sequence inhibiting it. Pick a number to determine what it does."
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function nextMove() {
  update(locations[0]);
}

function getUpgrades() {
  update(locations[1]);
}

function seekHosts() {
  update(locations[2]);
}

function lyseHosts() {
  hostCells -= 1;
  phages += 10;
  goldText.innerText = hostCells;
  healthText.innerText = phages;
  /*if (hostCells >= 1) {
    hostCells -= 1;
    phages += 10;
    goldText.innerText = hostCells;
    healthText.innerText = phages;
  } else {
    text.innerText = "You do not have enough hostCells produce more phages.";
  }*/
}

function recombination() {
  if (currentAdaptation < adaptations.length - 1) {
    if (hostCells >= 3) {
      hostCells -= 3;
      currentAdaptation++;
      hostsText.innerText = hostCells;
      let newAdaptation = adaptations[currentAdaptation].name;
      text.innerText = "You now have a " + newAdaptation + ".";
      adaptations.push(newAdaptation);
      text.innerText += " In your adaptations you have: " + adaptations;
    } else {
      text.innerText = "You do not have enough host cells to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 hostCells";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (adaptations.length > 1) {
    hostCells += 15;
    goldText.innerText = hostCells;
    let currentAdaptation = adaptations.shift();
    text.innerText = "You sold a " + currentAdaptation + ".";
    text.innerText += " In your adaptations you have: " + adaptations;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function attackBoss() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].phages;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " releases antiviral enzymes.";
  text.innerText += " You attack it with your " + adaptations[currentAdaptation].name + ".";
  phages -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= adaptations[currentAdaptation].power + Math.floor(Math.random() * virulence) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = phages;
  monsterHealthText.innerText = monsterHealth;
  if (phages <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && adaptations.length !== 1) {
    text.innerText += "The gene coding for your " + adaptations.pop() + " undergoes a nonsense mutation, rendering it useless.";
    currentAdaptation--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * virulence));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || phages < 20;
}

function dodge() {
  text.innerText = "You dodge the " + monsters[fighting].name + "'s attack.";
}

function defeatMonster() {
  hostCells += Math.floor(monsters[fighting].level * 6.7);
  virulence += monsters[fighting].level;
  goldText.innerText = hostCells;
  xpText.innerText = virulence;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  virulence = 0;
  phages = 100;
  hostCells = 50;
  currentAdaptation = 0;
  adaptations = ["stick"];
  goldText.innerText = hostCells;
  healthText.innerText = phages;
  xpText.innerText = virulence;
  nextMove();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }/*
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }*/
  if (numbers.includes(guess)) {
    text.innerText += "This gene codes for rapid cell division. You gain 2 additional host cells!";
    hostCells += 20;
    goldText.innerText = hostCells;
  } else {
    text.innerText += "This gene causes the cell to violently commit apoptosis. You lose 10 phages!";
    phages -= 10;
    healthText.innerText = phages;
    if (phages <= 0) {
      lose();
    }
  }
}