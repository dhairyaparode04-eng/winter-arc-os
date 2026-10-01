# Winter Arc OS — Cloud-first JEE PWA

This build contains the complete product shell discussed in the conversation.

## Included
- Google OAuth hook + username onboarding
- JEE countdown with 20 Jan fallback
- Dashboard, Winter Arc modes, Study Planner
- CBT Arena: full/subject/chapter/sub-topic/custom/adaptive/weakness test flows
- CBT history, time-management analysis, question tags
- Focus timer and daily boss battle
- Analytics, heatmap, subject and study-type distribution
- Revision engine and spaced revision
- Error Book, doubts, bookmarks
- Friends, requests, privacy controls, team challenges
- Rewards, XP, achievements, personal bests
- Profile/settings
- Cloud-first Supabase/Postgres schema with RLS owner policies
- PWA manifest

## Run locally
1. Copy `config.example.js` to `config.js`.
2. Add your Supabase project URL and public anon key.
3. Add `<script src="config.js"></script>` before `app.js` in `index.html`.
4. Run with any static server, e.g. `python -m http.server 8080`.
5. Open http://localhost:8080

## Supabase
Run `schema.sql` in Supabase SQL Editor.
Enable Google provider in Supabase Authentication.
Create redirect URLs for your deployed site.
Before production, add privacy-aware RLS policies for accepted-friend shared data and server-side functions for XP/achievement awarding.

## Question bank / PYQs
The CBT engine is intentionally a content shell. Populate it with question data you have the right to use/licence. Do not copy or redistribute copyrighted question banks without permission.

## Important
The included demo mode is for UI exploration. It does not pretend that cloud auth/storage is connected until Supabase credentials are supplied.


## Official JEE source integration
The CBT Arena includes an official-source library pointing to the NTA JEE Main website/question-paper area. It is designed to open the official material rather than bulk-republish protected question text. Before importing any question text/images/solutions into the database, verify the applicable NTA/third-party reuse permission or license.
