export const homeStoryChapters = [
  {
    id: 'foundation',
    index: '01',
    label: 'Foundation',
    title: 'Soft structure sets the rhythm before color ever does.',
    description:
      'Our opening chapter pairs breathable foundations with silhouette-first layering, so the collection reads refined before it reads seasonal.',
    details: [
      'Organic cotton bases designed to sit clean under tailoring.',
      'Low-contrast palettes that keep proportion and texture in focus.',
    ],
    media: {
      src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=80',
      alt: 'Editorial portrait with soft neutral tailoring',
    },
    caption: 'Light, cotton, restraint.',
  },
  {
    id: 'movement',
    index: '02',
    label: 'Movement',
    title: 'Relaxed volume makes the story feel lived in, not staged.',
    description:
      'Lengths lengthen, shoulders soften and the collection opens into pieces made to move with the day instead of fighting for attention.',
    details: [
      'Dropped proportions keep layers fluid on the body.',
      'Fabric weight stays balanced so the silhouette moves without collapse.',
    ],
    media: {
      src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=80',
      alt: 'Model walking in layered contemporary fashion',
    },
    caption: 'Volume with control.',
  },
  {
    id: 'finish',
    index: '03',
    label: 'Finish',
    title: 'Surface, hand-feel and craft carry the final note.',
    description:
      'Close inspection reveals the collection’s real luxury: dependable fabrication, tactile comfort and the quiet confidence of pieces meant to be worn often.',
    details: [
      'Materiality is treated as product proof, not decoration.',
      'Every finish is calibrated for repeat wear and visual calm.',
    ],
    media: {
      src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1400&q=80',
      alt: 'Close-up editorial image highlighting garment texture',
    },
    caption: 'Craft visible at arm’s length.',
  },
]

export const lookbookData = {
  hero: {
    eyebrow: 'Collection Story',
    title: 'Quiet Motion',
    subtitle:
      'An editorial route through cotton, proportion and the kind of material clarity that only gets stronger in motion.',
    media: {
      src: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=2000&q=80',
      alt: 'Cinematic editorial fashion portrait in shadow',
    },
    primaryCta: {
      label: 'Shop Featured Pieces',
      href: '/collection/featured',
    },
    secondaryCta: {
      label: 'Browse the Collection',
      href: '/collection',
    },
  },
  chapters: [
    {
      id: 'chapter-foundation',
      index: '01',
      label: 'Foundation',
      shopCollectionHandle: 'tops',
      shopTitle: 'Shop the foundation',
      shopDescription:
        'Cotton-led layers and clean silhouettes selected from the live store catalogue.',
      title: 'The collection opens with cotton that feels immediate and deliberate.',
      intro:
        'Texture leads the first impression: jersey, brushed interiors and breathable layers that keep the story grounded in wearability.',
      body:
        'Nothing is overloaded. The opening silhouette stays clean so material hand-feel and proportion can do the work, letting the product read premium without noise.',
      media: {
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80',
        alt: 'Minimal editorial styling with cotton essentials',
      },
      notes: [
        {
          label: 'Material cue',
          value: 'Cotton-led foundations keep the collection tactile before it becomes directional.',
        },
        {
          label: 'Fit direction',
          value: 'Relaxed cuts maintain shape without looking oversized for effect.',
        },
      ],
      cta: {
        label: 'Shop Tops',
        href: '/collection/tops',
      },
    },
    {
      id: 'chapter-layering',
      index: '02',
      label: 'Layering',
      shopCollectionHandle: 'featured',
      shopTitle: 'Shop the layering story',
      shopDescription:
        'A tighter edit of pieces that carry the collection’s depth, softness and shadow.',
      title: 'Midweight layers create depth through shadow, not ornament.',
      intro:
        'This chapter shifts the cadence. Hoodies, outer layers and softened tailoring stack tone on tone so the eye reads volume gradually.',
      body:
        'The result is a lookbook that feels cinematic without becoming theatrical. Pieces are composed to be re-worn, combined and lived with across different moments of the day.',
      media: {
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80',
        alt: 'Layered neutral tailoring styled for an editorial story',
      },
      notes: [
        {
          label: 'Visual rhythm',
          value: 'Sticky media slows the pace while text chapters continue moving forward.',
        },
        {
          label: 'Product proof',
          value: 'Soft interiors and structured exteriors share the same low-noise palette.',
        },
      ],
      cta: {
        label: 'View Featured',
        href: '/collection/featured',
      },
    },
    {
      id: 'chapter-finish',
      index: '03',
      label: 'Finish',
      shopCollectionHandle: 'bottoms',
      shopTitle: 'Shop the finish',
      shopDescription:
        'The final edit closes on grounded essentials that keep the full look wearable.',
      title: 'The final passage is about staying power: feel, durability and calm confidence.',
      intro:
        'Close-up framing gives the last word to fabrication. What matters here is not spectacle, but how the material promise survives daily wear.',
      body:
        'That is the thesis of the collection: premium product language built on real construction details, not moodboards alone. It is why the story resolves in material clarity.',
      media: {
        src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=80',
        alt: 'Close-up of premium fabric texture and tailored drape',
      },
      notes: [
        {
          label: 'Material focus',
          value: 'Descriptions and product copy surface fabrication instead of relying on generic luxury language.',
        },
        {
          label: 'Exit point',
          value: 'The route closes by sending the user back to the store with stronger product confidence.',
        },
      ],
      cta: {
        label: 'Explore All Products',
        href: '/collection',
      },
    },
  ],
  closing: {
    eyebrow: 'End of Story',
    title: 'Built to be worn often, remembered quietly.',
    description:
      'The editorial finishes where commerce gets strongest: in product pages that now surface real material notes with the same restraint as the rest of the experience.',
    primaryCta: {
      label: 'Enter the Store',
      href: '/collection',
    },
    secondaryCta: {
      label: 'Return Home',
      href: '/',
    },
  },
}
