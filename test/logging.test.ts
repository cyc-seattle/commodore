import { describe, it, expect } from "vitest";
import { InvalidOptionArgumentError } from "@commander-js/extra-typings";
import logform from "logform";
import "winston";
import { LoggingOption, OutputOption, VerboseOption } from "../src/logging.js";

// Runs a log entry through a format and returns the text winston would write. winston sets the
// level symbol on each entry, and registers the colors for its levels when it loads.
function render(format: logform.Format, message: unknown): string {
  const info = format.transform({ level: "info", [Symbol.for("level")]: "info", message });
  if (typeof info !== "object") throw new Error("the format dropped the entry");
  return (info as Record<symbol, unknown>)[Symbol.for("message")] as string;
}

// Commander invokes `option.parseArg(value, previous)` as a method call on the option, so the
// parser can read `this` off the receiver. Calling it detached from the option would not
// reproduce that. `parseArg` is typed optional and generic over `previous`'s type upstream, even
// though the constructor always sets a concrete one via `argParser` — hence the assertions below.
describe("VerboseOption", () => {
  it("increases from the default start level (warn) on the first call", () => {
    const option = new VerboseOption();
    expect(option.parseArg!("", undefined)).toBe("info");
  });

  it("increases from a custom start level on the first call", () => {
    const option = new VerboseOption("error");
    expect(option.parseArg!("", undefined)).toBe("warn");
  });

  it("increases again on a repeat call", () => {
    const option = new VerboseOption();
    expect(option.parseArg!("", "info")).toBe("debug");
  });

  it("saturates at debug rather than running off the end of the level list", () => {
    const option = new VerboseOption();
    expect(option.parseArg!("", "debug")).toBe("debug");
  });
});

describe("OutputOption", () => {
  it("prints the message as JSON with the json format", () => {
    const option = new OutputOption();
    const format = option.parseArg!("json", undefined) as unknown as logform.Format;
    expect(render(format, { a: 1 })).toBe('{"a":1}');
  });

  it("prints the message with util.inspect with the pretty format", () => {
    const option = new OutputOption();
    const format = option.parseArg!("pretty", undefined) as unknown as logform.Format;
    expect(render(format, "text")).toContain("'text'");
  });

  it("throws for an unknown format, listing the valid choices", () => {
    const option = new OutputOption();
    expect(() => option.parseArg!("bogus", undefined)).toThrow(InvalidOptionArgumentError);
    expect(() => option.parseArg!("bogus", undefined)).toThrow("Must be one of: pretty, json");
  });
});

describe("LoggingOption", () => {
  it("writes one JSON line with a timestamp with the json format", () => {
    const option = new LoggingOption();
    const format = option.parseArg!("json", undefined) as unknown as logform.Format;
    const line = JSON.parse(render(format, "Started")) as Record<string, unknown>;
    expect(line).toMatchObject({ level: "info", message: "Started" });
    expect(line["timestamp"]).toEqual(expect.any(String));
  });

  it("writes colored text, not JSON, with the pretty format", () => {
    const option = new LoggingOption();
    const format = option.parseArg!("pretty", undefined) as unknown as logform.Format;
    const line = render(format, "Started");
    expect(line).toContain("Started");
    expect(line).toContain("\u001b[");
    expect(() => JSON.parse(line)).toThrow();
  });

  it("throws for an unknown format, listing the valid choices", () => {
    const option = new LoggingOption();
    expect(() => option.parseArg!("bogus", undefined)).toThrow(InvalidOptionArgumentError);
    expect(() => option.parseArg!("bogus", undefined)).toThrow("Must be one of: json, pretty");
  });
});
