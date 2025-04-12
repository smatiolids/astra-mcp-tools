import { db } from "../util/db.js";

export async function GetCollections() {
  const collections = await db.listCollections();
  return collections;
}