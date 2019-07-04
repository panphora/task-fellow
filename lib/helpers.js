import nanoidGenerate from "nanoid/generate";
import forEachDeep from "deepdash-es/forEachDeep";
const path = require('path');
import jsonfile from "jsonfile";

// Collision probability (source: https://zelark.github.io/nano-id-cc/)
// if you generate 1000 IDS per hour, it will take ~15 years in order to have a 
// 1% probability of one collision with the following settings.
const nanoidLength = 10;
const nanoidAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function addUniqueIds (data, user) {
  let someUniqueIdsAdded = false;

  forEachDeep(data, function (value, key, parentValue, context) {
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        if (!item.id) {
          item.id = nanoidGenerate(nanoidAlphabet, nanoidLength);
          someUniqueIdsAdded = true;
        }
      });
    }
  });

  // save the data if some new ids have been added to it
  if (someUniqueIdsAdded) {
    jsonfile.writeFile(path.join(__dirname, `../data/${user}.json`), data, { spaces: 2 });
  }
}