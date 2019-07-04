import { isObject } from 'lodash-es';
import forEachDeep from "deepdash-es/forEachDeep";
const path = require('path');
import jsonfile from "jsonfile";
// Collision probability of unique ids (source: https://zelark.github.io/nano-id-cc/): if you generate 1000 IDS per hour, it will take ~15 years in order to have a 1% probability of one collision with the following settings.
const nanoidLength = 10;
const nanoidAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
import nanoidGenerate from "nanoid/generate";



export function preProcessData ({data, user, params}) {
  let someUniqueIdsAdded = false;
  let currentItem;

  forEachDeep(data, function (value, key, parentValue, context) {

    // generate unique ids for each array item without an id
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        if (!item.id) {
          item.id = nanoidGenerate(nanoidAlphabet, nanoidLength);
          someUniqueIdsAdded = true;
        }
      });
    }

    // get the data for the id in the route param if there is one
    if (params.id && isObject(value) && value.id === params.id) {
      currentItem = value;
    }
  });

  // save the data if some new ids have been added to it
  if (someUniqueIdsAdded) {
    jsonfile.writeFile(path.join(__dirname, `../data/${user}.json`), data, { spaces: 2 });
  }

  return { currentItem };
}


