import React, { useMemo, useState } from "react";

const WHATSAPP = "543364029927";

type Tier = "minorista" | "mayorista";

type Format = {
  size: string;
  price: number | null;
  tier: Tier;
  unit?: string;
  minQty?: number;
  maxQty?: number;
  yieldText?: string;
};

type Product = {
  id: number;
  category: string;
  name: string;
  badge?: string;
  formats: Format[];
};

type CartItem = Format & {
  key: string;
  name: string;
  category: string;
  qty: number;
  hasBidon: "si" | "no" | "no aplica";
};

const CONTAINER_PRICES = {
  "5L": 1500,
  "20L": 3800,
  "20KG": 3800
};

const products: Product[] = [
  {
    id: 1,
    category: "Jabones textiles",
    name: "Jabón líquido Tipo Ariel",
    formats: [
      { size: "1L", price: 1200, tier: "minorista" },
      { size: "5L", price: 3000, tier: "minorista" },
      { size: "20L a 99L", price: 400, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 2,
    category: "Jabones textiles",
    name: "Jabón líquido Tipo Skip",
    formats: [
      { size: "1L", price: 1200, tier: "minorista" },
      { size: "5L", price: 3000, tier: "minorista" },
      { size: "20L a 99L", price: 400, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 3,
    category: "Jabones textiles",
    name: "Jabón líquido Uva Caramelo",
    formats: [
      { size: "1L", price: 1600, tier: "minorista" },
      { size: "5L", price: 4000, tier: "minorista" },
      { size: "20L a 99L", price: 635, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 4,
    category: "Jabones textiles",
    name: "Jabón líquido Ariel Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 5,
    category: "Jabones textiles",
    name: "Jabón líquido Skip Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 6,
    category: "Jabones textiles",
    name: "Jabón líquido Ala Matic Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 7,
    category: "Jabones textiles",
    name: "Jabón líquido Ace Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 8,
    category: "Suavizantes textiles",
    name: "Suavizante celeste eco",
    formats: [
      { size: "1L", price: 1600, tier: "minorista" },
      { size: "5L", price: 4250, tier: "minorista" },
      { size: "20L a 99L", price: 680, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 9,
    category: "Suavizantes textiles",
    name: "Suavizante perfumado celeste",
    formats: [
      { size: "1L", price: 1900, tier: "minorista" },
      { size: "5L", price: 5200, tier: "minorista" },
      { size: "20L a 99L", price: 830, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 10,
    category: "Suavizantes textiles",
    name: "Suavizante perfumado New White",
    formats: [
      { size: "1L", price: 1900, tier: "minorista" },
      { size: "5L", price: 5200, tier: "minorista" },
      { size: "20L a 99L", price: 830, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 11,
    category: "Detergentes",
    name: "Detergente lavavajillas limón",
    formats: [
      { size: "1L", price: 2000, tier: "minorista" },
      { size: "5L", price: 5800, tier: "minorista" },
      { size: "20KG a 99KG", price: 885, tier: "mayorista", unit: "x kg", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 12,
    category: "Detergentes",
    name: "Detergente con desengrasante",
    formats: [
      { size: "1L", price: 2400, tier: "minorista" },
      { size: "5L", price: 7400, tier: "minorista" },
      { size: "20KG a 99KG", price: 1140, tier: "mayorista", unit: "x kg", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 13,
    category: "Jabones para manos",
    name: "Jabón para manos coco",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 14,
    category: "Jabones para manos",
    name: "Jabón para manos cherry",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },

  ...makePerfumesTextiles(100, "Perfumes textiles / ambiente / corporal", [
    ["Uva caramelo", 2900, 6100, 2250, 4800],
    ["Mora y crema", 2900, 5900, 2250, 4650],
    ["Frutos rojos", 2900, 6800, 2450, 5350],
    ["Frutilla", 2900, 6200, 2300, 4800],
    ["Cherry", 2900, 6300, 2300, 5000],
    ["Ariel OXY", 2900, 7400, 2600, 5800],
    ["Skip", 2900, 5800, 2250, 4450],
    ["Ala matic", 2900, 6600, 2400, 5150],
    ["Ace", 2900, 5800, 2250, 4450],
    ["Limón", 2900, 5000, 2000, 3900],
    ["Lavanda", 2900, 5000, 2000, 3900],
    ["New White fresco", 2900, 6800, 2450, 5350],
    ["Citronella", 2900, 5800, 2150, 4250],
    ["Confort", 2900, 6200, 2300, 4800],
    ["Colonia de bebé", 2900, 6200, 2250, 4800],
    ["Pradera de bosque", 2900, 5900, 2200, 4600]
  ]),

  {
    id: 200,
    category: "Desengrasantes",
    name: "Desengrasante multiuso",
    formats: [
      { size: "250cc c/push", price: 1700, tier: "minorista" },
      { size: "1L", price: 2600, tier: "minorista" },
      { size: "5L", price: 7200, tier: "minorista" },
      { size: "20L a 99L", price: 1200, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 201,
    category: "Desengrasantes",
    name: "Desengrasante industrial",
    formats: [
      { size: "250cc c/push", price: 2500, tier: "minorista" },
      { size: "1L", price: 4900, tier: "minorista" },
      { size: "5L", price: 18000, tier: "minorista" },
      { size: "20L a 99L", price: 2900, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 202,
    category: "Lavandinas / cloro",
    name: "Lavandina concentrada",
    formats: [
      { size: "1L", price: 900, tier: "minorista" },
      { size: "5L", price: 2500, tier: "minorista" },
      { size: "20L", price: 350, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 203,
    category: "Lavandinas / cloro",
    name: "Cloro líquido puro",
    formats: [
      { size: "1L", price: 1500, tier: "minorista" },
      { size: "5L", price: 4200, tier: "minorista" },
      { size: "20L", price: 650, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 204,
    category: "Lavandinas / cloro",
    name: "Lavandina gel",
    formats: [{ size: "Consultar", price: null, tier: "minorista" }]
  },

  ...makePerfuminas(300, [
    ["Perfumina Uva Caramelo", 2000, 5000, 1700, 4600],
    ["Perfumina Colonia de bebé", 2000, 5000, 1700, 4600],
    ["Perfumina Frutos Rojos", 2000, 5200, 1700, 4800],
    ["Perfumina Frutilla", 2000, 4700, 1700, 4300],
    ["Perfumina Cherry", 2000, 4500, 1700, 4100],
    ["Perfumina Limón", 2000, 4100, 1700, 3800],
    ["Perfumina Lavanda", 2000, 4100, 1700, 3800],
    ["Perfumina Pino", 2000, 4000, 1700, 3700],
    ["Perfumina Citronella", 2000, 4900, 1700, 4500],
    ["Perfumina Citrus", 2000, 4500, 1700, 4100]
  ]),

  ...makeBulkProducts(400, "Insecticidas y varios", [
    ["Fluido creolina negra", 1900, 5300, 21200, 3810],
    ["K-otrina concentrada 1+4", 1200, 3000, 10100, 1810, "Rinde 5 veces más"],
    ["Flit original aceite", 4200, 12600, 36600, 5700],
    ["Flit ecológico", 1400, 3800, 13800, 2600],
    ["Repelente con citronella", 2000, 4250, 16850, 3150],
    ["Cera para pisos", 1800, 4800, 18800, 2900]
  ]),
  {
    id: 406,
    category: "Insecticidas y varios",
    name: "Mojalampazos",
    formats: [
      { size: "250cc", price: 3800, tier: "minorista" },
      { size: "1L", price: 10800, tier: "minorista" }
    ]
  },
  {
    id: 407,
    category: "Insecticidas y varios",
    name: "Matayuyo",
    formats: [
      { size: "250cc", price: 1300, tier: "minorista" },
      { size: "1L", price: 3000, tier: "minorista" },
      { size: "20L a 99L", price: 530, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 408,
    category: "Insecticidas y varios",
    name: "Bicarbonato de limpieza",
    formats: [
      { size: "100gr", price: 600, tier: "minorista" },
      { size: "1/2kg", price: 2500, tier: "minorista" },
      { size: "1kg", price: 4000, tier: "minorista" },
      { size: "+3kg", price: 3500, tier: "mayorista", unit: "x kg", minQty: 3 }
    ]
  },
  ...makePartialBulkProducts(409, "Insecticidas y varios", [
    ["Vinagre de limpieza", 1800, 5300, 995],
    ["Quitasarro concentrado 1+1", 3100, 11300, 2125],
    ["Limpiavidrios", 1700, 4500, 730]
  ]),

  ...makeBulkProducts(500, "Cosmética / limpieza automotor", [
    ["Shampoo siliconado extra teflón", 2100, 5780, 23100, 4360],
    ["Revividor neumáticos siliconado", 1450, 4250, 16850, 3200],
    ["Revividor de neumáticos negro", 1200, 3500, 13500, 2550],
    ["Desengrasante automotor", 2500, 4900, 18000, 2900]
  ]),
  {
    id: 504,
    category: "Cosmética / limpieza automotor",
    name: "Espuma activa",
    formats: [{ size: "Consultar", price: null, tier: "minorista" }]
  }
];

function makePerfumesTextiles(
  startId: number,
  category: string,
  rows: Array<[string, number, number, number, number]>
): Product[] {
  return rows.map(([name, p250, p1, m250, m1], index) => ({
    id: startId + index,
    category,
    name,
    badge: "Mayorista por cantidad",
    formats: [
      { size: "250cc c/push", price: p250, tier: "minorista" },
      { size: "1L", price: p1, tier: "minorista" },
      { size: "250cc c/push mayorista", price: m250, tier: "mayorista", minQty: 4 },
      { size: "1L mayorista", price: m1, tier: "mayorista", minQty: 2 }
    ]
  }));
}

function makePerfuminas(startId: number, rows: Array<[string, number, number, number, number]>): Product[] {
  return rows.map(([name, p250, p1, m250, m1], index) => ({
    id: startId + index,
    category: "Pisos / perfuminas",
    name,
    badge: "Concentrada",
    formats: [
      { size: "250cc", price: p250, tier: "minorista", yieldText: "Rinde 5 litros" },
      { size: "1L", price: p1, tier: "minorista", yieldText: "Rinde 20 litros" },
      { size: "250cc mayorista", price: m250, tier: "mayorista", minQty: 4, yieldText: "Rinde 5 litros" },
      { size: "1L mayorista", price: m1, tier: "mayorista", minQty: 2, yieldText: "Rinde 20 litros" }
    ]
  }));
}

function makeBulkProducts(
  startId: number,
  category: string,
  rows: Array<[string, number, number, number, number, string?]>
): Product[] {
  return rows.map(([name, p250, p1, p5, p20, yieldText], index) => ({
    id: startId + index,
    category,
    name,
    formats: [
      { size: "250cc", price: p250, tier: "minorista", yieldText },
      { size: "1L", price: p1, tier: "minorista", yieldText },
      { size: "5L", price: p5, tier: "minorista", yieldText },
      { size: "20L a 99L", price: p20, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99, yieldText }
    ]
  }));
}

function makePartialBulkProducts(
  startId: number,
  category: string,
  rows: Array<[string, number, number, number]>
): Product[] {
  return rows.map(([name, p1, p5, p20], index) => ({
    id: startId + index,
    category,
    name,
    formats: [
      { size: "1L", price: p1, tier: "minorista" },
      { size: "5L", price: p5, tier: "minorista" },
      { size: "20L a 99L", price: p20, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  }));
}

const categories = ["Todas", ...Array.from(new Set(products.map(product => product.category)))];

function money(n: number | null) {
  if (n === null) return "Consultar";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(n);
}

function isReturnableFormat(size: string) {
  return size.includes("5L") || size.includes("20L") || size.includes("20KG");
}

function containerPriceFor(size: string) {
  if (size.includes("20KG")) return CONTAINER_PRICES["20KG"];
  if (size.includes("20L")) return CONTAINER_PRICES["20L"];
  if (size.includes("5L")) return CONTAINER_PRICES["5L"];
  return 0;
}

function itemMinQty(format: Format) {
  return format.minQty || 1;
}

function itemMaxQty(format: Format) {
  return format.maxQty;
}

export default function App() {
  const [mode, setMode] = useState<Tier>("minorista");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    barrio: "",
    phone: "",
    notes: ""
  });

  const visibleProducts = useMemo(() => {
    const search = query.toLowerCase().trim();

    return products
      .map(product => ({
        ...product,
        formats: product.formats.filter(format => format.tier === mode)
      }))
      .filter(product => product.formats.length > 0)
      .filter(product => category === "Todas" || product.category === category)
      .filter(product => `${product.name} ${product.category}`.toLowerCase().includes(search));
  }, [mode, category, query]);

  function add(product: Product, format: Format) {
    const key = `${product.id}-${format.size}`;

    setCart(prev => {
      if (prev.some(item => item.key === key)) return prev;

      return [
        ...prev,
        {
          key,
          name: product.name,
          category: product.category,
          ...format,
          qty: itemMinQty(format),
          hasBidon: isReturnableFormat(format.size) ? "si" : "no aplica"
        }
      ];
    });
  }

  function updateQty(key: string, value: number) {
    setCart(prev =>
      prev.map(item => {
        if (item.key !== key) return item;

        const min = itemMinQty(item);
        const max = itemMaxQty(item);
        let qty = Math.max(min, value || min);

        if (max) qty = Math.min(max, qty);

        return { ...item, qty };
      })
    );
  }

  function productSubtotal(item: CartItem) {
    if (item.price === null) return 0;
    return item.price * item.qty;
  }

  function containerSubtotal(item: CartItem) {
    if (!isReturnableFormat(item.size)) return 0;
    if (item.hasBidon !== "no") return 0;
    return containerPriceFor(item.size);
  }

  function subtotal(item: CartItem) {
    return productSubtotal(item) + containerSubtotal(item);
  }

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + subtotal(item), 0);
  }, [cart]);

  const hasConsultItems = cart.some(item => item.price === null);

  const whatsappText = useMemo(() => {
    const productsText = cart.length
      ? cart.map(item => {
          const priceText = item.price === null ? "Consultar" : money(item.price);
          const quantityText = `Cantidad: ${item.qty}`;

          const containerText = containerSubtotal(item) > 0
            ? `Envase/bidón nuevo: ${money(containerSubtotal(item))}`
            : "";

          const bidonText = isReturnableFormat(item.size)
            ? `Bidón retornable: ${
                item.hasBidon === "si"
                  ? "Sí, entrega envase para recambio"
                  : "No, necesita bidón/envase nuevo"
              }`
            : "";

          return `• ${item.name}
Formato: ${item.size}
${quantityText}
Precio: ${priceText} ${item.unit || ""}
${item.yieldText ? `Rinde: ${item.yieldText}` : ""}
Producto: ${item.price === null ? "Consultar" : money(productSubtotal(item))}
${containerText}
${bidonText}
Subtotal: ${item.price === null ? "Consultar" : money(subtotal(item))}`;
        }).join("\n\n")
      : "Sin productos cargados";

    return encodeURIComponent(
`Hola Limpitok, quiero hacer este pedido:

Cliente: ${customer.name || "-"}
Dirección: ${customer.address || "-"}
Barrio: ${customer.barrio || "-"}
Teléfono: ${customer.phone || "-"}

PRODUCTOS

${productsText}

Total estimado: ${hasConsultItems ? `${money(total)} + productos a consultar` : money(total)}

Observaciones: ${customer.notes || "-"}`
    );
  }, [cart, customer, total, hasConsultItems]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Limpitok</h1>
        <p style={styles.headerText}>Pedido rápido por WhatsApp</p>
        <p style={styles.headerText}>Av. Illia 645 · 3364 02-9927</p>
      </header>

      <section style={styles.modeBox}>
        <button style={mode === "minorista" ? styles.activeMode : styles.mode} onClick={() => setMode("minorista")}>
          Minorista
          <span>Unidades, 1L y 5L</span>
        </button>

        <button style={mode === "mayorista" ? styles.activeMode : styles.mode} onClick={() => setMode("mayorista")}>
          Mayorista
          <span>20L/20KG o promos por cantidad</span>
        </button>
      </section>

      <section style={styles.filters}>
        <input style={styles.input} placeholder="Buscar producto" value={query} onChange={e => setQuery(e.target.value)} />

        <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(item => <option key={item}>{item}</option>)}
        </select>
      </section>

      <main style={styles.layout}>
        <section style={styles.products}>
          {visibleProducts.map(product => (
            <article style={styles.product} key={product.id}>
              <div style={styles.productHeader}>
                <div>
                  <p style={styles.category}>{product.category}</p>
                  <h2 style={styles.productName}>{product.name}</h2>
                </div>
                {product.badge && <span style={styles.badge}>{product.badge}</span>}
              </div>

              {product.formats.map(format => (
                <div style={styles.format} key={format.size}>
                  <div>
                    <strong>{format.size}</strong>
                    <p style={styles.price}>{money(format.price)} {format.unit || ""}</p>
                    {format.minQty && <p style={styles.detail}>Mínimo: {format.minQty}</p>}
                    {format.yieldText && <p style={styles.detail}>{format.yieldText}</p>}
                    {isReturnableFormat(format.size) && <p style={styles.detail}>Bidón retornable</p>}
                  </div>

                  <button style={styles.addButton} onClick={() => add(product, format)}>
                    Agregar
                  </button>
                </div>
              ))}
            </article>
          ))}
        </section>

        <aside style={styles.cart}>
          <h2 style={styles.cartTitle}>Pedido</h2>

          {cart.length === 0 && <p style={styles.empty}>Todavía no agregaste productos.</p>}

          {cart.map(item => (
            <div style={styles.cartItem} key={item.key}>
              <strong>{item.name}</strong>
              <p style={styles.cartText}>{item.size}</p>

              <label style={styles.label}>Cantidad</label>
              <input
                style={styles.input}
                type="number"
                value={item.qty}
                min={itemMinQty(item)}
                max={itemMaxQty(item)}
                onChange={e => updateQty(item.key, Number(e.target.value))}
              />

              {isReturnableFormat(item.size) && (
                <>
                  <label style={styles.label}>¿Tiene bidón para recambio?</label>
                  <select
                    style={styles.input}
                    value={item.hasBidon}
                    onChange={e => {
                      const value = e.target.value as "si" | "no";
                      setCart(prev =>
                        prev.map(cartItem =>
                          cartItem.key === item.key ? { ...cartItem, hasBidon: value } : cartItem
                        )
                      );
                    }}
                  >
                    <option value="si">Sí, entrega bidón</option>
                    <option value="no">No, necesita bidón nuevo</option>
                  </select>
                </>
              )}

              <p style={styles.subtotal}>Producto: {item.price === null ? "Consultar" : money(productSubtotal(item))}</p>

              {containerSubtotal(item) > 0 && (
                <p style={styles.subtotal}>Bidón/envase nuevo: {money(containerSubtotal(item))}</p>
              )}

              <p style={styles.subtotal}>Subtotal: {item.price === null ? "Consultar" : money(subtotal(item))}</p>

              <button style={styles.remove} onClick={() => setCart(prev => prev.filter(cartItem => cartItem.key !== item.key))}>
                Quitar
              </button>
            </div>
          ))}

          <div style={styles.total}>
            Total: {hasConsultItems ? `${money(total)} + consultar` : money(total)}
          </div>

          <input style={styles.input} placeholder="Nombre" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
          <input style={styles.input} placeholder="Dirección" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
          <input style={styles.input} placeholder="Barrio" value={customer.barrio} onChange={e => setCustomer({ ...customer, barrio: e.target.value })} />
          <input style={styles.input} placeholder="Teléfono" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Observaciones" value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} />

          <a style={styles.whatsapp} href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`} target="_blank" rel="noreferrer">
            Enviar por WhatsApp
          </a>
        </aside>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7f9", color: "#172033", fontFamily: "Arial, sans-serif" },
  header: { background: "#ffffff", borderBottom: "1px solid #dde3ea", padding: "22px 18px" },
  title: { margin: 0, fontSize: 34, color: "#0057a8" },
  headerText: { margin: "6px 0 0", color: "#526070" },
  modeBox: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, padding: 14 },
  mode: { background: "#ffffff", border: "1px solid #cfd8e3", borderRadius: 8, padding: 14, cursor: "pointer", fontWeight: 700, color: "#172033", display: "flex", flexDirection: "column", gap: 4 },
  activeMode: { background: "#0057a8", border: "1px solid #0057a8", borderRadius: 8, padding: 14, cursor: "pointer", fontWeight: 700, color: "#ffffff", display: "flex", flexDirection: "column", gap: 4 },
  filters: { display: "grid", gridTemplateColumns: "1fr 220px", gap: 10, padding: "0 14px 14px" },
  input: { width: "100%", padding: 11, borderRadius: 8, border: "1px solid #cfd8e3", boxSizing: "border-box", marginTop: 8, fontSize: 15 },
  textarea: { width: "100%", minHeight: 78, padding: 11, borderRadius: 8, border: "1px solid #cfd8e3", boxSizing: "border-box", marginTop: 8, fontSize: 15, resize: "vertical" },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 14, padding: 14 },
  products: { display: "grid", gap: 12 },
  product: { background: "#ffffff", border: "1px solid #dde3ea", borderRadius: 8, padding: 14 },
  productHeader: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" },
  category: { margin: 0, color: "#0057a8", fontSize: 13, fontWeight: 700 },
  productName: { margin: "4px 0 10px", fontSize: 20 },
  badge: { background: "#e8f2ff", color: "#0057a8", borderRadius: 6, padding: "5px 8px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" },
  format: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", borderTop: "1px solid #edf1f5", paddingTop: 12, marginTop: 12 },
  price: { margin: "4px 0", color: "#172033" },
  detail: { margin: "3px 0", color: "#64748b", fontSize: 13 },
  addButton: { background: "#0057a8", color: "#ffffff", border: 0, borderRadius: 8, padding: "10px 12px", cursor: "pointer", fontWeight: 700 },
  cart: { background: "#ffffff", border: "1px solid #dde3ea", borderRadius: 8, padding: 14, height: "fit-content", position: "sticky", top: 10 },
  cartTitle: { margin: "0 0 10px", fontSize: 22 },
  empty: { color: "#64748b" },
  cartItem: { border: "1px solid #edf1f5", borderRadius: 8, padding: 10, marginBottom: 10 },
  cartText: { margin: "4px 0", color: "#64748b" },
  label: { display: "block", marginTop: 8, fontSize: 13, fontWeight: 700 },
  subtotal: { margin: "8px 0", fontWeight: 700 },
  remove: { background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: 8, padding: "8px 10px", cursor: "pointer" },
  total: { borderTop: "1px solid #dde3ea", paddingTop: 12, marginTop: 12, fontSize: 20, fontWeight: 800 },
  whatsapp: { display: "block", background: "#16a34a", color: "#ffffff", textAlign: "center", padding: 14, borderRadius: 8, fontWeight: 800, textDecoration: "none", marginTop: 12 }
};