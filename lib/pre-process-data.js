import { isObject } from 'lodash-es';
import forEachDeep from "deepdash-es/forEachDeep";
const path = require('path');
import jsonfile from "jsonfile";
import getUniqueId from "./get-unique-id";

export function preProcessData ({data, user, params}) {
  let someUniqueIdsAdded = false;
  let currentItem;

  forEachDeep(data, function (value, key, parentValue, context) {

    // generate unique ids for each array item without an id
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        if (!item.id) {
          item.id = getUniqueId();
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


