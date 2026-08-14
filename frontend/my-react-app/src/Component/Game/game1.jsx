import { useState, useEffect } from "react";

export const SortingGame = ({ onComplete }) => {
  const [items] = useState([
    { id: 1, name: "Plastic Bottle", type: "recyclable" },
    { id: 2, name: "Banana Peel", type: "compost" },
    { id: 3, name: "Battery", type: "hazardous" },
    { id: 4, name: "Glass Jar", type: "recyclable" },
    { id: 5, name: "Coffee Cup", type: "landfill" }
  ]);

  const [sortedItems, setSortedItems] = useState({
    recyclable: [],
    compost: [],
    hazardous: [],
    landfill: []
  });
  const [currentItem, setCurrentItem] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [xpGiven, setXpGiven] = useState(false);

  useEffect(() => {
    const savedGame = localStorage.getItem("environmentGameProgress");
    if (savedGame) {
      const gameProgress = JSON.parse(savedGame);
      setSortedItems(gameProgress.sortedItems);
      setCurrentItem(gameProgress.currentItem);
      setGameFinished(gameProgress.gameFinished);
    }
  }, []);

  const handleSort = (category) => {
    if (currentItem >= items.length) return;

    const newSortedItems = { ...sortedItems };
    newSortedItems[category].push(items[currentItem]);
    setSortedItems(newSortedItems);

    const nextItem = currentItem + 1;
    setCurrentItem(nextItem);

    const gameProgress = {
      sortedItems: newSortedItems,
      currentItem: nextItem,
      gameFinished: nextItem >= items.length
    };
    localStorage.setItem("environmentGameProgress", JSON.stringify(gameProgress));

    if (nextItem >= items.length) {
      setGameFinished(true);

      if (!xpGiven) {
        setXpGiven(true);
        onComplete &&
          onComplete({
            completed: true,
            xp: 30,
            itemsSorted: newSortedItems
          });
      }
    }
  };

  if (gameFinished) {
    return (
      <div className="game-container">
        <h3>🎉 Game Completed!</h3>
        <div className="game-results">
          <p>All items sorted!</p>
          <p>✅ +30 XP earned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h3>Eco Sorting Game</h3>
      <p>Sort the waste items into the correct bins</p>

      <div className="current-item">
        <h4>Current Item:</h4>
        <div className="item-card">{items[currentItem]?.name}</div>
      </div>

      <div className="bins">
        <button className="btn" onClick={() => handleSort("recyclable")}>♻️ Recyclable</button>
        <button  className="btn"  onClick={() => handleSort("compost")}>🍃 Compost</button>
        <button className="btn"  onClick={() => handleSort("hazardous")}>⚠️ Hazardous</button>
        <button className="btn"  onClick={() => handleSort("landfill")}>🗑️ Landfill</button>
      </div>

      <div className="game-progress">
        Progress: {currentItem + 1}/{items.length}
      </div>
    </div>
  );
};
