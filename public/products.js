/* =========================================================================
   MULTI-PRODUCT CONFIG  —  mx-ttshop
   Para agregar un producto nuevo: añade una entrada aquí con su "slug",
   crea la carpeta /<ruta>/ con el shell del landing (copia otro y cambia
   PRODUCT_SLUG). El checkout, el pago, los upsells y la verificación se
   reutilizan tal cual — solo cambia la slug.
   ========================================================================= */
(function () {
  var IMG = {
    negro:   'https://arg.patioar.com/images/patinete/negro.webp',
    azul:    'https://arg.patioar.com/images/patinete/azul.webp',
    rosa:    'https://arg.patioar.com/images/patinete/rosa.webp',
    blanco:  'https://arg.patioar.com/images/patinete/blanco.webp',
    naranja: 'https://arg.patioar.com/images/patinete/naranja.webp',
    features:'https://arg.patioar.com/images/patinete/features.webp',
    g1: 'https://arg.patioar.com/images/patinete/g1.webp',
    g2: 'https://arg.patioar.com/images/patinete/g2.webp',
    g3: 'https://arg.patioar.com/images/patinete/g3.webp',
    rev1: 'https://arg.patioar.com/images/patinete/rev1.webp',
    rev2: 'https://arg.patioar.com/images/patinete/rev2.webp',
    rev3: 'https://arg.patioar.com/images/patinete/rev3.webp',
    rev4: 'https://arg.patioar.com/images/patinete/rev4.webp'
  };
  var A = 'https://arg.patioar.com/images/armario/';
  var SF = 'https://arg.patioar.com/images/sofa/';
  var C = 'https://arg.patioar.com/images/panelas/';
  var G = 'https://arg.patioar.com/images/gazebo/';
  var ME = 'https://arg.patioar.com/images/mesa/';
  var AD = 'https://arg.patioar.com/images/adirondack/';
  var ADC = { 'Azul marino': AD + 'g-azul.webp?v=2', 'Blanco': AD + 'g-blanco.webp?v=2', 'Turquesa': AD + 'g-turquesa.webp?v=2', 'Negro': AD + 'g-negro.webp?v=2', 'Marrón': AD + 'g-marron.webp?v=2' };
  var NEV = 'https://arg.patioar.com/images/nevera/';
  var NIN = 'https://arg.patioar.com/images/ninja/', SUN = 'https://arg.patioar.com/images/sunfield/', MON = 'https://arg.patioar.com/images/monaco/', PIA = 'https://arg.patioar.com/images/piave/', ASA = 'https://arg.patioar.com/images/asador/';

  window.PRODUCTS = {

    'sofa-plegable-kivenjaja': {
      slug: 'sofa-plegable-kivenjaja',
      giftBonus: 'Juego de Sábanas Ajustables',
      cartBumps: [
        {
          slug: 'bateria-cocina-ceramica', offer: '1', color: 'Crema',
          name: 'Set de 10 Ollas de Cerámica',
          variant: 'Antiadherente · 10 piezas',
          img: '/__l5e/assets-v1/79c3b264-48c8-4dc7-9836-80f76e026462/ollas-v2.png', price: 16900, was: 112900,
          tag: '🎁 Completa tu cocina', hint: 'Oferta solo aquí', badge: '-85%',
          ttl: 'Set de 10 Ollas de Cerámica',
          benef: 'Antiadherente · Apta para toda estufa · 10 piezas incluidas'
        },
        {
          slug: 'mesa-plegable-fold', offer: '1', color: 'Blanco',
          name: 'Mesa Plegable FoldEase 180 cm',
          variant: 'Blanco · 180 cm',
          img: '/__l5e/assets-v1/feff8f84-07b3-4f73-8722-c07e4bfb67eb/mesa-v2.png', price: 19900, was: 79900,
          tag: '🎁 Añade a tu pedido', hint: 'Oferta solo aquí', badge: '-75%',
          ttl: 'Mesa Plegable FoldEase 180 cm',
          benef: 'Plegable y portátil · 180 cm · Ideal para camping, fiestas y jardín'
        }
      ],
      url: '/sofa/kivenjaja/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'KIVENJAJA',
      shopInitials: 'KV',
      shopName: 'KIVENJAJA',
      title: 'Sofá Plegable Sin Marco 78.7" (200 cm) — Convertible en Cama Doble, Tela Chenille Suave y Espuma de Alta Densidad, Incluye 2 Cojines, Sin Ensamblaje (Gris)',
      shortName: 'Sofá Plegable KIVENJAJA',
      variant: 'Gris',
      variantFull: 'Gris / 200 × 98 × 60.5 cm',
      price: 17900,
      was: 97000,
      discount: '-82%',
      currency: 'ARS',
      rating: '4.9',
      reviewsCount: '8,641',
      sold: '8,641 vendidos',
      stock: 12,
      metaTitle: 'Sofá Plegable Sin Marco KIVENJAJA 78.7" — Convertible en Sofá-Cama, Tela Chenille | Envío Gratis Argentina',
      metaDesc: 'Sofá plegable sin marco KIVENJAJA de 78.7 pulgadas: se convierte de sofá para 2 personas a cama doble. Tela chenille suave, espuma de alta densidad, incluye 2 cojines, sin ensamblaje. Color gris. Envío gratis a toda Argentina.',
      gallery: [
        { src: SF + 'g1.jpg', alt: 'Sofá plegable KIVENJAJA gris para dos personas' },
        { src: SF + 'g2.jpg', alt: 'Sofá KIVENJAJA — detalle de la tela chenille' },
        { src: SF + 'g3.jpg', alt: 'Sofá KIVENJAJA convertido en cama doble' },
        { src: SF + 'g4.jpg', alt: 'Sofá KIVENJAJA — detalle de acolchado' },
        { src: SF + 'g5.jpg', alt: 'Sofá KIVENJAJA — reposabrazos amplios' },
        { src: SF + 'g6.jpg', alt: 'Sofá KIVENJAJA — incluye dos cojines' },
        { src: SF + 'g7.jpg', alt: 'Sofá plegable KIVENJAJA color gris, vista completa' }
      ],
      colors: [
        { name: 'Gris', img: SF + 'g1.jpg' }
      ],
      offers: [
        { id: '1u', name: '1 Sofá Plegable', price: 17900, was: 97000, discount: '-82%', img: SF + 'g1.jpg' },
        { id: '2u', name: '2 Sofás Plegables', badge: 'MEJOR VALOR', price: 29900, was: 194000, discount: '-85%', img: SF + 'g7.jpg' }
      ],
      whyCheap: 'Oferta de liquidación limitada en el sofá plegable KIVENJAJA. Producto 100% original, con garantía completa y devolución gratis en 30 días. Una vez agotada esta promoción, el precio vuelve a <b>$97.000 ARS</b>.',
      description: 'Este sofá plegable KIVENJAJA de tamaño completo (78.7 pulgadas) ofrece dos formas en un solo producto. Voltea el respaldo fácilmente para cambiar entre sofá para dos personas y cama doble. Está cubierto con tela chenille suave y acolchado con espuma flexible de alta densidad, e incluye dos cojines. Ideal para departamentos pequeños, salas y oficinas — sin ensamblaje, listo para usar. Color gris.',
      specs: [
        ['Marca', 'KIVENJAJA'],
        ['Tipo de producto', 'Sofá convertible (sofá-cama)'],
        ['Dimensiones', '200 × 98 × 60.5 cm (78.7 × 38.58 × 23.81 pulg)'],
        ['Tela', 'Chenille suave'],
        ['Relleno', 'Espuma flexible de alta densidad'],
        ['Incluye', '2 cojines'],
        ['Ensamblaje', 'No requiere'],
        ['Color', 'Gris'],
        ['Garantía', 'Devolución gratis en 30 días']
      ],
      descExpanded: true,
      descImages: [
        { src: SF + 'b1.jpg', alt: 'Sofá KIVENJAJA — vista completa en la sala' },
        { src: SF + 'g3.jpg', alt: 'Se convierte en cama doble en segundos' },
        { src: SF + 'b2.jpg', alt: 'Tela chenille suave y resistente' },
        { src: SF + 'g6.jpg', alt: 'Incluye dos cojines a juego' }
      ],
      reviewsRecommend: '98%',
      ratingBars: [
        { lbl: '5★', w: '92%', pct: '92%' },
        { lbl: '4★', w: '5%',  pct: '5%' },
        { lbl: '3★', w: '2%',  pct: '2%' },
        { lbl: '2★', w: '1%',  pct: '1%' },
        { lbl: '1★', w: '0%',  pct: '0%' }
      ],
      reviewPhotos: [],
      reviews: [
        { nm: 'Carlos M.', stars: 5, date: '15 de enero de 2026', text: 'Compré el sofá hace un mes y ¡está increíble! El color gris es elegante y la tela es muy suave. Convertirlo de sofá a cama es fácil y rápido. Perfecto para mi departamento pequeño.' },
        { nm: 'María G.', stars: 5, date: '10 de enero de 2026', text: 'Lo uso en la sala y convertirlo en cama es muy útil para recibir visitas. Sin ensamblaje y una idea excelente. La espuma de alta densidad es cómoda para sentarse mucho tiempo.' },
        { nm: 'Diego R.', stars: 5, date: '5 de enero de 2026', text: 'Honestamente, superó mis expectativas. Excelente calidad y diseño moderno. Los reposabrazos son amplios y útiles. La tela chenille es suave y resistente. El empaque fue cuidadoso y el envío llegó rápido.' }
      ]
    },

    'ninja-licuadora': {
      slug: 'ninja-licuadora',
      url: '/licuadora/ninja/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'Ninja', shopInitials: 'NJ', shopName: 'Ninja',
      title: 'Licuadora y Procesador de Alimentos Ninja 3 en 1 — Sistema de Cocina de 1400 W con Vaso de 2.1 L, Tazón Procesador y Vasos Portátiles (BN801)',
      shortName: 'Licuadora Ninja 3 en 1',
      variant: 'Sistema 3 en 1', variantFull: 'Sistema de cocina 3 en 1 · 1400 W',
      price: 299, was: 999, discount: '-70%', currency: 'ARS',
      rating: '4.9', reviewsCount: '3,187', sold: '9,540 vendidos', stock: 10,
      descExpanded: true,
      metaTitle: 'Licuadora y Procesador Ninja 3 en 1 1400 W (BN801) | Envío Gratis Argentina',
      metaDesc: 'Sistema de cocina Ninja 3 en 1 de 1400 W: licúa, procesa y prepara bebidas para llevar. Vaso de 2.1 L, tazón procesador y vasos portátiles. Envío gratis a toda Argentina.',
      gallery: [
        { src: NIN + 'g-combo.webp',   alt: 'Sistema Ninja 3 en 1: licuadora, procesador y vasos portátiles' },
        { src: NIN + 'g-blender.webp', alt: 'Licuadora Ninja de alta potencia con frutas' },
        { src: NIN + 'g-system.webp',  alt: 'Sistema de cocina Ninja 3 en 1 completo' }
      ],
      colors: [],
      offers: [
        { id: '1', name: 'Sistema Ninja 3 en 1 (1400 W)', price: 299, was: 999, discount: '-70%', badge: 'ENVÍO GRATIS', img: NIN + 'g-combo.webp' }
      ],
      whyCheap: 'Liquidamos el inventario de esta línea para dar entrada al nuevo modelo. Cada equipo es 100% nuevo, sellado y con garantía. Cuando se agote, el precio vuelve a <b>$999 ARS</b>.',
      description: 'Sistema de cocina Ninja 3 en 1 con motor de 1400 W que licúa, pica y procesa sin ocupar espacio de más. Incluye vaso de 2.1 L para smoothies y bebidas frías, tazón procesador para picar, moler y hacer masa, y vasos portátiles para llevar tu bebida a donde vayas. Las cuchillas de acero inoxidable trituran hielo y frutas congeladas en segundos, y todas las piezas son aptas para lavavajillas. Diseño moderno y compacto, ideal para cualquier cocina.',
      specs: [
        ['Marca', 'Ninja'],
        ['Modelo', 'BN801'],
        ['Potencia', '1400 W'],
        ['Incluye', 'Base, vaso de 2.1 L, tazón procesador y vasos portátiles con tapa'],
        ['Cuchillas', 'Acero inoxidable — tritura hielo y congelados'],
        ['Limpieza', 'Piezas aptas para lavavajillas'],
        ['Garantía', '30 días de satisfacción']
      ],
      descImages: [
        { src: NIN + 'd-potencia.webp', alt: 'Potencia de 1400 W para resultados perfectos' },
        { src: NIN + 'd-system.webp',   alt: 'Sistema de cocina 3 en 1: licúa, procesa y mezcla' }
      ],
      reviewsRecommend: '98%',
      ratingBars: [ { lbl: '5★', w: '93%', pct: '93%' }, { lbl: '4★', w: '5%', pct: '5%' }, { lbl: '3★', w: '1%', pct: '1%' }, { lbl: '2★', w: '1%', pct: '1%' }, { lbl: '1★', w: '0%', pct: '0%' } ],
      reviews: [
        { nm: 'Mariana R.', stars: 5, date: '18 de julio de 2026', variant: 'Sistema 3 en 1', text: 'Increíble potencia, tritura el hielo y la fruta congelada como si nada. Uso el vaso grande para los licuados de la familia y los vasitos para llevar al trabajo. La mejor compra para la cocina.' },
        { nm: 'Carlos E.', stars: 5, date: '10 de julio de 2026', variant: 'Sistema 3 en 1', text: 'El procesador me sirve para picar verdura y hasta para la masa. Se lava fácil porque todo va al lavavajillas. Llegó bien empacado y sellado, 100% nuevo.' },
        { nm: 'Sofía L.', stars: 5, date: '2 de julio de 2026', variant: 'Sistema 3 en 1', text: 'Vale cada peso. Es rapidísima y no hace tanto ruido como esperaba. El diseño se ve elegante en la barra de la cocina. Totalmente recomendada.' }
      ]
    },

    'silla-sunfield': {
      slug: 'silla-sunfield',
      url: '/silla/sunfield/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'Sunfield', shopInitials: 'SF', shopName: 'Sunfield',
      title: 'Silla Plegable Reposera Sunfield — Acero Resistente y Tela Oxford Transpirable, Apoyabrazos de Madera, Ultra Liviana para Playa, Camping y Jardín (Soporta 110 kg)',
      shortName: 'Silla Plegable Sunfield',
      variant: 'Negro', variantFull: 'Negro / Silla plegable',
      price: 299, was: 699, discount: '-57%', currency: 'ARS',
      rating: '4.8', reviewsCount: '1,564', sold: '6,320 vendidos', stock: 14,
      metaTitle: 'Silla Plegable Reposera Sunfield — Acero y Tela Oxford | Envío Gratis Argentina',
      metaDesc: 'Silla plegable Sunfield de acero resistente y tela Oxford transpirable, con apoyabrazos de madera. Ultra liviana y portátil para playa, camping y jardín. Soporta 110 kg. Envío gratis a toda Argentina.',
      gallery: [
        { src: SUN + 'g-negro.webp',  alt: 'Silla plegable Sunfield color negro en el jardín' },
        { src: SUN + 'g-beige.webp',  alt: 'Silla plegable Sunfield color beige' },
        { src: SUN + 'g-negro2.webp', alt: 'Silla plegable Sunfield negra, vista de detalle' }
      ],
      colors: [
        { name: 'Negro', img: SUN + 'g-negro.webp' },
        { name: 'Beige', img: SUN + 'g-beige.webp' }
      ],
      offers: [
        { id: '1', name: '1 Silla Plegable Sunfield', price: 299, was: 699, discount: '-57%', badge: 'ENVÍO GRATIS', img: SUN + 'g-negro.webp' }
      ],
      whyCheap: 'Cerramos temporada de camping y liquidamos el stock restante. Cada silla es 100% nueva, en su empaque original y con garantía. Cuando repongamos inventario, el precio volverá a <b>$699 ARS</b>.',
      description: 'Silla plegable estilo reposera Sunfield con estructura de acero reforzado y asiento de tela Oxford transpirable de alta resistencia. Los apoyabrazos son de madera MDF, cómodos y elegantes, y las bisagras reforzadas garantizan estabilidad y durabilidad. Es ultra liviana y se pliega en segundos para transportarla o guardarla en cualquier espacio. Ideal para la playa, el camping, la pesca, el jardín o la terraza. Soporta hasta 110 kg.',
      specs: [
        ['Marca', 'Sunfield'],
        ['Estructura', 'Acero reforzado con bisagras reforzadas'],
        ['Asiento', 'Tela Oxford transpirable de alta resistencia'],
        ['Apoyabrazos', 'Madera MDF'],
        ['Capacidad de carga', 'Hasta 110 kg'],
        ['Plegado', 'Se pliega en segundos, ultra liviana'],
        ['Uso', 'Playa, camping, pesca, jardín y terraza'],
        ['Colores', 'Negro / Beige'],
        ['Garantía', '30 días de satisfacción']
      ],
      descImages: [],
      reviewsRecommend: '96%',
      ratingBars: [ { lbl: '5★', w: '90%', pct: '90%' }, { lbl: '4★', w: '7%', pct: '7%' }, { lbl: '3★', w: '2%', pct: '2%' }, { lbl: '2★', w: '1%', pct: '1%' }, { lbl: '1★', w: '0%', pct: '0%' } ],
      reviews: [
        { nm: 'Ernesto M.', stars: 5, date: '17 de julio de 2026', variant: 'Negro', text: 'Súper cómoda y resistente. La llevo a pescar y aguanta bien mi peso sin tambalearse. Se pliega chiquita y cabe en la cajuela sin problema. Los apoyabrazos de madera se sienten premium.' },
        { nm: 'Lucía F.', stars: 5, date: '9 de julio de 2026', variant: 'Beige', text: 'La tela es fresca y no se calienta al sol. Me encantó el color beige para el jardín. Muy ligera para cargar y firme al sentarse. Compraré otra.' },
        { nm: 'Andrés P.', stars: 4, date: '30 de junio de 2026', variant: 'Negro', text: 'Buena calidad por el precio. Ideal para el camping. Le doy 4 estrellas porque el armado toma un momento, pero una vez abierta queda muy estable.' }
      ]
    },

    'muebles-monaco': {
      slug: 'muebles-monaco',
      url: '/muebles/monaco/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'RattanHome', shopInitials: 'RH', shopName: 'RattanHome',
      title: 'Conjunto de Exterior Mónaco 4 Piezas — Sofá, 2 Sillones y Mesa de Centro en Ratán Sintético con Cojines, para Jardín, Patio y Terraza',
      shortName: 'Conjunto Exterior Mónaco',
      variant: 'Ratán / 4 piezas', variantFull: 'Ratán sintético · 4 piezas',
      price: 299, was: 999, discount: '-70%', currency: 'ARS',
      rating: '4.8', reviewsCount: '842', sold: '2,140 vendidos', stock: 8,
      metaTitle: 'Conjunto de Exterior Mónaco 4 Piezas en Ratán con Cojines | Envío Gratis Argentina',
      metaDesc: 'Conjunto de exterior Mónaco de 4 piezas en ratán sintético: sofá, 2 sillones y mesa de centro con cojines. Resistente e ideal para jardín, patio y terraza. Envío gratis a toda Argentina.',
      gallery: [
        { src: MON + 'g-hero.webp', alt: 'Conjunto de exterior Mónaco 4 piezas en ratán con cojines blancos' }
      ],
      colors: [],
      offers: [
        { id: '1', name: 'Conjunto Mónaco 4 Piezas', price: 299, was: 999, discount: '-70%', badge: 'ENVÍO GRATIS', img: MON + 'g-hero.webp' }
      ],
      whyCheap: 'Liquidamos el inventario de temporada de jardín para renovar catálogo. Cada conjunto es 100% nuevo, en su empaque original y con garantía. Cuando se agote, el precio volverá a <b>$999 ARS</b>.',
      description: 'Conjunto de exterior Mónaco de 4 piezas que incluye un sofá de dos plazas, dos sillones individuales y una mesa de centro, elaborados en ratán sintético resistente a la intemperie y a los rayos UV. Los cómodos cojines incluidos hacen de este set el lugar perfecto para relajarte o recibir visitas en el jardín, patio o terraza. La estructura de acero le da estabilidad y larga vida, y el ratán sintético se limpia fácilmente con un paño húmedo, sin mantenimiento.',
      specs: [
        ['Marca', 'RattanHome'],
        ['El conjunto incluye', 'Sofá de 2 plazas, 2 sillones y mesa de centro'],
        ['Material', 'Ratán sintético resistente a la intemperie y a los rayos UV'],
        ['Estructura', 'Acero resistente'],
        ['Cojines', 'Incluidos, de asiento y respaldo'],
        ['Uso', 'Jardín, patio y terraza'],
        ['Garantía', '30 días de satisfacción']
      ],
      descImages: [],
      reviewsRecommend: '95%',
      ratingBars: [ { lbl: '5★', w: '88%', pct: '88%' }, { lbl: '4★', w: '9%', pct: '9%' }, { lbl: '3★', w: '2%', pct: '2%' }, { lbl: '2★', w: '1%', pct: '1%' }, { lbl: '1★', w: '0%', pct: '0%' } ],
      reviews: [
        { nm: 'Regina C.', stars: 5, date: '16 de julio de 2026', variant: 'Ratán / 4 piezas', text: 'Se ve elegantísimo en mi terraza. Los cojines son muy cómodos y el ratán se siente resistente, no como otros que parecen frágiles. Por el precio de la oferta fue un regalo.' },
        { nm: 'Emilio G.', stars: 5, date: '7 de julio de 2026', variant: 'Ratán / 4 piezas', text: 'Buen tamaño para el patio. Lo dejo afuera y no le afecta el sol. Fácil de armar y limpiar. Mis visitas siempre preguntan dónde lo compré.' },
        { nm: 'Fabiola S.', stars: 4, date: '28 de junio de 2026', variant: 'Ratán / 4 piezas', text: 'Muy bonito y cómodo. Le doy 4 estrellas solo porque la mesa es un poco más chica de lo que imaginé, pero en general encantada con el conjunto.' }
      ]
    },

    'comedor-piave': {
      slug: 'comedor-piave',
      url: '/comedor/piave/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'JardínMax', shopInitials: 'JM', shopName: 'JardínMax',
      title: 'Conjunto de Comedor de Exterior Piave 4 Lugares — Mesa de Vidrio, 4 Sillas Plegables Acolchadas y Sombrilla, para Jardín, Patio y Terraza',
      shortName: 'Comedor Exterior Piave',
      variant: '4 lugares', variantFull: 'Mesa + 4 sillas + sombrilla',
      price: 299, was: 999, discount: '-70%', currency: 'ARS',
      rating: '4.7', reviewsCount: '1,203', sold: '3,870 vendidos', stock: 9,
      descExpanded: true,
      metaTitle: 'Conjunto de Comedor de Exterior Piave 4 Lugares con Sombrilla | Envío Gratis Argentina',
      metaDesc: 'Conjunto de comedor de exterior Piave 4 lugares: mesa de vidrio, 4 sillas plegables acolchadas y sombrilla. Ideal para jardín, patio y terraza. Envío gratis a toda Argentina.',
      gallery: [
        { src: PIA + 'g-hero.webp', alt: 'Conjunto de comedor de exterior Piave con mesa de vidrio, 4 sillas y sombrilla' },
        { src: PIA + 'g-alt.webp',  alt: 'Conjunto de comedor Piave con sillas acolchadas a rayas' }
      ],
      colors: [],
      offers: [
        { id: '1', name: 'Comedor Piave 4 Lugares + Sombrilla', price: 299, was: 999, discount: '-70%', badge: 'ENVÍO GRATIS', img: PIA + 'g-hero.webp' }
      ],
      whyCheap: 'Cerramos temporada de jardín y liquidamos el stock restante. Cada conjunto es 100% nuevo, en su empaque original y con garantía. Cuando repongamos inventario, el precio volverá a <b>$999 ARS</b>.',
      description: 'Conjunto de comedor de exterior Piave para 4 personas, ideal para disfrutar de comidas al aire libre en el jardín, patio o terraza. Incluye una mesa con cubierta de vidrio templado, 4 sillas plegables con cojines acolchados y una sombrilla que te protege del sol. La estructura de acero con recubrimiento resistente a la intemperie soporta el uso diario, y las sillas se pliegan para guardarse fácilmente cuando no las necesitas. Un set completo y elegante para tus reuniones.',
      specs: [
        ['Marca', 'JardínMax'],
        ['El conjunto incluye', 'Mesa con cubierta de vidrio, 4 sillas plegables y sombrilla'],
        ['Estructura', 'Acero con recubrimiento resistente a la intemperie'],
        ['Sillas', 'Plegables con cojines acolchados'],
        ['Mesa', 'Cubierta de vidrio templado con orificio para sombrilla'],
        ['Uso', 'Jardín, patio y terraza'],
        ['Garantía', '30 días de satisfacción']
      ],
      descImages: [
        { src: PIA + 'd-terraza.webp',  alt: 'Conjunto de comedor Piave en una terraza con vista' },
        { src: PIA + 'd-pool.webp',     alt: 'Conjunto de comedor Piave junto a la alberca' },
        { src: PIA + 'd-people.webp',   alt: 'Familia disfrutando del conjunto de comedor Piave' },
        { src: PIA + 'd-umbrella.webp', alt: 'Conjunto de comedor Piave con sombrilla abierta' }
      ],
      reviewsRecommend: '95%',
      ratingBars: [ { lbl: '5★', w: '86%', pct: '86%' }, { lbl: '4★', w: '10%', pct: '10%' }, { lbl: '3★', w: '3%', pct: '3%' }, { lbl: '2★', w: '1%', pct: '1%' }, { lbl: '1★', w: '0%', pct: '0%' } ],
      reviews: [
        { nm: 'Patricia H.', stars: 5, date: '15 de julio de 2026', variant: '4 lugares', text: 'Perfecto para las comidas del domingo en el jardín. La sombrilla ayuda muchísimo con el sol y las sillas son muy cómodas. El vidrio de la mesa se limpia en segundos. Encantada.' },
        { nm: 'Gerardo V.', stars: 5, date: '6 de julio de 2026', variant: '4 lugares', text: 'Buen conjunto, se ve mucho más caro de lo que costó. Las sillas se pliegan y las guardo cuando llueve. Resistente y elegante para la terraza.' },
        { nm: 'Norma L.', stars: 4, date: '27 de junio de 2026', variant: '4 lugares', text: 'Muy bonito y completo. El armado toma un rato pero no es complicado. Le doy 4 estrellas porque llegó un día tarde, pero la calidad está muy bien.' }
      ]
    },

    'asador-carbon': {
      slug: 'asador-carbon',
      url: '/asador/carbon/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'GrillMaster', shopInitials: 'GM', shopName: 'GrillMaster',
      title: 'Asador Ahumador de Carbón — Parrilla de Acero Resistente con Ruedas y Repisa, para Carne y BBQ, Color Negro',
      shortName: 'Asador Ahumador de Carbón',
      variant: 'Negro', variantFull: 'Carbón / Acero — Negro',
      price: 299, was: 899, discount: '-67%', currency: 'ARS',
      rating: '4.8', reviewsCount: '2,015', sold: '7,430 vendidos', stock: 11,
      metaTitle: 'Asador Ahumador de Carbón — Parrilla de Acero con Ruedas | Envío Gratis Argentina',
      metaDesc: 'Asador ahumador de carbón con parrilla de acero resistente, ruedas y repisa. Ideal para carne y BBQ en el jardín. Color negro. Envío gratis a toda Argentina.',
      gallery: [
        { src: ASA + 'g-hero.webp',   alt: 'Asador ahumador de carbón negro con carne en la parrilla' },
        { src: ASA + 'g-jardin.webp', alt: 'Asador de carbón ideal para el jardín' }
      ],
      colors: [],
      offers: [
        { id: '1', name: 'Asador Ahumador de Carbón', price: 299, was: 899, discount: '-67%', badge: 'ENVÍO GRATIS', img: ASA + 'g-hero.webp' }
      ],
      whyCheap: 'Liquidamos el inventario de temporada para renovar catálogo. Cada asador es 100% nuevo, en su empaque original y con garantía. Cuando se agote, el precio volverá a <b>$899 ARS</b>.',
      description: 'Asador ahumador de carbón con cámara y parrilla de acero resistente, perfecto para preparar carnes, cortes y BBQ con ese sabor ahumado inconfundible. Cuenta con tapa para ahumado, ruedas para moverlo con facilidad y una repisa inferior para tener a la mano tus utensilios y ingredientes. El sistema permite una eliminación cómoda de las cenizas y un buen control del carbón. Ideal para reuniones en el jardín, patio o terraza.',
      specs: [
        ['Marca', 'GrillMaster'],
        ['Material', 'Acero resistente con recubrimiento'],
        ['Combustible', 'Carbón'],
        ['Funciones', 'Asador y ahumador con tapa'],
        ['Movilidad', 'Ruedas para traslado fácil'],
        ['Extra', 'Repisa inferior y bandeja para cenizas'],
        ['Uso', 'Jardín, patio y terraza'],
        ['Garantía', '30 días de satisfacción']
      ],
      descImages: [
        { src: ASA + 'd-carbon.webp', alt: 'Asador de carbón con eliminación cómoda de las cenizas' }
      ],
      reviewsRecommend: '96%',
      ratingBars: [ { lbl: '5★', w: '90%', pct: '90%' }, { lbl: '4★', w: '7%', pct: '7%' }, { lbl: '3★', w: '2%', pct: '2%' }, { lbl: '2★', w: '1%', pct: '1%' }, { lbl: '1★', w: '0%', pct: '0%' } ],
      reviews: [
        { nm: 'Rubén A.', stars: 5, date: '19 de julio de 2026', variant: 'Negro', text: 'Quedé feliz con el asador. La carne agarra un sabor ahumado buenísimo con la tapa cerrada. Las ruedas ayudan a moverlo y la repisa de abajo es súper práctica. Muy resistente.' },
        { nm: 'Iván T.', stars: 5, date: '11 de julio de 2026', variant: 'Negro', text: 'Buen tamaño para reuniones familiares. El acero se siente firme y calienta parejo. Lo de sacar las cenizas es muy fácil. Por el precio no encuentras algo mejor.' },
        { nm: 'Mónica D.', stars: 4, date: '3 de julio de 2026', variant: 'Negro', text: 'A mi esposo le encantó. Cumple muy bien para las carnes asadas del fin de semana. Le doy 4 estrellas porque el armado toma su tiempo, pero vale la pena.' }
      ]
    },

    'nevera-mini': {
      slug: 'nevera-mini',
      url: '/nevera/mini/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'FrostLine',
      shopInitials: 'FL',
      shopName: 'FrostLine',
      title: 'Mini Refrigerador 2 Puertas con Congelador — Compacto de 3.2 pies³, Termostato Ajustable de 5 Niveles, Estante Removible y Puerta Reversible para Recámara, Oficina y Dormitorio',
      shortName: 'Mini Refrigerador 2 Puertas',
      variant: 'Negro',
      variantFull: 'Negro / 3.2 pies³',
      price: 349,
      was: 1299,
      discount: '-73%',
      currency: 'ARS',
      rating: '4.8',
      reviewsCount: '1,932',
      sold: '8,750 vendidos',
      stock: 12,
      metaTitle: 'Mini Refrigerador 2 Puertas con Congelador 3.2 pies³ | Envío Gratis Argentina',
      metaDesc: 'Mini refrigerador compacto de 2 puertas con congelador, 3.2 pies³. Termostato ajustable de 5 niveles, estante de vidrio removible y puerta reversible. Ideal para recámara, oficina y dormitorio. Silencioso y de bajo consumo. Envío gratis a toda Argentina.',

      gallery: [
        { src: NEV + 'g-negro.webp',      alt: 'Mini refrigerador negro de 2 puertas con congelador, puertas cerradas' },
        { src: NEV + 'g-negro-open.webp', alt: 'Mini refrigerador negro abierto: congelador arriba y refrigerador abajo, llenos de alimentos' }
      ],

      colors: [
        { name: 'Negro', img: NEV + 'g-negro.webp' }
      ],

      offers: [
        { id: '1', name: '1 Unidad — Mini Refrigerador 3.2 pies³', price: 349, was: 1299, discount: '-73%', badge: 'ENVÍO GRATIS', img: NEV + 'g-negro.webp' }
      ],

      whyCheap: 'Renovamos el modelo de temporada y liquidamos el inventario restante en lugar de almacenarlo. Cada refrigerador es 100% nuevo, en su empaque original y con garantía completa. Cuando repongamos stock, el precio volverá a <b>$1,299 ARS</b>.',

      description: 'Mini refrigerador de 2 puertas con congelador independiente y 3.2 pies³ de capacidad total, perfecto para recámara, oficina, dormitorio o sala de juegos. El congelador de 0.95 pies³ mantiene tus helados y congelados, mientras el refrigerador de 2.26 pies³ conserva frescas frutas, verduras y bebidas. Cuenta con termostato ajustable de 5 niveles, estante de vidrio removible, cajón crisper, luz interior y compartimentos en la puerta. Su puerta es reversible (se abre a la izquierda o a la derecha) para adaptarse a cualquier espacio, y las patas ajustables lo mantienen estable en pisos irregulares. Compresor silencioso de bajo consumo energético que enfría rápido sin disparar tu recibo de luz.',

      specs: [
        ['Marca', 'FrostLine'],
        ['Capacidad total', '3.2 pies³ (≈ 90 L)'],
        ['Congelador', '0.95 pies³ — hielo, carne y congelados'],
        ['Refrigerador', '2.26 pies³ — frutas, verduras y bebidas'],
        ['Control de temperatura', 'Termostato ajustable de 5 niveles'],
        ['Puerta', 'Reversible, apertura hasta 180°'],
        ['Interior', 'Estante de vidrio ajustable, cajón crisper, luz LED y estantes en la puerta'],
        ['Dimensiones', '45.7 cm ancho × 50.2 cm fondo × 86.4 cm alto'],
        ['Consumo', 'Compresor silencioso de bajo consumo energético'],
        ['Ideal para', 'Recámara, oficina, dormitorio y sala de juegos'],
        ['Garantía', '30 días de satisfacción']
      ],

      descImages: [
        { src: NEV + 'd-reversible-negro.webp', alt: 'Puerta reversible: elige el lado de apertura' }
      ],

      reviewsRecommend: '96%',
      ratingBars: [
        { lbl: '5★', w: '89%', pct: '89%' },
        { lbl: '4★', w: '8%',  pct: '8%' },
        { lbl: '3★', w: '2%',  pct: '2%' },
        { lbl: '2★', w: '1%',  pct: '1%' },
        { lbl: '1★', w: '0%',  pct: '0%' }
      ],

      reviews: [
        { nm: 'Ricardo H.', stars: 5, date: '20 de julio de 2026', variant: 'Negro / 3.2 pies³', text: 'Lo compré para la recámara y quedé encantado. Enfría rapidísimo y es súper silencioso, ni se escucha de noche. El tamaño es perfecto, cabe bien sin estorbar y se ve muy elegante en negro.' },
        { nm: 'Fernanda G.', stars: 5, date: '13 de julio de 2026', variant: 'Negro / 3.2 pies³', text: 'Ideal para mi oficina. Le caben mis aguas, refrescos y el lunch sin problema. Me sirvió que la puerta sea reversible porque la pude abrir del lado que me acomodaba. Muy buena compra por el precio.' },
        { nm: 'Jorge L.', stars: 5, date: '6 de julio de 2026', variant: 'Negro / 3.2 pies³', text: 'El congelador de arriba hace hielo sin problema y mantiene bien los congelados. Lo tengo en el cuarto de mi hijo en la universidad y no subió el recibo de luz. Llegó bien empacado y sin golpes.' },
        { nm: 'Alejandra M.', stars: 4, date: '29 de junio de 2026', variant: 'Negro / 3.2 pies³', text: 'Muy bueno y del tamaño exacto que buscaba. Enfría parejo y el estante se ajusta para meter botellas altas. Le doy 4 estrellas solo porque me hubiera gustado el congelador un poquito más grande, pero cumple perfecto.' },
        { nm: 'Miguel A.', stars: 5, date: '22 de junio de 2026', variant: 'Negro / 3.2 pies³', text: 'Calidad excelente para lo que costó. El compresor es muy silencioso y el acabado negro se ve moderno. Las patas se ajustan y quedó firme aunque mi piso está un poco disparejo. Recomendado.' }
      ],

      reviewPool: [
        { nm: 'Carmen V.', stars: 5, date: '15 de junio de 2026', variant: 'Negro / 3.2 pies³', text: 'Lo puse en la sala de juegos para tener las bebidas frías a la mano. Mantiene todo bien frío y los cajones ayudan a organizar. Encantada con la compra.' },
        { nm: 'Óscar R.', stars: 5, date: '8 de junio de 2026', variant: 'Negro / 3.2 pies³', text: 'Lo uso como segundo refri solo para bebidas. El compresor casi no se siente y enfría muy rápido. Buen tamaño, no ocupa nada de espacio.' },
        { nm: 'Daniela P.', stars: 4, date: '1 de junio de 2026', variant: 'Negro / 3.2 pies³', text: 'Bonito y funcional. Tardó un día más de lo estimado en llegar, pero valió la pena. La luz interior es un detalle muy práctico.' },
        { nm: 'Raúl T.', stars: 5, date: '25 de mayo de 2026', variant: 'Negro / 3.2 pies³', text: 'Mini refri para la recámara y a los niños les fascina. Fácil de limpiar y el termostato deja regular bien la temperatura. Muy contento.' },
        { nm: 'Patricia N.', stars: 5, date: '19 de mayo de 2026', variant: 'Negro / 3.2 pies³', text: 'El tamaño compacto es justo lo que necesitaba para el cuarto. El estante ajustable me dejó acomodar botellas de 2 litros paradas. Súper recomendable.' }
      ]
    },

    'silla-adirondack': {
      slug: 'silla-adirondack',
      url: '/silla/adirondack/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'RelaxLine',
      shopInitials: 'RL',
      shopLogo: '/__l5e/assets-v1/601bd0dd-1896-4bb6-b73f-721bab851c6b/tiktok-shop-logo-v2.png',
      shopName: 'RelaxLine',
      title: 'Set 2 Sillas Plegables Adirondack con Portavasos — Reclinables, de Plástico HDPE Resistente e Impermeable para Patio, Jardín y Playa (Compre 1 Lleve 2)',
      shortName: 'Set 2 Sillas Adirondack',
      variant: 'Azul marino',
      variantFull: 'Azul marino / Set de 2 sillas',
      price: 19900,
      was: 53900,
      discount: '-63%',
      currency: 'ARS',
      rating: '4.8',
      reviewsCount: '2,341',
      sold: '11,204 vendidos',
      stock: 15,
      descExpanded: true,
      hideReviews: true,
      hideStore: true,
      giftBonus: 'Mesa Plegable de regalo',
      metaTitle: 'Set 2 Sillas Plegables Adirondack con Portavasos — HDPE resistente | Envío Gratis Argentina',
      metaDesc: 'Set de 2 sillas Adirondack plegables con portavasos, de plástico HDPE resistente para todo clima. Reclinables, cómodas y fáciles de guardar. Compre 1 Lleve 2. Envío gratis a toda Argentina.',

      gallery: [
        { src: AD + 'g-azul.webp?v=2',      alt: 'Set de 2 sillas Adirondack plegables azul marino con portavasos' },
        { src: AD + 'g-blanco.webp?v=2',    alt: 'Sillas Adirondack plegables color blanco con portavasos' },
        { src: AD + 'g-turquesa.webp?v=2',  alt: 'Sillas Adirondack plegables color turquesa' },
        { src: AD + 'g-negro.webp?v=2',     alt: 'Sillas Adirondack plegables color negro' },
        { src: AD + 'g-marron.webp?v=2',    alt: 'Sillas Adirondack plegables color marrón tipo madera' }
      ],

      colors: [
        { name: 'Azul marino', img: AD + 'g-azul.webp?v=2' },
        { name: 'Blanco',      img: AD + 'g-blanco.webp?v=2' },
        { name: 'Turquesa',    img: AD + 'g-turquesa.webp?v=2' },
        { name: 'Negro',       img: AD + 'g-negro.webp?v=2' },
        { name: 'Marrón',      img: AD + 'g-marron.webp?v=2' }
      ],

      offers: [
        { id: '1', name: '1 Set (2 Sillas)', price: 19900, was: 53900,  discount: '-63%', badge: 'COMPRE 1 LLEVE 2', imgs: ADC },
        { id: '2', name: '2 Sets (4 Sillas)', price: 32900, was: 88900, discount: '-63%', badge: 'MÁS POPULAR', imgs: ADC },
        { id: '3', name: '3 Sets (6 Sillas) + Mesa Plegable GRATIS', price: 52900, was: 146900, discount: '-64%', badge: 'MEJOR VALOR', badgeColor: 'green', imgs: ADC }
      ],

      whyCheap: 'Cerramos temporada de jardín y liquidamos el stock restante en lugar de almacenarlo. Cada silla es 100% nueva, en su empaque original y con garantía completa. Cuando repongamos inventario, el precio volverá a <b>$53.900 ARS</b>.',

      description: 'Set de 2 sillas Adirondack plegables con portavasos, fabricadas en plástico HDPE de alta resistencia, impermeable y resistente a los rayos UV. El respaldo reclinado y los reposabrazos anchos ofrecen una comodidad excepcional para relajarte en el patio, jardín, playa o alberca. Se pliegan en segundos para guardarse en poco espacio y no requieren mantenimiento: no se astillan, no se decoloran y se limpian con un paño húmedo. Soportan hasta 150 kg por silla.',

      specs: [
        ['Marca', 'RelaxLine'],
        ['El set incluye', '2 sillas Adirondack plegables con portavasos'],
        ['Material', 'Plástico HDPE de alta resistencia, resistente a los rayos UV'],
        ['Capacidad de carga', 'Hasta 150 kg por silla'],
        ['Respaldo', 'Reclinado ergonómico, estilo Adirondack'],
        ['Uso', 'Interior y exterior — apto para todo clima'],
        ['Plegado', 'Se pliega en segundos, sin herramientas'],
        ['Colores', 'Azul marino / Blanco / Turquesa / Negro / Marrón'],
        ['Garantía', '30 días de satisfacción']
      ],

      descImages: [
        { src: AD + 'd-life-teal.webp',  alt: 'Sillas Adirondack turquesa en el jardín con sombrilla' },
        { src: AD + 'd-lifestyle.webp',  alt: 'Sillas Adirondack blancas junto a la alberca con sombrilla' },
        { src: AD + 'g-lifestyle.webp',  alt: 'Sillas Adirondack azul marino en el jardín con sombrilla y luces' },
        { src: AD + 'd-comodidad.webp',  alt: 'Comodidad excepcional para cualquier posición de asiento' },
        { src: AD + 'd-portavasos.webp', alt: 'Reposabrazos ensanchado y portavasos oculto' },
        { src: AD + 'd-ajustable.webp',  alt: 'Reposabrazos más ancho y asiento con ángulo ergonómico' },
        { src: AD + 'd-plegable.webp',   alt: 'Silla Adirondack plegable con portavasos, se pliega en pocos pasos' },
        { src: AD + 'd-materiales.webp', alt: 'Todo clima, fácil de mantener y materiales ecológicos' }
      ],

      reviewsRecommend: '97%',
      ratingBars: [
        { lbl: '5★', w: '91%', pct: '91%' },
        { lbl: '4★', w: '6%',  pct: '6%' },
        { lbl: '3★', w: '2%',  pct: '2%' },
        { lbl: '2★', w: '1%',  pct: '1%' },
        { lbl: '1★', w: '0%',  pct: '0%' }
      ],

      reviews: [
        { nm: 'Rodrigo M.', stars: 5, date: '19 de julio de 2026', variant: 'Azul marino / Set de 2', text: 'Compré el set y llegaron dos, tal cual la promoción. Son súper cómodas, el respaldo reclinado se siente increíble para el café de la tarde en el patio. El portavasos es un detalle que se agradece muchísimo.' },
        { nm: 'Diana L.', stars: 5, date: '12 de julio de 2026', variant: 'Turquesa / Set de 2', text: 'El color turquesa se ve precioso en el jardín. El plástico es grueso y resistente, no se sienten frágiles para nada. Y que se plieguen es lo mejor porque las guardo en invierno sin que estorben.' },
        { nm: 'Arturo P.', stars: 5, date: '5 de julio de 2026', variant: 'Negro / Set de 2', text: 'Excelente relación calidad-precio, sobre todo con la oferta de compre 1 lleve 2. Aguantan bien mi peso (100 kg) sin crujir. Las dejo afuera y no les afecta el sol ni la lluvia.' },
        { nm: 'Verónica S.', stars: 4, date: '28 de junio de 2026', variant: 'Blanco / Set de 2', text: 'Muy cómodas y bonitas. Le doy 4 estrellas solo porque el armado inicial me costó un poco entender, pero una vez abiertas quedan bien firmes. Volvería a comprar.' },
        { nm: 'Luis Fernando', stars: 5, date: '21 de junio de 2026', variant: 'Azul marino / Set de 2', text: 'Las puse frente a la alberca y se ven de revista. El material no se calienta tanto como pensé y limpiarlas es facilísimo. Llegaron rápido y bien empacadas.' }
      ],

      reviewPool: [
        { nm: 'Gabriela T.', stars: 5, date: '15 de junio de 2026', variant: 'Marrón / Set de 2', text: 'El color marrón parece madera de verdad pero sin el mantenimiento. Súper cómodas para leer en el jardín. El set de 2 por ese precio es un regalo.' },
        { nm: 'Héctor N.', stars: 5, date: '9 de junio de 2026', variant: 'Negro / Set de 2', text: 'Resistentes y estables. Me gustó que se pliegan planas y no estorban. La mesa que venía en el combo fue un buen extra.' },
        { nm: 'Paola R.', stars: 4, date: '2 de junio de 2026', variant: 'Turquesa / Set de 2', text: 'Bonitas y cómodas. Tardaron un día más de lo estimado en llegar, pero valieron la espera. El portavasos es perfecto para la bebida.' },
        { nm: 'Mario A.', stars: 5, date: '26 de mayo de 2026', variant: 'Blanco / Set de 2', text: 'Compré el combo de 4 sets para la terraza del restaurante. Excelente calidad, los clientes las aman. Repetiré la compra sin duda.' },
        { nm: 'Sandra', stars: 5, date: '20 de mayo de 2026', variant: 'Azul marino / Set de 2', text: 'Muy buena compra. Ligeras para mover pero firmes al sentarse. El diseño Adirondack es clásico y elegante. Recomendadas totalmente.' }
      ],

      cartBump: {
        slug: 'sombrilla-patio-luces', offer: 'bump',
        name: 'Sombrilla de Patio con Luces LED Solares',
        variant: 'Luces LED · Manivela',
        img: AD + 'sombrilla.webp', price: 199, was: 599,
        tag: '🎁 Completa tu patio', hint: 'Oferta solo aquí', badge: '-67%',
        ttl: 'Sombrilla de Patio con Luces LED',
        benef: 'Luces LED solares · Protección UV · Manivela de fácil apertura'
      }
    },

    'mesa-plegable-fold': {
      slug: 'mesa-plegable-fold',
      cartBumps: [], /* sin order bump (se removió el armario 2×1) */
      url: '/mesa/plegable/',
      reviewSource: 'Comprado en TTK Shop',
      brand: 'FoldEase',
      shopInitials: 'FE',
      shopName: 'FoldEase',
      title: 'Mesa Plegable Multifuncional FoldEase — Resistente, de HDPE para Camping y Fiestas, se Pliega por la Mitad como Maletín con Asa de Transporte (Soporta 120 kg)',
      shortName: 'Mesa Plegable FoldEase',
      variant: 'Blanco',
      variantFull: 'Blanco / 180 × 70 cm',
      price: 19900,
      was: 79900,
      discount: '-75%',
      currency: 'ARS',
      rating: '4.8',
      reviewsCount: '1,127',
      sold: '18,640 vendidos',
      stock: 12,
      giftBonus: '2 Sillas Plegables',
      metaTitle: 'Mesa Plegable Multifuncional FoldEase 180×70 cm — HDPE, soporta 120 kg | Envío Gratis Argentina',
      metaDesc: 'Mesa plegable FoldEase: cubierta de HDPE resistente, estructura de acero, soporta hasta 120 kg, se pliega como maletín con asa. Lista en segundos, sin herramientas. 4.8★, 18,640 vendidos. Envío gratis a toda Argentina.',

      gallery: [
        { src: ME + 'gal2.jpg',  alt: 'Mesa plegable FoldEase en una fiesta con comida y bebidas' },
        { src: ME + 'gal3.png',  alt: 'Mesa plegable multifuncional FoldEase 180×70 cm' },
        { src: ME + 'gal4.jpg',  alt: 'Se pliega como maletín y soporta hasta 120 kg' },
        { src: ME + 'gal5.webp', alt: 'Cubierta de HDPE resistente e impermeable' },
        { src: ME + 'gal6.png',  alt: 'Medidas: 180 × 74 × 70 cm abierta y 74 × 90 × 7 cm plegada' },
        { src: ME + 'gal7.webp', alt: 'Estructura de acero con patas antideslizantes' }
      ],

      colors: [
        { name: 'Blanco', img: ME + 'p20.jpg' },
        { name: 'Negro',  img: ME + 'mesa-negra.webp' }
      ],

      offers: [
        { id: '1', name: '1 Mesa Plegable', price: 19900, was: 79900, discount: '-75%', imgs: { Blanco: ME + 'p20.jpg', Negro: ME + 'mesa-negra.webp' } },
        { id: '2', name: '1 Mesa + 6 Sillas Plegables', price: 34900, was: 129900, discount: '-73%', badge: 'MÁS POPULAR', imgs: { Blanco: ME + 'kit1-blanco.jpg', Negro: ME + 'kit1-negro.jpg' } },
        { id: '3', name: '2 Mesas + 12 Sillas Plegables', price: 59900, was: 249900, discount: '-76%', badge: 'MEJOR VALOR', badgeColor: 'green', imgs: { Blanco: ME + 'kit2-blanco.jpg', Negro: ME + 'kit2-negro.jpg' } },
      ],

      whyCheap: 'Cerramos temporada y liquidamos el stock restante en lugar de almacenarlo. Cada mesa es 100% nueva, en su empaque original y con garantía completa. Cuando repongamos inventario, el precio volverá a <b>$899 ARS</b>.',

      description: 'Mesa plegable que ahorra espacio, con cubierta de HDPE de alta resistencia y estructura de acero pintado, diseñada para máxima estabilidad y durabilidad. Ideal para fiestas, catering, buffets, camping, ferias, el jardín o como superficie extra en casa. Se pliega en forma de maletín, es ligera para cargar y está lista para usar en segundos — sin necesidad de armado.',

      specs: [
        ['Marca', 'FoldEase'],
        ['Material', 'Cubierta de resina HDPE, estructura de acero pintado'],
        ['Tamaño (abierta)', '180 × 70 cm'],
        ['Tamaño (plegada)', '90 × 70 × 8 cm'],
        ['Capacidad de carga', 'Hasta 120 kg'],
        ['Color', 'Blanco / Negro'],
        ['Incluye', '1 × Mesa plegable con asa de transporte'],
        ['Garantía', '30 días de satisfacción']
      ],

      descImages: [
        { src: ME + 'g_capacity.jpg',      alt: 'Se pliega como maletín y soporta hasta 120 kg' },
        { src: ME + 'fr3.jpg',             alt: 'Mesa plegable FoldEase resistente y multiusos' },
        { src: ME + 'desc-caract.jpg',     alt: 'Asa de transporte, materiales impermeables y plegado tipo maletín' },
        { src: ME + 'desc-fiesta.jpg',     alt: 'Estructura resistente, goma antideslizante y seguro antiaccidentes' },
        { src: ME + 'desc-medidas.png',    alt: 'Medidas: 180 × 74 × 70 cm abierta y 74 × 90 × 7 cm plegada' },
        { src: ME + 'desc-liviana.png',    alt: 'Ligera y fácil de cargar con una sola mano' },
        { src: ME + 'desc-combo6.png',     alt: 'Combo mesa + 6 sillas plegables a juego' },
        { src: ME + 'desc-combo-negro.webp', alt: 'Disponible también en color negro' }
      ],

      reviewsRecommend: '96%',
      ratingBars: [
        { lbl: '5★', w: '90%', pct: '90%' },
        { lbl: '4★', w: '7%',  pct: '7%' },
        { lbl: '3★', w: '2%',  pct: '2%' },
        { lbl: '2★', w: '1%',  pct: '1%' },
        { lbl: '1★', w: '1%',  pct: '0%' }
      ],
      reviewPhotos: Array.from({ length: 22 }, function (_, i) { return ME + 'reviews/rc' + (i + 1) + '.webp'; }),

      reviews: [
        { nm: 'Verónica G.', stars: 5, thumb: ME + 'reviews/rc1.webp', date: '18 de julio de 2026', text: 'La verdad no esperaba tanto por lo que cuesta, pero me sorprendió. Muy firme cuando está abierta y no se tambalea nada. La usamos en la carne asada del domingo y aguantó todo sin problema. Llegó bien empacada y rápido.' },
        { nm: 'Luis Ángel R.', stars: 5, thumb: ME + 'reviews/rc3.webp', date: '11 de julio de 2026', text: 'La ocupo para mi puesto en el tianguis y ha sido lo mejor. Se abre en segundos, aguanta bastante peso y me la llevo como maletín con una sola mano. Ya me preguntaron dónde la compré varias veces.' },
        { nm: 'Mariana T.', stars: 5, thumb: ME + 'reviews/rc5.webp', date: '4 de julio de 2026', text: 'Perfecta para las fiestas en casa. Cabe muchísima comida y después se guarda plegada detrás de la puerta. La calidad está increíble para el precio, muy recomendada.' },
        { nm: 'José Ramón', stars: 4, thumb: ME + 'reviews/rc2.webp', date: '27 de junio de 2026', text: 'Buena mesa, cumple bien. Le doy 4 estrellas porque uno de los seguros venía algo duro, pero con el uso se soltó. Por lo demás resistente y muy práctica para cargar.' },
        { nm: 'Gaby M.', stars: 5, thumb: ME + 'reviews/rc4.webp', date: '21 de junio de 2026', text: 'Vivo en un depa chico y esta mesa me salvó. Se dobla a la mitad y casi no ocupa espacio. La saco cuando tengo visitas y listo. Ligerita pero bien firme.' }
      ],

      reviewPool: [
        { nm: 'Alejandra V.', stars: 5, thumb: ME + 'reviews/rc6.webp', date: '15 de junio de 2026', text: 'La compré para la fiesta de mi hija y quedó perfecta para el buffet. Aguantó el pastel, las bebidas y todo. Fácil de limpiar con un trapo húmedo. Volvería a comprar.' },
        { nm: 'Carlos M.', stars: 5, thumb: ME + 'reviews/rc7.webp', date: '9 de junio de 2026', text: 'La uso para mi negocio de comida y me ha funcionado de maravilla. Resistente, estable y se transporta fácil. Ya llevo meses usándola diario y sigue como nueva.' },
        { nm: 'Paty', stars: 5, date: '3 de junio de 2026', text: 'Me encantó, tal cual la descripción. Llegó en tres días con envío gratis y sin costo extra al recibir. Muy contenta con la compra.' },
        { nm: 'Ricardo H.', stars: 5, thumb: ME + 'reviews/rc9.webp', date: '28 de mayo de 2026', text: 'Ideal para acampar. La metí en la cajuela sin batallar y se arma en lo que dices campamento. Aguantó bien el terreno disparejo gracias a las gomitas de las patas.' },
        { nm: 'Fernanda L.', stars: 4, thumb: ME + 'reviews/rc10.webp', date: '22 de mayo de 2026', text: 'Llegó rápido y bien protegida. Le quito una estrella porque me gustaría que trajera una correa para colgarla al hombro, pero el asa es cómoda igual.' },
        { nm: 'Miguel Á.', stars: 5, thumb: ME + 'reviews/rc11.webp', date: '16 de mayo de 2026', text: 'Aguanta muchísimo peso, la cargué con cajas pesadas y no se pandeó ni tantito. Para lo que cuesta está increíble, muy resistente el material.' },
        { nm: 'Diana G.', stars: 5, thumb: ME + 'reviews/rc8.webp', date: '10 de mayo de 2026', text: 'La ocupo para vender en bazares y es justo lo que necesitaba. Amplia para acomodar mi mercancía y cabe en mi coche chico. Se ve muy limpia con un mantel encima.' },
        { nm: 'Toño', stars: 5, date: '4 de mayo de 2026', text: 'Excelente para las parrilladas con la familia. Firme, práctica y se guarda en nada. Ya varios compadres me pidieron el link jaja.' },
        { nm: 'Rosa María', stars: 5, thumb: ME + 'reviews/rc14.webp', date: '28 de abril de 2026', text: 'Muy buena calidad, la superficie se limpia solita con un paño. La uso de mesa extra en la cocina y también para las reuniones. Cien por ciento recomendada.' },
        { nm: 'Emmanuel S.', stars: 5, thumb: ME + 'reviews/rc15.webp', date: '22 de abril de 2026', text: 'Para mi puesto está perfecta. Rápida de montar y desmontar, aguanta el trajín diario del tianguis. Buen producto y buen precio.' },
        { nm: 'Karla P.', stars: 5, thumb: ME + 'reviews/rc16.webp', date: '16 de abril de 2026', text: 'La compré para los cumpleaños de los niños y ha sido un exitazo. Se limpia rápido después del desastre de pastel y jugo, y se guarda para recuperar la sala.' },
        { nm: 'Jorge L.', stars: 4, date: '10 de abril de 2026', text: 'Está bien por el precio. Pensé que era un poco más grande, pero para uso normal cumple perfecto. Resistente y fácil de transportar.' },
        { nm: 'Adriana', stars: 5, thumb: ME + 'reviews/rc18.webp', date: '4 de abril de 2026', text: 'Súper práctica para departamento. Se pliega delgadita y la guardo en cualquier rincón. La saco para trabajar desde casa o cuando llegan visitas.' },
        { nm: 'Sergio N.', stars: 5, thumb: ME + 'reviews/rc19.webp', date: '29 de marzo de 2026', text: 'La dejo en el jardín y aguanta el sol y la lluvia sin echarse a perder. El material es muy noble, se limpia al instante. Muy satisfecho con la compra.' },
        { nm: 'Lupita', stars: 5, thumb: ME + 'reviews/rc20.webp', date: '23 de marzo de 2026', text: 'La usé de mesa de buffet en la cena navideña y quedó espectacular. Nos acomodamos todos y luego se guardó al instante como maletín. Vale cada peso.' },
        { nm: 'Beto', stars: 5, thumb: ME + 'reviews/rc21.webp', date: '17 de marzo de 2026', text: 'Se carga tal cual un maletín, con una mano y sin batallar. La llevo del coche a donde sea. Firme y ligera, justo lo que buscaba.' },
        { nm: 'Nallely', stars: 5, thumb: ME + 'reviews/rc22.webp', date: '11 de marzo de 2026', text: 'La ocupo para vender postres los fines de semana y se ve muy profesional con un mantel. Aguanta las charolas sin moverse. Encantada.' }
      ],

      faq: [
        { q: '¿De qué material está hecha la mesa?', a: 'La cubierta es de HDPE de alta resistencia (el mismo plástico de las mesas profesionales) sobre una estructura de acero pintado. Es impermeable, no se astilla y se limpia con un solo paño.' },
        { q: '¿Cuánto peso soporta?', a: 'Soporta hasta 120 kg distribuidos sobre la cubierta, más que suficiente para buffets, comida, bebidas y todo tipo de reuniones.' },
        { q: '¿Qué medidas tiene abierta y plegada?', a: 'Abierta mide 180 × 74 × 70 cm. Plegada queda como un maletín de 74 × 90 × 7 cm, fácil de guardar en cualquier rincón o en la cajuela del coche.' },
        { q: '¿Viene armada o hay que montarla?', a: 'Viene lista para usar. Solo la despliegas y trabas las patas: queda firme en segundos, sin herramientas ni instrucciones.' },
        { q: '¿En qué colores está disponible?', a: 'Está disponible en blanco y negro. Puedes elegir el color al momento de tu compra.' },
        { q: '¿La mesa incluye las sillas?', a: 'La mesa se vende sola. Si quieres el juego completo, al elegir tu paquete puedes seleccionar el combo de mesa + 6 sillas plegables a juego.' },
        { q: '¿Hacen envíos a toda Argentina y cuánto tarda?', a: 'Sí, enviamos a todo el país con envío gratis. El tiempo estimado de entrega es de 3 a 7 días hábiles según tu ubicación.' },
        { q: '¿La mesa es nueva y tiene garantía?', a: 'Todas las mesas son 100% nuevas, en su empaque original y con garantía. Si tu producto llega con algún detalle, nuestro equipo lo resuelve rápido.' }
      ]
    },

    'gazebo-shademax-3x3': {
      slug: 'gazebo-shademax-3x3',
      url: '/gazebo/shademax-3x3/',
      brand: 'ShadeMax',
      shopInitials: 'SM',
      shopName: 'ShadeMax Oficial',
      title: 'Gazebo Plegable Portátil 3×3 m — Estructura de Acero Reforzado, Lona Oxford Impermeable con Protección UV UPF 50+, Sistema Pop-Up sin Herramientas (con 3 Paredes y Bolso con Ruedas)',
      shortName: 'Gazebo Plegable Portátil 3×3 m',
      variant: 'Azul',
      variantFull: 'Azul / 3×3 m',
      price: 249,
      was: 999,
      discount: '-75%',
      currency: 'ARS',
      rating: '4.8',
      reviewsCount: '3,410',
      sold: '8,700 vendidos',
      stock: 9,
      giftBonus: '2 Sillas Plegables',
      metaTitle: 'Gazebo Plegable Portátil 3×3 m — Acero Reforzado, Impermeable UPF 50+ | Envío Gratis Argentina',
      metaDesc: 'Gazebo plegable pop-up 3×3 m: estructura de acero reforzado, lona Oxford 210D impermeable con protección UV UPF 50+, 3 alturas y bolso con ruedas. Se arma en minutos sin herramientas. 4.8★, 8,700 vendidos. Envío gratis a toda Argentina.',

      gallery: [
        { src: G + 'main.webp',        alt: 'Gazebo plegable portátil 3×3 m azul con bolso de transporte y sistema pop-up' },
        { src: G + 'hero.webp',        alt: 'Gazebo plegable portátil 3×3 m azul con estructura de acero' },
        { src: G + 'con-paredes.webp', alt: 'Gazebo 3×3 con 3 paredes laterales impermeables' },
        { src: G + 'folding.webp',     alt: 'Sistema pop-up del gazebo, se pliega y despliega en minutos' },
        { src: G + 'toldo.webp',       alt: 'Toldo plegable de acero inoxidable con lona impermeable' },
        { src: G + 'event.webp',       alt: 'Gazebo 3×3 en una fiesta en el jardín' },
        { src: G + 'resist.webp',      alt: 'Materiales resistentes: velcro, refuerzos y puntos de apoyo' },
        { src: G + 'multiuso.webp',    alt: 'Diseño multiusos: jardines, playas, terrazas y mercados' }
      ],

      colors: [
        { name: 'Azul',   sw: '#1f63d6' },
        { name: 'Verde',  sw: '#1b7a3d' },
        { name: 'Negro',  sw: '#1c1c1e' },
        { name: 'Blanco', sw: '#eef0f2' },
        { name: 'Rojo',   sw: '#cf2e2e' }
      ],
      offers: [
        { id: '1', name: 'Gazebo 3×3 (sin paredes)', price: 249, was: 999,  discount: '-75%', img: G + 'hero.webp' },
        { id: '2', name: 'Gazebo 3×3 + 3 Paredes',    price: 349, was: 1499, discount: '-77%', img: G + 'con-paredes.webp', badge: 'MÁS POPULAR' }
      ],

      whyCheap: 'Cerramos la temporada de verano y liquidamos el stock restante en lugar de almacenarlo. Cada gazebo es 100% nuevo, en su empaque original y con la garantía completa del fabricante. Cuando repongamos inventario, el precio volverá a <b>$999 ARS</b>.',

      description: 'Gazebo plegable portátil de 3×3 m con sistema pop-up: se arma en minutos, sin herramientas y sin tornillos. La lona es de tela Oxford 210D con revestimiento plateado impermeable y protección solar UPF 50+, así que te cubre del sol y de la lluvia. La estructura es de acero reforzado con tubo cruzado y seguros de fijación en 3 alturas ajustables (hasta 2.63 m). Incluye 3 paredes laterales desmontables con ventanas (en la versión con paredes), estacas de anclaje, cuerdas de estabilización y un bolso 600D con ruedas para transportarlo y guardarlo fácil. Ideal para fiestas, ferias, camping, playa, jardín, food trucks o uso comercial. Disponible en varios colores.',

      specs: [
        ['Marca', 'ShadeMax'],
        ['Medidas', '3 × 3 m'],
        ['Altura', '3 alturas ajustables, hasta 2.63 m'],
        ['Techo', 'Tela Oxford 210D con revestimiento plateado impermeable'],
        ['Protección solar', 'UPF 50+'],
        ['Estructura', 'Acero reforzado con tubo cruzado'],
        ['Armado', 'Sistema pop-up, sin herramientas (2 personas)'],
        ['Paredes', '3 paredes desmontables con ventanas (versión con paredes)'],
        ['Anclaje', 'Estacas + cuerdas de estabilización incluidas'],
        ['Transporte', 'Bolso 600D con ruedas incluido'],
        ['Colores', 'Blanco, Negro, Azul, Rojo'],
        ['Incluye', '1 × Gazebo 3×3 + estacas + cuerdas + bolso con ruedas']
      ],

      descImages: [
        { src: G + 'anclaje.webp', alt: 'Sistema de anclaje, seguros de altura y acero inoxidable texturizado' },
        { src: G + 'facil.webp',   alt: 'Fácil de armar y desmontar, se adapta a cualquier espacio' }
      ],

      reviews: [
        { nm: 'Rodrigo_mx', stars: 5, thumb: G + 'rev1.jpg', date: '10 de julio de 2026', variant: 'Con 3 paredes / 3×3 m', text: 'Lo usé para la carne asada del domingo y quedó increíble. Entre dos lo armamos en menos de 5 minutos. Las paredes ayudan un montón cuando pega el aire. Muy resistente.' },
        { nm: 'Fernanda G.', stars: 5, thumb: G + 'rev2.jpg', date: '5 de julio de 2026', variant: 'Sin paredes / 3×3 m', text: 'Nos salvó en la playa, el sol estaba pesadísimo y abajo se sentía fresco. La lona no deja pasar nada de agua, nos agarró un aguacero y todo seco. Súper recomendado.' },
        { nm: 'Emilio_ferias', stars: 5, thumb: G + 'rev3.jpg', date: '30 de junio de 2026', variant: 'Con 3 paredes / 3×3 m', text: 'Lo uso para mi puesto en el tianguis cada fin. El acero se siente firme, no se tambalea. El bolso con ruedas es una maravilla para cargarlo yo solo.' },
        { nm: 'Carolina R.', stars: 4, thumb: G + 'rev4.jpg', date: '24 de junio de 2026', variant: 'Sin paredes / 3×3 m', text: 'Muy bueno y bonito el color azul. Le doy 4 estrellas solo porque de verdad se necesitan dos personas para armarlo bien, una sola batalla un poco. Calidad excelente.' },
        { nm: 'el_chef_toño', stars: 5, thumb: G + 'rev5.jpg', date: '19 de junio de 2026', variant: 'Con 3 paredes / 3×3 m', text: 'Lo tengo afuera de mi food truck. Aguantó lluvia y viento sin problema. Las alturas ajustables me sirven para nivelarlo en la banqueta despareja.' },
        { nm: 'Mariana V.', stars: 5, thumb: G + 'rev6.jpg', date: '14 de junio de 2026', variant: 'Sin paredes / 3×3 m', text: 'Llegó en 3 días con envío gratis. Se guarda en su bolso y no ocupa nada en la cajuela. Lo llevamos de camping y fue lo mejor del viaje.' }
      ],

      reviewPool: [
        { nm: 'Gustavo_gdl', stars: 5, date: '9 de junio de 2026', variant: 'Con 3 paredes / 3×3 m', text: 'Excelente para eventos. Ya lo armé como 6 veces y sigue como nuevo. Las paredes con ventana se ven muy pro y dan sombra completa.' },
        { nm: 'Adriana P.', stars: 5, date: '3 de junio de 2026', variant: 'Sin paredes / 3×3 m', text: 'Perfecto para el jardín. Los niños juegan abajo sin quemarse con el sol. Muy fácil de limpiar la lona.' },
        { nm: 'Beto_camping', stars: 4, date: '28 de mayo de 2026', variant: 'Sin paredes / 3×3 m', text: 'Buen gazebo por el precio. Tardó un día más de lo estimado pero llegó completo con estacas y cuerdas. Bien reforzado.' },
        { nm: 'Lucero M.', stars: 5, date: '22 de mayo de 2026', variant: 'Con 3 paredes / 3×3 m', text: 'Lo compré para la fiesta de mi hija y fue un éxito. Cupieron dos mesas largas abajo. Se ve carísimo y no lo fue.' },
        { nm: 'Ramiro_eventos', stars: 5, date: '16 de mayo de 2026', variant: 'Con 3 paredes / 3×3 m', text: 'Trabajo montando eventos y ya compré 3. Resisten el uso rudo y el armado pop-up ahorra muchísimo tiempo. Muy recomendables.' },
        { nm: 'Paty', stars: 5, date: '10 de mayo de 2026', variant: 'Sin paredes / 3×3 m', text: 'Lo uso en la terraza para el café de la mañana. Impermeable de verdad, resistió las lluvias de la temporada sin gotear. Encantada.' }
      ]
    },

    'patinete-cross-pro': {
      slug: 'patinete-cross-pro',
      url: '/patinete/cross-pro/',
      brand: 'CrossPro',
      shopInitials: 'CP',
      shopName: 'CrossPro',
      title: 'Patín Eléctrico Cross Pro 10" — Motor 350W, Freno de Disco, Llantas Inflables, Autonomía hasta 25 km, Velocidad 25 km/h (Soporta 120 kg)',
      shortName: 'Patín Eléctrico Cross Pro 10"',
      variant: 'Negro',
      variantFull: 'Negro / 10"',
      price: 219,
      was: 1299,
      discount: '-83%',
      currency: 'ARS',
      rating: '4.8',
      reviewsCount: '2,884',
      sold: '11,300 vendidos',
      stock: 12,
      metaTitle: 'Patín Eléctrico Cross Pro 10" — Motor 350W, hasta 25 km/h | Envío Gratis Argentina',
      metaDesc: 'Patín eléctrico Cross Pro 10": motor 350W, hasta 25 km/h, autonomía de 25 km, freno de disco y llantas inflables. Soporta 120 kg. 4.8★, 11,300 vendidos. Envío gratis a toda Argentina.',

      gallery: [
        { src: IMG.negro,    alt: 'Patín eléctrico Cross Pro 10" color negro' },
        { src: IMG.g1,       alt: 'Patín eléctrico Cross Pro en uso urbano' },
        { src: IMG.g2,       alt: 'Detalle del manubrio y pantalla del Cross Pro' },
        { src: IMG.features, alt: 'Características: motor 350W, freno de disco, llantas de 10", faro LED' },
        { src: IMG.g3,       alt: 'Patín eléctrico Cross Pro plegado y portátil' },
        { src: IMG.azul,     alt: 'Patín eléctrico Cross Pro color azul' }
      ],

      colors: [
        { name: 'Negro',   img: IMG.negro },
        { name: 'Azul',    img: IMG.azul },
        { name: 'Rosa',    img: IMG.rosa },
        { name: 'Blanco',  img: IMG.blanco },
        { name: 'Naranja', img: IMG.naranja }
      ],

      whyCheap: 'Estamos renovando el modelo de temporada y liquidando el stock restante en lugar de almacenarlo. Cada unidad es 100% nueva, en su empaque original y con la garantía completa del fabricante. Cuando repongamos inventario, el precio volverá a <b>$1,299 ARS</b>.',

      description: 'Patín eléctrico diseñado para la movilidad urbana: motor de 350W, batería de larga duración y freno de disco para un transporte práctico y seguro. Alcanza hasta 25 km/h y una autonomía de hasta 25 km con una sola carga. Llantas inflables de 10" que absorben los baches, faro LED y luz trasera para rodar de noche, y estructura plegable para guardarlo o llevarlo en el transporte. Ideal para ir al trabajo, la escuela o pasear por la ciudad.',

      specs: [
        ['Marca', 'CrossPro'],
        ['Motor', '350W'],
        ['Velocidad máxima', '25 km/h en terreno plano'],
        ['Autonomía', 'Hasta 25 km'],
        ['Batería', '36V 7.8Ah Li-ion'],
        ['Llantas', '10" inflables'],
        ['Frenos', 'Disco + electrónico'],
        ['Carga máxima', 'Hasta 120 kg'],
        ['Pendiente', 'Hasta 15°'],
        ['Iluminación', 'Faro LED + luz trasera'],
        ['Tiempo de carga', '4 - 6 horas'],
        ['Resistencia al agua', 'IPX4 (salpicaduras)'],
        ['Edad recomendada', '14 años en adelante'],
        ['Incluye', '1 × Patín eléctrico + cargador']
      ],

      descImages: [
        { src: IMG.features, alt: 'Motor 350W, freno de disco, llantas de 10" y faro LED' },
        { src: IMG.g2,       alt: 'Pantalla con velocidad y nivel de batería' }
      ],

      reviews: [
        { nm: 'Emiliano_cdmx', stars: 5, thumb: IMG.rev1, date: '9 de julio de 2026', variant: 'Negro / 10"', text: 'No esperaba tanto por el precio y me sorprendió. Llego al trabajo en la mitad del tiempo y la batería aguanta toda mi ida y vuelta. El freno de disco responde muy bien.' },
        { nm: 'Regina T.', stars: 5, thumb: IMG.rev2, date: '6 de julio de 2026', variant: 'Rosa / 10"', text: 'Llegó en 3 días con envío gratis. Muy fácil de usar, las llantas inflables se sienten suaves hasta en calles con baches. Mi novio ya quiere uno.' },
        { nm: 'Diego_movilidad', stars: 5, thumb: IMG.rev3, date: '2 de julio de 2026', variant: 'Negro / 10"', text: 'Subo una loma en mi colonia y la agarra sin problema. El faro LED alumbra bien de noche. Calidad muy buena para lo que costó.' },
        { nm: 'Paola M.', stars: 5, thumb: IMG.rev4, date: '28 de junio de 2026', variant: 'Azul / 10"', text: 'Lo compré para dejar el coche en casa y fue la mejor decisión. Se pliega y lo subo al metro sin problema. Anda rapidísimo.' },
        { nm: 'Santiago', stars: 4, date: '24 de junio de 2026', variant: 'Negro / 10"', text: 'Muy buen patín por el precio. Le quito una estrella solo porque tardó un día más de lo estimado, pero la calidad vale la pena.' },
        { nm: 'urbana_fer', stars: 5, date: '20 de junio de 2026', variant: 'Blanco / 10"', text: 'Ligero para cargarlo y firme cuando vas arriba. La app de velocidad es un plus. Ya llevo 200 km y sigue como nuevo.' }
      ],

      reviewPool: [
        { nm: 'Alejandro R.', stars: 5, date: '17 de junio de 2026', variant: 'Negro / 10"', text: 'Rendimiento sorprendente. Alcanza los 25 km/h sin batallar y frena parejo. Lo uso todos los días para ir a la uni.' },
        { nm: 'Mariana', stars: 5, date: '13 de junio de 2026', variant: 'Naranja / 10"', text: 'El color naranja se ve increíble. Batería dura mucho y se carga en una noche. Súper recomendado.' },
        { nm: 'jorge_bike', stars: 5, date: '9 de junio de 2026', variant: 'Negro / 10"', text: 'Vengo de las bicis eléctricas y este patín me ganó por lo práctico. Se pliega y cabe en la cajuela. Muy estable a alta velocidad.' },
        { nm: 'Valeria C.', stars: 4, date: '5 de junio de 2026', variant: 'Rosa / 10"', text: 'Muy bonito y rápido. El manual venía en inglés pero es intuitivo. Las llantas inflables hacen toda la diferencia.' },
        { nm: 'Kevin_gdl', stars: 5, date: '1 de junio de 2026', variant: 'Negro / 10"', text: 'En Guadalajara lo uso a diario. Aguanta mi peso (98 kg) sin perder velocidad. El freno de disco da mucha seguridad.' },
        { nm: 'Daniela', stars: 5, date: '28 de mayo de 2026', variant: 'Azul / 10"', text: 'Se lo regalé a mi hermano y no lo suelta. Llega cargado al 80% y armarlo fue cosa de minutos. Excelente compra.' },
        { nm: 'el_profe_luis', stars: 5, date: '24 de mayo de 2026', variant: 'Negro / 10"', text: 'Llevo un mes usándolo para ir a dar clases. Ahorro muchísimo en gasolina y transporte. La autonomía real me da como 22 km.' },
        { nm: 'Renata', stars: 5, date: '20 de mayo de 2026', variant: 'Blanco / 10"', text: 'Diseño limpio y elegante. Las luces LED se ven geniales de noche. Muy fácil de manejar aunque nunca había usado uno.' }
      ]
    },

    'armario-flexhome': {
      slug: 'armario-flexhome',
      url: '/armario/flexhome/',
      brand: 'SODIMAC',
      shopInitials: 'SD',
      shopName: 'SODIMAC',
      shopLogo: '/__l5e/assets-v1/381c3418-4139-49e6-92d4-045cc54309bd/sodimac-header-logo.png',
      shopLogoOnly: true,
      shopLogoOriginalRatio: true,
      storeAfterReviews: true,
      detailsAfterRelated: true,
      descriptionAfterReviews: true,
      reviewSource: 'Comprado en TTK Shop',
      title: 'Armario FlexHome de Acero Multifuncional — Aparador de Cocina de 4 Niveles, Puertas Abatibles de Vidrio, Acero Reforzado (Soporta 200 kg por estante)',
      shortName: 'Armario FlexHome de Acero',
      variant: 'Negro grafito',
      variantFull: 'Negro grafito / 145×80 cm',
      price: 27900,
      was: 116900,
      discount: '-76%',
      currency: 'ARS',
      rating: '4.9',
      reviewsCount: '1,502',
      sold: '9,229 vendidos',
      stock: 9,
      metaTitle: 'Armario FlexHome de Acero Multifuncional — 4 niveles, puertas de vidrio | Envío Gratis Argentina',
      metaDesc: 'Armario FlexHome de acero al carbono reforzado con recubrimiento antióxido: 4 niveles, puertas abatibles de vidrio, soporta 200 kg por estante. 145×80×32 cm. 4.9★, 9,229 vendidos. Envío gratis a toda Argentina.',

      gallery: [
        { src: '/__l5e/assets-v1/9b016f33-21e4-403a-94f1-cb34f82ef0c4/arm-1.png', alt: 'Armario FlexHome disponible en negro grafito y blanco' },
        { src: '/__l5e/assets-v1/917b2ef0-da9f-4f3f-994e-a8f198e05a5a/arm-2.png', alt: 'Armario FlexHome de acero negro grafito con puertas de vidrio' },
        { src: '/__l5e/assets-v1/2b11021b-fd2f-42f7-a149-0a93dc7a16dc/arm-3.png', alt: 'Armario FlexHome de acero blanco con puertas de vidrio' },
        { src: '/__l5e/assets-v1/10a2c985-4628-4ab8-a65d-254eba0b907c/arm-4.png', alt: 'Armario FlexHome en la cocina con patas niveladoras ajustables' }
      ],

      colors: [
        { name: 'Negro grafito', img: '/__l5e/assets-v1/917b2ef0-da9f-4f3f-994e-a8f198e05a5a/arm-2.png' },
        { name: 'Blanco',        img: '/__l5e/assets-v1/2b11021b-fd2f-42f7-a149-0a93dc7a16dc/arm-3.png' }
      ],


      bogo: {
        title: 'Compre 1 y Lleve 2',
        sub: 'Te llevas 2 armarios por el precio de 1 — elige tu combinación.',
        cta: '¡Lo quiero!'
      },
      giftBonus: 'Set de 12 Contenedores Herméticos de Vidrio',
      giftBonusImg: '/__l5e/assets-v1/46fc813b-edf8-4bc9-86af-dc75c68dfd4e/panelas-checkout.png',

      whyCheap: 'Estamos renovando el catálogo de temporada y liquidando el stock restante en lugar de almacenarlo. Cada unidad es 100% nueva, en su empaque original y con la garantía completa del fabricante. Cuando repongamos inventario, el precio volverá a <b>$116.900 ARS</b>.',

      description: 'Armario multifuncional de acero al carbono reforzado con recubrimiento antióxido, diseñado para organizar y lucir tus cosas con estilo. Cuenta con 4 niveles y puertas abatibles de vidrio templado esmerilado que protegen del polvo y dejan ver el contenido. Soporta hasta 200 kg por estante: caben ollas, sartenes, hasta la freidora de aire, vajilla, libros o plantas. Ideal como aparador de cocina, rincón de café, despensa o mueble organizador en cualquier habitación. Patas niveladoras de acero inoxidable para pisos disparejos y armado sencillo con manual y guía en video.',

      specs: [
        ['Marca', 'FlexHome'],
        ['Material', 'Acero al carbono reforzado, recubrimiento antióxido'],
        ['Dimensiones', '145 × 80 × 32 cm (alto × ancho × fondo)'],
        ['Niveles', '4 compartimentos'],
        ['Puertas', 'Vidrio templado esmerilado, abatibles'],
        ['Capacidad', 'Hasta 200 kg por estante'],
        ['Color', 'Negro grafito / Blanco'],
        ['Patas', 'Niveladoras de acero inoxidable'],
        ['Incluye', '1 × Armario + kit organizador de regalo + manual']
      ],

      descImages: [
        { src: '/__l5e/assets-v1/e21f52cf-e809-40b1-a018-721aa1630c84/flexhome-descricao-medidas.png', alt: 'Medidas, características y usos del Armario FlexHome de cuatro niveles' },
        { src: '/__l5e/assets-v1/e7e136d0-8c70-4f59-a682-5ec3cdac8b16/flexhome-ajustable-copy.png', alt: 'Estantes ajustables y capacidad del Armario FlexHome' }
      ],
      descExpanded: true,

      reviews: [
        { nm: 'Juliana F.', stars: 5, thumb: '/__l5e/assets-v1/e950bc0c-b4b6-4334-8df1-1c2032182dd0/review-flexhome-new-1.png', av: '', date: '1 de julio de 2026', variant: 'Negro grafito / 145×80 cm', text: '¡El armario es simplemente perfecto! Cabe todo: ollas, sartenes, hasta la freidora de aire. Las puertas de vidrio se ven carísimas y no entra nada de polvo.' },
        { nm: 'Rafael O.', stars: 5, thumb: '/__l5e/assets-v1/77720c78-d521-4d6c-b00d-2381eec1c0c4/review-flexhome-white-cabinet.png', av: '', date: '3 de junio de 2026', variant: 'Blanco / 145×80 cm', text: 'Excelente material, bien resistente. Los estantes ajustables aprovechan muy bien el espacio y las patas dejaron el armario perfectamente nivelado.' },
        { nm: 'Amanda C.', stars: 5, thumb: '/__l5e/assets-v1/ce9b6755-8398-4d43-ba7f-d6c8f0fcd568/review-flexhome-new-3.png', av: '', date: '6 de mayo de 2026', variant: 'Negro grafito / 145×80 cm', text: 'Llegó súper rápido y es exactamente como en la descripción. Lo uso como rincón de café en la cocina y se ve precioso.' },
        { nm: 'Patricia A.', stars: 5, thumb: '/__l5e/assets-v1/cb60814b-029e-47fa-9e66-2915d4788220/review-flexhome-new-4.png', av: '', date: '23 de mayo de 2026', variant: 'Blanco / 145×80 cm', text: 'Calidad excepcional y muy versátil. Lo puse en el comedor como aparador y todos me preguntan dónde lo compré.' },
        { nm: 'Carla M.', stars: 5, thumb: '/__l5e/assets-v1/2d8e0bdc-9fa8-4ea9-91f5-fbc4243231ae/review-flexhome-new-5.png', av: '', date: '9 de mayo de 2026', variant: 'Negro grafito / 145×80 cm', text: 'Las puertas de vidrio se ven de lujo y mantienen todo libre de polvo. El acero es muy resistente, aguanta muchísimo peso.' },
        { nm: 'Fernanda L.', stars: 5, date: '21 de marzo de 2026', variant: 'Negro grafito / 145×80 cm', text: 'La mejor relación calidad-precio. Aguanta muchísimo peso por estante y el recubrimiento antióxido es un gran plus.' }
      ],

      relatedProducts: [
        { name: 'Sofá Plegable KIVENJAJA', img: '/__l5e/assets-v1/ea12770e-9434-497f-b079-a448386fb208/relacionado-sofa-kivenjaja.png', price: 17900, was: 97000 },
        { name: 'Mecedora Papasan Oversized Acolchada', img: '/__l5e/assets-v1/e2b2ff88-68ad-4c39-a2bd-6b572f192ef3/relacionado-mecedora-papasan.png', price: 29900, was: 74900 },
        { name: 'Silla Adirondack', img: '/__l5e/assets-v1/d769212c-c2af-46ee-b57e-a12d3946d5c4/relacionado-silla-adirondack.png', price: 19900, was: 53900 },
        { name: 'Set 2 Reposeras Chaise Lounge + Mesa', img: '/__l5e/assets-v1/1be2016d-b02a-40d8-8469-866437a5d644/relacionado-reposeras-set.png', price: 34900, was: 89900 },
        { name: 'Futón Convertible 4 en 1 de Espuma', img: '/__l5e/assets-v1/c08b116e-8646-4a09-83de-8b36afb1830d/relacionado-futon-4en1.png', price: 24900, was: 69900 },
        { name: 'Sofá Cama Convertible Nube con Almacenaje — Sofá Acolchado', img: '/__l5e/assets-v1/834106e9-3c72-474a-b0cf-ad0f1ebc588b/relacionado-sofa-cama-nube.png', price: 39900, was: 109900 }
      ],

      reviewPool: [
        { nm: 'Gabriela_cocina', stars: 5, date: '17 de marzo de 2026', variant: 'Negro grafito / 145×80 cm', text: 'Organicé toda mi cocina con este armario. Las puertas de vidrio dejan ver todo y se limpia en segundos. Me encantó.' },
        { nm: 'Héctor R.', stars: 5, date: '13 de marzo de 2026', variant: 'Negro grafito / 145×80 cm', text: 'Muy sólido y elegante. Lo armé solo en 40 minutos. Los estantes aguantan un montón de peso sin doblarse.' },
        { nm: 'Mónica', stars: 4, date: '8 de marzo de 2026', variant: 'Blanco / 145×80 cm', text: 'Precioso y muy funcional. Le quito una estrella porque tardó un día extra, pero la calidad lo vale totalmente.' },
        { nm: 'depto_valeria', stars: 5, date: '2 de marzo de 2026', variant: 'Blanco / 145×80 cm', text: 'Perfecto para mi departamento chico. Guarda muchísimo y ocupa poco espacio. El vidrio esmerilado se ve carísimo.' },
        { nm: 'Ricardo M.', stars: 5, date: '26 de febrero de 2026', variant: 'Negro grafito / 145×80 cm', text: 'Lo uso como mueble de despensa. Las patas niveladoras salvaron mi piso disparejo. Excelente compra.' },
        { nm: 'Sofía', stars: 5, date: '20 de febrero de 2026', variant: 'Negro grafito / 145×80 cm', text: 'Se ve mucho más caro de lo que costó. Firme, bonito y con mucho espacio. Ya quiero comprar otro para la recámara.' }
      ],

      cartBumps: [
        {
          slug: 'bateria-cocina-ceramica', offer: '1', color: 'Crema',
          name: 'Set de 10 Ollas de Cerámica',
          variant: 'Antiadherente · 10 piezas',
          img: '/__l5e/assets-v1/46fc813b-edf8-4bc9-86af-dc75c68dfd4e/panelas-checkout.png', price: 16900, was: 112900,
          tag: '🎁 Completa tu cocina', hint: 'Oferta solo aquí', badge: '-85%',
          ttl: 'Set de 10 Ollas de Cerámica',
          benef: 'Antiadherente · Apta para toda estufa · 10 piezas incluidas'
        },
        {
          slug: 'mesa-plegable-fold', offer: '1', color: 'Blanco',
          name: 'Mesa Plegable FoldEase 180 cm',
          variant: 'Blanco · 180 cm',
          img: '/__l5e/assets-v1/feff8f84-07b3-4f73-8722-c07e4bfb67eb/mesa-v2.png', price: 19900, was: 79900,
          tag: '🎁 Añade a tu pedido', hint: 'Oferta solo aquí', badge: '-75%',
          ttl: 'Mesa Plegable FoldEase 180 cm',
          benef: 'Plegable y portátil · 180 cm · Ideal para camping, fiestas y jardín'
        }
      ]
    },

    'bateria-cocina-ceramica': {
      slug: 'bateria-cocina-ceramica',
      url: '/cocina/bateria-ceramica/',
      brand: "D'Italia",
      shopInitials: 'DI',
      shopName: "D'Italia Oficial",
      title: 'Batería de Cocina Antiadherente de Cerámica — 10 Piezas, Apta para Gas, Eléctrica e Inducción, Tapas de Vidrio Templado y Mangos que No Calientan',
      shortName: 'Batería de Cocina Cerámica 10 Piezas',
      variant: 'Crema',
      variantFull: 'Crema / 10 piezas',
      price: 219,
      was: 1499,
      discount: '-85%',
      currency: 'ARS',
      rating: '4.9',
      reviewsCount: '14,900',
      sold: '12,400 vendidos',
      stock: 11,
      metaTitle: 'Batería de Cocina Antiadherente de Cerámica 10 Piezas — Apta para Inducción | Envío Gratis Argentina',
      metaDesc: 'Batería de cocina antiadherente de cerámica de 10 piezas: apta para gas, eléctrica e inducción, tapas de vidrio templado, mangos soft-touch y 3 mm de grosor. 4.9★, 12,400 vendidas. Envío gratis a toda Argentina.',

      gallery: [
        { src: C + 'hero.webp', alt: 'Batería de cocina antiadherente de cerámica de 10 piezas color crema' },
        { src: C + 'g1.webp',   alt: 'Batería de cocina de cerámica en color gris con mangos efecto madera' },
        { src: C + 'rev1.webp', alt: 'Batería de cocina en uso sobre estufa de gas' },
        { src: C + 'rev3.webp', alt: 'Set completo recién desempacado con sus tapas de vidrio' }
      ],

      colors: [
        { name: 'Crema', img: C + 'hero.webp' },
        { name: 'Gris',  img: C + 'g1.webp' }
      ],

      whyCheap: 'Estamos renovando el catálogo de temporada y liquidando el stock restante en lugar de almacenarlo. Cada set es 100% nuevo, en su empaque original y con la garantía completa del fabricante. Cuando repongamos inventario, el precio volverá a <b>$1,499 ARS</b>.',

      description: 'Batería de cocina de 10 piezas con triple capa antiadherente de cerámica: la comida no se pega, cocinas con mucho menos aceite y se limpia pasando la esponja. El fondo triple de 4 mm con placa de inducción reparte el calor parejo, así que no se te quema el guisado de un lado mientras el otro sigue crudo, y calienta rápido en fuego bajo o medio. Los mangos de baquelita efecto madera son soft-touch, llevan protector de flama y no transmiten calor. Las tapas de vidrio templado tienen salida de vapor para vigilar la cocción sin destapar. Libre de PFOA y no tóxica. Sirve en estufa de gas, eléctrica y de inducción, y es apta para lavavajillas. Incluye 2 cacerolas con tapa, 2 ollas con tapa, 2 sartenes, 1 olla lechera y 3 utensilios de bambú de regalo.',

      specs: [
        ['Marca', "D'Italia"],
        ['Material', 'Aluminio con triple capa antiadherente de cerámica'],
        ['Piezas', '10 piezas'],
        ['Fondo', 'Triple, 4 mm, con placa para inducción'],
        ['Mangos', 'Baquelita efecto madera soft-touch, con protector de flama'],
        ['Tapas', 'Vidrio templado con salida de vapor'],
        ['Compatibilidad', 'Gas, eléctrica e inducción'],
        ['Libre de PFOA', 'Sí, no tóxica'],
        ['Horno', 'No apta para horno'],
        ['Lavavajillas', 'Apta'],
        ['Medidas', 'Sartén 22×4.5 cm · Cacerolas 20×8.5 cm y 22×10 cm · Olla 18×8 cm · Lechera 14×10 cm'],
        ['Capacidades', '1.4 L · 2.4 L · 3.5 L · 1.7 L · 1.3 L'],
        ['Color', 'Crema / Gris'],
        ['Garantía', '2 años'],
        ['Incluye', '2 cacerolas con tapa, 2 ollas con tapa, 2 sartenes, 1 olla lechera + 3 utensilios']
      ],

      reviews: [
        { nm: 'Mariana G.', stars: 5, thumb: C + 'rev2.webp', av: C + 'av-mariana.jpg', date: '11 de julio de 2026', variant: 'Gris / 10 piezas', text: 'Se ven preciosas en la cocina y son facilísimas de lavar. El huevo se desliza solo, sin nada de aceite. El grosor se siente de calidad, no son de esas hojalatas que se doblan.' },
        { nm: 'Rocío A.', stars: 5, av: C + 'av-rocio.jpg', date: '5 de julio de 2026', variant: 'Crema / 10 piezas', text: 'Las compré para mi parrilla de inducción y calientan parejo y rápido. Los mangos no se calientan ni tantito. Por el precio no encuentras nada igual.' },
        { nm: 'Lucía M.', stars: 5, thumb: C + 'rev4.webp', av: C + 'av-lucia.jpg', date: '28 de junio de 2026', variant: 'Crema / 10 piezas', text: 'Llegaron en 4 días, todas bien protegidas con plástico de burbuja. Las tapas de vidrio son muy prácticas para no destapar a cada rato. Ya regalé otro set a mi mamá.' },
        { nm: 'Ana Sofía', stars: 4, av: C + 'av-anasofia.jpg', date: '22 de junio de 2026', variant: 'Gris / 10 piezas', text: 'Cocinan increíble y no se pega nada. Le quito una estrella porque en estufa de gas la parte de afuera se me manchó un poco con el uso, pero por dentro siguen impecables.' },
        { nm: 'Gerardo_cocina', stars: 5, date: '16 de junio de 2026', variant: 'Crema / 10 piezas', text: 'Cambié toda mi batería vieja por esta. Uso mucho menos aceite y se lava con solo pasarle la esponja. Los utensilios de bambú salieron buenos también.' },
        { nm: 'Paulina R.', stars: 5, date: '9 de junio de 2026', variant: 'Gris / 10 piezas', text: 'El set completo por lo que cuesta una sola olla en la tienda. Pesan lo justo, ni muy pesadas ni corrientes. Muy contenta con la compra.' }
      ],

      reviewPool: [
        { nm: 'Verónica L.', stars: 5, date: '3 de junio de 2026', variant: 'Crema / 10 piezas', text: 'Llevo dos meses usándolas a diario y siguen como nuevas. Nada se pega, ni el arroz ni la carne. Se limpian en segundos.' },
        { nm: 'Emilio T.', stars: 5, date: '27 de mayo de 2026', variant: 'Gris / 10 piezas', text: 'Buenísimas. El fondo grueso reparte el calor parejo y no se queman los guisados por un lado como me pasaba antes. Recomendadísimas.' },
        { nm: 'la_cocina_de_rosy', stars: 5, date: '20 de mayo de 2026', variant: 'Crema / 10 piezas', text: 'Cocino para 6 personas todos los días y me rinden perfecto. La cacerola de 3.5 litros tiene muy buena capacidad.' },
        { nm: 'Néstor V.', stars: 4, date: '14 de mayo de 2026', variant: 'Gris / 10 piezas', text: 'Muy buena relación calidad-precio. Tardaron un día más de lo estimado pero llegaron completas y bien empacadas.' },
        { nm: 'Adriana', stars: 5, date: '7 de mayo de 2026', variant: 'Crema / 10 piezas', text: 'Las tapas de vidrio son mi parte favorita, veo la comida sin perder el vapor. Y van al lavavajillas sin problema.' },
        { nm: 'Ismael G.', stars: 5, date: '1 de mayo de 2026', variant: 'Gris / 10 piezas', text: 'Se las regalé a mi esposa y quedó feliz. Se ven mucho más caras de lo que costaron. Excelente compra.' }
      ]
    }

  };
})();
