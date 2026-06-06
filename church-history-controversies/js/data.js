// Filioque controversy — patristic analysis data.
//
// Positions are grouped into three categories that reflect how scholars
// actually read the Fathers, rather than a flat "for / against" binary:
//
//   "endorse"  — language of double procession: the Spirit proceeds
//                "from the Father AND the Son" (Latin: Filioque).
//   "through"  — "through the Son" (per Filium / διὰ τοῦ Υἱοῦ): the Father
//                is sole cause, but the Spirit proceeds/shines through the
//                Son. The contested middle ground both sides claim.
//   "father"   — procession "from the Father alone" (ἐκ μόνου τοῦ Πατρός);
//                explicit rejection of procession from the Son.
//
// "contested" flags a Father cited in good faith by both sides.

const POSITIONS = {
  endorse: {
    id: "endorse",
    label: "Endorses the Filioque",
    short: "Endorse",
    color: "#0a84ff",
    blurb: "Language of double procession — the Spirit proceeds from the Father and the Son.",
  },
  through: {
    id: "through",
    label: "Through the Son",
    short: "Through the Son",
    color: "#bf5af2",
    blurb: "The Father is the sole cause, yet the Spirit proceeds or shines forth through the Son. The contested middle ground.",
  },
  father: {
    id: "father",
    label: "From the Father Alone",
    short: "Father Alone",
    color: "#ff9f0a",
    blurb: "Procession from the Father alone — an explicit rejection of procession from the Son.",
  },
};

const FATHERS = [
  // ───────────────────────── ENDORSE ─────────────────────────
  {
    name: "Marius Victorinus",
    dates: "c. 290 – c. 364",
    region: "West",
    position: "endorse",
    summary:
      "The Latin rhetorician-turned-theologian usually credited as the first Western writer to teach a clear double procession, working it out through his Neoplatonic Trinitarian metaphysics.",
    quote:
      "The Holy Spirit is from the Father and the Son… as the Son is from the Father, so the Holy Spirit is from the Son.",
    source: "Against Arius (Adversus Arium), I",
  },
  {
    name: "St. Hilary of Poitiers",
    dates: "c. 310 – 367",
    region: "West",
    position: "endorse",
    summary:
      "The 'Athanasius of the West.' He repeatedly names the Father and the Son together as the source of the Spirit, while also using 'receives from the Son' language.",
    quote:
      "Concerning the Holy Spirit I ought not to be silent… He is to be confessed, who is from the Father and the Son, His authors.",
    source: "On the Trinity (De Trinitate), II.29",
  },
  {
    name: "St. Ambrose of Milan",
    dates: "c. 339 – 397",
    region: "West",
    position: "endorse",
    summary:
      "Augustine's mentor and one of the most explicit pre-Augustinian witnesses to double procession in the West.",
    quote:
      "The Holy Spirit also, when He proceeds from the Father and the Son, does not separate Himself from the Father nor from the Son.",
    source: "On the Holy Spirit (De Spiritu Sancto), I.11.120",
  },
  {
    name: "St. Augustine of Hippo",
    dates: "354 – 430",
    region: "West",
    position: "endorse",
    summary:
      "The architect of the Western doctrine. He taught procession from both, while carefully guarding the Father's priority with the word principaliter ('principally') and insisting Father and Son are one principle, not two.",
    quote:
      "The Holy Spirit proceeds principally from the Father, and, by the Father's wholly timeless gift, from both Father and Son in common… yet the Father and the Son are not two principles of the Holy Spirit, but one principle.",
    source: "On the Trinity (De Trinitate), XV.26 & V.14",
  },
  {
    name: "St. Epiphanius of Salamis",
    dates: "c. 310 – 403",
    region: "East",
    position: "endorse",
    contested: true,
    summary:
      "A Greek-speaking Father, notable precisely because he uses double-procession language in the East — a key witness for Western apologists that the idea was not merely Latin.",
    quote:
      "The Spirit is from both — the Spirit of the Father and the Spirit of the Son… proceeding from the Father and receiving from the Son.",
    source: "Ancoratus, 8–9",
  },
  {
    name: "St. Cyril of Alexandria",
    dates: "c. 376 – 444",
    region: "East",
    position: "endorse",
    contested: true,
    summary:
      "Genuinely claimed by both sides. He calls the Spirit 'proper to the Son' and uses 'from the Son' language, but also 'through the Son' — which is exactly why Theodoret accused him of teaching the Spirit's procession from the Son.",
    quote:
      "The Spirit is proper to the Son and proceeds from Him, pouring forth from the Father through the Son upon creation.",
    source: "Thesaurus & Commentary on John",
  },
  {
    name: "St. Fulgentius of Ruspe",
    dates: "c. 462 – 533",
    region: "West",
    position: "endorse",
    summary:
      "A North African heir of Augustine who states the double procession as a settled rule of faith.",
    quote:
      "Hold most firmly and never doubt that the same Holy Spirit, who is the one Spirit of the Father and the Son, proceeds from the Father and the Son.",
    source: "On the Faith, to Peter (De Fide ad Petrum)",
  },
  {
    name: "The Athanasian Creed",
    dates: "Western symbol, c. 5th–6th c.",
    region: "West",
    position: "endorse",
    summary:
      "Despite its name, a Latin creed (Quicunque vult), not by Athanasius. It became a standard Western confessional witness to double procession.",
    quote:
      "The Holy Spirit is of the Father and of the Son: neither made, nor created, nor begotten, but proceeding.",
    source: "Quicunque vult",
  },

  // ──────────────────────── THROUGH THE SON ───────────────────
  {
    name: "Tertullian",
    dates: "c. 155 – c. 220",
    region: "West",
    position: "through",
    summary:
      "The earliest Latin theologian. His 'from the Father through the Son' is a per Filium formula — a precursor often cited by Western apologists, though it stops short of full double procession.",
    quote:
      "I believe the Spirit to proceed from no other source than from the Father through the Son.",
    source: "Against Praxeas, 4",
  },
  {
    name: "St. Athanasius",
    dates: "c. 296 – 373",
    region: "East",
    position: "through",
    summary:
      "Defender of the Spirit's divinity. He grounds the Spirit in the Father while binding Him intimately to the Son — 'proper to the Son' — without making the Son a cause of His being.",
    quote:
      "The Spirit is proper to the Son and proceeds from the Father; what the Son has from the Father, the Spirit has from the Son.",
    source: "Letters to Serapion, I",
  },
  {
    name: "St. Basil the Great",
    dates: "c. 330 – 379",
    region: "East",
    position: "through",
    summary:
      "Cappadocian. He fixes the Spirit's order 'after the Son and with the Son,' subsisting from the Father and made known through the Son.",
    quote:
      "The Spirit… is made known after the Son and together with Him, and has His subsistence from the Father, from whom He proceeds.",
    source: "On the Holy Spirit (De Spiritu Sancto), 18",
  },
  {
    name: "St. Gregory of Nyssa",
    dates: "c. 335 – c. 395",
    region: "East",
    position: "through",
    summary:
      "Cappadocian who most explicitly uses a causal 'through the Son' ordering while reserving ultimate causation to the Father alone — the technical heart of the Eastern per Filium.",
    quote:
      "The Spirit is from the Father, and is of the Son… proceeding from the Father through the Son.",
    source: "Against Eunomius / On 'Not Three Gods'",
  },
  {
    name: "St. Maximus the Confessor",
    dates: "c. 580 – 662",
    region: "East",
    position: "through",
    summary:
      "The great reconciler. In his Letter to Marinus he defends the Latin Filioque to Greek critics — arguing the Romans never made the Son a cause, but used 'through the Son' to express consubstantiality.",
    quote:
      "They have shown that they do not make the Son the cause of the Spirit, for they know the Father is the one cause — of the Son by begetting, of the Spirit by procession — but they show that the Spirit proceeds through the Son, and so confess the unity of the essence.",
    source: "Letter to Marinus (Opuscule 10)",
  },

  // ─────────────────────── FROM THE FATHER ALONE ──────────────
  {
    name: "St. Gregory of Nazianzus",
    dates: "329 – 390",
    region: "East",
    position: "father",
    summary:
      "'The Theologian.' His Fifth Theological Oration gives the classic Eastern grammar: the Father is unbegotten, the Son begotten, the Spirit proceeds — each property distinct and non-transferable.",
    quote:
      "The Holy Spirit… proceeding from the Father; who, inasmuch as He proceeds from that source, is no creature; and inasmuch as He is not begotten is no Son; and inasmuch as He is between the Unbegotten and the Begotten, is God.",
    source: "Oration 31 (Fifth Theological Oration), 8",
  },
  {
    name: "St. Theodoret of Cyrus",
    dates: "c. 393 – c. 458",
    region: "East",
    position: "father",
    summary:
      "Explicitly rejected 'from the Son' when he attacked Cyril's anathemas — one of the sharpest early Eastern refusals of the idea.",
    quote:
      "If [Cyril] means that the Spirit has His existence from the Son or through the Son, we reject this as blasphemous and impious; for we believe the Spirit proceeds from the Father, but is said to be of the Son as being of the same nature.",
    source: "Reproof of Cyril's Ninth Anathema",
  },
  {
    name: "St. John of Damascus",
    dates: "c. 676 – 749",
    region: "East",
    position: "father",
    summary:
      "The definitive systematizer of Eastern doctrine. He affirms 'through the Son' as manifestation while explicitly denying that the Spirit is 'from the Son' as to His origin.",
    quote:
      "We do not say that the Spirit is from the Son; but we call Him the Spirit of the Son… proceeding from the Father and resting in the Son, manifested and imparted to us through the Son.",
    source: "Exact Exposition of the Orthodox Faith, I.8",
  },
  {
    name: "St. Photius the Great",
    dates: "c. 810 – 893",
    region: "East",
    position: "father",
    summary:
      "Patriarch of Constantinople and the great polemical opponent of the Filioque. His Mystagogy made 'from the Father alone' the explicit Eastern banner.",
    quote:
      "The Spirit proceeds from the Father alone (ἐκ μόνου τοῦ Πατρός) — for if procession from the Father is perfect, what need is there of procession from the Son?",
    source: "On the Mystagogy of the Holy Spirit",
  },
];

window.FILIOQUE = { POSITIONS, FATHERS };
