"use client";
import { useState } from "react";
import Button from "../reusable-components/Button";

export default function Generate() {
  const [story, setStory] = useState("initial story");
  const [posterUrl, setPosterUrl] = useState("");
  const [storyConcept, setStoryConcept] = useState("initial concept");
  const [isGeneratePoster, setIsGeneratePoster] = useState(true);
  const [isGenEachPageImg, setIsGenEachPageImg] = useState(true);
  const [isReGenPoster, setIsReGenPoster] = useState(true);
  const [isReGenEachPageImg, setIsReGenEachPageImg] = useState(true);
  const [isNeedsImprovement, setIsNeedsImprovement] = useState(false);
  const [improvementConcept, setImprovementConcept] = useState(
    "improvement concept"
  );

  const onClear = () => {
    setStoryConcept("");
    setStory("");
  };

  const onGenerate = () => {
    generateStory();
    if (isGeneratePoster) {
      generatePoster();
    }

    // setStory("some new story generated");
  };

  const onRegenerateClear = () => {
    setIsReGenPoster(false);
    setIsReGenEachPageImg(false);
    setIsNeedsImprovement(false);
    setImprovementConcept("");
  };

  const onRegenerate = () => {
    generateStory();
    if (isReGenPoster) {
      generatePoster();
    }
  };

  const generateStory = async () => {
    try {
      debugger;
      const response = await fetch("http://127.0.0.1:8000/generate/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: storyConcept,
        }),
      });
      debugger;
      const data = await response.json();
      setStory(data.story);

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }
    } catch (error) {
      setStory("Failed to generate story. Please try again...");
      console.error("Error generating story:", error);
    }
  };

  const generatePoster = async () => {
    try {
      debugger;
      const response = await fetch("http://127.0.0.1:8000/generate/poster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: storyConcept,
        }),
      });
      debugger;
      const data = await response.blob();
      const posterUrl = URL.createObjectURL(data);
      setPosterUrl(posterUrl);

      if (!response.ok) {
        throw new Error("Failed to generate poster");
      }
    } catch (error) {
      setPosterUrl("");
      console.error("Error generating poster:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Panel */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Enter Your Story Concept</h2>
        <textarea
          value={storyConcept}
          onChange={(e) => setStoryConcept(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type your story concept here..."
        ></textarea>

        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="generatePoster"
              className="mr-2"
              checked={isGeneratePoster}
              onChange={(e) => setIsGeneratePoster(!isGeneratePoster)}
            />
            <label htmlFor="generatePoster" className="text-gray-700">
              Generate Poster
            </label>
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="generatePageImages"
              className="mr-2"
              checked={isGenEachPageImg}
              onChange={(e) => setIsGenEachPageImg(!isGenEachPageImg)}
            />

            <label htmlFor="generatePageImages" className="text-gray-700">
              Generate Each Page Image
            </label>
          </div> */}
        </div>

        <div className="mt-6 flex space-x-4">
          <Button
            onClick={onClear}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Clear
          </Button>
          <Button
            onClick={onGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Generate
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Generated Story</h2>
        <div className="mb-4">
          <img
            src="poster.png"
            alt="Generated visual"
            className="w-full h-60 object-cover rounded-lg shadow-sm"
          />
        </div>
        {posterUrl && (
          <div className="mb-4">
            <img
              src={posterUrl}
              alt="Generated visual"
              className="w-full h-60 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4">{story}</p>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="regeneratePoster"
              className="mr-2"
              checked={isReGenPoster}
              onChange={(e) => setIsReGenPoster(!isReGenPoster)}
            />

            <label htmlFor="regeneratePoster" className="text-gray-700">
              Generate Poster
            </label>
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="regeneratePageImages"
              className="mr-2"
              checked={isReGenEachPageImg}
              onChange={(e) => setIsReGenEachPageImg(!isReGenEachPageImg)}
            />
            <label htmlFor="regeneratePageImages" className="text-gray-700">
              Generate Each Page Image
            </label>
          </div> */}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="needsImprovement"
              className="mr-2"
              checked={isNeedsImprovement}
              onChange={(e) => setIsNeedsImprovement(!isNeedsImprovement)}
            />
            <label htmlFor="needsImprovement" className="text-gray-700">
              Needs Improvement
            </label>
          </div>
        </div>
        {isNeedsImprovement && (
          <textarea
            value={improvementConcept}
            onChange={(e) => setImprovementConcept(e.target.value)}
            className="w-full h-32 mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Provide feedback or make changes here..."
          ></textarea>
        )}

        <div className="mt-6 flex space-x-4">
          <Button
            onClick={onRegenerateClear}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Clear
          </Button>
          <Button
            onClick={onRegenerate}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Regenerate
          </Button>
        </div>
      </div>
    </div>
  );
}
