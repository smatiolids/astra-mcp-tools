import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
export const db = client.db(
  process.env.ASTRA_DB_API_ENDPOINT || "https://api.astra.datastax.com"
);