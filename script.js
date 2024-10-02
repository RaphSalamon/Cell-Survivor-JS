let virulence = 0;
let phages = 100;
let hostCells = 5;
let current = 0;
let attacking = 0;
let colonyHealth;
let adaptations = ["baseline phage components"];
let strongestAdaptation = 0;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#dc-text");
const virulenceText = document.querySelector("#virulenceText");
const phagesText = document.querySelector("#phagesText");
const hostsText = document.querySelector("#hostsText");
const colonyStats = document.querySelector("#dc-colonyStats");
const colonyName = document.querySelector("#colonyName");
const colonyHealthText = document.querySelector("#colonyHealthText");
const possibleAdaptations = [
  { name: 'baseline phage components', power: 5 },
  { name: 'upgraded viral capsids', power: 30 },
  { name: 'enhanced tailspike proteins', power: 50 },
  { name: 'biofilm-degrading enzymes', power: 100 }
];
const enemies = [
  {
    name: "S. Aureus Colony",
    level: 2,
    colonyHealth: 15
  },
  {
    name: "A. Baumannii Colony",
    level: 8,
    colonyHealth: 60
  },
  {
    name: "K. Pneumoniae Biofilm",
    level: 20,
    colonyHealth: 300
  }

]
const locations = [
  {
    name: "Choose Next Move",
    "button text": ["Activate Intracellular Machinery", "Search for Targets", "Attack K. Pneumoniae Biofilm"],
    "button functions": [getUpgrades, seekHosts, attackBoss],
    text: "What should your host cells do? Options:<ul><li><strong>Activate Intracellular Machinery:</strong> Have your hosts use their machinery to produce or upgrade your phages.</li><li><strong>Seek More Hosts:</strong> Instruct your hosts to search for new colonies to target. Enables aquisition of additional host cells.</li><li><strong>Attack K. Pneumoniae Biofilm: </strong>Fulfill your pupose by attempting to eradicate the K. Pneumoniae colony.</ul>"
  },
  {
    name: "upgrade",
    "button text": ["Produce 10 phages (lyse 1 host)", "Recombine Genes (sacrifice 3 hosts)", "Cancel"],
    "button functions": [lyseHosts, recombination, nextMove],
    text: "Your hosts' cellular machinery awaits your command."
  },
  {
    name: "seekingHosts",
    "button text": ["Infect S. Aureus Colony", "Infect A. Baumannii Colony", "Cancel"],
    "button functions": [attackSA, attackAB, nextMove],
    text: "Your host cells find colonies of S. Aureus and A. Baumannii. Engage?"
  },
  {
    name: "attackingColony",
    "button text": ["Attack", "Camouflage", "Retreat"],
    "button functions": [infect, camouflage, nextMove],
    text: "You are attempting to infect a bacterial colony. Options:<ul><li><strong>Attack:</strong> Attack individual cells to weaken the colony.</li><li><strong>Camouflage:</strong> Hide phages in your host cells to avoid destruction by colony defenses. (Requires hosts.)</li><li><strong>Retreat: </strong>Use your host cells to gather your phages and escape the confrontation. (Requires hosts.)</ul>"
  },
  {
    name: "Defeat Colony",
    "button text": ["Plan Next Move", "Plan Next Move", "Plan Next Move"],
    "button functions": [nextMove, nextMove, easterEgg],
    text: 'You have defeated the colony. Your virulence increases and you gain new host cells.'
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
    text: "You defeated K. Pneumoniae! The scientists are pleased. (Maybe now they can get some sleep...) <br>YOU WIN!" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Cancel"],
    "button functions": [pickTwo, pickEight, nextMove],
    text: "One of your new hosts is carrying a strange gene, and inserting your viral genome has disabled the supressor sequence inhibiting it. Guess a number to determine what it does."
  },
  {
    name: "no hosts",
    "button text": ["Ok", "Fine", "Whatever"],
    "button functions": [waitForEncounter, waitForEncounter, waitForEncounter],
    text: "You have no more hosts! With no cells to control, all you can do is wait."
  },
  {
    name: "spontaneous encounter",
    "button text": ["Uh Oh...", "Bring it on.", "CHAAARGE!"],
    "button functions": [attackBoss, attackAB, attackSA],
    text: "Your phages are drifting towards a colony..."
  },
  {
    name: "rapid division",
    "button text": ["Nice", "Nice", "Nice"],
    "button functions": [nextMove, nextMove, nextMove],
    text: "This gene codes for rapid cell division. You gain 2 additional host cells! 🎉"
  },
  {
    name: "apoptosis",
    "button text": ["Ugh", "Ugh", "Ugh"],
    "button functions": [nextMove, nextMove, nextMove],
    text: "This gene causes the cell to violently commit apoptosis. You lose 10 phages! :("
  },
];

// initialize buttons
button1.onclick = getUpgrades;
button2.onclick = seekHosts;
button3.onclick = attackBoss;


function waitForEncounter() {
  if (Math.random() <= .3) {
    update(locations[9])
  }
  else {
    text.innerText = "Your phages drift helplessly."
  }
}

function update(location) {
  colonyStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function nextMove() {
  if (hostCells <= 0) text.innerText = "You can't escape!"; 
  else update(locations[0]);
}

function getUpgrades() {
  update(locations[1]);
}

function seekHosts() {
  update(locations[2]);
}

function lyseHosts() {
  if (hostCells >= 1) {
    hostCells -= 1;
    phages += 10;
    hostsText.innerText = hostCells;
    phagesText.innerText = phages;
    text.innerText = "You have produced more phages."
    if (hostCells == 0){
      update(locations[8])
    }
  } else {
    update(locations[8])
  }
}

function recombination() {
  if (strongestAdaptation < possibleAdaptations.length - 1) {
    let successfulRecombination = Math.random() > .4 ? 0 : 1;
    if (hostCells >= 3) {
      if (successfulRecombination){
        strongestAdaptation++;
        let newAdaptation = possibleAdaptations[strongestAdaptation].name;
        text.innerText = "You now have " + newAdaptation + ". ";
        adaptations.push(newAdaptation);
        text.innerText += "You current adaptations are: " + adaptations;
      }
      else text.innerText = "Genetic recombination did not produce any adaptive mutations.";
      hostCells -= 3;
      hostsText.innerText = hostCells;
    }
    else {
      text.innerText = "You do not have enough host cells to perform recombination.";
    }
  } else {
    text.innerText = "You already have the most powerful adaptation!";
  }
}

function attackSA() {
  attacking = 0;
  goFight();
}

function attackAB() {
  attacking = 1;
  goFight();
}

function attackBoss() {
  attacking = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  colonyStats.style.display = "block";
  colonyName.innerText = enemies[attacking].name;
  colonyHealth = enemies[attacking].colonyHealth;
  colonyHealthText.innerText = colonyHealth
}

function infect() {
  text.innerText = "The " + enemies[attacking].name + " deploys its defenses.";
  text.innerText = " You attack using your " + possibleAdaptations[strongestAdaptation].name + ".";
  phages -= getEnemyAttackValue(enemies[attacking].level);
  if (isEnemyInfected()) {
    colonyHealth -= possibleAdaptations[strongestAdaptation].power + Math.floor(Math.random() * virulence) + 1;    
  } else {
      if (Math.random() < .5) text.innerText = "The cells fool your phages with decoy surface receptors.";
      else if (Math.random() > .66) text.innerText = "Thick extracellular polymers prevent your phages from attaching.";
      else text.innerText = "The cells' defensive membrane proteins block DNA injection.";
  }
  colonyHealthText.innerText = colonyHealth;
  if (phages <= 0) {
    phagesText.innerText = 0;
    lose();
  } else if (colonyHealth <= 0) {
    phagesText.innerText = phages;
    if (attacking === 2) {
      winGame();
    } else {
      destroyColony();
    }
  }
  else{
    phagesText.innerText = phages;
    if (Math.random() <= .2 && adaptations.length !== 1) {
      text.innerText += "The gene coding for your " + adaptations.pop() + " undergoes a nonsense mutation, rendering it useless.";
      strongestAdaptation--;
    }
  }
}

function getEnemyAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * virulence));
  console.log(hit);
  if (hit > 0){
    text.innerText += " Type III CRISPR-Cas complexes digest your phages' DNA.";
    return hit;
  }
  else{
    return 0;
  }
}

function isEnemyInfected() {
  return Math.random() > .2 || phages < 20;
}

function camouflage() {
  if (hostCells <= 0){
    text.innerText = "You have no host cells to camouflage your phages in!";
    phages -= getEnemyAttackValue(enemies[attacking].level);
  }
  else {
    phages -= Math.floor(getEnemyAttackValue(enemies[attacking].level)/4);
    text.innerText = "Hidden in your host cells, most of your phages avoid the " + enemies[attacking].name + "'s antiviral enzymes.";
  }
  if (phages <= 0){
    phagesText.innerText = 0;
    lose();
  }
  phagesText.innerText = phages;
}

function destroyColony() {
  hostCells += Math.floor(enemies[attacking].level * .67);
  virulence += enemies[attacking].level;
  hostsText.innerText = hostCells;
  virulenceText.innerText = virulence;
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
  hostCells = 5;
  strongestAdaptation = 0;
  adaptations = ["baseline phage components"];
  hostsText.innerText = hostCells;
  phagesText.innerText = phages;
  virulenceText.innerText = virulence;
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
  while (numbers.length < 6) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  if (numbers.includes(guess) || phages <= 10) {
    hostCells += 2;
    update(locations[10]);
  } else {
    phages -= 10;
    phagesText.innerText = phages;
    update(locations[11]);
  }
}