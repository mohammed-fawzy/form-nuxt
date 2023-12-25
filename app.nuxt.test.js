import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";
import { log } from "console";

const BEFORE_ALL_TIMEOUT = 30000; // 30 sec

describe("check response of get all categories", () => {
  let response;
  let body;

  beforeAll(async () => {
    response = await fetch("https://staging.mazaady.com/api/v1/get_all_cats", {
      headers: {
        "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16",
        "Accept-Language": "en",
        "Content-Type": "application/json",
      },
    });
    body = await response.json();
  }, BEFORE_ALL_TIMEOUT);

  test("Should have response status 200", () => {
    expect(response.status).toBe(200);
  });

  test("Should have private-key", () => {
    expect(response.headers.hasOwnProperty("private-key"));
  });

  test("Should have array in the body", () => {
    expectTypeOf(body).toBeArray();
  });

  test("The first item in array should label name as CARS , MOTORCYCLES & ACCESSORIES", () => {
    expect(body.data.categories[0].name).to.have.string(
      "CARS , MOTORCYCLES & ACCESSORIES"
    );
  });
});
