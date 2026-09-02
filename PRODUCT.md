# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: the developer building it, learning the TanStack stack (Start, Router,
Query, Virtual) by building something real instead of a toy CRUD.

Secondary, and the audience the interface must actually serve: a person who wants to
find out what to watch. They arrive with either a vague appetite ("something good") or
a specific thread to pull (an actor, a director, a film they half-remember). They are
browsing, not working — often on a phone, often idle-scrolling.

The app is not built for a user base with accounts. Nobody signs in.

## Product Purpose

A movie discovery app on top of the TMDB API: browse what's popular and trending,
search the catalog, read a full film record, and follow the people involved through
their filmographies.

Success has two halves that must both hold. As a learning vehicle, it exercises the
parts of TanStack that only show up in a real app: route loaders with SSR, search
params as the source of truth for filter state, query caching and invalidation,
virtualized lists over large result sets, and i18n that reaches the data layer. As a
product, it earns the next click — a session ends because the user found something to
watch, not because they gave up navigating.

## Positioning

The differentiator is navigational depth, not catalog size. Every film leads to its
people; every person leads back to their films. Browsing is a graph you can walk
without ever typing, and the walk is deep-linkable — any state a user reaches can be
shared as a URL and restored exactly.

## Operating Context

- Casual, low-stakes, often one-handed on a phone. Sessions are short and exploratory.
- All content comes from TMDB at request time: posters, backdrops, credits, metadata.
  Image quality, aspect ratio, and availability vary by title, and a meaningful share
  of records have no poster, no backdrop, or a truncated cast.
- Result sets are large and paginated. Discovery and search are inherently
  scroll-heavy surfaces.
- Two locales in play, and locale is not only a UI concern: TMDB returns localized
  titles, overviews, and images, and localized fields are frequently empty where the
  English ones are not.

## Capabilities and Constraints

Confirmed scope:

- **Discover and search** — trending/popular entry point, text search, filtering by
  genre, year, and rating.
- **Film record** — synopsis, cast and crew, trailer, similar titles.
- **People** — actor and director records with navigable filmographies.

Explicitly out of scope: watchlists, favorites, "seen it" tracking, ratings, and
anything else personal. That decision removes accounts, auth, and a persistence layer
from the product entirely. Anything that would require remembering a specific user is
out until this record says otherwise.

Technical constraints:

- TanStack Start (SSR) + React 19 + Vite, `@lorenzopant/tmdb` as the API client,
  TanStack Query for caching, TanStack Virtual for long lists, Zod for validation,
  Biome for lint/format.
- **Mantine 9 is the styling authority.** Its theme defines tokens and components;
  Tailwind 4 is present for local layout and spacing adjustments only. New components
  extend the Mantine theme rather than reimplementing its primitives in utilities.
- **Locales: Spanish and English.** The `de` locale inherited from the TanStack
  starter is to be removed from `project.inlang/settings.json` and `messages/`, and
  Spanish added. Paraglide is the i18n mechanism.
- **Undecided:** TMDB API key handling. No key is defined in `src/env.ts` yet, and
  whether it stays server-side behind Start's server functions or ships to the client
  has not been settled. It is a real decision with a security consequence, not an
  oversight to paper over.
- **Undecided:** whether this is ever deployed publicly, and where.

## Brand Commitments

No name, logo, voice, or identity has been established beyond the working repository
name `movie-app-tmdb`. Nothing here is binding yet.

TMDB's API terms are binding, though, and they are an attribution obligation, not a
style choice: the TMDB logo must appear as an attribution mark, and the app must state
that it uses the TMDB API but is not endorsed or certified by TMDB. Any design must
leave room for both.

## Evidence on Hand

- Live TMDB data — real titles, real posters, real credits — is available from day
  one. There is no reason for any surface to be built or shown with placeholder
  content.
- There are no users, no usage numbers, no reviews, no press, and no case studies.
  None of these exist and none may be invented or implied anywhere in the product.

## Product Principles

1. **The URL is the state.** Filters, queries, pagination, and locale live in the
   route, not in component state. Any view a user reaches is a link they can send.
2. **Design for the gaps in the data.** Missing posters, empty localized overviews,
   and thin credit lists are the normal case, not the error case. A layout that only
   holds together with complete records is broken.
3. **Every record is a door.** A film exposes its people; a person exposes their
   films. Dead ends are a design defect.
4. **Nothing is remembered, so nothing is asked.** With no accounts and no
   persistence, the app never prompts for a signup, never gates content, and never
   implies continuity between sessions.
5. **Learning is a real requirement.** Where two implementations are equally good for
   the user, prefer the one that exercises the stack properly.

## Accessibility & Inclusion

No product-specific standard was established. Two facts do carry accessibility weight
and are recorded as constraints rather than aspirations: the interface is bilingual, so
layouts must survive the length differences between Spanish and English strings; and
poster and backdrop art is user-facing content that needs real alternative text drawn
from the title, not decorative filler.
