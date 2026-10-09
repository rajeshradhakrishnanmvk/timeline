# Stephen King book timeline

A chronological timeline of Stephen King's novels, with short original descriptions and a link out to a source page for each book. Three early cards still carry the original [Gramener Comicgen](https://gramener.com/comicgen/) strips.

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
| `comic` | Optional. `carrie`, `salems-lot`, `shining`, `never-flinch`, or `the-stand` attaches an existing comic panel |

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

- **Comicgen** by Gramener ([gramener.com/comicgen](https://gramener.com/comicgen/), [github.com/gramener/comicgen](https://github.com/gramener/comicgen)); code under MIT.
- **Character art** uses Comicgen CC0 character assets, including Sophie.
- **Noto emoji** (envelope) © Google Inc., Apache License 2.0.
- **Fonts:** Patrick Hand and Bangers, SIL Open Font License 1.1.
