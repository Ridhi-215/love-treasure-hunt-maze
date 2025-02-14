import React, { useState, useEffect } from "react";
import backgroundVideo from "../assets/background1.mp4"; // Ensure this file exists

const GRID_SIZE = 7; // 7x7 Maze Grid
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const CHECKPOINTS = [5, 14, 21, 36, 43]; // Checkpoint positions
const FINAL_BOX = TOTAL_CELLS; // Last box is the goal
const MAX_WRONG_ATTEMPTS = 3; // Max allowed wrong attempts

const MazeGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState(1);
  const [passedCheckpoints, setPassedCheckpoints] = useState([]);
  const [crossedCells, setCrossedCells] = useState([1]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Load stored favorite answers
  const favoriteAnswers = JSON.parse(localStorage.getItem("loveTreasureHuntAnswers")) || {};

  // Assign unique questions to checkpoints
  const questionKeys = Object.keys(favoriteAnswers).slice(0, CHECKPOINTS.length);
  const assignedQuestions = CHECKPOINTS.reduce((acc, checkpoint, index) => {
    acc[checkpoint] = {
      key: questionKeys[index] || `question${index + 1}`,
      text: `What is your partner's favorite ${questionKeys[index]?.replace("favorite", "")}?`,
    };
    return acc;
  }, {});

  // Move player step by step
  const movePlayer = () => {
    let nextPos = playerPos + 1;
    if (nextPos <= TOTAL_CELLS) {
      if (CHECKPOINTS.includes(nextPos) && !passedCheckpoints.includes(nextPos)) {
        setCurrentQuestion(assignedQuestions[nextPos]); // Trigger question
      } else {
        setPlayerPos(nextPos);
        setCrossedCells([...crossedCells, nextPos]); // Mark cell as crossed
      }
    }
  };

  // Handle answer submission
  const checkAnswer = () => {
    if (!currentQuestion) return; // Ensure there's a question before checking

    const correctAnswer = (favoriteAnswers[currentQuestion.key] || "").toLowerCase();
    
    if (answer.toLowerCase() === correctAnswer) {
      setPassedCheckpoints([...passedCheckpoints, playerPos]); // Mark checkpoint as passed
      setCurrentQuestion(null); // Clear question
      setAnswer("");
      setWrongAttempts(0); // Reset wrong attempts

      setTimeout(() => {
        let nextPos = playerPos + 1;
        setPlayerPos(nextPos);
        setCrossedCells([...crossedCells, nextPos]); // Mark as crossed
      }, 300);
    } else {
      const newAttempts = wrongAttempts + 1;
      if (newAttempts < MAX_WRONG_ATTEMPTS) {
        setWrongAttempts(newAttempts);
        setTimeout(() => alert(`⚠ Wrong answer! You have ${MAX_WRONG_ATTEMPTS - newAttempts} attempt(s) left.`), 100);
      } else {
        setTimeout(() => alert("💔 True love never gives up, but sometimes we need to listen more. Take a deep breath and try again!"), 100);
        resetGame();
      }
    }
  };

  // Reset game after disqualification or restart
  const resetGame = () => {
    setGameStarted(false);
    setPlayerPos(1);
    setPassedCheckpoints([]);
    setCrossedCells([1]);
    setCurrentQuestion(null);
    setAnswer("");
    setWrongAttempts(0);
    setGameWon(false);
  };

  // Check if the player reached the final goal
  useEffect(() => {
    if (playerPos === FINAL_BOX && !gameWon) {
      setGameWon(true);
      setTimeout(() => alert("Congratulations, lovebirds! ❤️ You found your way together! May your journey always be filled with love and laughter! 💑✨"), 300);
    }
  }, [playerPos, gameWon]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: "-1",
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Game Content */}
      <div style={{ textAlign: "center", padding: "20px", position: "relative", zIndex: "1" }}>
        <h2>❤️ Love Treasure Hunt Maze ❤️</h2>

        {!gameStarted ? (
          <button onClick={() => setGameStarted(true)}>Start Game</button>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`,
                gap: "5px",
                margin: "20px auto",
                width: `${GRID_SIZE * 55}px`,
              }}
            >
              {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
                let cellNumber = index + 1;
                let cellStyle = {
                  width: "50px",
                  height: "50px",
                  border: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  background: "white",
                };

                // Player's current position
                if (playerPos === cellNumber) cellStyle.background = "red";
                // Checkpoints start as red, turn green when answered
                if (CHECKPOINTS.includes(cellNumber)) {
                  cellStyle.background = passedCheckpoints.includes(cellNumber) ? "green" : "red";
                }
                // Crossed cells turn blue
                if (crossedCells.includes(cellNumber) && !CHECKPOINTS.includes(cellNumber)) {
                  cellStyle.background = "lightblue";
                }
                // Final goal color
                if (cellNumber === FINAL_BOX) cellStyle.background = "gold";

                return (
                  <div key={index} style={cellStyle}>
                    {cellNumber}
                  </div>
                );
              })}
            </div>

            {!currentQuestion ? (
              <button onClick={movePlayer}>Move Forward</button>
            ) : (
              <div style={{ marginTop: "20px" }}>
                <h3>{currentQuestion.text}</h3>
                <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                <button onClick={checkAnswer}>Submit</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MazeGame;
