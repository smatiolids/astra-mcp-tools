export const toolsConfig = [
  {
    name: "GetJobs",
    description: "List jobs from a collection in the database",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City or state to search for jobs in",
        },
        searchQuery: {
          type: "string",
          description: "Search query to filter jobs by",
        },
      },
      required: ["location", "searchQuery"],
    },
    astraMapping: {
      operation: "Find",
      collectionName: "job_listings",
      filter: {
        "metadata.location": {
          inputArg: "location",
        },
      },
      vectorize: "searchQuery",
      limit: 10,
    },
  },
];
