// Primary attributes are Health, Happiness, Money.
// Secondary attibute (hidden) is education level which, if increased, will open up higher paying job oppurtunities.
// Experience will accrue with each turn and also allow for higher paying jobs.
const attributes = {
  health: 100,
  happiness: 100,
  money: 0,
  education: 50,
  experience: 0,
};

// Starting out, user will be working for 10/hour working 40 hours a week. Hours can be increased or decreased.
const wage = 10;
const hours = 40;
const income = wage * hours * 0.825;
