import { getNotices } from "../tools/getNotices.js";
import { getEvents } from "../tools/getEvents.js";
import { searchKnowledgeBase } from "../tools/searchKnowledgeBase.js";

export const toolFunctions = {
    getNotices,
    getEvents,
    searchKnowledgeBase,
};

export const toolDeclarations = [
  {
    functionDeclarations: [
      {
        name: "getNotices",
        description: "Returns the latest college notices."
      },
      {
        name: "getEvents",
        description: "Returns upcoming college events."
      },
      {
        name: "searchKnowledgeBase",
        description: "Searches the college knowledge base.",
        parameters: {
          type: "OBJECT",
          properties: {
            keyword: {
              type: "STRING"
            }
          },
          required: ["keyword"]
        }
      }
    ]
  }
];