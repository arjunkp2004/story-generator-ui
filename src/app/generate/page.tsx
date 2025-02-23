"use client";
import { useState } from "react";
import Button from "../reusable-components/Button";

export default function Generate() {
  const [story, setStory] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [storyConcept, setStoryConcept] = useState("");
  const [isGenerateStory, setIsGenerateStory] = useState(true);
  const [isGeneratePoster, setIsGeneratePoster] = useState(true);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingPoster, setIsLoadingPoster] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [posterError, setPosterError] = useState("");

  const onClear = () => {
    setStoryConcept("");
    setStory("");
    setPosterUrl("");
    setStoryError("");
    setPosterError("");
  };

  const onGenerate = async () => {
    setStoryError("");
    setPosterError("");
    setIsLoadingStory(isGenerateStory);
    setIsLoadingPoster(isGeneratePoster);

    try {
      const [storyResponse, posterResponse] = await generateContent(
        storyConcept,
        isGenerateStory,
        isGeneratePoster
      );

      if (storyResponse) {
        setStory(storyResponse.story || "");
        setIsLoadingStory(false);
      }

      if (posterResponse) {
        setPosterUrl(posterResponse.poster_url || "");
        setIsLoadingPoster(false);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setIsLoadingStory(false);
      setIsLoadingPoster(false);
    }
  };

  const generateContent = async (prompt, generateStory, generatePoster) => {
    try {
      const requests = [];

      if (generateStory) {
        requests.push(
          fetch("http://127.0.0.1:8000/generate/story", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          }).then((res) => res.json())
        );
      } else {
        requests.push(Promise.resolve(null));
      }

      if (generatePoster) {
        requests.push(
          fetch("http://127.0.0.1:8000/generate/poster", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ story_summary: prompt }),
          }).then((res) => res.json())
        );
      } else {
        requests.push(Promise.resolve(null));
      }

      const [storyResponse, posterResponse] = await Promise.all(requests);
      return [storyResponse, posterResponse];
    } catch (error) {
      console.error("Error in API calls:", error);
      throw error;
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

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="generateStory"
            className="mr-2"
            checked={isGenerateStory}
            onChange={() => setIsGenerateStory(!isGenerateStory)}
          />
          <label htmlFor="generateStory" className="text-gray-700">
            Generate Story
          </label>
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="generatePoster"
            className="mr-2"
            checked={isGeneratePoster}
            onChange={() => setIsGeneratePoster(!isGeneratePoster)}
          />
          <label htmlFor="generatePoster" className="text-gray-700">
            Generate Poster
          </label>
        </div>

        <div className="mt-6 flex space-x-4">
          <Button onClick={onClear} className="bg-red-500 hover:bg-red-600">
            Clear
          </Button>
          <Button
            onClick={onGenerate}
            className={`bg-blue-500 hover:bg-blue-600 ${
              isLoadingStory || isLoadingPoster
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isLoadingStory || isLoadingPoster}
          >
            {isLoadingStory || isLoadingPoster ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Generated Story</h2>
        <div className="max-h-96 overflow-y-auto border p-4 rounded-lg bg-gray-100">
          {isLoadingStory ? (
            <p className="text-blue-500 animate-pulse">Generating story...</p>
          ) : (
            <pre className="whitespace-pre-wrap text-gray-700">
              {story || "Your story will appear here."}
            </pre>
          )}
        </div>
        {posterUrl && (
          <img
            src={posterUrl}
            alt="Generated poster"
            className="w-full h-auto max-h-96 object-contain rounded-lg shadow-sm mt-4"
          />
        )}
      </div>
    </div>
  );
}
