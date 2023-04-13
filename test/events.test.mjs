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

/** These tests require a running koha-testing-docker instance at localhost:8080
 *  and the db to be populated with the db seed for front_end_testing. */

describe("Events Endpoint", () => {
  it("returns 200 response", async () => {
    const response = await fetch(`${url}/events`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events).to.be.an("array");
  });

  it("returns 400 response for invalid parameters", async () => {
    const response = await fetch(`${url}/events?invalid_param=invalid_value`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(400);
    const error = await response.json();
    expect(error).to.be.an("array");
  });

  it("returns 404 response for invalid namespace", async () => {
    const response = await fetch(`${url}/invalid_namespace/events`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(404);
    const error = await response.text();
    expect(error).to.be.a("string");
  });

  it("returns events for a specific page with a specific number of events per page", async () => {
    const page = 2;
    const perPage = 5;
    const response = await fetch(
      `${url}/events?_page=${page}&_per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events).to.be.an("array");
    expect(events.length).to.be.at.most(perPage);
  });

  /* This is currently not implemented even though it would work
  it("returns events with a name that starts with a specific string", async () => {
    const match = "exact";
    const name = "Movie Night in the Park";
    const response = await fetch(
      `${url}/events?_match=${match}&name=${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events).to.be.an("array");
    events.forEach((event) => {
      expect(event.name.startsWith(name)).to.be.true;
    });
  });
    */

  it("returns events filtered by a query with multiple fields", async () => {
    const location = "1";
    const maxAge = 100;
    const query = encodeURIComponent(
      JSON.stringify({ location: location, max_age: { "<=": maxAge } })
    );
    const response = await fetch(`${url}/events?q=${query}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events).to.be.an("array");
    events.forEach((event) => {
      expect(event.location).to.equal(location);
      expect(event.max_age).to.be.at.most(maxAge);
    });
  });

  it("returns events ordered by a specific field", async () => {
    const orderBy = "start_time";
    const response = await fetch(`${url}/events?_order_by=${orderBy}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events).to.be.an("array");

    let previousEventStartTime = null;
    events.forEach((event) => {
      if (previousEventStartTime) {
        expect(new Date(event.start_time)).to.be.at.least(
          previousEventStartTime
        );
      }
      previousEventStartTime = new Date(event.start_time);
    });
  });
});
