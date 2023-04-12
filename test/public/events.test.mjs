import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { expect } from "chai";

dotenv.config();

const baseURL = process.env.BASE_URL;
const namespace = process.env.NAMESPACE;
const url = `${baseURL}/${namespace}`;

/** These tests require a running koha-testing-docker instance at localhost:8080
 *  and the db to be populated with the db seed for front_end_testing. */

describe("Public Events API", () => {
  it("returns 200 response", async () => {
    const response = await fetch(`${url}/public/events`, {
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
    const response = await fetch(
      `${url}/public/events?invalid_param=invalid_value`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status).to.equal(400);
    const error = await response.json();
    expect(error).to.be.an("array");
  });

  it("returns 400 response for invalid date range", async () => {
    const response = await fetch(
      `${url}/public/events?start_date=2021-01-01&end_date=2020-01-01`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status).to.equal(400);
    const error = await response.json();
    expect(error).to.be.an("array");
  });

  it("returns 400 response for invalid date format", async () => {
    const response = await fetch(
      `${url}/public/events?start_date=2021-01-01&end_date=2020-01-01`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status).to.equal(400);
    const error = await response.json();
    expect(error).to.be.an("array");
  });

  it("returns 404 response for invalid namespace", async () => {
    const response = await fetch(`${baseURL}/invalid_namespace/public/events`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(404);
    const error = await response.text();
    expect(error).to.be.a("string");
  });

  it("returns events filtered by name", async () => {
    const response = await fetch(
      `${url}/public/events?name=${encodeURIComponent(
        "Movie Night in the Park"
      )}`,
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
      expect(event.name).to.equal("Movie Night in the Park");
    });
  });

  it("returns events filtered by event_type", async () => {
    const response = await fetch(
      `${url}/public/events?event_type=0&event_type=1`,
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
      expect(["0", "1"]).to.include(event.event_type);
    });
  });

  it("returns events filtered by target_group", async () => {
    const response = await fetch(
      `${url}/public/events?target_group=1&target_group=2`,
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
      expect(
        event.target_groups.some((tg) => [1, 2].includes(tg.target_group_id))
      ).to.be.true;
    });
  });

  it("returns events filtered by age range", async () => {
    const min_age = 10;
    const max_age = 20;
    const response = await fetch(
      `${url}/public/events?min_age=${min_age}&max_age=${max_age}`,
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
      expect(event.min_age).to.be.at.least(min_age);
      expect(event.max_age).to.be.at.most(max_age);
    });
  });

  it("returns events filtered by open_registration", async () => {
    const response = await fetch(`${url}/public/events?open_registration=0`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events.length).to.be.at.least(1);

    events.forEach((event) => {
      expect(event.open_registration).to.be.false;
    });
  });

  it("returns events filtered by fee", async () => {
    const maxFee = 50;
    const response = await fetch(`${url}/public/events?fee=${maxFee}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    expect(response.status).to.equal(200);
    const events = await response.json();
    expect(events.length).to.be.greaterThan(0);

    events.forEach((event) => {
      const { target_groups } = event;
      target_groups.forEach((target_group) => {
        expect(target_group.fee).to.be.lessThanOrEqual(maxFee);
      });
    });
  });

  it("returns events filtered by location", async () => {
    const response = await fetch(`${url}/public/events?location=1`);
    const events = await response.json();

    expect(response.status).to.equal(200);
    expect(events.length).to.be.greaterThan(0);

    events.forEach((event) => {
      expect(event.location).to.equal("1");
    });
  });

  it("returns events filtered by start_time", async () => {
    const startTime = "2023-04-20T14:00:00Z";
    const response = await fetch(
      `${url}/public/events?start_time=${startTime}`
    );
    const events = await response.json();

    expect(response.status).to.equal(200);
    expect(events.length).to.be.greaterThan(0);

    events.forEach((event) => {
      expect(new Date(event.start_time)).to.be.at.least(new Date(startTime));
    });
  });

  it("returns events filtered by end_time", async () => {
    const endTime = "2023-07-20T18:00:00Z";
    const response = await fetch(`${url}/public/events?end_time=${endTime}`);
    const events = await response.json();

    expect(response.status).to.equal(200);
    expect(events.length).to.be.greaterThan(0);

    events.forEach((event) => {
      expect(new Date(event.end_time)).to.be.at.most(new Date(endTime));
    });
  });

  it("returns events filtered by start_time and end_time", async () => {
    const startTime = "2023-04-20T14:00:00Z";
    const endTime = "2023-07-20T18:00:00Z";
    const response = await fetch(`${url}/public/events?start_time=${startTime}&end_time=${endTime}`);
    const events = await response.json();

    expect(response.status).to.equal(200);
    expect(events.length).to.be.greaterThan(0);

    events.forEach((event) => {
      expect(new Date(event.start_time)).to.be.at.least(new Date(startTime));
      expect(new Date(event.end_time)).to.be.at.most(new Date(endTime));
    });
  });

  it("returns events filtered by location, max_age, and start_time", async () => {
    const location = "1";
    const maxAge = 100;
    const startTime = "2023-04-20T14:00:00Z";

    const response = await fetch(`${url}/public/events?location=${location}&max_age=${maxAge}&start_time=${startTime}`);
    const events = await response.json();

    expect(response.status).to.equal(200);
    expect(events.length).to.be.greaterThan(0);

    events.forEach((event) => {
      expect(event.location).to.equal(location);
      expect(event.max_age).to.be.at.most(maxAge);
      expect(new Date(event.start_time)).to.be.at.least(new Date(startTime));
    });
  });
});
