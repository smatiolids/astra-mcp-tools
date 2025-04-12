import { Sort } from "@datastax/astra-db-ts";
import { ToolMapping } from "../tools.js";
import { db } from "../util/db.js";

const buildFilterFromArgs = (filter: any, args: any) => {
  return Object.keys(filter).reduce((acc: any, key: any) => {
    if (filter[key].inputArg) {
      acc[key] = args[filter[key].inputArg];
    }
    return acc;
  }, {});
};

const buildSortFromArgs = (toolMapping: ToolMapping, args: any) => {
  if (
    toolMapping.astraMapping.vectorize &&
    args[toolMapping.astraMapping.vectorize] &&
    args[toolMapping.astraMapping.vectorize] !== ""
  ) {
    return { $vectorize: args[toolMapping.astraMapping.vectorize] };
  }
  return {};
};

export async function Find(toolMapping: ToolMapping, args: any) {
  console.log("Find Operation:", args);
  const { collectionName, filter, vectorize, limit } = toolMapping.astraMapping;
  const collection = db.collection(collectionName);

  const filterCondition = buildFilterFromArgs(filter, args);
  const sort = buildSortFromArgs(toolMapping, args);

  console.log("Query:", filterCondition, sort);
  try {
    let query = collection.find(filterCondition);

    // Only add sort if the sort object is not empty
    if (Object.keys(sort).length > 0) {
      query = query.sort(sort as Sort);
    }

    const results = await query.limit(limit || 5).toArray();
    return results;
  } catch (error) {
    console.error(
      "Error executing Find operation:",
      error,
      filterCondition,
      sort
    );
    throw error;
  }
}
