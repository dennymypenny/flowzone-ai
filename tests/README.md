# Tests

These are the site's safety net. They open the real site in a real browser and
poke the real API, then check that a handful of things that used to be broken
are still fixed.

You do not need to be a developer to run them. You need a terminal, and you
need to be in the project folder.

## How to run them

```
npm test
```

That is it. It builds the site, starts it, runs every check, then shuts
everything down. It takes a few minutes, mostly the build.

If you just built the site and nothing has changed since, you can skip the
build and save a minute:

```
npm run test:fast
```

To run one group on its own:

```
npm run test:intake      # the money path
npm run test:api         # the three forms that email us
npm run test:seo         # search engine tags on every page
npm run test:ratelimit   # protection against floods
npm run test:flow        # the Flow Mode tool on /start
```

The single group commands assume the site is already built. If they complain
about a missing build, run `npm run test:build` once.

## Reading the result

At the end you get a count. `# fail 0` means everything is fine.

If something failed, scroll up and look for a block like this:

```
WHAT BROKE: ...
WHY IT MATTERS: ...
WHAT WE FOUND: ...
```

That is written for a person, not a machine. It tells you what stopped working
and what it costs the business. If you are handing the problem to a developer,
copy that whole block.

## What each group protects

### 1. The intake sad path (`intake-sad-path.test.mjs`)

The most important one. `/intake` used to show "You're all set!" and a Venmo
pay link even when the submission failed, so somebody could pay for a project
whose details reached nobody.

This fills the form, forces the submission to fail, and checks that the success
screen does not appear, that no Venmo link is anywhere on the page, and that
everything the visitor typed is still in the boxes so they can try again. Then
it runs the same thing with a working submission and checks the success screen
does appear.

### 2. The three forms that email us (`api-contract.test.mjs`)

`/api/contact`, `/api/subscribe` and `/api/intake` all end with a message
landing in Denny's inbox. For each one this checks a bad email address is
refused, a missing answer is refused, and, most importantly, that the route
says it failed when the email service is not configured. That last one is the
difference between "we lost your lead" and "we lost your lead and told you it
was fine".

This group runs the site deliberately without an email key, so the failure it
checks is the real thing and not a pretend one.

### 3. Search engine tags (`seo-metadata.test.mjs`)

Every page used to tell Google it was a copy of the homepage, which meant
nothing but the homepage could show up in search. This checks all eleven public
pages point at themselves, checks the three internal pages stay out of search,
and checks the old name "FlowZone AI" does not appear anywhere.

### 4. Flood protection (`rate-limit.test.mjs`)

The API used to be wide open. Anybody with a loop could fill the inbox or run
up a bill. This hammers `/api/subscribe` from one address and checks it gets
cut off, then checks a different visitor in the same minute is not punished for
it.

### 5. Flow Mode (`flow-mode.test.mjs`)

`/start` is the free tool, and it is about 9,000 lines of code with no other
coverage. This opens each of the four tracks with a completely empty browser,
waits for the track to load, checks its first real control is on screen, and
checks the page produced no errors. It also opens the page with nothing saved
at all, because "it works for anyone with nothing saved" is a promise the site
makes.

## Notes for whoever maintains this

- No test tools were added. Everything uses Node's own test runner and the
  Playwright browser already in the project.
- Each group starts its own copy of the site on its own port and stops it
  afterwards. Nothing is left running.
- Two errors show up in the browser on every page locally: Google Fonts cannot
  be reached from the test sandbox, and the Vercel analytics script only exists
  once the site is deployed. Both are ignored on purpose, and only those two.
  Everything else counts as a failure.
