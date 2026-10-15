"""Builds the site's pages from the shared header/footer/menu below.

Run from anywhere:  python3 build.py

Writes: driftless.html, between-rivers.html, gamers.html, family-drift.html,
related-ideas.html and about.html (fully generated: edit their text HERE,
not in the .html files, or the next build will overwrite it).
index.html: only its header and footer are regenerated; the project
sections inside <main> are kept as written in index.html.

Every page gets <body class="h-layout">: on landscape screens 900px+ wide the
<main> becomes one sideways-scrolling row under the header (footer hidden);
narrower or portrait screens stack vertically with the footer (styles.css).
"""
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

NAV = [("index.html", "Home"), ("driftless.html", "Driftless"), ("between-rivers.html", "Between rivers"),
       ("gamers.html", "gamers"), ("family-drift.html", "Family drift"), ("related-ideas.html", "related ideas"),
       ("about.html", "about")]

def bar(tag, current):
    cur = ' aria-current="page"'
    items = "\n".join(
        f'        <a href="{h}"{cur if h == current else ""}>{t}</a>' for h, t in NAV)
    mid = f"{tag}-menu"
    return f'''  <{tag} class="bar">
    <a class="wordmark" href="index.html">Todd Deutsch</a>
    <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="{mid}">
      <img src="assets/menu-header.svg" width="40" height="40" alt="">
    </button>
    <nav class="menu" id="{mid}" aria-label="Site" hidden>
{items}
    </nav>
  </{tag}>'''

def head(title, fonts, scripts=("menu.js", "hscroll.js")):
    script_tags = "".join(f'  <script src="{js}" defer></script>\n' for js in scripts)
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
{script_tags}</head>
<body class="h-layout">
'''

TAIL = "</body>\n</html>\n"

STATEMENT = [
    ("", "Lorem ipsum dolor sit amet consectetur. Ut amet nisi metus posuere euismod a lectus. Sollicitudin scelerisque nascetur venenatis at malesuada id. Faucibus sed porta semper neque tellus nulla. Egestas imperdiet vitae amet tellus mauris. Aenean egestas malesuada nunc dui lobortis dictum blandit lacus. A ac sed mus neque venenatis ullamcorper praesent."),
    ("", "Faucibus consectetur vulputate vitae natoque vulputate ante nulla cursus id. Vulputate consectetur eget odio et eu faucibus duis. Risus morbi donec magnis tortor enim ullamcorper odio quisque etiam. Sit convallis sodales purus et leo. Malesuada ipsum amet pulvinar et in ut."),
    (' class="new-stanza"', "Ligula diam duis in lorem. Tellus tincidunt vitae turpis integer aliquam non lectus viverra commodo. Lectus sagittis massa id arcu consectetur tempus netus felis. Mauris sollicitudin nunc nullam interdum a viverra sagittis lectus consectetur. Urna sit nunc etiam facilisis. Cursus diam sit fames viverra. Tempus tristique massa convallis nulla vitae vestibulum nec cursus. Donec cras lorem et volutpat bibendum pharetra ante lobortis imperdiet. Turpis mi donec rhoncus sem. Egestas nec purus consectetur in sociis malesuada nunc."),
    (' class="new-stanza"', "Arcu posuere consequat orci lectus elementum nascetur dignissim sed. Mi nunc turpis eget risus vitae tellus semper. Nunc vulputate viverra neque posuere nam pulvinar sociis. Malesuada tempus porttitor auctor ultrices venenatis. Neque amet fames condimentum maecenas. Volutpat vitae et egestas a enim eu. In sed augue viverra ipsum turpis scelerisque nibh. Tellus urna amet porttitor in. Tellus massa scelerisque arcu cursus. Nibh donec dui orci feugiat facilisi gravida. Pulvinar lectus eu nunc aenean nec leo nulla. Amet dictum mauris risus tortor sit."),
    (' class="new-stanza"', "Et quam nisi elit diam. Turpis facilisis iaculis eget dictum eros nunc id vel diam. Morbi quis mattis interdum bibendum. Massa molestie feugiat imperdiet porttitor potenti porttitor nibh. In."),
]

# Real statements; galleries not listed here use the placeholder STATEMENT above
STATEMENTS = {
    "between-rivers": [
        ("", "Between Rivers is about place and belonging at the confluence of the Mississippi and the St. Croix. The city of Prescott, Wisconsin, is located where the two rivers converge. I moved there in 2007, and I still feel like a visitor. Like many small towns, there is a soft line dividing those who were born there from those who were not. Their experience of the place is much different -- for better or for worse -- than those of us who are considered recent arrivals. A constellation of common family names identifies lifelong residents. They are linked by birth, marriage, and community affiliations that form an umbrella of kinship and shared experience. They inherited a web of connections that shape their understanding of the place in ways that I will never fully comprehend."),
        (' class="new-stanza"', "The geography surrounding Prescott is characterized by separation, a necessary precursor to convergence. A drawbridge provides the only route into town from the West and marks the border between Minnesota and Wisconsin. The road leading to the bridge runs along Point Douglas, a narrow finger of land that funnels traffic between the rivers. It’s hard to travel that route and not feel a sense of compression and release, of coming together and breaking apart. I understand the place as a parade of quietly opposing forces: young and old, red and blue, insider and outsider, water and ground. These photographs are motivated by a desire to reconcile the tension in opposition, to find belonging in not belonging. They are a record of inhabiting shared space, of reaching out and wandering."),
    ],
    "gamers": [
        ("", "The photographs in Gamers were made at Local Area Network (LAN) parties in suburban Minneapolis and St. Paul. Avid gamers take over empty storefronts and set up temporary networks for head- to- head gaming. Players bring their computers, sleeping bags, and enough caffeine to survive two days of nonstop video combat."),
        (' class="footnote"', "<small>* This work was supported in part by a fellowship from the University of Minnesota/ McKnight Foundation Artist Fellowship for Photographers Program, with funds made available by The McKnight Foundation.</small>"),
    ],
    "family-drift": [
        ("", "I started making photographs of my family shortly before my first son was born in 1997. The pictures became a way to maintain an even keel in the midst of rapid change. We now have three boys and are awaiting a fourth. As they grow older the desire for assurance that everything will fall into place is undermined by the reality that no such certainty exists. There is no single destination, only perpetual movement. Being a father, as it turns out, is a process of constant adjustment and evaluation. I find myself being carried along by the current rather than heading deliberately and confidently forward. I am chasing the family drift with the hope that knowing where we have been will provide insight into where we are going."),
        (' class="new-stanza"', "My great- grandparents recorded milestone events in a family bible. Birth, baptism, marriage, and death created a simple and reliable narrative path describing our family history. These records are now kept in photo albums. Although the format has a less religious overtone, the element of ritual remains intact. Yearly school photographs, along with snapshots of birthdays, holidays, and vacations make up the bulk of these obviously selective, routine histories. They describe an optimistically simple and peaceful version of family life; one in which change is predictable and effortless. But what is left is a broad outline that ignores the complexity and richness of the life it is meant to recall. The reality, of course, is that it has never been as peaceful (or organized as efficiently) as the photographs might suggest. Chasing the Family Drift is a way of staying mindful of the time spent in the gaps."),
        (' class="statement-art"', '<img src="assets/family-drift/oscar-drawing.jpg" width="600" height="509" alt="Child’s drawing of five stick figures">'),
    ],
    "related-ideas": [],  # no statement yet: the panel shows just the title band
}

# Photos in Figma order, from assets/<slug>/; galleries not listed here get 10 placeholder plates
IMAGES = {
    "between-rivers": [
        "020715_1010487_ff-edit-01", "011315_1009706_ff-edit-01", "012815_1010160_ff-edit-01",
        "011515_2470-edit-01", "053016_1013034", "012015_1009813-edit-01", "031115_1011037_ff-edit-1",
        "033115_1011198_ff-edit-1", "060815_1011861-edit-1", "053116_1013127", "031715_1011078_ff-edit-1",
        "020715_1010475_ff-edit-01", "010815_1009571-edit-01", "010815_1009549-edit-01-2",
        "061015_1011877-edit-1", "090514_1008576-edit-01", "063014_1008310-edit-01",
        "033115_1011197_ff-edit-1", "011315_1009717_ff-edit-01", "011315_1009692_ff-edit-01",
    ],
    # order from the old site
    "gamers": [
        "110505-8077v3", "110505-8073v2", "031206-8945v3", "081906-0437", "082006-0469",
        "110405-7896v3", "031006-0100-v3", "111205-8341-v2", "120205-8568", "120305-8764",
        "120305-8694v4", "092405-7115", "092405-7025v5", "031006-0118-v3", "082006-0448",
        "010806-9478v2", "111205-8369-v8", "120305-8685", "110505-8231-v3",
    ],
    "family-drift": [
        "070104v2b-x7", "072707-_mg_3269-x7", "090905-6535b-x7", "011108-0629x18cr", "062107-00873-cr-x7",
        "061904v2d-x7", "122506-1709b-x7", "072405-3515-x7", "032407-2454-x7", "062407-_mg_3053-x7",
        "071907-_mg_3119-x7", "080204v3-x14", "032407-2474v2-x7", "122706-1750-rtb-x7", "061208-0413c-x14",
        "072807-3340-x7", "070304v2-x7", "071704v2b-x7", "032304v2b-x7", "011407-1790v2-x7",
        "040107-00018-rt-crcx7", "072904v2-x7",
    ],
    # sequenced for flow: beds, motion, tables and gatherings, then outdoors
    "related-ideas": [
        "b01-22b-final", "06-21-00-final", "02-09-00-final",
        "08-09-00-final", "03-01-00-final", "03-08-00-final", "c10-32-final", "c39-33-final",
        "d35-03-final", "b12-10-final", "e01-36-final", "b19-17-final", "f21-28-final", "g05-33-final",
    ],
}

GALLERIES = [
    # slug, title, plate color (placeholders), statement card color, band color, title color, statement weight
    # (Gamers and Related Ideas bands are the solid colors their old see-through bands showed over gray;
    # Between Rivers' band is the blue its old half-see-through band showed over the old blue card)
    ("driftless", "Driftless", "#d2d2d2", "#fff", "#ececec", "#000", None),
    ("between-rivers", "Between Rivers", "#b7c3d1", "#fff", "#b6c5d4", "#000", None),
    ("gamers", "Gamers", "#717171", "#fff", "#38373d", "#fff", None),
    ("family-drift", "Family Drift", "#fff", "#fff", "#b0bdb6", "#000", None),
    ("related-ideas", "Related Ideas", "#7d7564", "#fff", "#39352f", "#fff", "700"),
]

GALLERY_FONTS = "family=Jost:ital,wght@0,200;0,300;0,700;1,300&family=Julius+Sans+One"

def jpeg_size(path):
    """(width, height) read from a JPEG's frame header."""
    d = open(path, "rb").read()
    i = 2
    while i < len(d):
        marker, length = d[i + 1], int.from_bytes(d[i + 2:i + 4], "big")
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            return int.from_bytes(d[i + 7:i + 9], "big"), int.from_bytes(d[i + 5:i + 7], "big")
        i += 2 + length
    raise ValueError(f"no size found in {path}")

def gallery_page(slug, name, plate, card, band, ink, weight):
    page = f"{slug}.html"
    paras = "\n".join(f"        <p{c}>{t}</p>" for c, t in STATEMENTS.get(slug, STATEMENT))
    text = f'      <div class="statement-text">\n{paras}\n      </div>\n' if paras else ""
    wstyle = f"; --statement-weight: {weight}" if weight else ""
    if slug in IMAGES:
        def photo(i, f):
            src = f"assets/{slug}/{f}.jpg"
            w, h = jpeg_size(src)
            return (f'    <img class="plate photo" src="{src}" width="{w}" height="{h}" style="--ar: {w} / {h}"'
                    f' alt="{name}, photograph {i}" loading="lazy" decoding="async">')
        plates = "\n".join(photo(i, f) for i, f in enumerate(IMAGES[slug], 1))
    else:
        plates = "    <!-- Placeholder plates: list photos in IMAGES above to replace them -->\n" + \
            "\n".join('    <div class="plate"></div>' for _ in range(10))
    html = head(f"{name} — Todd Deutsch", GALLERY_FONTS) + bar("header", page) + f'''

  <main class="gallery" tabindex="0" aria-label="Gallery" style="--plate-bg: {plate}; --statement-bg: {card}; --band-bg: {band}; --title-color: {ink}{wstyle};">
    <section class="plate statement">
      <h1 class="statement-band"><span class="title">{name}</span></h1>
{text}    </section>

{plates}
  </main>

''' + bar("footer", page) + "\n" + TAIL
    open(page, "w").write(html)

for g in GALLERIES:
    gallery_page(*g)

ABOUT = [
    ("", "Lorem ipsum dolor sit amet consectetur. Sit aliquam elit enim mattis pellentesque senectus. Facilisis tincidunt facilisi laoreet in morbi sed. Lectus morbi duis semper cras. Vitae cursus volutpat sed amet. Lorem at tortor vitae tincidunt. Sagittis cursus vulputate sapien volutpat arcu fermentum ac fermentum. At dui ipsum egestas faucibus integer viverra sagittis. Eu adipiscing bibendum facilisis aenean ut nunc malesuada turpis vestibulum. Enim leo vel mi venenatis mauris vivamus mollis at lorem."),
    ("", "Morbi cursus sem in at sed tincidunt odio purus. Fusce et mauris libero accumsan vulputate ligula orci volutpat. Massa potenti tempus vulputate nibh gravida adipiscing tortor vulputate ut. Ut donec varius natoque urna sagittis faucibus elit cursus nulla. Fringilla lacus nunc elit fermentum quis amet velit. Massa ipsum volutpat ipsum pulvinar lectus at. Malesuada adipiscing nunc ut placerat nisl neque ac."),
    (' class="new-stanza"', "In in orci arcu facilisi aliquet pellentesque velit. Proin nunc lacus risus turpis. Cursus posuere purus vitae gravida ridiculus sem. Sit pulvinar vitae pellentesque interdum feugiat lectus donec fermentum habitant. Volutpat id ut lacinia placerat cras condimentum. Aliquet orci adipiscing sed eleifend pulvinar et sem morbi. Nulla mattis eu nullam elementum massa fermentum enim."),
    ("", "Massa dui morbi ipsum mauris arcu. Vestibulum risus pellentesque duis ultrices facilisis tincidunt. Netus amet porttitor hac semper. Volutpat hac dui nec ut ut purus etiam. Et quam hac ipsum vehicula ultricies."),
    (' class="new-stanza"', "Nec mauris vitae risus condimentum sed vulputate nisi leo. Enim accumsan sed ut diam est urna ut eu. Commodo pellentesque convallis adipiscing arcu nulla vestibulum. Rhoncus est dui varius purus consectetur et. Adipiscing turpis est pharetra viverra feugiat turpis."),
    ("", "Lobortis quis facilisis adipiscing a pharetra sit commodo vel. Nunc amet lectus ut neque. Tincidunt in vitae ac amet viverra nullam. Turpis sapien sem nibh leo. Dictum nulla odio non sed in adipiscing non imperdiet semper. Mi nisl vitae eget morbi. Semper vulputate vitae."),
]
NOTES = ["Lorem ipsum dolor sit amet consectetur.", "Pellentesque magna lectus sed nulla sed risus.", "Dui cras quis gravida aliquam suscipit sapien."]
bio = "\n".join(f"      <p{c}>{t}</p>" for c, t in ABOUT)
notes = "\n".join(f"      <p>{t}</p>" for t in NOTES)
html = head("About — Todd Deutsch", "family=Julius+Sans+One") + bar("header", "about.html") + f'''

  <main class="about" tabindex="0">
    <div class="about-bio">
{bio}
    </div>
    <div class="about-notes">
{notes}
    </div>
  </main>

''' + bar("footer", "about.html") + "\n" + TAIL
open("about.html", "w").write(html)

# Home page: swap the header/footer for the shared bar, keep the project sections as they are
s = open("index.html").read()
main = s[s.index("  <main"):s.index("</main>") + len("</main>")]
main = main.replace('<main class="projects">', '<main class="projects" tabindex="0" aria-label="Projects">')
html = head("Todd Deutsch", "family=Jost:wght@200&family=Julius+Sans+One") + bar("header", "index.html") + "\n\n" + main + "\n\n" + bar("footer", "index.html") + "\n" + TAIL
open("index.html", "w").write(html)
