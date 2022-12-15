import React, { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");
      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }

      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);

      if (!error) {
        setFacts(facts);
      } else alert("There was a problem getting data");

      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

  return (
    <React.Fragment>
      {/* HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} />}
      </main>
    </React.Fragment>
  );
};

const Loader = () => {
  return <p className="message">Loading...</p>;
};

const Header = ({ showForm, setShowForm }) => {
  const appTitle = "FactShare";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" />
        <h1>{appTitle}</h1>
      </div>

      <button
        onClick={() => setShowForm((show) => !show)}
        className="btn btn-large btn-open"
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
};

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const NewFactForm = ({ setFacts, setShowForm }) => {
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  const handleSubmit = async (event) => {
    // prevent reload on form submit
    event.preventDefault();
    console.log(text, source, category);

    // if data is valid, create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // create new fact obj
      // const newFact = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // upload fact to supabase and recieve the new fact object

      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();

      setIsUploading(false);

      console.log(newFact);

      // add new fact to UI: add the fact to state
      setFacts((facts) => [newFact[0], ...facts]);

      // reset input field
      setText("");
      setSource("");
      setCategory("");

      // close the form
      setShowForm(false);
    }
  };

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(event) => {
          setSource(event.target.value);
        }}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
        }}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => {
          return (
            <option key={cat.name} value={cat.name}>
              {cat.name.toUpperCase()}
            </option>
          );
        })}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
};

const CategoryFilter = ({ setCurrentCategory }) => {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name} className="category">
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
                onClick={() => setCurrentCategory(cat.name)}
              >
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

const FactList = ({ facts }) => {
  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet! Create the first one ✌🏻
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => {
          return <Fact key={fact.id} fact={fact} />;
        })}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
};

const Fact = ({ fact }) => {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
};

export default App;
