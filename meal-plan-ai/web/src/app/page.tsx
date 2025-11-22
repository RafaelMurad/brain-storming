"use client";

import { useState } from "react";
import { Sparkles, Calendar, ShoppingCart, ChefHat, Heart, Clock, Users, Plus, Check, Loader2, Leaf, Flame } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  time: number;
  servings: number;
  tags: string[];
}

const weekMeals: Record<string, Meal[]> = {
  Monday: [
    { id: "1", name: "Avocado Toast with Eggs", image: "🥑", calories: 420, time: 15, servings: 2, tags: ["vegetarian", "quick"] },
    { id: "2", name: "Grilled Chicken Salad", image: "🥗", calories: 380, time: 20, servings: 2, tags: ["high-protein", "low-carb"] },
    { id: "3", name: "Salmon with Roasted Veggies", image: "🐟", calories: 520, time: 35, servings: 4, tags: ["omega-3", "healthy"] },
  ],
  Tuesday: [
    { id: "4", name: "Greek Yogurt Parfait", image: "🫐", calories: 280, time: 5, servings: 1, tags: ["quick", "breakfast"] },
    { id: "5", name: "Turkey Wrap", image: "🌯", calories: 450, time: 10, servings: 2, tags: ["quick", "protein"] },
    { id: "6", name: "Vegetable Stir Fry", image: "🥦", calories: 340, time: 25, servings: 4, tags: ["vegan", "healthy"] },
  ],
};

const groceryItems = [
  { id: "1", name: "Avocados", quantity: 4, checked: false, category: "Produce" },
  { id: "2", name: "Eggs (dozen)", quantity: 1, checked: true, category: "Dairy" },
  { id: "3", name: "Chicken Breast", quantity: 2, checked: false, category: "Meat", unit: "lbs" },
  { id: "4", name: "Salmon Fillets", quantity: 4, checked: false, category: "Seafood" },
  { id: "5", name: "Mixed Greens", quantity: 2, checked: false, category: "Produce", unit: "bags" },
  { id: "6", name: "Greek Yogurt", quantity: 1, checked: true, category: "Dairy" },
  { id: "7", name: "Cherry Tomatoes", quantity: 1, checked: false, category: "Produce", unit: "pint" },
  { id: "8", name: "Olive Oil", quantity: 1, checked: true, category: "Pantry" },
];

export default function Home() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isGenerating, setIsGenerating] = useState(false);
  const [items, setItems] = useState(groceryItems);
  const [view, setView] = useState<"plan" | "grocery">("plan");

  const toggleItem = (id: string) => setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));

  const generatePlan = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
  };

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl">MealPlan<span className="text-primary">AI</span></h1>
              <p className="text-xs text-muted-foreground">Smart meal planning</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("plan")} className={`btn ${view === "plan" ? "btn-primary" : "btn-secondary"}`}>
              <Calendar className="w-4 h-4" /> Meal Plan
            </button>
            <button onClick={() => setView("grocery")} className={`btn ${view === "grocery" ? "btn-primary" : "btn-secondary"}`}>
              <ShoppingCart className="w-4 h-4" /> Grocery List
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {view === "plan" ? (
          <>
            {/* Generate Banner */}
            <div className="card mb-8 bg-gradient-to-r from-primary/20 to-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Generate Your Week</h2>
                  <p className="text-muted-foreground mt-1">Tell us your preferences and let AI create a personalized meal plan</p>
                </div>
                <button onClick={generatePlan} disabled={isGenerating} className="btn btn-primary">
                  {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Plan</>}
                </button>
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedDay === day ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Meals */}
            <div className="grid grid-cols-3 gap-4">
              {["Breakfast", "Lunch", "Dinner"].map((mealType, i) => {
                const meal = weekMeals[selectedDay]?.[i];
                return (
                  <div key={mealType}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{mealType}</h3>
                    {meal ? (
                      <div className="meal-card">
                        <div className="h-32 bg-secondary flex items-center justify-center text-5xl">{meal.image}</div>
                        <div className="p-4">
                          <h4 className="font-semibold">{meal.name}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> {meal.calories} cal</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {meal.time}m</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {meal.servings}</span>
                          </div>
                          <div className="flex gap-1 mt-3">
                            {meal.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex items-center justify-center">
                        <button className="btn btn-secondary"><Plus className="w-4 h-4" /> Add Meal</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Grocery List */}
            <div className="card mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Grocery List</h2>
                  <p className="text-muted-foreground">{checkedCount} of {items.length} items checked</p>
                </div>
                <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${(checkedCount / items.length) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${item.checked ? "bg-secondary/50" : "bg-card border border-border"}`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${item.checked ? "bg-primary border-primary" : "border-border"}`}>
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`flex-1 text-left ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
                  <span className="text-muted-foreground">{item.quantity} {item.unit || ""}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{item.category}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Premium Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/20 to-orange-500/10 rounded-2xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Leaf className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-bold text-lg">Unlock Premium</h3>
                <p className="text-muted-foreground">Nutritional insights, diet plans, and unlimited AI generations</p>
              </div>
            </div>
            <button className="btn btn-primary">$9.99/month</button>
          </div>
        </div>
      </main>
    </div>
  );
}
