import type { Category, DietaryType, MenuItem } from "./menu";

// Factual dish names from the linked business's official menu, checked 23 Nov 2026.
// Descriptions and prices below are our own illustrative demo proposals, NOT the
// restaurant's recipes, current prices, availability, or allergen declarations.
// Use licensed category photography; never imply it depicts the referenced dish.
type ReferenceEntry = readonly [id: string, name: string, price: number, description: string, dietaryType?: DietaryType];

function group(category: Category, sourceSlug: string, image: string, entries: readonly ReferenceEntry[]): MenuItem[] {
  return entries.map(([id, name, price, description, dietaryType = "unverified"]) => ({
    id, name, price, description, category, dietaryType,
    image: `/images/${image}.jpg`,
    imageAlt: `Illustrative ${category.toLowerCase()} photograph, not the restaurant’s ${name}`,
    imageIsRepresentative: true,
    sourceUrl: `https://www.xerodegrees.com/menu-category/${sourceSlug}/`,
    dietary: dietaryType === "non-vegetarian" ? "Contains meat · confirm full recipe and allergens"
      : dietaryType === "vegetarian" ? "Vegetarian concept · confirm full recipe and allergens"
      : "Recipe, egg content, and allergens not verified",
  }));
}

export const referenceMenu: MenuItem[] = [
  ...group("Coffee", "hot-coffee", "espresso", [
    ["espresso", "Espresso", 130, "A short, bold coffee for a quick little reset.", "vegetarian"],
    ["americano", "Americano", 150, "A longer black coffee with a clean, bold finish.", "vegetarian"],
    ["cafe-mocha", "Cafe Mocha", 210, "A comforting meeting of coffee, chocolate, and milk.", "vegetarian"],
  ]),
  ...group("Coffee", "cold-coffee", "cold-brew", [
    ["classic-cold-coffee", "Classic Cold Coffee", 210, "Chilled coffee for an easy afternoon pick-me-up.", "vegetarian"],
    ["hazelnut-cold-coffee", "Hazelnut Cold Coffee", 240, "A nutty twist on your chilled coffee break.", "vegetarian"],
    ["caramel-cold-coffee", "Caramel Cold Coffee", 240, "Chilled coffee with a sweet caramel-inspired finish.", "vegetarian"],
  ]),
  ...group("Shakes", "classic-shakes", "strawberry-shake", [
    ["vanilla-shake", "Vanilla Classic Shake", 220, "An old-school vanilla treat for your sweet side."],
    ["strawberry-shake", "Strawberry Classic Shake", 220, "A fruity, creamy shake for a brighter coffee break."],
    ["blueberry-shake", "Blueberry Classic Shake", 240, "A berry-inspired shake for a little change of pace."],
  ]),
  ...group("Shakes", "classic-shakes", "chocolate-shake", [
    ["chocolate-shake", "Chocolate Classic Shake", 230, "A chocolate-filled pause in an otherwise busy day."],
    ["butterscotch-shake", "Butterscotch Classic Shake", 230, "A sweet, butterscotch-inspired shake to linger over."],
  ]),
  ...group("Shakes", "premium-shakes", "chocolate-shake", [
    ["nutella-shake", "Nutella Shake", 290, "A chocolate-hazelnut-inspired treat in a glass."],
    ["kitkat-shake", "Kitkat Shake", 280, "A chocolate-wafer-inspired shake for a treat-yourself day."],
    ["brownie-hazelnut-shake", "Brownie Hazelnut Shake", 310, "A dessert-style shake with brownie and hazelnut inspiration."],
  ]),
  ...group("Shakes", "premium-shakes", "strawberry-shake", [
    ["mango-cheesecake-shake", "Mango Cheese Cake Shake", 310, "Mango and cheesecake inspiration in a creamy drink."],
    ["blueberry-cheesecake-shake", "Blueberry Cheese Cake Shake", 310, "A berry-and-cheesecake-inspired dessert break."],
  ]),
  ...group("Coolers", "coolers", "iced-tea", [
    ["peach-iced-tea", "Peach Ice Tea Cooler", 190, "A peach-inspired iced drink for a refreshing pause.", "vegetarian"],
    ["lemon-iced-tea", "Lemon Ice Tea Cooler", 180, "An iced tea with a citrus-inspired lift.", "vegetarian"],
    ["fresh-lime-cooler", "Fresh Lime Cooler", 170, "A zesty little cooler for warmer afternoons.", "vegetarian"],
    ["ocean-b-cooler", "Ocean B Cooler", 210, "A colourful cooler concept; flavour to be confirmed."],
  ]),
  ...group("Fries & bites", "fries", "fries", [
    ["classic-fries", "Classic Fries", 160, "A simple side of fries, made for sharing.", "vegetarian"],
    ["dil-se-cheesy-fries", "Dil Se Cheesy Fries", 240, "A cheese-and-fries-inspired comfort-food break.", "vegetarian"],
    ["peri-peri-cheese-fries", "Peri Peri Cheese Fries", 250, "Fries with a spicy, cheesy demo twist.", "vegetarian"],
    ["southwest-garlic-fries", "Southwest Garlic Fries", 240, "A garlicky fries concept for the centre of the table.", "vegetarian"],
    ["hola-mexican-fries", "Hola Mexican Fries", 260, "A loaded-fries concept with a Mexican-inspired twist."],
    ["paneer-popcorn-fries", "Paneer Popcorn Fries", 280, "A paneer-and-fries pairing for a filling snack.", "vegetarian"],
  ]),
  ...group("Fries & bites", "fries", "chicken", [
    ["chicken-cheese-fries", "Dil Se Chicken Cheese Fries", 310, "Chicken, cheese, and fries inspiration for bigger cravings.", "non-vegetarian"],
    ["chicken-poppers-fries", "Chicken Poppers Fries", 290, "A chicken-bites-and-fries concept to share.", "non-vegetarian"],
  ]),
  ...group("Fries & bites", "appetizer", "nachos", [
    ["mexican-nachos", "Mexican Nachos", 240, "A crunchy, nacho-inspired snack for the whole table."],
    ["baked-cheesy-nachos", "Baked Cheesy Nachos", 280, "A warm, cheese-and-nachos-inspired sharing plate."],
    ["veg-pizza-pocket", "Veg Pizza Pocket", 210, "A handheld pizza-inspired bite for a smaller appetite.", "vegetarian"],
    ["mini-veg-cheese-roll", "Mini Veg & Cheese Roll", 220, "A vegetable-and-cheese snack concept to share.", "vegetarian"],
  ]),
  ...group("Fries & bites", "garlic-bread", "bread", [
    ["cheese-garlic-bread", "Cheese Garlic Bread", 190, "A cheesy, garlicky bread concept for the side.", "vegetarian"],
    ["chicken-cheese-garlic-bread", "Chicken & Cheese Garlic Bread", 260, "A chicken-and-cheese twist on garlic bread.", "non-vegetarian"],
  ]),
  ...group("Pizza", "single-serve-pizza", "pizza", [
    ["cheese-corn-pizza", "Cheese Corn Pizza", 260, "A cheese-and-sweetcorn pizza concept.", "vegetarian"],
    ["cheese-onion-pizza", "Cheese Onion Pizza", 250, "A simple cheese-and-onion pairing on a pizza base.", "vegetarian"],
    ["paneer-delight-pizza", "Paneer Delight Pizza", 320, "A paneer-topped pizza concept for a satisfying bite.", "vegetarian"],
    ["chicken-cheese-pizza", "Chicken Cheese Pizza", 350, "A chicken-and-cheese pizza concept for your table.", "non-vegetarian"],
  ]),
  ...group("Pizza", "special-pizza", "pizza", [
    ["cheesy-margherita", "Cheesy Margherita Pizza", 340, "A cheese-forward Margherita-inspired pizza.", "vegetarian"],
    ["veggie-affair-pizza", "Veggie Affair Pizza", 380, "A vegetable-topped pizza concept for sharing.", "vegetarian"],
    ["butter-chicken-pizza", "Butter Chicken Pizza", 440, "A butter-chicken-inspired take on a pizza night.", "non-vegetarian"],
  ]),
  ...group("Pasta", "baked-pasta", "pasta", [
    ["pink-sauce-spaghetti", "Pink Sauce Spaghetti Pasta", 320, "A pink-sauce-inspired spaghetti comfort bowl."],
    ["arrabbiata-penne", "Arrabbiata Penne Pasta", 290, "A tomato-and-chilli-inspired penne pasta concept."],
  ]),
  ...group("Pasta", "baked-pasta", "alfredo", [
    ["alfredo-penne", "Alfredo Penne Pasta", 310, "A creamy Alfredo-inspired penne pasta concept."],
    ["mama-mia-penne", "Mama Mia Penne Pasta", 330, "A comforting penne pasta option; sauce to be confirmed."],
  ]),
  ...group("Burgers", "burgers", "veggie-burger", [
    ["super-veggie-burger", "Super Veggie Burger", 240, "A vegetable-burger concept for an easy lunch.", "vegetarian"],
    ["signature-paneer-burger", "XD Signature Paneer Burger", 290, "A paneer-burger option from the reference menu.", "vegetarian"],
  ]),
  ...group("Burgers", "burgers", "burger", [
    ["peri-peri-chicken-burger", "Peri Peri Chicken Burger", 290, "A peri-peri-inspired chicken burger concept.", "non-vegetarian"],
    ["tandoori-chicken-burger", "Tandoori Chicken Burger", 310, "A tandoori-inspired chicken burger concept.", "non-vegetarian"],
    ["butter-chicken-burger", "Butter Chicken Burger", 320, "A butter-chicken-inspired burger for a bigger appetite.", "non-vegetarian"],
  ]),
  ...group("Sandwiches & wraps", "sandwiches", "sandwich", [
    ["peri-peri-paneer-sandwich", "Peri Peri Paneer Sandwich", 280, "A paneer sandwich with a peri-peri-inspired twist.", "vegetarian"],
    ["peri-peri-chicken-sandwich", "Peri Peri Chicken Sandwich", 310, "A peri-peri-inspired chicken sandwich concept.", "non-vegetarian"],
    ["mac-cheese-sandwich", "Mac N Cheese Sandwich", 290, "Macaroni-and-cheese inspiration in sandwich form."],
    ["chicken-keema-sandwich", "Chicken Keema Sandwich", 320, "A minced-chicken sandwich concept for lunch.", "non-vegetarian"],
  ]),
  ...group("Sandwiches & wraps", "wraps", "wrap", [
    ["soy-keema-wrap", "Soy Keema Wrap", 250, "A savoury soy-mince wrap concept.", "vegetarian"],
    ["crispy-chicken-wrap", "Crispy Chicken Wrap", 290, "A crispy-chicken-inspired wrap for lunch on the go.", "non-vegetarian"],
    ["chicken-seekh-wrap", "Chicken Seekh Wrap", 310, "A chicken-seekh-inspired wrap concept.", "non-vegetarian"],
  ]),
  ...group("Momos", "momos", "momos", [
    ["vegetable-momos", "Vegetable Momos", 190, "A vegetable-filled dumpling concept for a snack break.", "vegetarian"],
    ["corn-cheese-momos", "Corn N Cheese Momos", 230, "A corn-and-cheese dumpling concept.", "vegetarian"],
    ["pan-fried-veg-momos", "Pan Fried Veg Momos", 220, "A pan-fried vegetable-dumpling concept.", "vegetarian"],
    ["soya-momos", "Soya Momos", 210, "A soy-filled dumpling concept with a savoury twist.", "vegetarian"],
    ["chicken-momos", "Chicken Momos", 240, "A chicken-filled dumpling concept for your table.", "non-vegetarian"],
    ["spicy-chicken-momos", "Spicy Chicken Momos", 260, "A chicken-dumpling concept with a spicy finish.", "non-vegetarian"],
  ]),
  ...group("Desserts", "waffle", "waffles", [
    ["nutella-waffles", "Nutella Waffles", 260, "A chocolate-hazelnut-inspired waffle treat."],
    ["choco-fudge-waffles", "Choco Fudge Waffles", 240, "A chocolate-fudge-inspired waffle break."],
    ["blueberry-waffles", "Blueberry Waffles", 250, "A blueberry-inspired waffle treat."],
    ["red-velvet-waffles", "Red Velvet Waffles", 270, "A red-velvet-inspired waffle concept."],
  ]),
  ...group("Desserts", "sundae", "ice-cream", [
    ["biscoff-sundae", "Biscoff Sundae", 290, "A spiced-biscuit-inspired ice-cream treat."],
    ["tiramisu-sundae", "Tiramisu Sundae", 310, "A coffee-dessert-inspired sundae concept."],
    ["brownie-ice-cream-sundae", "Brownie with Ice Cream Sundae", 280, "A brownie-and-ice-cream pairing for a sweet finish."],
  ]),
];