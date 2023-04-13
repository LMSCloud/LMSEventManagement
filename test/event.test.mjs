import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { expect } from "chai";

dotenv.config();

const PROTOCOL = process.env.PROTOCOL;
const HOST = process.env.HOST;
const PATHNAME = process.env.PATHNAME;
const NAMESPACE = process.env.NAMESPACE;

const PORT = 8081;

const url = `${PROTOCOL}://${HOST}:${PORT}${PATHNAME}/${NAMESPACE}`;

describe("Event Endpoint", () => {
  let eventId;

  before(async () => {
    // Create a new event for testing
    const response = await fetch(`${url}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Movie Night",
        target_groups: [
          {
            id: "1",
            selected: "1",
            fee: "0",
          },
          {
            id: "2",
            selected: "1",
            fee: "5",
          },
          {
            id: "3",
            selected: "1",
            fee: "10",
          },
          {
            id: "4",
            selected: "1",
            fee: "15",
          },
        ],
        min_age: "0",
        max_age: "255",
        max_participants: "100",
        location: "1",
        description: "Enjoy a movie under the stars",
        open_registration: "1",
      }),
    });

    const newEvent = await response.json();
    eventId = newEvent.id;
  });

  after(async () => {
    // Delete the test event
    await fetch(`${url}/events/${eventId}`, {
      method: "DELETE",
    });
  });

  it("returns 200 response for getting an event", async () => {
    const response = await fetch(`${url}/events/${eventId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(200);
    const event = await response.json();
    expect(event).to.be.an("object");
    expect(event.id).to.equal(eventId);
  });

  it("returns 404 response for getting a non-existent event", async () => {
    const response = await fetch(`${url}/events/123456789`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(404);
    const error = await response.json();
    expect(error).to.be.an("object");
    expect(error.error).to.equal("Event not found");
  });

  // Add more tests for update and delete operations
});
