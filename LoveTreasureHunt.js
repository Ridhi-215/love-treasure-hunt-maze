import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "../assets/background.mp4"; // Ensure this file exists
import "../styles/LoveTreasureHunt.css"; // Import CSS

const LoveTreasureHunt = () => {
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState({
    favoriteColor: "",
    favoriteMovie: "",
    favoriteSong: "",
    dreamDestination: "",
    favoriteFood: "",
  });

  // Load answers from localStorage when component mounts
  useEffect(() => {
    const savedAnswers = localStorage.getItem("loveTreasureHuntAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Handle input changes and update localStorage
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedAnswers = { ...answers, [name]: value };
    setAnswers(updatedAnswers);
    localStorage.setItem("loveTreasureHuntAnswers", JSON.stringify(updatedAnswers));
  };

  // Start Game - Save answers and navigate to the game
  const startGame = () => {
    localStorage.setItem("loveTreasureHuntAnswers", JSON.stringify(answers));
    navigate("/maze"); // Navigate to the maze game
  };

  // Reset stored answers
  const resetAnswers = () => {
    localStorage.removeItem("loveTreasureHuntAnswers"); // Clear local storage
    setAnswers({
      favoriteColor: "",
      favoriteMovie: "",
      favoriteSong: "",
      dreamDestination: "",
      favoriteFood: "",
    });
  };

  return (
    <div className="love-container">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h2>💖Welcome t0 Love Treasure Hunt 💖 </h2>
        <h3> Fill in your Favourites</h3>
        <form>
          <label>Favorite Color:</label>
          <input type="text" name="favoriteColor" value={answers.favoriteColor} onChange={handleChange} />

          <label>Favorite Movie:</label>
          <input type="text" name="favoriteMovie" value={answers.favoriteMovie} onChange={handleChange} />

          <label>Favorite Song:</label>
          <input type="text" name="favoriteSong" value={answers.favoriteSong} onChange={handleChange} />

          <label>Dream Destination:</label>
          <input type="text" name="dreamDestination" value={answers.dreamDestination} onChange={handleChange} />

          <label>Favorite Food:</label>
          <input type="text" name="favoriteFood" value={answers.favoriteFood} onChange={handleChange} />

          <div className="button-group">
            <button type="button" onClick={startGame}>❤️ Start Game ❤️</button>
            <button type="button" onClick={resetAnswers} className="reset-button">🔄 Reset Answers</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoveTreasureHunt;
