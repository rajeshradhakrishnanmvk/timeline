# Stephen King book timeline

A chronological timeline of Stephen King's novels, with short original descriptions and a link out to a source page for each book. Carrie still carries the original [Gramener Comicgen](https://gramener.com/comicgen/) strip.

The site is published with classic GitHub Pages from the `main` branch (site root, no build Action). It is live at <https://rajeshradhakrishnanmvk.github.io/timeline/>.

## Add a book

Edit [`_data/books.yml`](_data/books.yml). Each entry needs:

| Field | Purpose |
| --- | --- |
| `id` | Unique fragment used as the card's `id` (letters, numbers, `_`) |
| `year` | Year shown in the card heading |
| `date` | First publication date, `YYYY-MM-DD`. The page sorts on this, so the entry can go anywhere in the file |
| `title` | Book title. Quote it if it contains an apostrophe |
| `source` | A Wikipedia or [stephenking.com](https://stephenking.com/works/) page for that book |
| `description` | A short, spoiler-light summary in your own words |
| `comic` | Optional. `carrie`, `salems-lot`, `shining`, `the-dead-zone`, `firestarter`, `roadwork`, `cujo`, `the-running-man`, `never-flinch`, `the-stand`, or `the-long-walk` attaches an existing comic panel |

Left and right placement alternates down the list after the sort. Do not set a side by hand.

Write the description yourself. Do not paste text from Wikipedia or the publisher.

## Posts and the feed

Story notes live in `_posts/` as normal Jekyll posts. They use `_layouts/post.html`. The RSS feed is the hand-written [`feed.xml`](feed.xml). GitHub Pages always loads `jekyll-feed`, and that plugin leaves an existing `feed.xml` alone, so this file is the one that publishes.

## Build locally

The site is built with the `github-pages` gem so the local result matches GitHub Pages (Jekyll 3.10, whitelisted plugins only). No custom plugins.

```bash
bundle install
bundle exec jekyll serve
```

Open <http://127.0.0.1:4000/timeline/>. `url` and `baseurl` are set in `_config.yml`.

## Comic art

Comicgen's browser build does not publish a versioned `dist/` file. `assets/vendor/comicgen/` is the build that was served at `https://gramener.com/comicgen/dist/` (the file reports version `0.4.0`). Character artwork is still requested from `https://gramener.com/comicgen/`; the saved script pins that base URL so moving the file into this repo does not break the figures.

The Never Flinch strip is fan-made, non-commercial, and based on the public publisher blurb. It is not affiliated with or endorsed by Stephen King or Scribner.

The Stand strip is fan-made, non-commercial, and based on the public publisher premise of the 1978 novel: a weaponized flu escapes, most of the world dies, and the survivors are drawn toward two opposing figures. It is not affiliated with or endorsed by Stephen King or Doubleday.

The Long Walk strip is fan-made, non-commercial, and based on the public premise of the 1979 Richard Bachman novel: teenage boys enter a walking contest that does not let them stop, warnings follow if they fall off the pace, and the last walker is promised the Prize. It is not affiliated with or endorsed by Stephen King or Signet.

The 'Salem's Lot strip is fan-made, non-commercial, and based on the public premise of the 1975 novel: writer Ben Mears returns to Jerusalem's Lot, an old hill house has long been the subject of rumor, a stranger moves in, and after dark an unease spreads through the town. A few allies mean to face it. The strip does not follow the plot past that premise. It is not affiliated with or endorsed by Stephen King or Doubleday.

The Shining strip is fan-made, non-commercial, and based on the public publisher premise of the 1977 novel: Jack Torrance takes the off-season caretaker job at the Overlook Hotel, hoping for a fresh start, time to write, and time with his family. Winter closes in, the remote hotel begins to feel sinister, and only five-year-old Danny notices forces gathering. The strip does not follow the plot past that premise. It is not affiliated with or endorsed by Stephen King or Doubleday.

The Dead Zone strip is fan-made, non-commercial, and based on the public publisher premise of the 1979 novel: schoolteacher Johnny Smith wakes after nearly five years in a coma following a car accident and finds that a touch shows him someone's past or future. People call the sight a gift and bring him their problems; he feels cursed. His fiancée has married someone else. A handshake with an ambitious politician shows him something disturbing, and he has not decided what to do. The strip does not follow the plot past that premise. It is not affiliated with or endorsed by Stephen King or Viking Press.

The Roadwork strip is fan-made, non-commercial, and based on the public publisher premise of the Richard Bachman novel (Signet, March 1981): Barton George Dawes's house and the laundry plant where he works stand in the path of a new highway extension. He refuses to step aside. The argument drives his wife and his friends away while he faces the bureaucracy that wants both places torn down. The strip does not follow the plot past that premise. It is not affiliated with or endorsed by Stephen King or Signet.

The Firestarter strip is fan-made, non-commercial, and based on the public publisher premise of the 1980 novel: at college, Andy and Vicky volunteer for a study run by a veiled agency, the Department of Scientific Intelligence, also called The Shop. The dose is called Lot Six. They later marry and have a daughter, Charlie, whom the agency never planned on. Charlie can start fires. The agency wants to capture her and use that fire, and she is on the run with her father. The strip does not follow the plot past that premise. It is not affiliated with or endorsed by Stephen King or Viking Press.

The Cujo strip is fan-made, non-commercial, and based on the public publisher premise of the novel (Viking Press, September 8, 1981): in a hot Castle Rock summer, Donna Trenton and her four-year-old son Tad are already strained while Vic is away on business. Cujo, a gentle St. Bernard, is bitten by a bat and changes. Donna and Tad drive their failing Pinto to a remote farm garage, and it breaks down there, leaving them stuck in the car as the dog appears. The strip does not follow the plot past that premise. It is not affiliated with or endorsed by Stephen King or Viking Press.

The Running Man strip is fan-made, non-commercial, and based on the public premise of the 1982 Richard Bachman novel (Signet, May 1982): in a bleak near-future, a desperate, broke father whose baby daughter is sick signs up for a deadly television game show, The Running Man. He must stay alive while the public is paid to report him and hunters track him down. The strip does not follow the plot past that premise. Dialogue is original. It is unofficial fan work, not affiliated with or endorsed by Stephen King or his publishers.

- **Comicgen** by Gramener ([gramener.com/comicgen](https://gramener.com/comicgen/), [github.com/gramener/comicgen](https://github.com/gramener/comicgen)); code under MIT.
- **Character art** uses Comicgen CC0 character assets, including Sophie. The Running Man strip uses Ethan by Devarani B; Dee, Dey, and Ringo by Ramya Mylavarapu; and Bill by Renel McCullum (CC0). Sheila is Dee. The producer is Bill. The baby is original fan art in that flat style.
- **Noto emoji** (envelope) © Google Inc., Apache License 2.0.
- **Fonts:** Patrick Hand and Bangers, SIL Open Font License 1.1.
