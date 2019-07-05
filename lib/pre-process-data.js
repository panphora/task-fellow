import { isObject } from 'lodash-es';
import forEachDeep from "deepdash-es/forEachDeep";
import getUniqueId from "./get-unique-id";
import { getCollection } from "./db-connection";

export async function preProcessData ({data, user, params}) {
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
    let usersCollection = await getCollection("users");
    let updateResult = await usersCollection.updateOne(
      { "_id" : user._id },
      { $set: { appData: JSON.stringify(data) } }
    );
  }

  return { currentItem };
}


