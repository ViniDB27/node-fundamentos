import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { buildErrorResponse } from "./utils/build-error-response.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      const users = database.select(
        "tasks",
        search
          ? {
              title: search,
            }
          : null
      );
      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      try {
        const { title, description } = req.body;
        if (!title || !description)
          return res.writeHead(400).end("Title and description are required");
        const user = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        };
        database.insert("tasks", user);
        return res.writeHead(201).end();
      } catch (error) {
        return buildErrorResponse(req, res, error);
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!title || !description)
          return res.writeHead(400).end("Title and description are required");
        database.update("tasks", id, {
          title,
          description,
          updated_at: new Date(),
        });
        return res.writeHead(204).end();
      } catch (error) {
        return buildErrorResponse(req, res, error);
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      try {
        database.delete("tasks", id);
        return res.writeHead(204).end();
      } catch (error) {
        return buildErrorResponse(req, res, error);
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      try {
        database.update("tasks", id, { completed_at: new Date() });
        return res.writeHead(204).end();
      } catch (error) {
        return buildErrorResponse(req, res, error);
      }
    },
  },
];
